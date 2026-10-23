'use client'

import { useState, useEffect } from 'react'
import { Camera, Download, Copy, Check } from 'lucide-react'

export interface CaptureToastData {
  id: string
  type: 'copy' | 'download'
  title: string
  elapsedMs?: number
}

const TOAST_EVENT = 'html-shutter-toast'

export function showCaptureToast(data: Omit<CaptureToastData, 'id'>) {
  if (typeof window === 'undefined') return
  const toastItem: CaptureToastData = {
    ...data,
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  }
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: toastItem }))
}

export function CaptureToastContainer() {
  const [toasts, setToasts] = useState<CaptureToastData[]>([])

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<CaptureToastData>
      if (!customEvent.detail) return
      setToasts((prev) => [...prev.slice(-2), customEvent.detail])

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== customEvent.detail.id))
      }, 3200)
    }

    window.addEventListener(TOAST_EVENT, handler)
    return () => window.removeEventListener(TOAST_EVENT, handler)
  }, [])

  if (toasts.length === 0) return null

  return (
    <aside
      aria-label="Capture notifications"
      className="no-export fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0"
      data-no-export="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-border-primary bg-bg-pane/95 backdrop-blur-xl shadow-float text-xs font-mono text-text-primary animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl border border-border-primary bg-bg-sidebar flex items-center justify-center shrink-0 text-accent shadow-2xs">
              {toast.type === 'copy' ? <Copy size={15} /> : <Download size={15} />}
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 font-bold truncate">
                <Check size={13} className="text-success shrink-0" />
                <span className="truncate">
                  {toast.type === 'copy' ? 'Copied to clipboard' : 'PNG downloaded'}
                </span>
              </div>
              <div className="text-[11px] text-text-muted truncate flex items-center gap-1.5">
                <span className="truncate">{toast.title}</span>
                {toast.elapsedMs !== undefined && (
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-flash/15 border border-flash/30 text-flash shrink-0 font-bold text-[10px]">
                    {toast.elapsedMs}ms
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-accent shrink-0 pl-2 opacity-80 font-mono">
            <Camera size={11} />
            <span>html-shutter</span>
          </div>
        </div>
      ))}
    </aside>
  )
}
