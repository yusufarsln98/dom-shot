'use client'

import { useState, useMemo } from 'react'
import { Copy, Check, FileCode2 } from 'lucide-react'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-json'
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
      className={`w-full max-w-full relative group rounded-2xl border border-border-primary bg-bg-pane-inner overflow-hidden font-mono text-xs shadow-float transition-colors ${
        className ?? 'my-4'
      }`}
    >
      {/* Code window chrome header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-primary bg-bg-sidebar/60 text-text-muted text-xs select-none">
        <div className="flex items-center gap-3">
          {/* Muted window indicators */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-border-secondary" />
            <span className="w-2.5 h-2.5 rounded-full bg-border-secondary" />
            <span className="w-2.5 h-2.5 rounded-full bg-border-secondary" />
          </div>

          <div className="h-3 w-[1px] bg-border-primary" />

          <div className="flex items-center gap-2">
            <FileCode2 className="w-3.5 h-3.5 text-accent shrink-0" />
            {filename ? (
              <>
                <span className="text-text-primary font-mono text-xs font-semibold">{filename}</span>
                <span className="text-border-primary">·</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted px-1.5 py-0.5 rounded border border-border-primary bg-bg-pane">
                  {language}
                </span>
              </>
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted px-1.5 py-0.5 rounded border border-border-primary bg-bg-pane">
                {language}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border-primary hover:border-border-secondary bg-bg-pane text-text-secondary hover:text-text-primary shadow-2xs active:scale-95 transition-all cursor-pointer text-xs font-mono"
          aria-label={copied ? 'Copied code' : 'Copy code'}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-accent font-bold" />
              <span className="text-accent font-bold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <pre className="p-5 overflow-x-auto text-text-primary whitespace-pre leading-relaxed font-mono text-xs sm:text-[13px] bg-transparent">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  )
}
