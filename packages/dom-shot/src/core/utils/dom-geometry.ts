/**
 * Reads the element's own corner radius from its computed style so the
 * capture's frame mirrors the live element's corners.
 *
 * Returns the largest of the four computed corner radii, or `null` when the
 * element is square (callers treat that as a 0-radius frame).
 */
export const resolveElementBorderRadius = (element: HTMLElement, win: Window): number | null => {
  const style = win.getComputedStyle(element)
  const corners = [
    style.borderTopLeftRadius,
    style.borderTopRightRadius,
    style.borderBottomLeftRadius,
    style.borderBottomRightRadius,
  ]

  let max = 0
  for (const corner of corners) {
    const value = Number.parseFloat(corner)
    if (Number.isFinite(value) && value > max) {
      max = value
    }
  }

  return max > 0 ? max : null
}
