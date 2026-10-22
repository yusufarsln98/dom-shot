import { dataUrlToBlob } from '../utils/index.js'
import type { CaptureElementOptions } from '../types/index.js'
import { captureElementToPngDataUrl } from './capture-element.js'

/**
 * A ready-to-display PNG preview: the data URL itself plus the metadata a host
 * app needs to render it back at 1:1 and tell the user how big the export is.
 */
export interface ElementPreview {
  /** PNG data URL, exactly as `captureElementToPngDataUrl` produces it. */
  dataUrl: string
  /** Decoded PNG size in bytes (exact — the base64 payload is decoded once). */
  bytes: number
  /** The captured element's CSS layout width in px, so previews render at 1:1. */
  cssWidth: number
}

/**
 * Captures an element and resolves with a display-ready preview — PNG data
 * URL, decoded byte size, and the element's CSS layout size — in a single
 * call, so callers never re-derive any of it from the raw data URL. Throws
 * when the underlying capture fails.
 */
export const previewElementAsImage = async (
  element: HTMLElement,
  options?: CaptureElementOptions,
): Promise<ElementPreview> => {
  // Measure before capturing: the live DOM is never mutated mid-capture, so
  // the rect taken here is the layout the data URL was rendered against.
  const rect = element.getBoundingClientRect()

  const dataUrl = await captureElementToPngDataUrl(element, options)
  // Decoding through the internal helper gives the exact PNG byte size
  // instead of a base64 length estimate.
  const blob = await dataUrlToBlob(dataUrl)

  return {
    dataUrl,
    bytes: blob.size,
    cssWidth: Math.round(rect.width),
  }
}
