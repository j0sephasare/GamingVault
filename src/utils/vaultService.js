import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { encryptEntry, decryptEntry } from './crypto'

/*
 
*/

const vaultRef = (uid) => collection(db, 'users', uid, 'vault')

export const getVaultEntries = async (uid) => {
  try {
    const q = query(vaultRef(uid), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data()
      return decryptEntry({ id: docSnap.id, ...data }, uid)
    })
  } catch (err) {
    console.error('Failed to fetch vault entries:', err)
    throw err
  }
}

export const addVaultEntry = async (uid, entry) => {
  try {
    const encrypted = encryptEntry(entry, uid)
    // Only write defined fields — strip anything undefined to avoid Firestore errors
    const clean = Object.fromEntries(
      Object.entries(encrypted).filter(([, v]) => v !== undefined)
    )
    return await addDoc(vaultRef(uid), {
      ...clean,
      createdAt: serverTimestamp(),
    })
  } catch (err) {
    console.error('Failed to add vault entry:', err)
    throw err
  }
}

export const updateVaultEntry = async (uid, entryId, updates) => {
  try {
    const encrypted = encryptEntry(updates, uid)
    const clean = Object.fromEntries(
      Object.entries(encrypted).filter(([, v]) => v !== undefined)
    )
    const docRef = doc(db, 'users', uid, 'vault', entryId)
    return await updateDoc(docRef, {
      ...clean,
      updatedAt: serverTimestamp(),
    })
  } catch (err) {
    console.error('Failed to update vault entry:', err)
    throw err
  }
}

export const deleteVaultEntry = async (uid, entryId) => {
  try {
    const docRef = doc(db, 'users', uid, 'vault', entryId)
    return await deleteDoc(docRef)
  } catch (err) {
    console.error('Failed to delete vault entry:', err)
    throw err
  }
}