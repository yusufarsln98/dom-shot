import { describe, expect, it } from 'vitest'

import { resolveBackgroundColor, resolveBorderColor } from '../utils/dom-colors.js'

describe('resolveBackgroundColor', () => {
  it('inherits from the nearest opaque ancestor', () => {
    const parent = document.createElement('div')
    parent.style.backgroundColor = 'rgb(255, 0, 0)'
    const child = document.createElement('div')
    parent.appendChild(child)

    expect(resolveBackgroundColor(child)).toBe('rgb(255, 0, 0)')
  })

  it('falls back to the light default without any opaque ancestor', () => {
    const el = document.createElement('div')
    document.body.style.backgroundColor = ''
    document.documentElement.removeAttribute('data-theme')

    expect(resolveBackgroundColor(el)).toBe('#ffffff')
  })

  it('switches to the dark fallback under data-theme="dark"', () => {
    const el = document.createElement('div')
    document.body.style.backgroundColor = ''
    document.documentElement.setAttribute('data-theme', 'dark')

    expect(resolveBackgroundColor(el)).toBe('#141414')
    document.documentElement.removeAttribute('data-theme')
  })
})

describe('resolveBorderColor', () => {
  it('prefers theme custom properties when no visible border exists', () => {
    const parent = document.createElement('div')
    parent.style.setProperty('--ant-color-border', '#7f56d9')
    const child = document.createElement('div')
    parent.appendChild(child)

    expect(resolveBorderColor(child)).toBe('#7f56d9')
  })

  it('supports a custom variable lookup list', () => {
    const el = document.createElement('div')
    el.style.setProperty('--custom-border', '#00ff00')

    expect(resolveBorderColor(el, ['--custom-border'])).toBe('#00ff00')
  })
})
