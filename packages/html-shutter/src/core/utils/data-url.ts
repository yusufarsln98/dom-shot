/**
 * Converts a data URL into a properly typed `Blob` without touching the
 * network. Resolves for base64 payloads and for percent-encoded payloads alike
 * so both encoding styles can flow into down-the-stream download helpers.
 */
export const dataUrlToBlob = (dataUrl: string): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const commaIndex = dataUrl.indexOf(',')
    if (commaIndex === -1 || !dataUrl.trim().toLowerCase().startsWith('data:')) {
      reject(new Error('Invalid data URL'))
      return
    }

    const header = dataUrl.slice(0, commaIndex)
    const payload = dataUrl.slice(commaIndex + 1)
    const mime = header.slice(5).split(';')[0] || 'application/octet-stream'

    try {
      if (/;base64$/i.test(header)) {
        const binary = atob(payload)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i)
        }
        resolve(new Blob([bytes], { type: mime }))
        return
      }

      resolve(new Blob([decodeURIComponent(payload)], { type: mime }))
    } catch (error) {
      reject(error instanceof Error ? error : new Error('Invalid data URL'))
    }
  })
