import { dataUrlToBlob } from '../utils/index.js'
import type { CaptureElementOptions } from '../types/index.js'
import { captureElementToPngDataUrl } from './capture-element.js'

/** The minimal clipboard surface the copy flow needs. */
interface ClipboardLike {
  write?: (items: ClipboardItem[]) => Promise<void>
  writeText?: (text: string) => Promise<void>
}

/**
 * Captures an element to PNG and copies it to the system clipboard as an
 * image (`image/png` `ClipboardItem`). When the browser cannot write images
 * — non-secure context, permission denial, missing `ClipboardItem` — the PNG
 * data URL falls back to `writeText` so something always lands on the
 * clipboard. Resolves `false` when nothing could be written, so callers can
 * branch without try/catch.
 */
export const copyElementToClipboard = async (
  element: HTMLElement,
  options?: CaptureElementOptions,
): Promise<boolean> => {
  if (!navigator.clipboard) return false

  const dataUrl = await captureElementToPngDataUrl(element, options)
  const clipboard = navigator.clipboard as ClipboardLike

  if (typeof clipboard.write === 'function' && typeof ClipboardItem !== 'undefined') {
    try {
      const blob = await dataUrlToBlob(dataUrl)
      await clipboard.write([new ClipboardItem({ 'image/png': blob })])
      return true
    } catch {
      // Permission denial / unsupported image type — fall through to text.
    }
  }

  if (typeof clipboard.writeText === 'function') {
    try {
      await clipboard.writeText(dataUrl)
      return true
    } catch {
      return false
    }
  }

  return false
}
