'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Capturable } from '../../../components/capturable'
import {
  Camera,
  Copy,
  Check,
  ArrowRight,
  Terminal,
  Activity,
  Layers,
  Zap,
  Sparkles,
} from 'lucide-react'

export function HeroSection() {
  const [copiedInstall, setCopiedInstall] = useState(false)
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0'

  const handleCopyInstall = () => {
    navigator.clipboard.writeText('npm install html-shutter')
    setCopiedInstall(true)
    setTimeout(() => setCopiedInstall(false), 2000)
  }

  return (
    <section className="w-full relative overflow-hidden pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[var(--ds-line)]">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-8">
        {/* Cartouche Status Bar */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full border border-[var(--ds-line)] bg-[var(--ds-panel)] text-xs font-mono text-[var(--ds-muted)] shadow-xs">
          <span className="inline-flex items-center gap-1.5 text-[var(--ds-ink)] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[var(--ds-flash)]" />
            <span>v{appVersion}</span>
          </span>
          <span className="text-[var(--ds-line)]">·</span>
          <span>SVG ForeignObject Engine</span>
          <span className="text-[var(--ds-line)]">·</span>
          <span>React 18 &amp; 19 Ready</span>
          <span className="text-[var(--ds-line)]">·</span>
          <Link
            href="/changelog"
            className="text-[var(--ds-lens)] hover:underline inline-flex items-center gap-0.5 font-semibold"
          >
            Changelog <ArrowRight size={11} />
          </Link>
        </div>

        {/* Big Editorial Headline */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-sans text-[var(--ds-ink)] leading-[1.08] text-balance">
            Pixel-accurate DOM element <span className="text-[var(--ds-lens)]">screenshots</span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--ds-muted)] max-w-2xl mx-auto leading-relaxed text-pretty">
            Clone live DOM trees, inline computed styles, rasterize cleanly through SVG
            foreignObject, and export crisp PNGs or write directly to clipboard.
          </p>
        </div>

        {/* Primary Actions & Install Snippet */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href="#quickstart"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--ds-lens)] text-white dark:text-[#0b1020] font-bold text-sm hover:brightness-110 shadow-sm transition-all cursor-pointer"
          >
            <Camera size={16} />
            Get Started
            <ArrowRight size={14} />
          </a>

          <button
            type="button"
            onClick={handleCopyInstall}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[var(--ds-line)] bg-[var(--ds-panel)] text-[var(--ds-ink)] font-mono text-xs hover:border-[var(--ds-lens)]/60 transition-colors cursor-pointer shadow-xs"
          >
            <Terminal size={14} className="text-[var(--ds-lens)]" />
            <span>npm i html-shutter</span>
            {copiedInstall ? (
              <Check size={14} className="text-[var(--ds-lens)]" />
            ) : (
              <Copy size={14} className="text-[var(--ds-muted)]" />
            )}
          </button>
        </div>

        {/* Scale-Bar Benchmark Metrics Strip */}
        <div className="w-full pt-8 mt-4 border-t border-[var(--ds-line)] grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <Capturable
            fileName="html-shutter-metric-raster-latency"
            title="Metric · Raster Latency"
            className="p-4 rounded-xl border border-[var(--ds-line)] bg-[var(--ds-panel)]/50 space-y-1"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--ds-muted)]">
              <Zap size={13} className="text-[var(--ds-flash)]" />
              <span>Raster Latency</span>
            </div>
            <div className="text-xl font-bold font-sans text-[var(--ds-ink)]">&lt; 35ms</div>
            <div className="text-[10px] font-mono text-[var(--ds-muted)]">
              Client-side rendering
            </div>
          </Capturable>

          <Capturable
            fileName="html-shutter-metric-bundle-footprint"
            title="Metric · Bundle Footprint"
            className="p-4 rounded-xl border border-[var(--ds-line)] bg-[var(--ds-panel)]/50 space-y-1"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--ds-muted)]">
              <Layers size={13} className="text-[var(--ds-lens)]" />
              <span>Bundle Footprint</span>
            </div>
            <div className="text-xl font-bold font-sans text-[var(--ds-ink)]">~4.8 KB</div>
            <div className="text-[10px] font-mono text-[var(--ds-muted)]">
              Zero external canvas deps
            </div>
          </Capturable>

          <Capturable
            fileName="html-shutter-metric-resolution-multiplier"
            title="Metric · Resolution Multiplier"
            className="p-4 rounded-xl border border-[var(--ds-line)] bg-[var(--ds-panel)]/50 space-y-1"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--ds-muted)]">
              <Activity size={13} className="text-emerald-500" />
              <span>Resolution Multiplier</span>
            </div>
            <div className="text-xl font-bold font-sans text-[var(--ds-ink)]">Up to 3x</div>
            <div className="text-[10px] font-mono text-[var(--ds-muted)]">
              High-DPI / Retina crisp
            </div>
          </Capturable>

          <Capturable
            fileName="html-shutter-metric-export-format"
            title="Metric · Export Format"
            className="p-4 rounded-xl border border-[var(--ds-line)] bg-[var(--ds-panel)]/50 space-y-1"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--ds-muted)]">
              <Sparkles size={13} className="text-[var(--ds-lens)]" />
              <span>Export Format</span>
            </div>
            <div className="text-xl font-bold font-sans text-[var(--ds-ink)]">Lossless PNG</div>
            <div className="text-[10px] font-mono text-[var(--ds-muted)]">
              Data URL or Clipboard
            </div>
          </Capturable>
        </div>
      </div>
    </section>
  )
}
