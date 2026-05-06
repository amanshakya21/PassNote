import { create } from 'zustand'
import { decryptText, deriveKey, encryptText, generateSalt, iterations } from '../crypto/crypto'
import { clearAllStorage, getRecord, setRecord } from '../services/storage'
import type { AuthRecord } from '../types'

const VERIFICATION_TEXT = 'vaultnote-verification-v1'

interface AuthState {
  isInitialized: boolean
  isSetup: boolean
  isAuthenticated: boolean
  key: CryptoKey | null
  loginError: string | null
  bootstrap: () => Promise<void>
  setup: (password: string) => Promise<void>
  login: (password: string) => Promise<boolean>
  lock: () => void
  logout: () => void
  clearAll: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  isInitialized: false,
  isSetup: false,
  isAuthenticated: false,
  key: null,
  loginError: null,
  bootstrap: async () => {
    const auth = await getRecord<AuthRecord>('auth')
    set({ isSetup: Boolean(auth), isInitialized: true })
  },
  setup: async (password: string) => {
    const salt = generateSalt()
    const key = await deriveKey(password, salt, iterations)
    const verification = await encryptText(VERIFICATION_TEXT, key)
    const authRecord: AuthRecord = {
      salt: btoa(String.fromCharCode(...salt)),
      verificationIv: verification.iv,
      verificationCipher: verification.data,
      iterations,
    }
    await setRecord('auth', authRecord)
    set({ isSetup: true, isAuthenticated: true, key, loginError: null })
  },
  login: async (password: string) => {
    try {
      const auth = await getRecord<AuthRecord>('auth')
      if (!auth) return false
      const salt = Uint8Array.from(atob(auth.salt), (c) => c.charCodeAt(0))
      const key = await deriveKey(password, salt, auth.iterations)
      const verification = await decryptText({ iv: auth.verificationIv, data: auth.verificationCipher }, key)
      if (verification !== VERIFICATION_TEXT) throw new Error('Invalid password')
      set({ isAuthenticated: true, key, loginError: null })
      return true
    } catch {
      set({ loginError: 'Wrong master password', isAuthenticated: false, key: null })
      return false
    }
  },
  lock: () => set({ isAuthenticated: false, key: null }),
  logout: () => set({ isAuthenticated: false, key: null }),
  clearAll: async () => {
    await clearAllStorage()
    set({ isSetup: false, isAuthenticated: false, key: null, loginError: null })
  },
}))
