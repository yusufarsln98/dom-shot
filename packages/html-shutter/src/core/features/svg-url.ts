/**
 * Puts every inline/external SVG data URL into a consistent, rasterizer-safe
 * form: base64 UTF-8 payload, explicit intrinsic size, and an optional color
 * override that re-colors `black` fills/strokes (used by CSS mask repaint).
 */
export const normalizeSvgDataUrl = (svgDataUrl: string, colorOverride?: string): string => {
  const commaIdx = svgDataUrl.indexOf(',')
  if (commaIdx === -1) return svgDataUrl

  const header = svgDataUrl.slice(0, commaIdx)
  const payload = svgDataUrl.slice(commaIdx + 1)

  let svgText = payload
  try {
    if (header.includes(';base64')) {
      svgText = atob(payload)
    } else if (payload.includes('%3C') || payload.includes('%3c')) {
      svgText = decodeURIComponent(payload)
    }
  } catch {
    svgText = payload
  }

  if (!/<svg[^>]*\bwidth=/i.test(svgText)) {
    svgText = svgText.replace(/<svg\b/i, '<svg width="64" height="64"')
  }

  if (colorOverride && colorOverride !== 'transparent' && colorOverride !== 'rgba(0, 0, 0, 0)') {
    svgText = svgText.replace(
      /\b(fill|stroke)=(['"])(?:black|#000000|#000)\2/gi,
      `$1=$2${colorOverride}$2`,
    )
  }

  try {
    const bytes = new TextEncoder().encode(svgText)
    let binary = ''
    for (const byte of bytes) {
      binary += String.fromCharCode(byte)
    }
    return `data:image/svg+xml;base64,${btoa(binary)}`
  } catch {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`
  }
}
