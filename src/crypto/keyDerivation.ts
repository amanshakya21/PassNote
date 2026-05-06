const DEFAULT_ITERATIONS = 310000

export const generateSalt = (size = 16): Uint8Array => crypto.getRandomValues(new Uint8Array(size))
export const generateIV = (size = 12): Uint8Array => crypto.getRandomValues(new Uint8Array(size))

const textEncoder = new TextEncoder()

export const deriveKey = async (password: string, salt: Uint8Array, iterations = DEFAULT_ITERATIONS) => {
  const keyMaterial = await crypto.subtle.importKey('raw', textEncoder.encode(password), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as unknown as BufferSource, iterations, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export const iterations = DEFAULT_ITERATIONS
