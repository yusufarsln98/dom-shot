import Link from 'next/link'
import { PixelGrid } from './pixel-grid'
import { GitHubIcon, NpmIcon } from './icons'
import {
  Layers,
  Camera,
  Tag,
  FileText,
  Bot,
  FileCode,
  Sparkles,
} from 'lucide-react'

export function Footer() {
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0'

  return (
    <footer className="border-t border-[var(--ds-line)] bg-[var(--ds-paper)] py-12 px-4 sm:px-6 mt-auto transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Masthead */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[var(--ds-line)]">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <PixelGrid size={24} color="lens" className="group-hover:scale-105 transition-transform" />
              <span className="font-sans font-bold text-lg text-[var(--ds-ink)]">
                dom<span className="text-[var(--ds-lens)]">-</span>shot
              </span>
            </Link>
            <p className="text-[var(--ds-muted)] text-xs leading-relaxed max-w-md">
              High-fidelity DOM-to-PNG capture engine. Clones DOM trees, inlines computed styles,
              flattens SVGs/Canvases, and outputs pixel-accurate images for web apps and dashboards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--ds-muted)]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[var(--ds-line)] bg-[var(--ds-panel)]">
              <span className="w-2 h-2 rounded-full bg-[var(--ds-lens)] animate-pulse" />
              React 18 &amp; 19 Ready
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[var(--ds-line)] bg-[var(--ds-panel)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--ds-flash)]" />
              Zero Canvas Bloat
            </span>
            <span className="px-2 py-1 rounded-md border border-[var(--ds-line)] bg-[var(--ds-panel)] text-[11px]">
              v{appVersion}
            </span>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 pt-8">
          {/* Col 1: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--ds-ink)] font-bold">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-2 text-[var(--ds-muted)] hover:text-[var(--ds-ink)] transition-colors group"
                >
                  <Layers className="w-3.5 h-3.5 text-[var(--ds-lens)] group-hover:scale-110 transition-transform" />
                  <span>Overview</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="flex items-center gap-2 text-[var(--ds-muted)] hover:text-[var(--ds-ink)] transition-colors group"
                >
                  <Tag className="w-3.5 h-3.5 text-[var(--ds-muted)] group-hover:text-[var(--ds-lens)] transition-colors" />
                  <span>Release Changelog</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Open Source */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--ds-ink)] font-bold">
              Open Source
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a
                  href="https://github.com/yusufarsln98/dom-shot"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-[var(--ds-muted)] hover:text-[var(--ds-ink)] transition-colors group"
                >
                  <GitHubIcon size={14} className="group-hover:scale-110 transition-transform" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/dom-shot"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-[var(--ds-muted)] hover:text-[var(--ds-ink)] transition-colors group"
                >
                  <NpmIcon size={14} className="group-hover:scale-110 transition-transform" />
                  <span>NPM Registry</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/yusufarsln98/dom-shot/blob/main/LICENSE"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-[var(--ds-muted)] hover:text-[var(--ds-ink)] transition-colors group"
                >
                  <FileText className="w-3.5 h-3.5 text-[var(--ds-muted)] group-hover:text-[var(--ds-ink)] transition-colors" />
                  <span>MIT License</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: AI & Standards */}
          <div className="space-y-3 col-span-2 md:col-span-1">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--ds-ink)] font-bold">
              AI &amp; Standards
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a
                  href="/skill.md"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-[var(--ds-muted)] hover:text-[var(--ds-ink)] transition-colors group"
                >
                  <Bot className="w-3.5 h-3.5 text-[var(--ds-lens)] group-hover:scale-110 transition-transform" />
                  <span>SKILL.md Spec</span>
                </a>
              </li>
              <li>
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-[var(--ds-muted)] hover:text-[var(--ds-ink)] transition-colors group"
                >
                  <FileCode className="w-3.5 h-3.5 text-[var(--ds-flash)] group-hover:scale-110 transition-transform" />
                  <span>llms.txt Index</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Colophon */}
        <div className="border-t border-[var(--ds-line)] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[var(--ds-muted)] gap-3 font-mono">
          <div>&copy; {new Date().getFullYear()} dom-shot · Open source under MIT</div>
          <div className="flex items-center gap-1.5 text-[var(--ds-lens)]">
            <span>Ink</span> · <span>Lens</span> · <span>Deep Lens</span> · <span>Flash</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
