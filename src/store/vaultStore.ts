import { create } from 'zustand'
import { decryptVault, encryptVault } from '../crypto/crypto'
import { getRecord, setRecord } from '../services/storage'
import type { Credential, EncryptedVault, Vault } from '../types'

const emptyVault: Vault = { items: [] }

interface VaultState {
  vault: Vault
  loadVault: (key: CryptoKey) => Promise<void>
  saveVault: (key: CryptoKey) => Promise<void>
  addItem: (item: Credential) => void
  updateItem: (item: Credential) => void
  softDelete: (id: string) => void
  restore: (id: string) => void
  deletePermanent: (id: string) => void
}

export const useVaultStore = create<VaultState>((set, get) => ({
  vault: emptyVault,
  loadVault: async (key) => {
    const encrypted = await getRecord<EncryptedVault>('vault')
    if (!encrypted) {
      set({ vault: emptyVault })
      return
    }
    try {
      const vault = await decryptVault(encrypted, key)
      set({ vault })
    } catch {
      set({ vault: emptyVault })
    }
  },
  saveVault: async (key) => {
    const encrypted = await encryptVault(get().vault, key)
    await setRecord('vault', encrypted)
  },
  addItem: (item) => set({ vault: { items: [item, ...get().vault.items] } }),
  updateItem: (item) =>
    set({
      vault: { items: get().vault.items.map((entry) => (entry.id === item.id ? { ...item, updatedAt: Date.now() } : entry)) },
    }),
  softDelete: (id) =>
    set({
      vault: {
        items: get().vault.items.map((item) => (item.id === id ? { ...item, deletedAt: Date.now() } : item)),
      },
    }),
  restore: (id) =>
    set({
      vault: {
        items: get().vault.items.map((item) => (item.id === id ? { ...item, deletedAt: undefined } : item)),
      },
    }),
  deletePermanent: (id) => set({ vault: { items: get().vault.items.filter((item) => item.id !== id) } }),
}))
