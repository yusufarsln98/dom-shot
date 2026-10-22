import { CSS_URL_REGEX } from '../utils/constants.js'
import { isColorTransparent } from '../utils/dom-colors.js'
import { fetchUrlAsDataUrl } from './fetch-asset.js'
import { normalizeSvgDataUrl } from './svg-url.js'

/**
 * Rasterizes a CSS `mask-image` reference (data SVG, URL SVG, or remote image)
 * into a paintable PNG data URL tinted with the element's background color.
 * Keeps a per-request cache so repeated masks don't re-rasterize.
 */
export const rasterizeMaskToPngDataUrl = async (
  rawUrl: string,
  backgroundColor: string,
  width: number,
  height: number,
  baseUri: string,
  cache: Map<string, Promise<string | null>>,
): Promise<string | null> => {
  const cacheKey = `mask::${rawUrl}::${backgroundColor}::${width}x${height}`
  const cached = cache.get(cacheKey)
  if (cached) return cached

  const promise = (async (): Promise<string | null> => {
    let dataUrl: string | null = null
    if (rawUrl.startsWith('data:image/svg+xml')) {
      dataUrl = normalizeSvgDataUrl(rawUrl, backgroundColor)
    } else if (rawUrl.startsWith('data:')) {
      dataUrl = rawUrl
    } else {
      let resolvedUrl = rawUrl
      try {
        resolvedUrl = new URL(rawUrl, baseUri).href
      } catch {
        // keep rawUrl
      }
      dataUrl = await fetchUrlAsDataUrl(resolvedUrl, cache)
      if (dataUrl?.startsWith('data:image/svg+xml')) {
        dataUrl = normalizeSvgDataUrl(dataUrl, backgroundColor)
      }
    }

    if (!dataUrl) return null

    try {
      const targetW = Math.max(Math.round(width * 2), 64)
      const targetH = Math.max(Math.round(height * 2), 64)
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.width = targetW
      img.height = targetH

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = (err) => reject(err)
        img.src = dataUrl
      })

      const canvas = document.createElement('canvas')
      canvas.width = targetW
      canvas.height = targetH
      const ctx = canvas.getContext('2d')
      if (!ctx) return dataUrl

      ctx.drawImage(img, 0, 0, targetW, targetH)
      if (!isColorTransparent(backgroundColor)) {
        ctx.globalCompositeOperation = 'source-in'
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, targetW, targetH)
      }

      return canvas.toDataURL('image/png')
    } catch {
      return dataUrl
    }
  })()

  cache.set(cacheKey, promise)
  return promise
}

/**
 * Flattens a computed CSS mask into inline background layering on the target:
 * the mask image is rasterized, the `background-color` becomes transparent,
 * and the tinted raster is applied as the element background. WebKit
 * pseudo-standard forms (`-webkit-mask-*`) are handled through their
 * standardized equivalents.
 */
export const applyCssMaskToElement = async (
  target: HTMLElement,
  computed: CSSStyleDeclaration,
  baseUri: string,
  cache: Map<string, Promise<string | null>>,
) => {
  const maskImage =
    computed.getPropertyValue('mask-image') || computed.getPropertyValue('-webkit-mask-image')

  if (!maskImage || maskImage === 'none' || !maskImage.includes('url(')) {
    return
  }

  const matches = Array.from(maskImage.matchAll(CSS_URL_REGEX))
  const firstMatch = matches[0]
  const rawUrl = (firstMatch?.[1] ?? firstMatch?.[2] ?? firstMatch?.[3])?.trim()
  if (!rawUrl || rawUrl.startsWith('#')) {
    return
  }

  const bgColor = computed.getPropertyValue('background-color')
  const width = Number.parseFloat(computed.getPropertyValue('width')) || 16
  const height = Number.parseFloat(computed.getPropertyValue('height')) || 16

  const rasterizedDataUrl = await rasterizeMaskToPngDataUrl(
    rawUrl,
    bgColor,
    width,
    height,
    baseUri,
    cache,
  )
  if (!rasterizedDataUrl) return

  const maskSize =
    computed.getPropertyValue('mask-size') ||
    computed.getPropertyValue('-webkit-mask-size') ||
    'contain'
  const maskRepeat =
    computed.getPropertyValue('mask-repeat') ||
    computed.getPropertyValue('-webkit-mask-repeat') ||
    'no-repeat'
  const maskPosition =
    computed.getPropertyValue('mask-position') ||
    computed.getPropertyValue('-webkit-mask-position') ||
    'center'

  target.style.setProperty('background-color', 'transparent', 'important')
  target.style.setProperty('background-image', `url("${rasterizedDataUrl}")`, 'important')
  target.style.setProperty(
    'background-size',
    maskSize !== 'initial' ? maskSize : 'contain',
    'important',
  )
  target.style.setProperty(
    'background-repeat',
    maskRepeat !== 'initial' ? maskRepeat : 'no-repeat',
    'important',
  )
  target.style.setProperty(
    'background-position',
    maskPosition !== 'initial' ? maskPosition : 'center',
    'important',
  )
  target.style.setProperty('mask-image', 'none', 'important')
  target.style.setProperty('-webkit-mask-image', 'none', 'important')
}
