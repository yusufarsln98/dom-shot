import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { ElementPreview } from '../../core/features/preview-element.js'
import { useElementCapture } from '../use-element-capture.js'

const downloadElementAsImage = vi.hoisted(() => vi.fn())
const copyElementToClipboard = vi.hoisted(() => vi.fn())
const previewElementAsImage = vi.hoisted(() => vi.fn())

vi.mock('../../core/features/download-element.js', () => ({ downloadElementAsImage }))
vi.mock('../../core/features/copy-image.js', () => ({ copyElementToClipboard }))
vi.mock('../../core/features/preview-element.js', () => ({ previewElementAsImage }))

afterEach(() => {
  downloadElementAsImage.mockReset()
  copyElementToClipboard.mockReset()
  previewElementAsImage.mockReset()
})

describe('useElementCapture', () => {
  it('returns false without touching the pipeline when the ref is unattached', async () => {
    const { result } = renderHook(() => useElementCapture())

    await expect(result.current.download()).resolves.toBe(false)
    await expect(result.current.copy()).resolves.toBe(false)
    await expect(result.current.preview()).resolves.toBeNull()

    expect(downloadElementAsImage).not.toHaveBeenCalled()
    expect(copyElementToClipboard).not.toHaveBeenCalled()
    expect(previewElementAsImage).not.toHaveBeenCalled()
    expect(result.current.isCapturing).toBe(false)
  })

  it('keeps the action callbacks referentially stable across re-renders and option changes', () => {
    const { result, rerender } = renderHook((props) => useElementCapture(props), {
      initialProps: { fileName: 'initial' },
    })
    const download = result.current.download
    const copy = result.current.copy
    const preview = result.current.preview

    rerender({ fileName: 'changed' })

    expect(result.current.download).toBe(download)
    expect(result.current.copy).toBe(copy)
    expect(result.current.preview).toBe(preview)
  })

  it('toggles isCapturing while the download is in flight and returns the result', async () => {
    let resolveDownload: ((value: boolean) => void) | undefined
    downloadElementAsImage.mockImplementation(
      () =>
        new Promise<boolean>((resolve) => {
          resolveDownload = resolve
        }),
    )

    const { result } = renderHook(() => useElementCapture({ fileName: 'card' }))
    result.current.ref.current = document.createElement('div')

    let promise!: Promise<boolean>
    await act(async () => {
      promise = result.current.download()
    })

    expect(result.current.isCapturing).toBe(true)
    expect(downloadElementAsImage).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({ fileName: 'card' }),
    )

    resolveDownload!(true)
    await expect(promise).resolves.toBe(true)
    await act(async () => {})
    expect(result.current.isCapturing).toBe(false)
  })

  it('merges per-call overrides over the initialization options', async () => {
    copyElementToClipboard.mockResolvedValue(true)

    const { result } = renderHook(() => useElementCapture({ fileName: 'report', pixelRatio: 2 }))
    result.current.ref.current = document.createElement('div')

    await act(async () => {
      await result.current.copy({ pixelRatio: 3 })
    })

    expect(copyElementToClipboard).toHaveBeenCalledWith(expect.any(HTMLElement), {
      fileName: 'report',
      pixelRatio: 3,
    })
    expect(result.current.isCapturing).toBe(false)
  })

  it('resolves preview with the capture result and toggles isCapturing', async () => {
    let resolvePreview: ((value: ElementPreview) => void) | undefined
    previewElementAsImage.mockImplementation(
      () =>
        new Promise<ElementPreview>((resolve) => {
          resolvePreview = resolve
        }),
    )

    const { result } = renderHook(() => useElementCapture({ pixelRatio: 2 }))
    result.current.ref.current = document.createElement('div')

    let promise!: Promise<ElementPreview | null>
    await act(async () => {
      promise = result.current.preview()
    })

    expect(result.current.isCapturing).toBe(true)
    expect(previewElementAsImage).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({ pixelRatio: 2 }),
    )

    resolvePreview!({ dataUrl: 'data:image/png;base64,ab', bytes: 3, cssWidth: 120 })
    await expect(promise).resolves.toMatchObject({ bytes: 3, cssWidth: 120 })
    await act(async () => {})
    expect(result.current.isCapturing).toBe(false)
  })
})
