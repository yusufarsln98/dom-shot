import { DEFAULT_SKIP_CLASSES, shouldSkipElement } from '../utils/index.js'
import { applyCssMaskToElement } from './css-mask.js'
import { canvasElementToDataUrl, imageElementToDataUrl } from './image-asset.js'
import { inlineCssUrls } from './inline-urls.js'
import { materializePseudoElement } from './pseudo-elements.js'
import { copyRootCssVariables, inlineElementStyles } from './style-inlining.js'

/**
 * Because the rasterized SVG document must be self-contained, we rebuild the
 * tree manually (rather than cloning and mutating): computed styles from the
 * whitelist are inlined onto each new node; every node gets the
 * `data-pseudo-cloned` marker so document CSS can suppress re-materialized
 * pseudo elements; `<canvas>` becomes a snapshot `<img>`; `<img>` sources are
 * flattened to data URLs; form-control values are written explicitly
 * pseudo elements become real spans; and scrolled containers wrap their
 * children in a translated box to preserve the visible scroll offset.
 * Callers run the copy-variables step separately on the returned root.
 */
export const cloneAndInlineTree = async (
  source: Element,
  doc: Document,
  win: Window,
  cache: Map<string, Promise<string | null>>,
  skipClasses: readonly string[] = DEFAULT_SKIP_CLASSES,
  isRoot = false,
  rootWidth?: number,
  rootHeight?: number,
  resolution = 1,
  replaceRootBorder = false,
): Promise<Element | null> => {
  if (!isRoot && shouldSkipElement(source, skipClasses)) {
    return null
  }

  const computed = win.getComputedStyle(source)
  if (!isRoot && computed.display === 'none') {
    return null
  }

  const tagName = source.tagName.toLowerCase()

  // Convert <canvas> to <img> with its current bitmap content
  if (tagName === 'canvas') {
    const canvas = source as HTMLCanvasElement
    const img = doc.createElement('img')
    inlineElementStyles(source, img, computed, isRoot, rootWidth, rootHeight, replaceRootBorder)
    const rect = canvas.getBoundingClientRect()
    const w = rect.width || canvas.width
    const h = rect.height || canvas.height
    if (w > 0 && h > 0) {
      img.style.width = `${w}px`
      img.style.height = `${h}px`
    }
    img.src = canvasElementToDataUrl(canvas, w, h, resolution)
    return img
  }

  const clone = source.cloneNode(false) as Element
  clone.removeAttribute('onload')
  clone.removeAttribute('onerror')
  clone.setAttribute('data-pseudo-cloned', 'true')

  inlineElementStyles(source, clone, computed, isRoot, rootWidth, rootHeight, replaceRootBorder)

  if (clone instanceof HTMLElement) {
    const baseUri = doc.baseURI || window.location.href
    const bgImage = computed.getPropertyValue('background-image')
    if (bgImage && bgImage !== 'none' && bgImage.includes('url(')) {
      const inlinedBg = await inlineCssUrls(bgImage, baseUri, cache)
      clone.style.backgroundImage = inlinedBg
    }
    await applyCssMaskToElement(clone, computed, baseUri, cache)
  }

  if (tagName === 'img') {
    const sourceImg = source as HTMLImageElement
    const dataUrl = await imageElementToDataUrl(sourceImg, cache, resolution)
    clone.setAttribute('src', dataUrl)
    clone.removeAttribute('srcset')
    clone.removeAttribute('loading')
    clone.removeAttribute('crossorigin')
    return clone
  }

  if (tagName === 'input') {
    const sourceInput = source as HTMLInputElement
    clone.setAttribute('value', sourceInput.value)
    if (sourceInput.type === 'checkbox' || sourceInput.type === 'radio') {
      if (sourceInput.checked) {
        clone.setAttribute('checked', 'checked')
      } else {
        clone.removeAttribute('checked')
      }
    }
    return clone
  } else if (tagName === 'textarea') {
    const sourceTextarea = source as HTMLTextAreaElement
    clone.textContent = sourceTextarea.value
    return clone
  }

  const childNodes = Array.from(source.childNodes)
  const clonedChildren: Node[] = []

  const beforePseudo = await materializePseudoElement(source, '::before', doc, win, cache)
  if (beforePseudo) {
    clonedChildren.push(beforePseudo)
  }

  for (const child of childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      clonedChildren.push(child.cloneNode(false))
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const childEl = child as Element
      const clonedChild = await cloneAndInlineTree(
        childEl,
        doc,
        win,
        cache,
        skipClasses,
        false,
        undefined,
        undefined,
        resolution,
        replaceRootBorder,
      )
      if (clonedChild) {
        if (
          tagName === 'select' &&
          childEl.tagName.toLowerCase() === 'option' &&
          (childEl as HTMLOptionElement).selected
        ) {
          clonedChild.setAttribute('selected', 'selected')
        }
        clonedChildren.push(clonedChild)
      }
    }
  }

  const afterPseudo = await materializePseudoElement(source, '::after', doc, win, cache)
  if (afterPseudo) {
    clonedChildren.push(afterPseudo)
  }

  // Preserve scroll position for scrolled containers
  const scrollTop = source instanceof HTMLElement ? source.scrollTop : 0
  const scrollLeft = source instanceof HTMLElement ? source.scrollLeft : 0

  if (!isRoot && clone instanceof HTMLElement && (scrollTop > 0 || scrollLeft > 0)) {
    clone.style.overflow = 'hidden'
    const scrollWrapper = doc.createElement('div')
    scrollWrapper.style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`
    scrollWrapper.style.width = '100%'
    scrollWrapper.style.height = '100%'
    for (const child of clonedChildren) {
      scrollWrapper.appendChild(child)
    }
    clone.appendChild(scrollWrapper)
  } else {
    for (const child of clonedChildren) {
      clone.appendChild(child)
    }
  }

  return clone
}

/**
 * Final clone-root prep: copied theme custom properties plus the XHTML
 * namespace demanded by the XML serializer.
 */
export const prepareCloneRoot = (
  clone: Element,
  source: HTMLElement,
  doc: Document,
  win: Window,
) => {
  if (clone instanceof HTMLElement) {
    copyRootCssVariables(source, doc, win, clone)
    clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
  }
}
