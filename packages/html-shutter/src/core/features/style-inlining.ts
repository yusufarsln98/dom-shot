import { HTML_STYLE_PROPERTIES, SVG_STYLE_PROPERTIES } from '../utils/style-properties.js'

/**
 * Copies the whitelisted computed properties from a live source element onto
 * its clone. SVG subtrees get a dedicated property set plus explicit width/
 * height and XHTML namespace so they render identically inside foreignObject.
 * The root also loses ancestor-relative positioning so the frame draws at
 * 0,0 with its intrinsic size — and, when the painted frame border replaces
 * it, its own border ring (colors made transparent; widths kept so layout is
 * untouched) so the export never shows two overlapping borders.
 */
export const inlineElementStyles = (
  source: Element,
  target: Element,
  computed: CSSStyleDeclaration,
  isRoot: boolean,
  rootWidth?: number,
  rootHeight?: number,
  replaceRootBorder = false,
) => {
  if (
    source instanceof SVGElement &&
    (target instanceof SVGElement || target.namespaceURI?.includes('svg'))
  ) {
    const targetSvg = target as SVGElement
    for (const prop of SVG_STYLE_PROPERTIES) {
      const val = computed.getPropertyValue(prop)
      if (val && val !== 'initial' && val !== 'none') {
        targetSvg.style.setProperty(prop, val)
      } else if (prop === 'fill' && val === 'none') {
        targetSvg.style.setProperty('fill', 'none')
      } else if (prop === 'display' && val === 'none') {
        targetSvg.style.setProperty('display', 'none')
      }
    }

    if (source.tagName.toLowerCase() === 'svg') {
      const rect = source.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        targetSvg.setAttribute('width', `${rect.width}`)
        targetSvg.setAttribute('height', `${rect.height}`)
        targetSvg.style.width = `${rect.width}px`
        targetSvg.style.height = `${rect.height}px`
      }
      targetSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    }
    return
  }

  if (target instanceof HTMLElement) {
    for (const prop of HTML_STYLE_PROPERTIES) {
      const val = computed.getPropertyValue(prop)
      if (val && val !== 'initial') {
        target.style.setProperty(prop, val)
      }
    }

    if (isRoot && rootWidth !== undefined && rootHeight !== undefined) {
      target.style.width = `${rootWidth}px`
      target.style.height = `${rootHeight}px`
      target.style.minWidth = `${rootWidth}px`
      target.style.maxWidth = `${rootWidth}px`
      target.style.minHeight = `${rootHeight}px`
      target.style.maxHeight = `${rootHeight}px`
      target.style.margin = '0'
      target.style.position = 'relative'
      target.style.left = '0'
      target.style.top = '0'
      target.style.transform = 'none'
      target.style.boxSizing = 'border-box'

      if (replaceRootBorder) {
        // The canvas-painted frame is the single border; neutralize the
        // element's own ring after the whitelist copy (widths stay so the
        // box does not reflow) and let the frame stroke provide the line.
        for (const side of ['top', 'right', 'bottom', 'left'] as const) {
          target.style.setProperty(`border-${side}-color`, 'transparent')
        }
      }
    }
  }
}

/**
 * Copies every CSS custom property visible on the source element and its
 * ancestors into the clone root, outermost first, so theme tokens used by the
 * inlined styles keep their overridden values inside the SVG document.
 */
export const copyRootCssVariables = (
  sourceElement: HTMLElement,
  doc: Document,
  win: Window,
  target: HTMLElement,
) => {
  const ancestors: HTMLElement[] = []
  let curr: HTMLElement | null = sourceElement
  while (curr) {
    ancestors.push(curr)
    curr = curr.parentElement
  }
  if (doc.body && !ancestors.includes(doc.body)) {
    ancestors.push(doc.body)
  }
  if (doc.documentElement && !ancestors.includes(doc.documentElement)) {
    ancestors.push(doc.documentElement)
  }

  // Apply from outermost ancestor down to the source element so overrides win
  for (let idx = ancestors.length - 1; idx >= 0; idx--) {
    const el = ancestors[idx]
    if (!el) continue
    const style = win.getComputedStyle(el)
    for (let i = 0; i < style.length; i++) {
      const propName = style[i]
      if (propName && propName.startsWith('--')) {
        const value = style.getPropertyValue(propName)
        if (value) {
          target.style.setProperty(propName, value)
        }
      }
    }
  }
}
