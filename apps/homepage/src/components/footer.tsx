import Link from 'next/link'
import { PixelGrid } from './pixel-grid'
import { GitHubIcon, NpmIcon } from './icons'
import { Layers, Tag, FileText, Bot, FileCode, Sparkles } from 'lucide-react'

export function Footer() {
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0'

  return (
    <footer className="border-t border-border-primary bg-bg-sidebar/50 py-16 px-6 sm:px-8 mt-auto transition-colors select-none">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Masthead */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-border-primary">
          <div className="space-y-2.5">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent rounded-lg p-0.5"
            >
              <PixelGrid
                size={24}
                className="pixel-anim text-accent group-hover:scale-105 transition-transform"
              />
              <span className="font-sans font-bold text-base tracking-tight text-text-primary">
                html<span className="text-accent">-</span>shutter
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono border border-border-primary bg-bg-pane text-text-muted">
                v{appVersion}
              </span>
            </Link>
            <p className="text-text-secondary text-xs leading-relaxed max-w-md">
              High-fidelity DOM-to-PNG capture engine. Clones DOM trees, inlines computed styles,
              flattens SVGs/Canvases, and outputs pixel-accurate images for web apps and dashboards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-text-secondary">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border-primary bg-bg-pane shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_6px_var(--accent)]" />
              <span>Framework Agnostic</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border-primary bg-bg-pane shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-flash" />
              <span>Zero Canvas Bloat</span>
            </span>
            <span className="px-2.5 py-1 rounded-full border border-border-primary bg-bg-pane text-[11px] font-semibold">
              v{appVersion}
            </span>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          {/* Col 1: Product */}
          <div className="space-y-3">
            <h4 className="eyebrow text-text-primary">Product</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors group focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <Layers className="w-3.5 h-3.5 text-accent" />
                  <span>Overview</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors group focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <Tag className="w-3.5 h-3.5 text-text-muted group-hover:text-accent transition-colors" />
                  <span>Release Changelog</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Open Source */}
          <div className="space-y-3">
            <h4 className="eyebrow text-text-primary">Open Source</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a
                  href="https://github.com/yusufarsln98/html-shutter"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors group focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <GitHubIcon size={14} className="group-hover:scale-105 transition-transform" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/html-shutter"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors group focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <NpmIcon size={14} className="group-hover:scale-105 transition-transform" />
                  <span>NPM Registry</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/yusufarsln98/html-shutter/blob/main/LICENSE"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors group focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <FileText className="w-3.5 h-3.5 text-text-muted group-hover:text-accent transition-colors" />
                  <span>MIT License</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: AI & Standards */}
          <div className="space-y-3 col-span-2 md:col-span-1">
            <h4 className="eyebrow text-text-primary">AI &amp; Standards</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a
                  href="/skill.md"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors group focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <Bot className="w-3.5 h-3.5 text-accent" />
                  <span>SKILL.md Spec</span>
                </a>
              </li>
              <li>
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors group focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <FileCode className="w-3.5 h-3.5 text-flash" />
                  <span>llms.txt Index</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Colophon */}
        <div className="border-t border-border-primary/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-text-muted gap-3 font-mono">
          <div>&copy; {new Date().getFullYear()} html-shutter · Open source under MIT</div>
          <div className="flex items-center gap-2 text-accent">
            <span>Clean OKLCH</span> · <span>Native Neutral</span> · <span>Zero Bloat</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
