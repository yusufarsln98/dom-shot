'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Capturable } from '../../../components/capturable'
import {
  Camera,
  Copy,
  Check,
  ArrowRight,
  Activity,
  Layers,
  Zap,
  Sparkles,
} from 'lucide-react'

const INSTALL_COMMANDS = {
  pnpm: 'pnpm add html-shutter',
  npm: 'npm install html-shutter',
  bun: 'bun add html-shutter',
}

export function HeroSection() {
  const [copied, setCopied] = useState(false)
  const [activePkg, setActivePkg] = useState<'pnpm' | 'npm' | 'bun'>('npm')
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0'

  const command = INSTALL_COMMANDS[activePkg]

  const handleCopy = () => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 px-6 sm:px-8 border-b border-border-primary overflow-hidden">
      {/* Soft radial ambient glow — no background grids */}
      <div className="absolute inset-0 mask-radial bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
        {/* Release Eyebrow */}
        <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-border-primary bg-bg-pane/80 backdrop-blur-md shadow-2xs mb-8 transition-transform hover:scale-102">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-mono font-medium text-text-secondary">
            v{appVersion} • Framework Agnostic
          </span>
          <span className="text-text-muted">•</span>
          <Link
            href="/changelog"
            className="text-xs font-mono text-accent hover:underline flex items-center gap-1 font-semibold"
          >
            Release Notes <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Headline — distinct Space Grotesk typography */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-text-primary mb-6 leading-[1.04]">
          Pixel-accurate DOM element{' '}
          <span className="text-accent">
            screenshots
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Clone live DOM trees, inline computed styles, rasterize cleanly through SVG foreignObject,
          and export crisp PNGs or write directly to clipboard.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <a
            href="#quickstart"
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-accent hover:bg-accent-strong text-accent-fg font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:shadow-md cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </a>

          {/* Terminal Copy Snippet */}
          <div className="w-full sm:w-auto flex items-center rounded-xl bg-bg-pane border border-border-primary overflow-hidden shadow-2xs font-mono text-xs">
            <div className="flex border-r border-border-primary bg-bg-sidebar/50">
              {(['npm', 'pnpm', 'bun'] as const).map((pkg) => (
                <button
                  key={pkg}
                  onClick={() => setActivePkg(pkg)}
                  className={`px-2.5 py-3 transition-colors uppercase text-[10px] font-bold ${
                    activePkg === pkg
                      ? 'bg-bg-pane text-accent'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {pkg}
                </button>
              ))}
            </div>
            <div className="px-3.5 py-3 text-text-primary flex items-center gap-2">
              <span className="text-text-muted select-none">$</span>
              <span>{command}</span>
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-3 border-l border-border-primary hover:bg-bg-sidebar/60 transition-colors text-text-muted hover:text-text-primary cursor-pointer"
              aria-label="Copy install command"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Bento Telemetry Metrics Strip */}
        <div className="w-full pt-16 mt-12 border-t border-border-primary grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <Capturable
            fileName="html-shutter-metric-raster-latency"
            title="Metric · Raster Latency"
            className="p-5 rounded-2xl border border-border-primary bg-bg-pane/80 backdrop-blur-sm space-y-2 hover:border-border-secondary hover:shadow-float transition-all"
          >
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-text-secondary">
              <Zap size={14} className="text-flash" />
              <span>Raster Latency</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black font-sans text-text-primary tracking-tight">&lt; 35ms</div>
            <div className="text-xs font-mono text-text-muted">
              Client-side rendering
            </div>
          </Capturable>

          <Capturable
            fileName="html-shutter-metric-bundle-footprint"
            title="Metric · Bundle Footprint"
            className="p-5 rounded-2xl border border-border-primary bg-bg-pane/80 backdrop-blur-sm space-y-2 hover:border-border-secondary hover:shadow-float transition-all"
          >
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-text-secondary">
              <Layers size={14} className="text-accent" />
              <span>Bundle Footprint</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black font-sans text-text-primary tracking-tight">~4.8 KB</div>
            <div className="text-xs font-mono text-text-muted">
              Zero external canvas deps
            </div>
          </Capturable>

          <Capturable
            fileName="html-shutter-metric-resolution-multiplier"
            title="Metric · Resolution Multiplier"
            className="p-5 rounded-2xl border border-border-primary bg-bg-pane/80 backdrop-blur-sm space-y-2 hover:border-border-secondary hover:shadow-float transition-all"
          >
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-text-secondary">
              <Activity size={14} className="text-success" />
              <span>Resolution Multiplier</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black font-sans text-text-primary tracking-tight">Up to 3x</div>
            <div className="text-xs font-mono text-text-muted">
              High-DPI / Retina crisp
            </div>
          </Capturable>

          <Capturable
            fileName="html-shutter-metric-export-format"
            title="Metric · Export Format"
            className="p-5 rounded-2xl border border-border-primary bg-bg-pane/80 backdrop-blur-sm space-y-2 hover:border-border-secondary hover:shadow-float transition-all"
          >
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-text-secondary">
              <Sparkles size={14} className="text-accent" />
              <span>Export Format</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black font-sans text-text-primary tracking-tight">Lossless PNG</div>
            <div className="text-xs font-mono text-text-muted">
              Data URL or Clipboard
            </div>
          </Capturable>
        </div>
      </div>
    </section>
  )
}
