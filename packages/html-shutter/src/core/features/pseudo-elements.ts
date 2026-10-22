import { HTML_STYLE_PROPERTIES } from '../utils/style-properties.js'
import { applyCssMaskToElement } from './css-mask.js'
import { inlineCssUrls } from './inline-urls.js'

/** Reveals the user-visible text of a `content` declaration (handles escapes). */
export const parsePseudoContent = (content: string): string => {
  const trimmed = content.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).replace(/\\a0/gi, ' ').replace(/\\"/g, '"').replace(/\\'/g, "'")
  }
  return ''
}

/**
 * Converts one computed `::before` / `::after` pseudo element into a real
 * `<span>` so it survives namespace-less cloning inside foreignObject.
 * Only visually present pseudo elements are materialized; `url()` backgrounds
 * are inlined and CSS masks are already flattened at this stage.
 */
export const materializePseudoElement = async (
  source: Element,
  pseudo: '::before' | '::after',
  doc: Document,
  win: Window,
  cache: Map<string, Promise<string | null>>,
): Promise<HTMLElement | null> => {
  if (!(source instanceof HTMLElement)) return null

  const computed = win.getComputedStyle(source, pseudo)
  const content = computed.getPropertyValue('content')
  if (!content || content === 'none' || content === 'normal') {
    return null
  }

  const display = computed.getPropertyValue('display')
  const visibility = computed.getPropertyValue('visibility')
  const opacity = computed.getPropertyValue('opacity')
  if (display === 'none' || visibility === 'hidden' || opacity === '0') {
    return null
  }

  const span = doc.createElement('span')
  span.setAttribute('data-pseudo-element', pseudo)
  span.setAttribute('data-pseudo-cloned', 'true')

  for (const prop of HTML_STYLE_PROPERTIES) {
    const val = computed.getPropertyValue(prop)
    if (val && val !== 'initial') {
      span.style.setProperty(prop, val)
    }
  }

  const baseUri = doc.baseURI || window.location.href

  const bgImage = computed.getPropertyValue('background-image')
  if (bgImage && bgImage !== 'none' && bgImage.includes('url(')) {
    const inlinedBg = await inlineCssUrls(bgImage, baseUri, cache)
    span.style.backgroundImage = inlinedBg
  }

  await applyCssMaskToElement(span, computed, baseUri, cache)

  const text = parsePseudoContent(content)
  if (text) {
    span.textContent = text
  }

  return span
}
