'use client'

import { useState } from 'react'
import { Tag, Search } from 'lucide-react'
import { RELEASES } from '../../views/changelog/releases-data'
import { ReleaseCard } from '../../views/changelog/release-card'

const CATEGORIES = ['All', 'Features', 'Architecture', 'Performance']

export default function ChangelogPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const filteredReleases = RELEASES.filter((rel) => {
    return (
      rel.version.toLowerCase().includes(search.toLowerCase()) ||
      rel.title.toLowerCase().includes(search.toLowerCase()) ||
      rel.description.toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-12">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="space-y-4 border-b border-[var(--ds-line)] pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--ds-line)] bg-[var(--ds-panel)] text-xs font-mono text-[var(--ds-muted)]">
          <Tag size={13} className="text-[var(--ds-lens)]" />
          <span>Release Notes &amp; Version History</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-sans text-[var(--ds-ink)] tracking-tight">
          dom<span className="text-[var(--ds-lens)]">-</span>shot Changelog
        </h1>
        <p className="text-sm text-[var(--ds-muted)] max-w-2xl leading-relaxed">
          Track updates, technical refinements, and feature additions across the core rasterization engine and React bindings.
        </p>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4">
          <div className="relative flex-1 max-w-md">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ds-muted)]"
            />
            <input
              type="text"
              placeholder="Search release notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-lg border border-[var(--ds-line)] bg-[var(--ds-panel)] text-[var(--ds-ink)] focus:outline-hidden focus:border-[var(--ds-lens)]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'border border-[var(--ds-lens)] bg-[var(--ds-lens)]/10 text-[var(--ds-lens)] font-bold'
                    : 'border border-[var(--ds-line)] bg-[var(--ds-panel)] text-[var(--ds-muted)] hover:text-[var(--ds-ink)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Releases Timeline ────────────────────────────────────────── */}
      <div className="space-y-10">
        {filteredReleases.map((release) => (
          <ReleaseCard
            key={release.version}
            release={release}
            selectedCategory={selectedCategory}
          />
        ))}
      </div>
    </div>
  )
}
