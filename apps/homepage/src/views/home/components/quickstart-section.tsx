'use client'

import { useState } from 'react'
import { CODE_SAMPLES } from '../../../data/code-samples'
import { DocCodeBlock } from '../../../components/doc-code-block'
import { Capturable } from '../../../components/capturable'
import { ChevronRight, Terminal } from 'lucide-react'

export function QuickstartSection() {
  const [activeSampleId, setActiveSampleId] = useState(CODE_SAMPLES[0].id)
  const activeSample = CODE_SAMPLES.find((s) => s.id === activeSampleId) || CODE_SAMPLES[0]
  const activeIndex = CODE_SAMPLES.findIndex((s) => s.id === activeSampleId)

  return (
    <section id="quickstart" className="w-full py-24 px-6 sm:px-8 border-b border-border-primary bg-bg-app">
      <div className="max-w-6xl mx-auto space-y-14">
        <div className="space-y-3">
          <div className="eyebrow text-accent">§ 02 · Developer Integration</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Up and Running in 3 Minutes
          </h2>
          <p className="text-sm sm:text-base text-text-secondary max-w-2xl leading-relaxed">
            Seamlessly captures live DOM nodes, computed CSS properties, and canvas layers with zero
            coordinate drift. Works out-of-the-box with any modern frontend framework or vanilla TypeScript.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[20rem_1fr] gap-8 items-start">
          {/* Left: Example Selector Nav */}
          <nav aria-label="Code examples" className="space-y-4 lg:sticky lg:top-20">
            <div className="text-[11px] font-mono uppercase tracking-wider text-text-muted font-bold pl-1 flex items-center gap-2">
              <Terminal size={12} className="text-accent" />
              <span>Integration Guides</span>
            </div>

            <div className="rounded-2xl border border-border-primary bg-bg-pane overflow-hidden divide-y divide-border-primary shadow-2xs">
              {CODE_SAMPLES.map((sample, index) => {
                const isActive = sample.id === activeSampleId
                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => setActiveSampleId(sample.id)}
                    aria-pressed={isActive}
                    className={`w-full text-left px-4 py-3.5 text-xs font-mono transition-all flex items-center justify-between cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent ${
                      isActive
                        ? 'bg-bg-sidebar text-accent font-semibold border-l-2 border-l-accent'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-sidebar/50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-[11px] text-accent font-semibold opacity-90">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="truncate">{sample.title}</span>
                    </span>
                    {isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-flash shadow-[0_0_8px_var(--flash)] shrink-0" />
                    ) : (
                      <ChevronRight size={13} className="opacity-40 shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Current sample description card */}
            <Capturable
              fileName={`html-shutter-guide-${activeSample.id}`}
              title={`Guide · ${activeSample.title}`}
              className="p-5 rounded-2xl border border-border-primary bg-bg-pane/80 backdrop-blur-sm space-y-2 shadow-2xs"
            >
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-accent uppercase tracking-wider font-semibold">
                <span className="px-1.5 py-0.5 rounded bg-bg-sidebar border border-border-primary">
                  Ex. {String(activeIndex + 1).padStart(2, '0')}
                </span>
                <span className="text-border-primary">·</span>
                <span className="text-text-muted font-medium truncate">{activeSample.filename}</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
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
              className="my-0"
            />
          </Capturable>
        </div>
      </div>
    </section>
  )
}
