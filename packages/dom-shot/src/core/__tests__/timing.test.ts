import { describe, expect, it } from 'vitest'

import { waitForNextFrames } from '../utils/timing.js'

describe('waitForNextFrames', () => {
  it('resolves without throwing', async () => {
    await expect(waitForNextFrames(1)).resolves.toBeUndefined()
  })

  it('falls back to timers when requestAnimationFrame is unavailable', async () => {
    const original = window.requestAnimationFrame
    window.requestAnimationFrame = undefined!
    await expect(waitForNextFrames(1)).resolves.toBeUndefined()
    window.requestAnimationFrame = original
  })
})
