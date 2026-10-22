'use client'

import { useState } from 'react'
import { CODE_SAMPLES } from '../../../data/code-samples'
import { DocCodeBlock } from '../../../components/doc-code-block'
import { Capturable } from '../../../components/capturable'
import { Code2, ChevronRight } from 'lucide-react'

export function QuickstartSection() {
  const [activeSampleId, setActiveSampleId] = useState(CODE_SAMPLES[0].id)
  const activeSample = CODE_SAMPLES.find((s) => s.id === activeSampleId) || CODE_SAMPLES[0]
  const activeIndex = CODE_SAMPLES.findIndex((s) => s.id === activeSampleId)

  return (
    <section id="quickstart" className="w-full py-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-12">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--ds-line)] bg-[var(--ds-panel)] text-xs font-mono text-[var(--ds-lens)] font-semibold uppercase tracking-wider shadow-xs">
          <Code2 size={14} />
          <span>§ 02 · Developer Integration</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-[var(--ds-ink)] tracking-tight">
          Up and Running in 3 Minutes
        </h2>
        <p className="text-sm sm:text-base text-[var(--ds-muted)] max-w-2xl leading-relaxed">
          Seamlessly captures live DOM nodes, computed CSS properties, and canvas layers with zero
          coordinate drift. Works out-of-the-box with any modern frontend framework or vanilla TypeScript.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[19rem_1fr] gap-8 items-start">
        {/* Left: Example Selector Nav */}
        <nav aria-label="Code examples" className="space-y-4 lg:sticky lg:top-24">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--ds-muted)] font-bold pl-1">
            Integration Guides
          </div>

          <div className="rounded-2xl border border-[var(--ds-line)] bg-[var(--ds-panel)] overflow-hidden divide-y divide-[var(--ds-line)] shadow-sm">
            {CODE_SAMPLES.map((sample, index) => {
              const isActive = sample.id === activeSampleId
              return (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => setActiveSampleId(sample.id)}
                  aria-pressed={isActive}
                  className={`w-full text-left px-4 py-3.5 text-xs font-mono transition-all flex items-center justify-between cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ds-lens)] ${
                    isActive
                      ? 'bg-[var(--ds-paper)] text-[var(--ds-lens)] font-bold shadow-xs'
                      : 'text-[var(--ds-muted)] hover:text-[var(--ds-ink)] hover:bg-[var(--ds-paper)]/60'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-[10px] text-[var(--ds-lens)] font-semibold opacity-80">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{sample.title}</span>
                  </span>
                  {isActive ? (
                    <span className="w-2 h-2 rounded-full bg-[var(--ds-flash)] shadow-[0_0_8px_var(--ds-flash)]" />
                  ) : (
                    <ChevronRight size={13} className="opacity-40" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Current sample description card */}
          <Capturable
            fileName={`html-shutter-guide-${activeSample.id}`}
            title={`Guide · ${activeSample.title}`}
            className="p-4 rounded-2xl border border-[var(--ds-line)] bg-[var(--ds-paper)] space-y-2.5 shadow-xs"
          >
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[var(--ds-lens)] uppercase tracking-wider font-semibold">
              <span>Example {String(activeIndex + 1).padStart(2, '0')}</span>
              <span className="text-[var(--ds-line)]">·</span>
              <span className="text-[var(--ds-muted)]">{activeSample.filename}</span>
            </div>
            <p className="text-xs text-[var(--ds-muted)] leading-relaxed">
              {activeSample.description}
            </p>
          </Capturable>
        </nav>

        {/* Right: Code Block with Syntax Highlighting */}
        <Capturable
          fileName={`html-shutter-code-${activeSample.id}`}
          title={`Code · ${activeSample.filename}`}
          className="min-w-0 rounded-2xl"
        >
          <DocCodeBlock
            code={activeSample.code}
            language="tsx"
            filename={activeSample.filename}
            className="my-0 shadow-md border border-[var(--ds-line)] rounded-2xl overflow-hidden"
          />
        </Capturable>
      </div>
    </section>
  )
}
