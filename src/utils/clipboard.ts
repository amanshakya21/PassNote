export const copyWithAutoClear = async (value: string, timeoutSeconds: number) => {
  await navigator.clipboard.writeText(value)
  setTimeout(async () => {
    try {
      const current = await navigator.clipboard.readText()
      if (current === value) await navigator.clipboard.writeText('')
    } catch {
      // Clipboard access can be blocked by the browser. Ignore silently.
    }
  }, timeoutSeconds * 1000)
}
