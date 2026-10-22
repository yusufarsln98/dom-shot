import { describe, expect, it } from 'vitest'

import { dataUrlToBlob } from '../utils/data-url.js'
import { TRANSPARENT_PIXEL } from '../utils/constants.js'

const readBytes = (blob: Blob): Promise<Uint8Array> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (reader.result instanceof ArrayBuffer) resolve(new Uint8Array(reader.result))
      else reject(reader.error ?? new Error('Failed to read blob'))
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(blob)
  })

describe('dataUrlToBlob', () => {
  it('round-trips a base64 data URL into a typed GIF Blob', async () => {
    const blob = await dataUrlToBlob(TRANSPARENT_PIXEL)
    expect(blob.type).toBe('image/gif')
    expect(blob.size).toBeGreaterThan(10)

    const bytes = await readBytes(blob)
    expect(Array.from(bytes.slice(0, 3))).toEqual([0x47, 0x49, 0x46]) // "GIF"
  })

  it('rejects malformed data URLs', async () => {
    await expect(dataUrlToBlob('not-a-data-url')).rejects.toThrow('Invalid data URL')
  })

  it('defaults the mime type for header-less data URLs', async () => {
    const blob = await dataUrlToBlob('data:,hello')
    expect(blob.type).toBe('application/octet-stream')
    expect(blob.size).toBe(5)
  })
})
