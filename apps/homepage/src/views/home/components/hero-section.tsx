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
    <section className="w-full relative overflow-hidden pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-[var(--ds-line)] bg-lens-glow">
      <div className="absolute inset-0 bg-graph opacity-40 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-5xl mx-auto flex flex-col items-center text-center space-y-10">
        {/* Cartouche Status Bar */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2.5 px-4 py-1.5 rounded-full border border-[var(--ds-line)] bg-[var(--ds-panel)]/80 backdrop-blur-md text-xs font-mono text-[var(--ds-muted)] shadow-sm hover:border-[var(--ds-lens)]/40 transition-colors">
          <span className="inline-flex items-center gap-1.5 text-[var(--ds-ink)] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[var(--ds-flash)] shadow-[0_0_8px_var(--ds-flash)] animate-pulse" />
            <span>v{appVersion}</span>
          </span>
          <span className="text-[var(--ds-line)] select-none">·</span>
          <span>SVG ForeignObject Engine</span>
          <span className="text-[var(--ds-line)] select-none">·</span>
          <span>Framework Agnostic</span>
          <span className="text-[var(--ds-line)] select-none">·</span>
          <Link
            href="/changelog"
            className="text-[var(--ds-lens)] hover:underline inline-flex items-center gap-1 font-semibold focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[var(--ds-lens)] rounded-xs"
          >
            Changelog <ArrowRight size={11} />
          </Link>
        </div>

        {/* Big Editorial Headline */}
        <div className="space-y-5 max-w-3xl">
          <h1 className="text-[clamp(2.25rem,1.5rem+3.5vw,4.25rem)] font-extrabold tracking-tight font-sans text-[var(--ds-ink)] leading-[1.08]">
            Pixel-accurate DOM element{' '}
            <span className="text-[var(--ds-lens)] drop-shadow-[0_2px_18px_rgba(79,216,245,0.25)]">
              screenshots
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--ds-muted)] max-w-[65ch] mx-auto leading-relaxed">
            Clone live DOM trees, inline computed styles, rasterize cleanly through SVG
            foreignObject, and export crisp PNGs or write directly to clipboard.
          </p>
        </div>

        {/* Primary Actions & Install Snippet */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 w-full sm:w-auto">
          <a
            href="#quickstart"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--ds-lens)] text-white dark:text-[#0b1020] font-bold text-sm hover:brightness-110 shadow-md hover:shadow-[0_0_24px_rgba(79,216,245,0.35)] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ds-lens)]"
          >
            <Camera size={16} />
            <span>Get Started</span>
            <ArrowRight size={14} />
          </a>

          <button
            type="button"
            onClick={handleCopyInstall}
            aria-label="Copy npm install command"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl border border-[var(--ds-line)] bg-[var(--ds-panel)]/90 backdrop-blur-sm text-[var(--ds-ink)] font-mono text-xs hover:border-[var(--ds-lens)]/60 hover:bg-[var(--ds-panel)] shadow-sm active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ds-lens)]"
          >
            <Terminal size={14} className="text-[var(--ds-lens)]" />
            <span>npm i html-shutter</span>
            {copiedInstall ? (
              <Check size={14} className="text-emerald-500 font-bold" />
            ) : (
              <Copy size={14} className="text-[var(--ds-muted)] hover:text-[var(--ds-ink)]" />
            )}
          </button>
        </div>

        {/* Scale-Bar Benchmark Metrics Strip */}
        <div className="w-full pt-10 mt-6 border-t border-[var(--ds-line)] grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <Capturable
            fileName="html-shutter-metric-raster-latency"
            title="Metric · Raster Latency"
            className="p-4 rounded-xl border border-[var(--ds-line)] bg-[var(--ds-panel)]/70 backdrop-blur-sm space-y-1.5 hover:border-[var(--ds-lens)]/40 transition-colors shadow-xs"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--ds-muted)]">
              <Zap size={13} className="text-[var(--ds-flash)]" />
              <span>Raster Latency</span>
            </div>
            <div className="text-2xl font-bold font-sans text-[var(--ds-ink)] tracking-tight">&lt; 35ms</div>
            <div className="text-[10px] font-mono text-[var(--ds-muted)]">
              Client-side rendering
            </div>
          </Capturable>

          <Capturable
            fileName="html-shutter-metric-bundle-footprint"
            title="Metric · Bundle Footprint"
            className="p-4 rounded-xl border border-[var(--ds-line)] bg-[var(--ds-panel)]/70 backdrop-blur-sm space-y-1.5 hover:border-[var(--ds-lens)]/40 transition-colors shadow-xs"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--ds-muted)]">
              <Layers size={13} className="text-[var(--ds-lens)]" />
              <span>Bundle Footprint</span>
            </div>
            <div className="text-2xl font-bold font-sans text-[var(--ds-ink)] tracking-tight">~4.8 KB</div>
            <div className="text-[10px] font-mono text-[var(--ds-muted)]">
              Zero external canvas deps
            </div>
          </Capturable>

          <Capturable
            fileName="html-shutter-metric-resolution-multiplier"
            title="Metric · Resolution Multiplier"
            className="p-4 rounded-xl border border-[var(--ds-line)] bg-[var(--ds-panel)]/70 backdrop-blur-sm space-y-1.5 hover:border-[var(--ds-lens)]/40 transition-colors shadow-xs"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--ds-muted)]">
              <Activity size={13} className="text-emerald-500" />
              <span>Resolution Multiplier</span>
            </div>
            <div className="text-2xl font-bold font-sans text-[var(--ds-ink)] tracking-tight">Up to 3x</div>
            <div className="text-[10px] font-mono text-[var(--ds-muted)]">
              High-DPI / Retina crisp
            </div>
          </Capturable>

          <Capturable
            fileName="html-shutter-metric-export-format"
            title="Metric · Export Format"
            className="p-4 rounded-xl border border-[var(--ds-line)] bg-[var(--ds-panel)]/70 backdrop-blur-sm space-y-1.5 hover:border-[var(--ds-lens)]/40 transition-colors shadow-xs"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--ds-muted)]">
              <Sparkles size={13} className="text-[var(--ds-lens)]" />
              <span>Export Format</span>
            </div>
            <div className="text-2xl font-bold font-sans text-[var(--ds-ink)] tracking-tight">Lossless PNG</div>
            <div className="text-[10px] font-mono text-[var(--ds-muted)]">
              Data URL or Clipboard
            </div>
          </Capturable>
        </div>
      </div>
    </section>
  )
}
