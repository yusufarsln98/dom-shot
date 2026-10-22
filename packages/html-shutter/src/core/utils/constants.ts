/** 1×1 transparent GIF used as a fallback for images that cannot be resolved. */
export const TRANSPARENT_PIXEL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

export const INVALID_XML_CHARS_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F]/g

/** Matches every `url(...)` occurrence inside a CSS value. */
export const CSS_URL_REGEX = /url\(\s*(?:"([^"]+)"|'([^']+)'|([^'")]+))\s*\)/g

/** CSS custom properties consulted when deriving the default border color. */
export const DEFAULT_BORDER_COLOR_VARIABLES: readonly string[] = [
  '--ant-color-border',
  '--ant-color-border-secondary',
]

/** Class names always treated as "do not capture" (opt-out markers and dev-only overlays). */
export const DEFAULT_SKIP_CLASSES: readonly string[] = ['no-export', 'zeugma-dev-footer']

/** Fallback border colors matching the framework default themes. */
export const FALLBACK_BORDER_COLOR_LIGHT = '#d9d9d9'
export const FALLBACK_BORDER_COLOR_DARK = '#303030'
