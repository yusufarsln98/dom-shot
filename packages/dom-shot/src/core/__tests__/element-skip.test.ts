import { describe, expect, it } from 'vitest'

import { shouldSkipElement } from '../utils/element-skip.js'

describe('shouldSkipElement', () => {
  it('skips opt-out class names', () => {
    const el = document.createElement('div')
    el.classList.add('no-export')
    expect(shouldSkipElement(el)).toBe(true)
  })

  it('supports custom skip class lists', () => {
    const el = document.createElement('div')
    el.classList.add('keep-me-hidden')
    expect(shouldSkipElement(el, ['keep-me-hidden'])).toBe(true)
    expect(shouldSkipElement(el, [])).toBe(false)
  })

  it('skips the data-no-export attribute', () => {
    const el = document.createElement('div')
    el.setAttribute('data-no-export', 'true')
    expect(shouldSkipElement(el)).toBe(true)
  })

  it('skips non-renderable tags', () => {
    for (const tag of ['script', 'noscript', 'iframe']) {
      expect(shouldSkipElement(document.createElement(tag))).toBe(true)
    }
  })

  it('keeps ordinary elements', () => {
    expect(shouldSkipElement(document.createElement('div'))).toBe(false)
  })
})
