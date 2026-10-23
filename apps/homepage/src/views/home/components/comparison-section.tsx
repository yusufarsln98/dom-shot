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
    <section className="w-full py-24 px-6 sm:px-8 max-w-6xl mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="eyebrow text-accent">§ 03 · Benchmarking</div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          Why html-shutter?
        </h2>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          A surgical comparison against traditional canvas emulators and server-side browser engines.
        </p>
      </div>

      <Capturable
        fileName="html-shutter-comparison-benchmark"
        title="Comparison · Feature & Benchmark Table"
        className="rounded-2xl border border-border-primary bg-bg-pane shadow-float overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm font-mono border-collapse">
            <thead className="border-b border-border-primary bg-bg-sidebar/80 text-text-muted text-xs uppercase tracking-wider">
              <tr>
                <th scope="col" className="py-4 px-5 font-semibold">
                  Capability
                </th>
                <th scope="col" className="py-4 px-5 font-bold text-accent bg-accent/5 border-x border-border-primary">
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles size={13} className="text-flash" />
                    html-shutter
                  </span>
                </th>
                <th scope="col" className="py-4 px-5 font-semibold">
                  html2canvas
                </th>
                <th scope="col" className="py-4 px-5 font-semibold">
                  Puppeteer
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary text-text-primary">
              {COMPARISONS.map((row, idx) => (
                <tr key={idx} className="hover:bg-bg-sidebar/30 transition-colors">
                  <td className="py-4 px-5 font-sans font-medium text-text-primary">
                    {row.feature}
                  </td>
                  <td className="py-4 px-5 text-accent font-semibold bg-accent/5 border-x border-border-primary">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-bg-pane border border-border-primary text-accent text-xs font-mono shadow-2xs">
                      {row.htmlShutter}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-text-muted text-xs">
                    {row.html2canvas}
                  </td>
                  <td className="py-4 px-5 text-text-muted text-xs">
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
