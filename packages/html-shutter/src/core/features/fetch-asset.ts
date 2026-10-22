/**
 * Fetches an arbitrary asset URL and converts it to a data URL, caching
 * concurrent and repeat requests behind a single promise. Falls back from
 * same-origin credentials to a plain CORS request before giving up.
 */
export const fetchUrlAsDataUrl = async (
  url: string,
  cache: Map<string, Promise<string | null>>,
): Promise<string | null> => {
  if (url.startsWith('data:')) return url
  if (cache.has(url)) {
    return cache.get(url) ?? null
  }

  const promise = (async () => {
    try {
      const response = await fetch(url, {
        mode: 'cors',
        credentials: 'same-origin',
        cache: 'force-cache',
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const blob = await response.blob()
      return await blobToDataUrl(blob)
    } catch {
      try {
        const response = await fetch(url, {
          mode: 'cors',
          credentials: 'omit',
          cache: 'force-cache',
        })
        if (!response.ok) return null
        const blob = await response.blob()
        return await blobToDataUrl(blob)
      } catch {
        return null
      }
    }
  })()

  cache.set(url, promise)
  return promise
}

/**
 * Converts an in-memory Blob to a data URL using `FileReader`.
 */
const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert blob to data URL'))
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
