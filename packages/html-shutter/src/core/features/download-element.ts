import { dataUrlToBlob, downloadBlob, sanitizeFileName } from '../utils/index.js'
import type { CaptureElementOptions } from '../types/index.js'
import { captureElementToPngDataUrl } from './capture-element.js'

/** Formats the default file stamp as `YYYY-MM-DD-HHmmss` without a date library. */
const defaultFileStamp = (): string => {
  const now = new Date()
  const pad = (value: number, size = 2) => `${value}`.padStart(size, '0')
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const time = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  return `${date}-${time}`
}

/**
 * Captures an element to PNG and hands it to the browser as a file download.
 * Returns `false` when the capture failed, so callers can branch without
 * wrapping in try/catch.
 */
export const downloadElementAsImage = async (
  element: HTMLElement,
  options?: CaptureElementOptions,
): Promise<boolean> => {
  const dataUrl = await captureElementToPngDataUrl(element, options)
  const blob = await dataUrlToBlob(dataUrl)

  const rawName = options?.fileName || `element-${defaultFileStamp()}`
  const sanitized = sanitizeFileName(rawName)
  const fileName = sanitized.endsWith('.png') ? sanitized : `${sanitized}.png`

  downloadBlob(blob, fileName)
  return true
}
