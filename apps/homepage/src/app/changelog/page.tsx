import fs from 'node:fs'
import path from 'node:path'
import Link from 'next/link'
import type { Metadata } from 'next'
import { GitCommit, ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Changelog & Releases — html-shutter',
  description: 'Detailed record of every architectural milestone, engine enhancement, and bug fix across html-shutter.',
}

interface ChangeSection {
  heading: string
  items: string[]
}

interface ReleaseGroup {
  version: string
  type: 'major' | 'minor' | 'patch'
  sections: ChangeSection[]
}

function fetchSingletonChangelog(): string {
  const candidatePaths = [
    path.resolve(process.cwd(), 'packages/html-shutter/CHANGELOG.md'),
    path.resolve(process.cwd(), '../packages/html-shutter/CHANGELOG.md'),
    path.resolve(process.cwd(), '../../packages/html-shutter/CHANGELOG.md'),
  ]

  for (const localPath of candidatePaths) {
    if (fs.existsSync(localPath)) return fs.readFileSync(localPath, 'utf-8')
  }
  return '# html-shutter\n\n## 0.1.0\n\n### Major Changes\n\n- Initial release.'
}

function parseChangelogMarkdown(content: string): ReleaseGroup[] {
  const lines = content.split('\n')
  const releases: ReleaseGroup[] = []
  let currentGroup: ReleaseGroup | null = null
  let currentSection: ChangeSection | null = null

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (line.startsWith('## ')) {
      const version = line.replace('## ', '').trim()
      const parts = version.replace(/^v/, '').split('.').map(Number)
      const major = parts[0] || 0
      const minor = parts[1] || 0
      const type: 'major' | 'minor' | 'patch' =
        major > 0 && minor === 0 ? 'major' : minor > 0 ? 'minor' : 'patch'

      currentGroup = { version, type, sections: [] }
      releases.push(currentGroup)
      currentSection = null
    } else if (line.startsWith('### ') && currentGroup) {
      currentSection = { heading: line.replace('### ', '').trim(), items: [] }
      currentGroup.sections.push(currentSection)
    } else if (line.startsWith('- ') && currentGroup) {
      if (!currentSection) {
        currentSection = { heading: 'Changes', items: [] }
        currentGroup.sections.push(currentSection)
      }
      currentSection.items.push(line.replace(/^- /, '').trim())
    }
  }

  return releases
}

export default function ChangelogPage() {
  const rawChangelog = fetchSingletonChangelog()
  const releases = parseChangelogMarkdown(rawChangelog)
  const latestRelease = releases[0]

  return (
    <main className="w-full max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* ── Hero Header ───────────────────────────────────────────────────── */}
      <header className="space-y-6 border-b border-border-primary pb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-text-primary transition-colors rounded-lg py-1 px-2 -ml-2 hover:bg-bg-pane focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-accent group"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Overview</span>
        </Link>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-text-primary">
              Changelog <span className="font-display italic font-normal text-accent tracking-normal px-1">&amp; Releases</span>
            </h1>

            {/* Quick action badges */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {latestRelease && (
                <div className="inline-flex items-center gap-2 h-8 px-3 rounded-full border border-border-primary bg-bg-pane text-xs font-mono font-semibold text-text-primary shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>v{latestRelease.version}</span>
                  <span className="text-[10px] text-accent uppercase tracking-wider font-bold">
                    Latest
                  </span>
                </div>
              )}
              <a
                href="https://github.com/yusufarsln98/html-shutter"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-border-primary bg-bg-pane hover:border-border-secondary text-xs font-mono text-text-secondary hover:text-text-primary transition-all shadow-2xs active:scale-95"
              >
                <span>GitHub</span>
                <ArrowUpRight className="w-3 h-3 text-text-muted" />
              </a>
              <a
                href="https://www.npmjs.com/package/html-shutter"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-border-primary bg-bg-pane hover:border-border-secondary text-xs font-mono text-text-secondary hover:text-text-primary transition-all shadow-2xs active:scale-95"
              >
                <span>npm</span>
                <ExternalLink className="w-3 h-3 text-text-muted" />
              </a>
            </div>
          </div>

          <p className="text-sm sm:text-base text-text-secondary max-w-2xl leading-relaxed">
            Detailed record of every architectural milestone, engine enhancement, and bug fix across html-shutter.
          </p>
        </div>
      </header>

      {/* ── Releases Timeline ────────────────────────────────────────────── */}
      <section className="space-y-8" aria-label="Releases timeline">
        {releases.map((release, idx) => (
          <article
            key={release.version}
            id={`v${release.version}`}
            className="p-6 sm:p-8 rounded-2xl border border-border-primary bg-bg-pane space-y-6 shadow-2xs hover:border-border-secondary hover:shadow-float transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-primary pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border border-border-primary bg-bg-sidebar flex items-center justify-center text-accent shrink-0 shadow-2xs">
                  <GitCommit size={18} />
                </div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold font-sans text-text-primary tracking-tight leading-none">
                    v{release.version}
                  </h2>
                  {idx === 0 && (
                    <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-accent/15 border border-accent/40 text-accent text-[10px] font-mono uppercase tracking-wider font-bold shadow-2xs">
                      Latest
                    </span>
                  )}
                  <span className="inline-flex items-center h-6 px-2.5 rounded-full border border-border-primary bg-bg-sidebar text-text-muted text-[10px] font-mono uppercase tracking-wider font-semibold shadow-2xs">
                    {release.type}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {release.sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-2.5">
                  <h3 className="eyebrow text-accent flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span>{section.heading}</span>
                  </h3>
                  <ul className="space-y-2 pl-4 list-disc marker:text-accent text-xs sm:text-sm text-text-secondary">
                    {section.items.map((item, iIdx) => (
                      <li key={iIdx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
