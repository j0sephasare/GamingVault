import CryptoJS from 'crypto-js'

const getKey = (uid) => {
  const secret = import.meta.env.VITE_ENCRYPT_SECRET
  if (!secret) throw new Error('VITE_ENCRYPT_SECRET is not set in .env.local')
  return `${uid}:${secret}`
}

export const encrypt = (plaintext, uid) => {
  if (!plaintext) return ''
  try {
    return CryptoJS.AES.encrypt(plaintext, getKey(uid)).toString()
  } catch (err) {
    console.error('Encryption failed:', err)
    throw new Error('Failed to encrypt data')
  }
}

export const decrypt = (ciphertext, uid) => {
  if (!ciphertext) return ''
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, getKey(uid))
    return bytes.toString(CryptoJS.enc.Utf8) || ''
  } catch {
    return ''
  }
}

/*
  - game:     the game id (e.g. "league") — plaintext, not sensitive
  - username: encrypted
  - email:    encrypted
  - password: encrypted
  - notes:    encrypted
*/
export const encryptEntry = (entry, uid) => ({
  game:     entry.game,                    // plaintext — just an id like "league"
  username: encrypt(entry.username, uid),
  email:    encrypt(entry.email, uid),
  password: encrypt(entry.password, uid),
  notes:    encrypt(entry.notes, uid),
})

export const decryptEntry = (entry, uid) => ({
  ...entry,
  username: decrypt(entry.username, uid),
  email:    decrypt(entry.email, uid),
  password: decrypt(entry.password, uid),
  notes:    decrypt(entry.notes, uid),
})