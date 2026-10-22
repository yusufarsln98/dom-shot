'use client'

import { useState } from 'react'
import { CODE_SAMPLES } from '../../../data/code-samples'
import { DocCodeBlock } from '../../../components/doc-code-block'
import { Capturable } from '../../../components/capturable'
import { Code2 } from 'lucide-react'

export function QuickstartSection() {
  const [activeSampleId, setActiveSampleId] = useState(CODE_SAMPLES[0].id)
  const activeSample = CODE_SAMPLES.find((s) => s.id === activeSampleId) || CODE_SAMPLES[0]
  const activeIndex = CODE_SAMPLES.findIndex((s) => s.id === activeSampleId)

  return (
    <section id="quickstart" className="w-full py-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--ds-lens)] font-semibold uppercase tracking-wider">
          <Code2 size={14} />§ 02 · Developer Integration
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-[var(--ds-ink)] tracking-tight">
          Up and Running in 3 Minutes
        </h2>
        <p className="text-sm text-[var(--ds-muted)] max-w-2xl leading-relaxed text-pretty">
          Seamlessly captures live DOM nodes, computed CSS properties, and canvas layers with zero
          coordinate drift. Works out-of-the-box with React 18 &amp; 19, or vanilla TypeScript.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-8 items-start">
        {/* Left: Example Selector Nav */}
        <nav aria-label="Code examples" className="space-y-4 lg:sticky lg:top-24">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--ds-muted)] font-bold pl-1">
            Integration Guides
          </div>

          <div className="rounded-xl border border-[var(--ds-line)] bg-[var(--ds-panel)] overflow-hidden divide-y divide-[var(--ds-line)] shadow-xs">
            {CODE_SAMPLES.map((sample, index) => {
              const isActive = sample.id === activeSampleId
              return (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => setActiveSampleId(sample.id)}
                  className={`w-full text-left px-3.5 py-3 text-xs font-mono transition-colors flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-[var(--ds-paper)] text-[var(--ds-lens)] font-bold'
                      : 'text-[var(--ds-muted)] hover:text-[var(--ds-ink)] hover:bg-[var(--ds-paper)]/50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-[10px] text-[var(--ds-lens)] opacity-70">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{sample.title}</span>
                  </span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[var(--ds-flash)]" />}
                </button>
              )
            })}
          </div>

          {/* Current sample description card */}
          <Capturable
            fileName={`html-shutter-guide-${activeSample.id}`}
            title={`Guide · ${activeSample.title}`}
            className="p-4 rounded-xl border border-[var(--ds-line)] bg-[var(--ds-paper)] space-y-2"
          >
            <div className="text-[10px] font-mono text-[var(--ds-muted)] uppercase tracking-wider font-semibold">
              Example {String(activeIndex + 1).padStart(2, '0')} · {activeSample.filename}
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
          className="min-w-0 rounded-xl"
        >
          <DocCodeBlock
            code={activeSample.code}
            language="tsx"
            filename={activeSample.filename}
            className="my-0 shadow-sm"
          />
        </Capturable>
      </div>
    </section>
  )
}
