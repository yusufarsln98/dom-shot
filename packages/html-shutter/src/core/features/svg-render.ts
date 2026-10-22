import { INVALID_XML_CHARS_REGEX } from '../utils/constants.js'
import { isColorTransparent } from '../utils/dom-colors.js'
import { waitForNextFrames } from '../utils/timing.js'
import { drawRoundedRectPath } from './rounded-rect.js'

export interface SvgDocumentInput {
  serializedHtml: string
  width: number
  height: number
  backgroundColor: string
  documentCss: string
}

/**
 * Wraps the cloned, style-inlined XHTML tree into a standalone SVG document:
 * a `<defs>` stylesheet carrying the sanitized document CSS (CDATA-guarded),
 * a background rect, and the tree itself inside a `<foreignObject>`.
 */
export const buildSvgDocument = ({
  serializedHtml,
  width,
  height,
  backgroundColor,
  documentCss,
}: SvgDocumentInput): string => {
  const serialized = serializedHtml.replace(INVALID_XML_CHARS_REGEX, '')
  const cdataCss = documentCss.trim() ? `/*<![CDATA[*/\n${documentCss}\n/*]]>*/` : ''

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
	<defs>
		<style type="text/css">${cdataCss}</style>
	</defs>
	<rect width="100%" height="100%" fill="${backgroundColor}" />
	<foreignObject x="0" y="0" width="${width}" height="${height}">
		${serialized}
	</foreignObject>
</svg>`
}

/**
 * Rasterizes the SVG document onto a canvas: draws the frame (rounded clip,
 * background, border) at `pixelRatio` and returns the raw canvas for callers
 * to export as they like.
 */
export const renderSvgToCanvas = async (
  svgString: string,
  width: number,
  height: number,
  backgroundColor: string,
  borderColor: string,
  borderWidth: number,
  borderRadius: number,
  pixelRatio: number,
): Promise<HTMLCanvasElement> => {
  const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`

  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.width = width
  img.height = height

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = (err) => reject(err)
    img.src = svgDataUrl
  })

  if (typeof img.decode === 'function') {
    try {
      await img.decode()
    } catch {
      // ignore decode warnings in older browsers
    }
  }

  // Wait a frame so WebKit/Safari finishes decoding nested base64 images inside foreignObject
  await waitForNextFrames(1)

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * pixelRatio)
  canvas.height = Math.round(height * pixelRatio)

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Canvas 2D context is not available')
  }

  ctx.scale(pixelRatio, pixelRatio)
  ctx.save()

  if (borderRadius > 0) {
    drawRoundedRectPath(ctx, 0, 0, width, height, borderRadius)
    ctx.clip()
  }

  if (backgroundColor && backgroundColor !== 'transparent') {
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)
  }
  ctx.drawImage(img, 0, 0, width, height)

  if (borderWidth > 0 && borderColor && !isColorTransparent(borderColor)) {
    const inset = borderWidth / 2
    drawRoundedRectPath(
      ctx,
      inset,
      inset,
      width - borderWidth,
      height - borderWidth,
      Math.max(0, borderRadius - inset),
    )
    ctx.lineWidth = borderWidth
    ctx.strokeStyle = borderColor
    ctx.stroke()
  }

  ctx.restore()

  return canvas
}
