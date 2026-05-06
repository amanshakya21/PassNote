import type { EncryptedVault, Vault } from '../types'
import { generateIV } from './keyDerivation'

const enc = new TextEncoder()
const dec = new TextDecoder()

const toBase64 = (arr: Uint8Array): string => btoa(String.fromCharCode(...arr))
const fromBase64 = (value: string): Uint8Array => Uint8Array.from(atob(value), (c) => c.charCodeAt(0))

export const encryptText = async (value: string, key: CryptoKey) => {
  const iv = generateIV()
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv as unknown as BufferSource }, key, enc.encode(value))
  return { iv: toBase64(iv), data: toBase64(new Uint8Array(cipher)) }
}

export const decryptText = async (payload: { iv: string; data: string }, key: CryptoKey) => {
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64(payload.iv) as unknown as BufferSource },
    key,
    fromBase64(payload.data) as unknown as BufferSource,
  )
  return dec.decode(plain)
}

export const encryptVault = async (vault: Vault, key: CryptoKey): Promise<EncryptedVault> => {
  const encrypted = await encryptText(JSON.stringify(vault), key)
  return { ...encrypted, updatedAt: Date.now() }
}

export const decryptVault = async (vault: EncryptedVault, key: CryptoKey): Promise<Vault> => {
  const plain = await decryptText({ iv: vault.iv, data: vault.data }, key)
  return JSON.parse(plain) as Vault
}

