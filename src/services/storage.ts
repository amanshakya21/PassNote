import { openDB } from 'idb'
import type { AuthRecord, EncryptedVault, UserSettings } from '../types'

const DB_NAME = 'vaultnote-db'
const STORE = 'kv'

type StorageKey = 'auth' | 'vault' | 'settings'
type StorageValue = AuthRecord | EncryptedVault | UserSettings

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE)) {
      db.createObjectStore(STORE)
    }
  },
})

export const setRecord = async (key: StorageKey, value: StorageValue) => {
  const db = await dbPromise
  await db.put(STORE, value, key)
}

export const getRecord = async <T>(key: StorageKey): Promise<T | undefined> => {
  const db = await dbPromise
  return db.get(STORE, key) as Promise<T | undefined>
}

export const clearAllStorage = async () => {
  const db = await dbPromise
  await db.clear(STORE)
}
