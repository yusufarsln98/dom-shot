import {
  DEFAULT_BORDER_COLOR_VARIABLES,
  FALLBACK_BORDER_COLOR_DARK,
  FALLBACK_BORDER_COLOR_LIGHT,
} from './constants.js'

const isTransparentColor = (color: string | null | undefined): boolean => {
  if (!color) return true
  const normalized = color.trim().toLowerCase()
  return (
    normalized === '' ||
    normalized === 'transparent' ||
    normalized === 'rgba(0, 0, 0, 0)' ||
    normalized === 'hsla(0, 0%, 0%, 0)'
  )
}

export const isColorTransparent = isTransparentColor

/**
 * Derives the frame background paint for a capture: the first opaque
 * background found on the element or its ancestors, then the document body and
 * root element, and finally the framework's default light/dark color.
 */
export const resolveBackgroundColor = (element: HTMLElement): string => {
  const doc = element.ownerDocument || document
  const win = doc.defaultView || window

  let current: HTMLElement | null = element
  while (current) {
    const bg = win.getComputedStyle(current).backgroundColor
    if (!isTransparentColor(bg)) {
      return bg
    }
    current = current.parentElement
  }

  const bodyBg = win.getComputedStyle(doc.body).backgroundColor
  if (!isTransparentColor(bodyBg)) {
    return bodyBg
  }

  const htmlBg = win.getComputedStyle(doc.documentElement).backgroundColor
  if (!isTransparentColor(htmlBg)) {
    return htmlBg
  }

  const isDark = doc.documentElement.getAttribute('data-theme') === 'dark'
  return isDark ? '#141414' : '#ffffff'
}

/**
 * Derives the frame border color for a capture: the first visible border found
 * on the element or its ancestors, then well-known theme custom properties
 * (`variables` — consults every ancestor before falling back to the document
 * root), and finally the framework's default light/dark border color.
 */
export const resolveBorderColor = (
  element: HTMLElement,
  variables: readonly string[] = DEFAULT_BORDER_COLOR_VARIABLES,
): string => {
  const doc = element.ownerDocument || document
  const win = doc.defaultView || window

  let current: HTMLElement | null = element
  while (current) {
    const style = win.getComputedStyle(current)

    const borderStyle = style.borderTopStyle
    const borderWidth = Number.parseFloat(style.borderTopWidth || '0')
    const borderColor = style.borderTopColor
    if (
      borderStyle &&
      borderStyle !== 'none' &&
      borderWidth > 0 &&
      !isTransparentColor(borderColor)
    ) {
      return borderColor
    }

    for (const variable of variables) {
      const value = style.getPropertyValue(variable).trim()
      if (value && !isTransparentColor(value)) {
        return value
      }
    }

    current = current.parentElement
  }

  const rootStyle = win.getComputedStyle(doc.documentElement)
  for (const variable of variables) {
    const value = rootStyle.getPropertyValue(variable).trim()
    if (value && !isTransparentColor(value)) {
      return value
    }
  }

  const isDark = doc.documentElement.getAttribute('data-theme') === 'dark'
  return isDark ? FALLBACK_BORDER_COLOR_DARK : FALLBACK_BORDER_COLOR_LIGHT
}
