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
  const { theme, toggleTheme, mounted } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-primary bg-bg-app/80 backdrop-blur-md transition-colors select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent rounded-lg p-1"
        >
          <PixelGrid
            size={22}
            className="pixel-anim text-accent group-hover:scale-105 transition-transform"
          />
          <span className="font-sans font-bold text-sm tracking-tight text-text-primary">
            html<span className="text-accent">-</span>shutter
          </span>
          <span className="text-[10px] font-mono font-medium border border-border-primary bg-bg-sidebar text-text-muted px-1.5 py-0.5 rounded-full">
            v{appVersion}
          </span>
        </Link>

        {/* Desktop Nav Links in pill capsule */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1 bg-bg-sidebar/50 border border-border-primary/60 rounded-full p-1 text-xs font-medium">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1 rounded-full transition-all duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive
                    ? 'bg-bg-pane text-text-primary shadow-xs font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Actions (GitHub, NPM, Theme toggle) */}
        <div className="hidden sm:flex items-center gap-1.5">
          <a
            href="https://github.com/yusufarsln98/html-shutter"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Repository"
            className="p-1.5 rounded-lg border border-border-primary bg-bg-pane text-text-secondary hover:text-text-primary hover:border-border-secondary transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent shadow-2xs"
          >
            <GitHubIcon size={15} />
          </a>
          <a
            href="https://www.npmjs.com/package/html-shutter"
            target="_blank"
            rel="noreferrer"
            aria-label="NPM Package"
            className="p-1.5 rounded-lg border border-border-primary bg-bg-pane text-text-secondary hover:text-text-primary hover:border-border-secondary transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent shadow-2xs"
          >
            <NpmIcon size={15} />
          </a>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            className="p-1.5 rounded-lg border border-border-primary bg-bg-pane text-text-secondary hover:text-text-primary hover:border-border-secondary transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent shadow-2xs"
          >
            {mounted && theme === 'light' ? <Moon size={15} className="text-accent" /> : <Sun size={15} className="text-accent" />}
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-1.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 rounded-lg border border-border-primary bg-bg-pane text-text-secondary"
          >
            {mounted && theme === 'light' ? <Moon size={15} className="text-accent" /> : <Sun size={15} className="text-accent" />}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            className="p-1.5 rounded-lg border border-border-primary bg-bg-pane text-text-secondary"
          >
            {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border-primary bg-bg-pane/95 backdrop-blur-xl px-4 py-3 space-y-1">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-accent bg-bg-sidebar font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {label}
              </Link>
            )
          })}
          <div className="pt-2.5 border-t border-border-primary flex items-center gap-4 px-2">
            <a
              href="https://github.com/yusufarsln98/html-shutter"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-text-secondary flex items-center gap-1.5 hover:text-text-primary"
            >
              <GitHubIcon size={14} /> GitHub <ArrowUpRight size={12} />
            </a>
            <a
              href="https://www.npmjs.com/package/html-shutter"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-text-secondary flex items-center gap-1.5 hover:text-text-primary"
            >
              <NpmIcon size={14} /> NPM <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
