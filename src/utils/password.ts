const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const NUM = '0123456789'
const SYM = '!@#$%^&*()-_=+[]{};:,.<>/?'

export const generatePassword = (length: number, opts: { upper: boolean; lower: boolean; num: boolean; sym: boolean }) => {
  const source = `${opts.upper ? UPPER : ''}${opts.lower ? LOWER : ''}${opts.num ? NUM : ''}${opts.sym ? SYM : ''}` || LOWER
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes, (b) => source[b % source.length]).join('')
}

export const scorePassword = (value: string) => {
  const pool =
    (/[A-Z]/.test(value) ? 26 : 0) +
    (/[a-z]/.test(value) ? 26 : 0) +
    (/[0-9]/.test(value) ? 10 : 0) +
    (/[^A-Za-z0-9]/.test(value) ? 32 : 0)
  const entropy = Math.round(value.length * Math.log2(Math.max(pool, 1)))
  const label = entropy > 70 ? 'Strong' : entropy > 45 ? 'Good' : entropy > 25 ? 'Weak' : 'Poor'
  return { entropy, label }
}

export const sanitizeText = (value: string) =>
  value
    .split('')
    .filter((char) => {
      const code = char.charCodeAt(0)
      return code >= 32 && code !== 127
    })
    .join('')
    .trim()
