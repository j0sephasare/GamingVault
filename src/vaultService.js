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
import { encryptEntry, decryptEntry } from '../utils/crypto'

/*
  WHY A SERVICE LAYER?
  ====================
  Instead of writing Firestore calls directly inside components, we put
  all database logic here. This gives us:

  1. Single responsibility — components handle UI, this file handles data
  2. Easy to change — if you swap Firebase for something else later,
     you only update this file, not 10 different components
  3. Encryption in one place — encrypt on write, decrypt on read, always.
     There's no risk of accidentally saving plaintext.
  4. Easier to test — you can mock this module in tests

  PATH PATTERN: /users/{uid}/vault/{entryId}
  Each user has their own "vault" sub-collection under their user document.
  The Firestore security rules ensure only the owner can access it.
*/

// Helper: returns the Firestore collection reference for a user's vault
const vaultRef = (uid) => collection(db, 'users', uid, 'vault')

/*
  getVaultEntries(uid)
  --------------------
  Fetches all vault entries for a user, ordered by creation date.
  Automatically decrypts each entry before returning.
  
  Returns: Array of entry objects with { id, game, imageKey, username,
           email, password, notes, createdAt }
*/
export const getVaultEntries = async (uid) => {
  try {
    // query() with orderBy sorts results server-side (most efficient)
    const q = query(vaultRef(uid), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data()
      // Decrypt sensitive fields before handing to the UI
      return decryptEntry({ id: docSnap.id, ...data }, uid)
    })
  } catch (err) {
    console.error('Failed to fetch vault entries:', err)
    throw err
  }
}

/*
  addVaultEntry(uid, entry)
  -------------------------
  Saves a new vault entry to Firestore.
  Encrypts all sensitive fields BEFORE writing — plaintext never touches
  the network or the database.
  
  entry shape: { game, imageKey, username, email, password, notes }
  Returns: The Firestore document reference (contains the new entry's ID)
*/
export const addVaultEntry = async (uid, entry) => {
  try {
    const encrypted = encryptEntry(entry, uid)
    return await addDoc(vaultRef(uid), {
      ...encrypted,
      createdAt: serverTimestamp(), // Firebase server time — more reliable than client time
    })
  } catch (err) {
    console.error('Failed to add vault entry:', err)
    throw err
  }
}

/*
  updateVaultEntry(uid, entryId, updates)
  ----------------------------------------
  Updates an existing vault entry. Re-encrypts all sensitive fields.
  
  We re-encrypt ALL fields (not just changed ones) for simplicity and
  because we don't want to accidentally leave any field as plaintext.
*/
export const updateVaultEntry = async (uid, entryId, updates) => {
  try {
    const encrypted = encryptEntry(updates, uid)
    const docRef = doc(db, 'users', uid, 'vault', entryId)
    return await updateDoc(docRef, {
      ...encrypted,
      updatedAt: serverTimestamp(),
    })
  } catch (err) {
    console.error('Failed to update vault entry:', err)
    throw err
  }
}

/*
  deleteVaultEntry(uid, entryId)
  ------------------------------
  Permanently deletes a vault entry. This is irreversible — consider
  adding a confirmation dialog before calling this (we'll do that in Step 4).
*/
export const deleteVaultEntry = async (uid, entryId) => {
  try {
    const docRef = doc(db, 'users', uid, 'vault', entryId)
    return await deleteDoc(docRef)
  } catch (err) {
    console.error('Failed to delete vault entry:', err)
    throw err
  }
}