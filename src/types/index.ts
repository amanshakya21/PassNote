export type Category = 'social' | 'email' | 'banking' | 'work' | 'notes' | (string & {})

export interface Credential {
  id: string
  title: string
  username: string
  password: string
  notes: string
  category: Category
  websiteUrl?: string
  favorite: boolean
  pinned?: boolean
  deletedAt?: number
  createdAt: number
  updatedAt: number
  lastUsedAt?: number
}

export interface Vault {
  items: Credential[]
}

export interface EncryptedVault {
  iv: string
  data: string
  updatedAt: number
}

export interface AuthRecord {
  salt: string
  verificationIv: string
  verificationCipher: string
  iterations: number
}

export interface UserSettings {
  autoLockMinutes: number
  theme: 'dark' | 'light'
  clipboardClearSeconds: number
}
