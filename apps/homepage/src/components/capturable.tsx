'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useElementCapture } from 'html-shutter/react'
import { Camera, Copy, Download, Check, AlertCircle, Loader2 } from 'lucide-react'
import { ViewfinderFrame } from './viewfinder-frame'
import { showCaptureToast } from './capture-toast'

export interface CapturableProps {
  children: React.ReactNode
  fileName?: string
  title?: string
  className?: string
  dwellMs?: number
  pixelRatio?: number
  badgePosition?: 'top-right' | 'top-center' | 'top-left'
}

export function Capturable({
  children,
  fileName = 'html-shutter-component',
  title,
  className = '',
  dwellMs = 380,
  pixelRatio = 2,
  badgePosition = 'top-right',
}: CapturableProps) {
  const [isStopped, setIsStopped] = useState(false)
  const [shutter, setShutter] = useState(false)
  const [copyState, setCopyState] = useState<'idle' | 'capturing' | 'copied' | 'error'>('idle')
  const [downloadState, setDownloadState] = useState<'idle' | 'capturing' | 'downloaded' | 'error'>(
    'idle',
  )

  const dwellTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInteractingRef = useRef(false)

  const { ref, copy, download, isCapturing } = useElementCapture<HTMLDivElement>({
    fileName,
    pixelRatio,
  })

  const clearTimers = useCallback(() => {
    if (dwellTimerRef.current) {
      clearTimeout(dwellTimerRef.current)
      dwellTimerRef.current = null
    }
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current)
      leaveTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => clearTimers()
  }, [clearTimers])

  const handlePointerEnter = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current)
      leaveTimerRef.current = null
    }

    if (!isStopped) {
      dwellTimerRef.current = setTimeout(() => {
        setIsStopped(true)
      }, dwellMs)
    }
  }, [isStopped, dwellMs])

  const handlePointerMove = useCallback(() => {
    // If the toolbar is already visible, don't interrupt the user
    if (isStopped) return

    // Debounce the stop trigger: when pointer stops moving for 320ms, show options
    if (dwellTimerRef.current) {
      clearTimeout(dwellTimerRef.current)
    }
    dwellTimerRef.current = setTimeout(() => {
      setIsStopped(true)
    }, 320)
  }, [isStopped])

  const handlePointerLeave = useCallback(() => {
    if (dwellTimerRef.current) {
      clearTimeout(dwellTimerRef.current)
      dwellTimerRef.current = null
    }

    // Don't auto-dismiss if currently capturing or showing active feedback
    if (
      isCapturing ||
      copyState === 'copied' ||
      downloadState === 'downloaded' ||
      isInteractingRef.current
    ) {
      return
    }

    leaveTimerRef.current = setTimeout(() => {
      setIsStopped(false)
    }, 320)
  }, [isCapturing, copyState, downloadState])

  const triggerShutterFlash = useCallback(() => {
    setShutter(true)
    setTimeout(() => {
      setShutter(false)
    }, 350)
  }, [])

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      isInteractingRef.current = true
      setCopyState('capturing')
      triggerShutterFlash()

      const start = performance.now()
      try {
        const ok = await copy({ fileName, pixelRatio })
        const elapsed = Math.round(performance.now() - start)
        if (ok) {
          setCopyState('copied')
          showCaptureToast({
            type: 'copy',
            title: title || fileName,
            elapsedMs: elapsed,
          })
          setTimeout(() => {
            setCopyState('idle')
            isInteractingRef.current = false
          }, 2400)
        } else {
          setCopyState('error')
          setTimeout(() => {
            setCopyState('idle')
            isInteractingRef.current = false
          }, 2000)
        }
      } catch {
        setCopyState('error')
        setTimeout(() => {
          setCopyState('idle')
          isInteractingRef.current = false
        }, 2000)
      }
    },
    [copy, fileName, pixelRatio, title, triggerShutterFlash],
  )

  const handleDownload = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      isInteractingRef.current = true
      setDownloadState('capturing')
      triggerShutterFlash()

      const start = performance.now()
      try {
        const ok = await download({ fileName, pixelRatio })
        const elapsed = Math.round(performance.now() - start)
        if (ok) {
          setDownloadState('downloaded')
          showCaptureToast({
            type: 'download',
            title: `${fileName}.png`,
            elapsedMs: elapsed,
          })
          setTimeout(() => {
            setDownloadState('idle')
            isInteractingRef.current = false
          }, 2400)
        } else {
          setDownloadState('error')
          setTimeout(() => {
            setDownloadState('idle')
            isInteractingRef.current = false
          }, 2000)
        }
      } catch {
        setDownloadState('error')
        setTimeout(() => {
          setDownloadState('idle')
          isInteractingRef.current = false
        }, 2000)
      }
    },
    [download, fileName, pixelRatio, triggerShutterFlash],
  )

  const positionClasses = {
    'top-right': 'top-2.5 right-2.5',
    'top-center': 'top-2.5 left-1/2 -translate-x-1/2',
    'top-left': 'top-2.5 left-2.5',
  }[badgePosition]

  return (
    <div
      ref={ref}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative transition-all duration-200 ${
        isStopped ? 'ring-1 ring-[var(--ds-lens)]/50' : ''
      } ${className}`}
    >
      {/* ── Viewfinder corner marks (Visible only when stopped) ─────────── */}
      {isStopped && (
        <div
          className="no-export transition-opacity duration-200 pointer-events-none opacity-100"
          data-no-export="true"
          aria-hidden="true"
        >
          <ViewfinderFrame />
        </div>
      )}

      {/* ── Shutter Flash Burst Overlay ─────────────────────────────────── */}
      {shutter && (
        <div
          aria-hidden="true"
          className="no-export pointer-events-none absolute inset-0 z-40 rounded-[inherit] bg-white/90 dark:bg-cyan-200/80 shutter-flash-overlay"
          data-no-export="true"
        />
      )}

      {/* ── Floating Capture Options Toolbar ────────────────────────────── */}
      <div
        className={`no-export absolute ${positionClasses} z-30 flex items-center gap-1 p-1 rounded-xl border border-[var(--ds-line)] bg-[var(--ds-paper)]/95 dark:bg-[#0b1020]/95 backdrop-blur-md shadow-lg transition-all duration-200 ${
          isStopped
            ? 'opacity-100 scale-100 pointer-events-auto translate-y-0'
            : 'opacity-0 scale-95 pointer-events-none -translate-y-1'
        }`}
        data-no-export="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          disabled={isCapturing}
          title="Copy image to clipboard"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium hover:bg-[var(--ds-panel)] hover:text-[var(--ds-lens)] text-[var(--ds-ink)] transition-colors cursor-pointer disabled:opacity-50 select-none"
        >
          {copyState === 'capturing' ? (
            <>
              <Loader2 size={13} className="animate-spin text-[var(--ds-flash)]" />
              <span>Copying...</span>
            </>
          ) : copyState === 'copied' ? (
            <>
              <Check size={13} className="text-emerald-500 font-bold" />
              <span className="text-emerald-500 font-bold">Copied!</span>
            </>
          ) : copyState === 'error' ? (
            <>
              <AlertCircle size={13} className="text-rose-500" />
              <span className="text-rose-500">Failed</span>
            </>
          ) : (
            <>
              <Copy size={13} className="text-[var(--ds-muted)]" />
              <span>Copy</span>
            </>
          )}
        </button>

        <div className="w-[1px] h-3.5 bg-[var(--ds-line)]" />

        {/* Download Button */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={isCapturing}
          title="Download PNG image"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium hover:bg-[var(--ds-panel)] hover:text-[var(--ds-lens)] text-[var(--ds-ink)] transition-colors cursor-pointer disabled:opacity-50 select-none"
        >
          {downloadState === 'capturing' ? (
            <>
              <Loader2 size={13} className="animate-spin text-[var(--ds-flash)]" />
              <span>Saving...</span>
            </>
          ) : downloadState === 'downloaded' ? (
            <>
              <Check size={13} className="text-emerald-500 font-bold" />
              <span className="text-emerald-500 font-bold">Saved!</span>
            </>
          ) : downloadState === 'error' ? (
            <>
              <AlertCircle size={13} className="text-rose-500" />
              <span className="text-rose-500">Failed</span>
            </>
          ) : (
            <>
              <Download size={13} className="text-[var(--ds-muted)]" />
              <span>Download</span>
            </>
          )}
        </button>
      </div>

      {/* The component content */}
      {children}
    </div>
  )
}
