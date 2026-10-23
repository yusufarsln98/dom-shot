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
      className={`no-export absolute ${positionClasses} z-30 flex items-center gap-1 p-1 rounded-full border border-border-primary bg-bg-pane/90 backdrop-blur-md shadow-float transition-all duration-200 select-none ${
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
        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium hover:bg-bg-sidebar hover:text-accent text-text-primary transition-all duration-150 cursor-pointer disabled:opacity-50 select-none active:scale-95 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-accent"
      >
        {copyState === 'capturing' ? (
          <>
            <Loader2 size={13} className="animate-spin text-accent" />
            <span>Copying...</span>
          </>
        ) : copyState === 'copied' ? (
          <>
            <Check size={13} className="text-success font-bold" />
            <span className="text-success font-bold">Copied!</span>
          </>
        ) : copyState === 'error' ? (
          <>
            <AlertCircle size={13} className="text-danger" />
            <span className="text-danger">Failed</span>
          </>
        ) : (
          <>
            <Copy size={13} className="text-text-muted transition-colors group-hover:text-accent" />
            <span>Copy</span>
          </>
        )}
      </button>

      <div className="w-[1px] h-3.5 bg-border-primary" />

      {/* Download Button */}
      <button
        type="button"
        onClick={onDownload}
        disabled={isCapturing}
        aria-label="Download screenshot PNG"
        title="Download PNG image"
        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium hover:bg-bg-sidebar hover:text-accent text-text-primary transition-all duration-150 cursor-pointer disabled:opacity-50 select-none active:scale-95 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-accent"
      >
        {downloadState === 'capturing' ? (
          <>
            <Loader2 size={13} className="animate-spin text-accent" />
            <span>Saving...</span>
          </>
        ) : downloadState === 'downloaded' ? (
          <>
            <Check size={13} className="text-success font-bold" />
            <span className="text-success font-bold">Saved!</span>
          </>
        ) : downloadState === 'error' ? (
          <>
            <AlertCircle size={13} className="text-danger" />
            <span className="text-danger">Failed</span>
          </>
        ) : (
          <>
            <Download size={13} className="text-text-muted transition-colors group-hover:text-accent" />
            <span>Download</span>
          </>
        )}
      </button>
    </div>
  )
}
