import type { CaptureElementOptions } from '../types/index.js'
import {
  DEFAULT_SKIP_CLASSES,
  isColorTransparent,
  resolveBackgroundColor,
  resolveBorderColor,
  resolveElementBorderRadius,
} from '../utils/index.js'
import { cloneAndInlineTree, prepareCloneRoot } from './clone-tree.js'
import { collectSafeDocumentCss } from './document-css.js'
import { buildSvgDocument, renderSvgToCanvas } from './svg-render.js'

/**
 * The core capture: rasterizes a live element into a pixel-accurate
 * `image/png` data URL.
 *
 * The element tree is cloned with styles inlined, embedded into an SVG
 * `foreignObject` document, and drawn to a canvas — the live DOM is never
 * touched. Explicit option values win; omitted values are derived from the
 * element's own theme (nearest opaque background, nearest visible border).
 */
export const captureElementToPngDataUrl = async (
  element: HTMLElement,
  options?: CaptureElementOptions,
): Promise<string> => {
  const doc = element.ownerDocument || document
  const win = doc.defaultView || window

  const rect = element.getBoundingClientRect()
  const width = Math.max(Math.ceil(rect.width || element.clientWidth), 100)
  const height = Math.max(Math.ceil(rect.height || element.clientHeight), 100)
  const backgroundColor = options?.backgroundColor ?? resolveBackgroundColor(element)
  const borderColor =
    options?.borderColor ?? resolveBorderColor(element, options?.borderColorVariables)
  const borderWidth = options?.borderWidth ?? 1
  // The frame radius is not adjustable: it always follows the element's own
  // computed corner radius (0 for square elements) so the export mirrors the
  // live element's silhouette.
  const borderRadius = resolveElementBorderRadius(element, win) ?? 0
  const pixelRatio = options?.pixelRatio ?? Math.min(win.devicePixelRatio || 1, 2)

  // When the painted frame border is enabled, it replaces the element's own
  // border ring (otherwise two overlapping borders with different corner
  // radii show up in the export).
  const replaceRootBorder = borderWidth > 0 && !!borderColor && !isColorTransparent(borderColor)

  const skipClasses = [...DEFAULT_SKIP_CLASSES, ...(options?.extraSkipClasses ?? [])]

  const urlCache = new Map<string, Promise<string | null>>()
  const clonedRoot = await cloneAndInlineTree(
    element,
    doc,
    win,
    urlCache,
    skipClasses,
    true,
    width,
    height,
    pixelRatio,
    replaceRootBorder,
  )

  if (!clonedRoot) {
    throw new Error('Failed to clone element')
  }

  // Theme custom properties + XHTML namespace so the serialized tree is self-sufficient
  prepareCloneRoot(clonedRoot, element, doc, win)

  const xmlSerializer = new XMLSerializer()
  const serializedHtml = xmlSerializer.serializeToString(clonedRoot)

  const safeCss = collectSafeDocumentCss(doc)

  const svgString = buildSvgDocument({
    serializedHtml,
    width,
    height,
    backgroundColor,
    documentCss: safeCss,
  })

  const canvas = await renderSvgToCanvas(
    svgString,
    width,
    height,
    backgroundColor,
    borderColor,
    borderWidth,
    borderRadius,
    pixelRatio,
  )

  return canvas.toDataURL('image/png')
}
