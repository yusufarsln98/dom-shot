'use client'

import { useState, useMemo } from 'react'
import { Copy, Check } from 'lucide-react'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-bash'

interface DocCodeBlockProps {
  code: string
  language?: string
  filename?: string
  className?: string
}

export function DocCodeBlock({
  code,
  language = 'tsx',
  filename,
  className,
}: DocCodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const html = useMemo(() => {
    const cleanLang = language.toLowerCase()
    const grammar = Prism.languages[cleanLang] || Prism.languages.tsx || Prism.languages.javascript
    return Prism.highlight(code, grammar, cleanLang)
  }, [code, language])

  return (
    <div
      className={`w-full max-w-full relative group rounded-xl border border-[var(--ds-line)] bg-[var(--ds-panel)] overflow-hidden font-mono text-xs shadow-xs transition-colors ${
        className ?? 'my-4'
      }`}
    >
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-[var(--ds-line)] bg-[var(--ds-paper)]/70 text-[var(--ds-muted)] text-xs select-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rotate-45 bg-[var(--ds-lens)] shrink-0" aria-hidden="true" />
          {filename ? (
            <>
              <span className="text-[var(--ds-ink)] font-mono text-xs font-semibold">{filename}</span>
              <span className="text-[var(--ds-line)]">·</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--ds-muted)]">
                {language}
              </span>
            </>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--ds-muted)]">
              {language}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[var(--ds-line)] hover:border-[var(--ds-lens)]/50 bg-[var(--ds-panel)] text-[var(--ds-muted)] hover:text-[var(--ds-ink)] transition-colors cursor-pointer text-xs font-mono"
          aria-label={copied ? 'Copied code' : 'Copy code'}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[var(--ds-lens)]" />
              <span className="text-[var(--ds-lens)] font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 sm:p-5 overflow-x-auto text-[var(--ds-ink)] whitespace-pre leading-relaxed font-mono text-xs sm:text-[13px]">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  )
}

