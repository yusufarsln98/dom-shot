/**
 * Saves a Blob to disk through a temporary object URL download link.
 * Mirrors the browser-native "anchor click with `download` attribute" flow.
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(link)
}

/**
 * Normalizes a user-visible name into a safe download file stem:
 * filesystem-hostile characters become dashes, whitespace collapses, and the
 * result is lowercased. Callers append the final extension.
 */
export const sanitizeFileName = (value: string): string =>
  value
    .trim()
    .replace(/[<>:"/\\|?*]+/g, '-')
    .replace(/\s+/g, '-')
    .toLowerCase()
