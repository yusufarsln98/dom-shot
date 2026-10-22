import { INVALID_XML_CHARS_REGEX } from '../utils/constants.js'

/**
 * Serializes the current document's stylesheets into an XML-safe CSS string.
 * `@import` rules and every non-inline `url()` get stripped so the standalone
 * SVG document cannot trigger external requests, and control characters that
 * would break XML parsing are removed.
 */
export const collectSafeDocumentCss = (doc: Document): string => {
  const chunks: string[] = [
    '[data-pseudo-cloned]::before, [data-pseudo-cloned]::after { content: none !important; display: none !important; }',
  ]
  const styleSheets = Array.from(doc.styleSheets || [])

  for (const sheet of styleSheets) {
    try {
      const rules = Array.from(sheet.cssRules || [])
      for (const rule of rules) {
        const text = rule.cssText
        // Skip @import and external url() rules so SVG never triggers external requests
        if (text.startsWith('@import')) continue
        const sanitized = text.replace(/url\(\s*(['"]?)(?!data:|#)[^'")]+?\1\s*\)/gi, 'none')
        chunks.push(sanitized)
      }
    } catch {
      // Cross-origin stylesheet; skip safely
    }
  }

  return chunks.join('\n').replace(INVALID_XML_CHARS_REGEX, '').replace(/\]\]>/g, ']]&gt;')
}
