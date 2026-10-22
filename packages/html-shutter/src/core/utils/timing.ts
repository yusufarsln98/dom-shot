interface TimingWindow {
  requestAnimationFrame?: (callback: (time: number) => void) => number
}

/**
 * Waits for `frameCount` browser animation frames so layout, web fonts and
 * images have visually settled before an element is rasterized. Falls back to
 * raw timers when `requestAnimationFrame` is unavailable.
 */
export const waitForNextFrames = async (frameCount = 2): Promise<void> => {
  for (let i = 0; i < frameCount; i++) {
    await new Promise<void>((resolve) => {
      const win = window as typeof window & TimingWindow
      if (typeof win.requestAnimationFrame === 'function') {
        win.requestAnimationFrame(() => resolve())
      } else {
        setTimeout(resolve, 16)
      }
    })
  }
}
