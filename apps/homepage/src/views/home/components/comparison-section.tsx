import { Activity, Sparkles } from 'lucide-react'
import { Capturable } from '../../../components/capturable'

const COMPARISONS = [
  {
    feature: 'Bundle Size (Gzipped)',
    htmlShutter: '~4.8 KB',
    html2canvas: '~48 KB',
    puppeteer: '> 150 MB (Node daemon)',
  },
  {
    feature: 'Execution Environment',
    htmlShutter: 'Pure Browser (Client-side)',
    html2canvas: 'Pure Browser',
    puppeteer: 'Headless Chrome Server',
  },
  {
    feature: 'HTML5 Canvas Flattening',
    htmlShutter: 'Native Lossless toDataURL',
    html2canvas: 'Partial Re-drawing',
    puppeteer: 'Browser Screenshot',
  },
  {
    feature: 'System Clipboard Copy',
    htmlShutter: 'Built-in (ClipboardItem)',
    html2canvas: 'Manual blob conversion',
    puppeteer: 'Server-to-client stream',
  },
  {
    feature: 'CSS Variables & Pseudos',
    htmlShutter: 'Full Computed Inlining',
    html2canvas: 'Fragile parser emulation',
    puppeteer: 'Native Chrome Engine',
  },
]

export function ComparisonSection() {
  return (
    <section className="w-full py-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--ds-line)] bg-[var(--ds-panel)] text-xs font-mono text-[var(--ds-lens)] font-semibold uppercase tracking-wider shadow-xs">
          <Activity size={14} />
          <span>§ 03 · Benchmarking</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-[var(--ds-ink)] tracking-tight">
          Why html-shutter?
        </h2>
        <p className="text-sm sm:text-base text-[var(--ds-muted)] leading-relaxed">
          A surgical comparison against traditional canvas emulators and server-side browser engines.
        </p>
      </div>

      <Capturable
        fileName="html-shutter-comparison-benchmark"
        title="Comparison · Feature & Benchmark Table"
        className="rounded-2xl border border-[var(--ds-line)] bg-[var(--ds-panel)] shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm font-mono border-collapse">
            <thead className="border-b border-[var(--ds-line)] bg-[var(--ds-paper)] text-[var(--ds-muted)]">
              <tr>
                <th scope="col" className="py-4 px-5 font-semibold text-xs uppercase tracking-wider">
                  Capability
                </th>
                <th scope="col" className="py-4 px-5 font-bold text-xs uppercase tracking-wider text-[var(--ds-lens)] bg-[var(--ds-lens)]/5 border-x border-[var(--ds-lens)]/20">
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles size={13} className="text-[var(--ds-flash)]" />
                    html-shutter
                  </span>
                </th>
                <th scope="col" className="py-4 px-5 font-semibold text-xs uppercase tracking-wider">
                  html2canvas
                </th>
                <th scope="col" className="py-4 px-5 font-semibold text-xs uppercase tracking-wider">
                  Puppeteer
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--ds-line)] text-[var(--ds-ink)]">
              {COMPARISONS.map((row, idx) => (
                <tr key={idx} className="hover:bg-[var(--ds-paper)]/50 transition-colors">
                  <td className="py-4 px-5 font-sans font-medium text-[var(--ds-ink)]">
                    {row.feature}
                  </td>
                  <td className="py-4 px-5 text-[var(--ds-lens)] font-bold bg-[var(--ds-lens)]/5 border-x border-[var(--ds-lens)]/20">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-[var(--ds-panel)] text-[var(--ds-lens)] border border-[var(--ds-lens)]/30 text-xs">
                      {row.htmlShutter}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-[var(--ds-muted)] text-xs">
                    {row.html2canvas}
                  </td>
                  <td className="py-4 px-5 text-[var(--ds-muted)] text-xs">
                    {row.puppeteer}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Capturable>
    </section>
  )
}
