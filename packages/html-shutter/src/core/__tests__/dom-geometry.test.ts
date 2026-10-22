import { describe, expect, it } from 'vitest'

import { resolveElementBorderRadius } from '../utils/dom-geometry.js'

describe('resolveElementBorderRadius', () => {
  it('returns the largest computed corner radius', () => {
    const el = document.createElement('div')
    // jsdom does not expand the `border-radius` shorthand into corner longhands
    el.style.borderTopLeftRadius = '2px'
    el.style.borderTopRightRadius = '14px'
    el.style.borderBottomLeftRadius = '8px'
    el.style.borderBottomRightRadius = '4px'
    document.body.appendChild(el)

    expect(resolveElementBorderRadius(el, window)).toBe(14)

    el.remove()
  })

  it('returns null for square elements', () => {
    const el = document.createElement('div')
    document.body.appendChild(el)

    expect(resolveElementBorderRadius(el, window)).toBeNull()

    el.remove()
  })

  it('reads radii defined through a stylesheet class', () => {
    const style = document.createElement('style')
    style.textContent =
      '.rs-rounded-test { border-top-left-radius: 14px; border-top-right-radius: 3px; }'
    document.head.appendChild(style)
    const el = document.createElement('div')
    el.className = 'rs-rounded-test'
    document.body.appendChild(el)

    expect(resolveElementBorderRadius(el, window)).toBe(14)

    el.remove()
    style.remove()
  })
})
