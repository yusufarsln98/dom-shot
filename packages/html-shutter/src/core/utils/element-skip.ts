import { DEFAULT_SKIP_CLASSES } from './constants.js'

const ALWAYS_SKIPPED_TAGS = new Set(['script', 'noscript', 'iframe'])

/**
 * Decide whether an element must disappear from the capture tree:
 * explicit `data-no-export` opt-outs, dev-only overlay classes, and tags that
 * never belong in a rasterized image. The root element is exempt from this
 * filter because callers never clone a root they don't want.
 */
export const shouldSkipElement = (
  el: Element,
  skipClasses: readonly string[] = DEFAULT_SKIP_CLASSES,
): boolean => {
  if (
    skipClasses.some((className) => el.classList.contains(className)) ||
    el.getAttribute('data-no-export') === 'true'
  ) {
    return true
  }
  return ALWAYS_SKIPPED_TAGS.has(el.tagName.toLowerCase())
}
