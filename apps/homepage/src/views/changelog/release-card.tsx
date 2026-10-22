import { Calendar, ExternalLink, CheckCircle2 } from 'lucide-react'
import type { ReleaseItem } from './types'

interface ReleaseCardProps {
  release: ReleaseItem
  selectedCategory: string
}

export function ReleaseCard({ release, selectedCategory }: ReleaseCardProps) {
  const visibleGroups = release.changes.filter(
    (group) => selectedCategory === 'All' || group.category === selectedCategory,
  )

  return (
    <article className="p-6 sm:p-8 rounded-2xl border border-[var(--ds-line)] bg-[var(--ds-panel)] shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[var(--ds-line)]">
        <div className="flex items-center gap-3">
          <div className="h-8 px-2.5 rounded-lg border border-[var(--ds-line)] bg-[var(--ds-paper)] flex items-center justify-center text-[var(--ds-lens)] font-mono font-bold text-xs shrink-0 whitespace-nowrap shadow-2xs">
            v{release.version}
          </div>
          <div>
            <h2 className="font-sans font-bold text-lg text-[var(--ds-ink)]">{release.title}</h2>
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--ds-muted)]">
              <span className="flex items-center gap-1">
                <Calendar size={12} /> {release.date}
              </span>
              <span>·</span>
              <span className="text-[var(--ds-lens)] font-semibold">{release.tag}</span>
            </div>
          </div>
        </div>

        <a
          href={`https://github.com/yusufarsln98/html-shutter/releases/tag/v${release.version}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--ds-muted)] hover:text-[var(--ds-lens)] transition-colors self-start sm:self-auto"
        >
          <span>GitHub Release</span>
          <ExternalLink size={12} />
        </a>
      </div>

      <p className="text-sm text-[var(--ds-muted)] leading-relaxed">{release.description}</p>

      <div className="space-y-6 pt-2">
        {visibleGroups.map((group) => (
          <div key={group.category} className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--ds-ink)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--ds-flash)]" />
              {group.category}
            </h3>
            <ul className="space-y-2">
              {group.items.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-[var(--ds-muted)] leading-relaxed"
                >
                  <CheckCircle2 size={14} className="text-[var(--ds-lens)] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  )
}
