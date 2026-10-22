import { Activity } from 'lucide-react'
import { Capturable } from '../../../components/capturable'

const COMPARISONS = [
  {
    feature: 'Bundle Size (Gzipped)',
    domShot: '~4.8 KB',
    html2canvas: '~48 KB',
    puppeteer: '> 150 MB (Node daemon)',
  },
  {
    feature: 'Execution Environment',
    domShot: 'Pure Browser (Client-side)',
    html2canvas: 'Pure Browser',
    puppeteer: 'Headless Chrome Server',
  },
  {
    feature: 'HTML5 Canvas Flattening',
    domShot: 'Native Lossless toDataURL',
    html2canvas: 'Partial Re-drawing',
    puppeteer: 'Browser Screenshot',
  },
  {
    feature: 'System Clipboard Copy',
    domShot: 'Built-in (ClipboardItem)',
    html2canvas: 'Manual blob conversion',
    puppeteer: 'Server-to-client stream',
  },
  {
    feature: 'CSS Variables & Pseudos',
    domShot: 'Full Computed Inlining',
    html2canvas: 'Fragile parser emulation',
    puppeteer: 'Native Chrome Engine',
  },
]

export function ComparisonSection() {
  return (
    <section className="w-full py-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--ds-lens)] font-semibold uppercase tracking-wider">
          <Activity size={14} />
          Benchmarking
        </div>
        <h2 className="text-3xl font-extrabold font-sans text-[var(--ds-ink)] tracking-tight">
          Why dom-shot?
        </h2>
        <p className="text-sm text-[var(--ds-muted)]">
          A surgical comparison against traditional canvas emulators and server-side browser engines.
        </p>
      </div>

      <Capturable
        fileName="dom-shot-comparison-benchmark"
        title="Comparison · Feature & Benchmark Table"
        className="rounded-2xl border border-[var(--ds-line)] bg-[var(--ds-panel)] shadow-xs overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-[var(--ds-line)] bg-[var(--ds-paper)] text-[var(--ds-muted)]">
              <tr>
                <th className="py-3 px-4 font-semibold">Capability</th>
                <th className="py-3 px-4 font-semibold text-[var(--ds-lens)]">dom-shot</th>
                <th className="py-3 px-4 font-semibold">html2canvas</th>
                <th className="py-3 px-4 font-semibold">Puppeteer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--ds-line)] text-[var(--ds-ink)]">
              {COMPARISONS.map((row, idx) => (
                <tr key={idx} className="hover:bg-[var(--ds-paper)]/50 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-medium">{row.feature}</td>
                  <td className="py-3.5 px-4 text-[var(--ds-lens)] font-bold">{row.domShot}</td>
                  <td className="py-3.5 px-4 text-[var(--ds-muted)]">{row.html2canvas}</td>
                  <td className="py-3.5 px-4 text-[var(--ds-muted)]">{row.puppeteer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Capturable>
    </section>
  )
}

