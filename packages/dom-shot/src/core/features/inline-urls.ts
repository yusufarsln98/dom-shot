import { CSS_URL_REGEX } from '../utils/constants.js'
import { fetchUrlAsDataUrl } from './fetch-asset.js'
import { normalizeSvgDataUrl } from './svg-url.js'

/**
 * Replaces every `url(...)` reference in a CSS value with a data URL so the
 * value survives inside the standalone SVG document. SVG references get
 * normalized; unresolvable references degrade to `none` instead of breaking
 * rasterization.
 */
export const inlineCssUrls = async (
  cssValue: string,
  baseUri: string,
  cache: Map<string, Promise<string | null>>,
): Promise<string> => {
  if (!cssValue || !cssValue.includes('url(')) return cssValue

  const matches = Array.from(cssValue.matchAll(CSS_URL_REGEX))
  if (matches.length === 0) return cssValue

  let result = cssValue
  for (const match of matches) {
    const fullMatch = match[0]
    const rawUrl = (match[1] ?? match[2] ?? match[3])?.trim()
    if (!rawUrl || rawUrl.startsWith('#')) {
      continue
    }

    if (rawUrl.startsWith('data:image/svg+xml')) {
      const normalized = normalizeSvgDataUrl(rawUrl)
      result = result.replace(fullMatch, `url("${normalized}")`)
      continue
    }

    if (rawUrl.startsWith('data:')) {
      continue
    }

    let resolvedUrl = rawUrl
    try {
      resolvedUrl = new URL(rawUrl, baseUri).href
    } catch {
      // keep rawUrl
    }

    const dataUrl = await fetchUrlAsDataUrl(resolvedUrl, cache)
    if (dataUrl) {
      result = result.replace(fullMatch, `url("${dataUrl}")`)
    } else {
      result = result.replace(fullMatch, 'none')
    }
  }

  return result
}
