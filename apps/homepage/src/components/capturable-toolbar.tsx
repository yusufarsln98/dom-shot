'use client'

import React from 'react'
import { Copy, Download, Check, AlertCircle, Loader2 } from 'lucide-react'

export interface CapturableToolbarProps {
  isStopped: boolean
  isCapturing: boolean
  copyState: 'idle' | 'capturing' | 'copied' | 'error'
  downloadState: 'idle' | 'capturing' | 'downloaded' | 'error'
  onCopy: (e: React.MouseEvent) => void
  onDownload: (e: React.MouseEvent) => void
  badgePosition?: 'top-right' | 'top-center' | 'top-left'
}

export function CapturableToolbar({
  isStopped,
  isCapturing,
  copyState,
  downloadState,
  onCopy,
  onDownload,
  badgePosition = 'top-right',
}: CapturableToolbarProps) {
  const positionClasses = {
    'top-right': 'top-2.5 right-2.5',
    'top-center': 'top-2.5 left-1/2 -translate-x-1/2',
    'top-left': 'top-2.5 left-2.5',
  }[badgePosition]

  return (
    <div
      role="toolbar"
      aria-label="Component screenshot capture controls"
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
        onClick={onCopy}
        disabled={isCapturing}
        aria-label="Copy screenshot to clipboard"
        title="Copy image to clipboard"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium hover:bg-[var(--ds-panel)] hover:text-[var(--ds-lens)] text-[var(--ds-ink)] transition-colors cursor-pointer disabled:opacity-50 select-none focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[var(--ds-lens)]"
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
        onClick={onDownload}
        disabled={isCapturing}
        aria-label="Download screenshot PNG"
        title="Download PNG image"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium hover:bg-[var(--ds-panel)] hover:text-[var(--ds-lens)] text-[var(--ds-ink)] transition-colors cursor-pointer disabled:opacity-50 select-none focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[var(--ds-lens)]"
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
  )
}

