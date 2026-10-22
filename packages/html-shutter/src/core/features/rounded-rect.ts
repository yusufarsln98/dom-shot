/**
 * Traces a rectangle with uniform corner radii (falling back to arcTo on
 * engines without `roundRect`). Shared by the clip path and the border stroke.
 */
export const drawRoundedRectPath = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) => {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2))
  ctx.beginPath()
  if (typeof ctx.roundRect === 'function' && radius > 0) {
    ctx.roundRect(x, y, w, h, radius)
  } else if (radius > 0) {
    ctx.moveTo(x + radius, y)
    ctx.arcTo(x + w, y, x + w, y + h, radius)
    ctx.arcTo(x + w, y + h, x, y + h, radius)
    ctx.arcTo(x, y + h, x, y, radius)
    ctx.arcTo(x, y, x + w, y, radius)
    ctx.closePath()
  } else {
    ctx.rect(x, y, w, h)
  }
}
