import CryptoJS from 'crypto-js'



const getKey = (uid) => {
  const secret = import.meta.env.VITE_ENCRYPT_SECRET
  if (!secret) {
    throw new Error('VITE_ENCRYPT_SECRET is not set in your .env.local file')
  }
  // Concatenate to create a per-user key. CryptoJS hashes this internally.
  return `${uid}:${secret}`
}

/*
  encrypt(plaintext, uid)
  -----------------------
  Takes a readable string (e.g. "MyPassword123") and returns an
  encrypted ciphertext string (e.g. "U2FsdGVkX1+...") safe to store.
  
  Returns empty string for empty input — no point encrypting nothing.
*/
export const encrypt = (plaintext, uid) => {
  if (!plaintext) return ''
  try {
    return CryptoJS.AES.encrypt(plaintext, getKey(uid)).toString()
  } catch (err) {
    console.error('Encryption failed:', err)
    throw new Error('Failed to encrypt data')
  }
}

/*
  decrypt(ciphertext, uid)
  ------------------------
  Takes a ciphertext string and returns the original readable string.
  
  Returns empty string if decryption fails (e.g. wrong key, corrupted data).
  We don't throw here because a failed decrypt should show "" in the UI,
  not crash the app.
*/
export const decrypt = (ciphertext, uid) => {
  if (!ciphertext) return ''
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, getKey(uid))
    const result = bytes.toString(CryptoJS.enc.Utf8)
    // If decryption produces garbage (wrong key), result will be empty
    return result || ''
  } catch (err) {
    // Silently fail — return empty rather than crashing
    console.error('Decryption failed:', err)
    return ''
  }
}

/*
  encryptEntry(entry, uid)
  ------------------------
  Convenience function: takes a full vault entry object and encrypts
  all sensitive fields at once. Non-sensitive fields (like 'game' and
  'imageKey') are left in plaintext so you can display the game name
  and icon without needing to decrypt first.
*/
export const encryptEntry = (entry, uid) => ({
  game:      entry.game,          // plaintext — just the game name, not sensitive
  imageKey:  entry.imageKey,      // plaintext — used to show the game logo
  username:  encrypt(entry.username, uid),
  email:     encrypt(entry.email, uid),
  password:  encrypt(entry.password, uid),
  notes:     encrypt(entry.notes, uid),
})

/*
  decryptEntry(entry, uid)
  ------------------------
  Reverse of encryptEntry — decrypts all sensitive fields.
  Called when the user opens a vault entry to view their credentials.
*/
export const decryptEntry = (entry, uid) => ({
  ...entry,   // spread to keep id, createdAt, etc.
  username: decrypt(entry.username, uid),
  email:    decrypt(entry.email, uid),
  password: decrypt(entry.password, uid),
  notes:    decrypt(entry.notes, uid),
})