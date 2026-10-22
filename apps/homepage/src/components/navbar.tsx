'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { PixelGrid } from './pixel-grid'
import { GitHubIcon, NpmIcon } from './icons'
import { useTheme } from './theme-provider'
import { Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react'

const NAV_LINKS = [
  { href: '/', label: 'Overview' },
  { href: '/changelog', label: 'Changelog' },
]

export function Navbar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--ds-line)] bg-[var(--ds-paper)]/85 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <PixelGrid size={28} className="pixel-anim text-[var(--ds-lens)] group-hover:scale-105 transition-transform" />
          <span className="font-sans font-bold text-xl tracking-tight text-[var(--ds-ink)]">
            html<span className="text-[var(--ds-lens)]">-</span>shutter
          </span>
          <span className="ml-1 text-[11px] font-mono px-1.5 py-0.5 rounded border border-[var(--ds-line)] bg-[var(--ds-panel)] text-[var(--ds-muted)]">
            v{appVersion}
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? 'text-[var(--ds-lens)] bg-[var(--ds-panel)] shadow-xs font-semibold'
                    : 'text-[var(--ds-muted)] hover:text-[var(--ds-ink)] hover:bg-[var(--ds-panel)]/50'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Actions (GitHub, NPM, Theme toggle) */}
        <div className="hidden sm:flex items-center gap-2.5">
          <a
            href="https://github.com/yusufarsln98/html-shutter"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Repository"
            className="p-2 rounded-lg border border-[var(--ds-line)] bg-[var(--ds-panel)] text-[var(--ds-muted)] hover:text-[var(--ds-ink)] hover:border-[var(--ds-lens)]/50 transition-colors"
          >
            <GitHubIcon size={16} />
          </a>
          <a
            href="https://www.npmjs.com/package/html-shutter"
            target="_blank"
            rel="noreferrer"
            aria-label="NPM Package"
            className="p-2 rounded-lg border border-[var(--ds-line)] bg-[var(--ds-panel)] text-[var(--ds-muted)] hover:text-[var(--ds-ink)] hover:border-[var(--ds-lens)]/50 transition-colors"
          >
            <NpmIcon size={16} />
          </a>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg border border-[var(--ds-line)] bg-[var(--ds-panel)] text-[var(--ds-muted)] hover:text-[var(--ds-ink)] hover:border-[var(--ds-lens)]/50 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg border border-[var(--ds-line)] bg-[var(--ds-panel)] text-[var(--ds-muted)]"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="p-2 rounded-lg border border-[var(--ds-line)] bg-[var(--ds-panel)] text-[var(--ds-muted)]"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--ds-line)] bg-[var(--ds-panel)] px-4 py-4 space-y-2">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'text-[var(--ds-lens)] bg-[var(--ds-paper)]'
                    : 'text-[var(--ds-muted)] hover:text-[var(--ds-ink)]'
                }`}
              >
                {label}
              </Link>
            )
          })}
          <div className="pt-2 border-t border-[var(--ds-line)] flex gap-3">
            <a
              href="https://github.com/yusufarsln98/html-shutter"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[var(--ds-muted)] flex items-center gap-1 hover:text-[var(--ds-ink)]"
            >
              <GitHubIcon size={14} /> GitHub <ArrowUpRight size={12} />
            </a>
            <a
              href="https://www.npmjs.com/package/html-shutter"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[var(--ds-muted)] flex items-center gap-1 hover:text-[var(--ds-ink)]"
            >
              <NpmIcon size={14} /> NPM <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

