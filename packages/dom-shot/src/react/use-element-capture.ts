import { useCallback, useRef, useState } from 'react'

import type { CaptureElementOptions } from '../core/types/index.js'
import type { ElementPreview } from '../core/features/preview-element.js'
import { copyElementToClipboard } from '../core/features/copy-image.js'
import { downloadElementAsImage } from '../core/features/download-element.js'
import { previewElementAsImage } from '../core/features/preview-element.js'

export type UseElementCaptureOptions = CaptureElementOptions

export interface UseElementCaptureReturn<T extends HTMLElement> {
  /** Attach to the element that should become the screenshot. */
  ref: React.RefObject<T | null>
  /** Save the element as a PNG file, or `false` when nothing is attached / the write failed. */
  download: (overrides?: CaptureElementOptions) => Promise<boolean>
  /** Copy the element as an image to the clipboard, or `false` on failure (falls back to the data URL as text). */
  copy: (overrides?: CaptureElementOptions) => Promise<boolean>
  /** Capture and return a display-ready PNG preview (data URL, byte size, CSS size), or `null` when nothing is attached. */
  preview: (overrides?: CaptureElementOptions) => Promise<ElementPreview | null>
  /** True while a capture is in flight. */
  isCapturing: boolean
}

/**
 * React binding around `downloadElementAsImage` / `copyElementToClipboard` /
 * `previewElementAsImage`. Exposes exactly three actions — download the PNG
 * file, copy the PNG image to the clipboard, preview the PNG together with
 * its decoded byte size. Pass options once (theme tokens, pixel ratio, file
 * name); every call may still override them partially. Options are read
 * through a latest-ref, so the callbacks stay referentially stable.
 */
export const useElementCapture = <T extends HTMLElement = HTMLDivElement>(
  options?: UseElementCaptureOptions,
): UseElementCaptureReturn<T> => {
  const ref = useRef<T | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  const latestOptions = useRef<UseElementCaptureOptions | undefined>(options)
  latestOptions.current = options

  const download = useCallback(async (overrides?: CaptureElementOptions): Promise<boolean> => {
    if (!ref.current) return false
    try {
      setIsCapturing(true)
      return await downloadElementAsImage(ref.current, {
        ...latestOptions.current,
        ...overrides,
      })
    } finally {
      setIsCapturing(false)
    }
  }, [])

  const copy = useCallback(async (overrides?: CaptureElementOptions): Promise<boolean> => {
    if (!ref.current) return false
    try {
      setIsCapturing(true)
      return await copyElementToClipboard(ref.current, {
        ...latestOptions.current,
        ...overrides,
      })
    } finally {
      setIsCapturing(false)
    }
  }, [])

  const preview = useCallback(
    async (overrides?: CaptureElementOptions): Promise<ElementPreview | null> => {
      if (!ref.current) return null
      try {
        setIsCapturing(true)
        return await previewElementAsImage(ref.current, {
          ...latestOptions.current,
          ...overrides,
        })
      } finally {
        setIsCapturing(false)
      }
    },
    [],
  )

  return { ref, download, copy, preview, isCapturing }
}
