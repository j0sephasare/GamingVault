import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  getVaultEntries,
  addVaultEntry,
  updateVaultEntry,
  deleteVaultEntry,
} from '../utils/vaultService'

/*
  useVault.js
  ===========
  Custom hook that owns ALL vault state and data operations.


  VaultPage.jsx needs to:
  - Load entries from Firestore on mount
  - Add, edit, delete entries
  - Track loading/saving/error states
  - Know the current user's UID for every operation

  Without this hook, VaultPage would be 200+ lines of mixed UI + data logic.
  By extracting data logic into useVault, VaultPage only deals with rendering.
  This separation makes both easier to read and debug.

  WHAT THIS HOOK PROVIDES:
  - entries:       array of decrypted vault entries
  - loading:       true while initial fetch is running
  - error:         string if fetch failed, null otherwise
  - saving:        true while a write operation is in progress
  - addEntry:      function to add a new entry
  - editEntry:     function to update an existing entry
  - removeEntry:   function to delete an entry
  - refresh:       function to manually re-fetch (pull-to-refresh style)
*/
export function useVault() {
  const { currentUser } = useAuth()
  const [entries, setEntries]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState(null)

  // fetchEntries: loads all vault entries for the current user
  // useCallback memoizes this function so it doesn't cause re-renders
  // when passed to useEffect below
  const fetchEntries = useCallback(async () => {
    if (!currentUser) return
    try {
      setLoading(true)
      setError(null)
      const data = await getVaultEntries(currentUser.uid)
      setEntries(data)
    } catch (err) {
      console.error('Failed to load vault:', err)
      setError('Failed to load your vault. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }, [currentUser])

  // Load entries when the component mounts (or user changes)
  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  /*
    addEntry(formData)
    ------------------
    Saves a new entry to Firestore, then adds it to local state.

  */
  const addEntry = async (formData) => {
    try {
      setSaving(true)
      const docRef = await addVaultEntry(currentUser.uid, formData)
      // Build the local entry — matches what Firestore would return
      const newEntry = {
        id: docRef.id,
        ...formData,
        createdAt: new Date(), // approximate — server timestamp comes on re-fetch
      }
      setEntries(prev => [newEntry, ...prev])
      return true // signal success to the caller
    } catch (err) {
      console.error('Failed to add entry:', err)
      return false
    } finally {
      setSaving(false)
    }
  }

  /*
    editEntry(entryId, formData)
    ----------------------------
    Updates an entry in Firestore, then updates it in local state.
    Replaces the matching entry in the array using map().
  */
  const editEntry = async (entryId, formData) => {
    try {
      setSaving(true)
      await updateVaultEntry(currentUser.uid, entryId, formData)
      setEntries(prev =>
        prev.map(e => e.id === entryId ? { ...e, ...formData } : e)
      )
      return true
    } catch (err) {
      console.error('Failed to update entry:', err)
      return false
    } finally {
      setSaving(false)
    }
  }

  /*
    removeEntry(entryId)
    --------------------
    Deletes an entry from Firestore, then removes it from local state.
    Uses filter() to build a new array without the deleted entry.
  */
  const removeEntry = async (entryId) => {
    try {
      setSaving(true)
      await deleteVaultEntry(currentUser.uid, entryId)
      setEntries(prev => prev.filter(e => e.id !== entryId))
      return true
    } catch (err) {
      console.error('Failed to delete entry:', err)
      return false
    } finally {
      setSaving(false)
    }
  }

  return {
    entries,
    loading,
    saving,
    error,
    addEntry,
    editEntry,
    removeEntry,
    refresh: fetchEntries,
  }
}