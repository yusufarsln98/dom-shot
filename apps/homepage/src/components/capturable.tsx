'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useElementCapture } from 'html-shutter/react'
import { ViewfinderFrame } from './viewfinder-frame'
import { showCaptureToast } from './capture-toast'
import { CapturableToolbar } from './capturable-toolbar'

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
  const [downloadState, setDownloadState] = useState<'idle' | 'capturing' | 'downloaded' | 'error'>('idle')

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
      dwellTimerRef.current = setTimeout(() => setIsStopped(true), dwellMs)
    }
  }, [isStopped, dwellMs])

  const handlePointerMove = useCallback(() => {
    if (isStopped) return
    if (dwellTimerRef.current) clearTimeout(dwellTimerRef.current)
    dwellTimerRef.current = setTimeout(() => setIsStopped(true), 320)
  }, [isStopped])

  const handlePointerLeave = useCallback(() => {
    if (dwellTimerRef.current) {
      clearTimeout(dwellTimerRef.current)
      dwellTimerRef.current = null
    }
    if (isCapturing || copyState === 'copied' || downloadState === 'downloaded' || isInteractingRef.current) {
      return
    }
    leaveTimerRef.current = setTimeout(() => setIsStopped(false), 320)
  }, [isCapturing, copyState, downloadState])

  const triggerShutterFlash = useCallback(() => {
    setShutter(true)
    setTimeout(() => setShutter(false), 350)
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
          showCaptureToast({ type: 'copy', title: title || fileName, elapsedMs: elapsed })
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
          showCaptureToast({ type: 'download', title: `${fileName}.png`, elapsedMs: elapsed })
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
      {isStopped && (
        <div className="no-export transition-opacity duration-200 pointer-events-none opacity-100" data-no-export="true" aria-hidden="true">
          <ViewfinderFrame />
        </div>
      )}

      {shutter && (
        <div aria-hidden="true" className="no-export pointer-events-none absolute inset-0 z-40 rounded-[inherit] bg-white/90 dark:bg-cyan-200/80 shutter-flash-overlay" data-no-export="true" />
      )}

      <CapturableToolbar
        isStopped={isStopped}
        isCapturing={isCapturing}
        copyState={copyState}
        downloadState={downloadState}
        onCopy={handleCopy}
        onDownload={handleDownload}
        badgePosition={badgePosition}
      />

      {children}
    </div>
  )
}
