import { TRANSPARENT_PIXEL } from '../utils/constants.js'
import { fetchUrlAsDataUrl } from './fetch-asset.js'

/**
 * Draws any decoded image source (bitmap `<img>` or `<canvas>` snapshot) at
 * exactly `targetW × targetH` with high-quality smoothing, so the final SVG
 * rasterization draws it 1:1 instead of letting the renderer upscale it with
 * its blocky integer-factor fast path. Vector sources are rasterized by the
 * engine at the requested size, which keeps them sharp at any `pixelRatio`.
 */
export const rasterizeImageSourceAtRect = (
  source: CanvasImageSource,
  targetW: number,
  targetH: number,
): string | null => {
  if (targetW < 1 || targetH < 1) return null
  try {
    const canvas = document.createElement('canvas')
    canvas.width = targetW
    canvas.height = targetH
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(source, 0, 0, targetW, targetH)
    return canvas.toDataURL('image/png')
  } catch {
    // Tainted source or context failure
    return null
  }
}

/**
 * Produces a data URL for an `<img>` element rasterized at `resolution` times
 * its display size:
 * - decoded sources draw at the target rect (vectors stay crisp; low-res
 *   bitmaps are smooth-upscaled once, instead of getting blocky in the final
 *   render),
 * - not-yet-decoded sources fall back to the fetched data-URL,
 * - total failures degrade to a transparent pixel.
 *
 * `resolution = 1` mirrors the legacy behavior; the capture pipeline forwards
 * its `pixelRatio` for high-resolution output.
 */
export const imageElementToDataUrl = async (
  img: HTMLImageElement,
  cache: Map<string, Promise<string | null>>,
  resolution = 1,
): Promise<string> => {
  const src = img.currentSrc || img.src || img.getAttribute('src') || ''
  if (!src) return TRANSPARENT_PIXEL

  const rect = img.getBoundingClientRect()
  const naturalW = img.naturalWidth
  const naturalH = img.naturalHeight
  const targetW = Math.round(Math.max(rect.width * resolution, naturalW, 1))
  const targetH = Math.round(Math.max(rect.height * resolution, naturalH, 1))

  if (img.complete && naturalW > 0 && naturalH > 0) {
    const rasterized = rasterizeImageSourceAtRect(img, targetW, targetH)
    if (rasterized) return rasterized
  }

  const fetched = await fetchUrlAsDataUrl(src, cache)
  if (fetched) return fetched

  // Last resort: keep the live pixels even when fetching failed.
  return rasterizeImageSourceAtRect(img, naturalW, naturalH) ?? TRANSPARENT_PIXEL
}

/**
 * Snapshot for `<canvas>` clones: re-rasterizes the live bitmap at the
 * requested target resolution (smooth when upscaling, 1:1 when the bitmap
 * already has enough detail) so canvas widgets stay crisp at high
 * `pixelRatio` without changing their live appearance.
 */
export const canvasElementToDataUrl = (
  canvas: HTMLCanvasElement,
  displayWidth: number,
  displayHeight: number,
  resolution: number,
): string => {
  if (canvas.width <= 0 || canvas.height <= 0 || displayWidth <= 0 || displayHeight <= 0) {
    return TRANSPARENT_PIXEL
  }
  const targetW = Math.round(Math.max(displayWidth * resolution, canvas.width, 1))
  const targetH = Math.round(Math.max(displayHeight * resolution, canvas.height, 1))
  return rasterizeImageSourceAtRect(canvas, targetW, targetH) ?? TRANSPARENT_PIXEL
}
