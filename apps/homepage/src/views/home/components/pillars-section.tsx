import { Boxes, Layers, Eye, Sliders, Copy, ShieldCheck, Feather } from 'lucide-react'
import { Capturable } from '../../../components/capturable'

const PILLARS = [
  {
    number: '01',
    title: 'Recursive Computed Style Inlining',
    category: 'DOM CLONER',
    description:
      'Recursively traverses the target DOM tree and snapshots computed style properties, including CSS custom properties (variables), pseudo-elements (::before/::after), borders, and box shadows.',
    icon: Layers,
  },
  {
    number: '02',
    title: 'Lossless Canvas & SVG Flattening',
    category: 'RASTER ENGINE',
    description:
      'Live HTML5 <canvas> elements and inline SVG gradients are rasterized into embedded image sources prior to XML serialization, preserving 2D draw commands without coordinate loss.',
    icon: Eye,
  },
  {
    number: '03',
    title: 'Super-Sampled Retina Resolution',
    category: 'PIXEL RATIO',
    description:
      'Configurable pixelRatio multiplier up to 3x creates razor-sharp exports suitable for high-density Retina screens, printed brochures, and vector-grade pitch decks.',
    icon: Sliders,
  },
  {
    number: '04',
    title: 'Native OS Clipboard Integration',
    category: 'CLIPBOARD BUS',
    description:
      'Writes PNG images directly to the operating system clipboard via ClipboardItem(["image/png"]). Users can immediately paste snapshots into Slack, Figma, Notion, or Linear.',
    icon: Copy,
  },
  {
    number: '05',
    title: 'Selective Class-Based Exclusion',
    category: 'FILTER MASK',
    description:
      'Nodes bearing .no-export or data-no-export="true" are stripped during cloning. Interactive buttons, debug controls, and temporary highlights vanish from the final image.',
    icon: ShieldCheck,
  },
  {
    number: '06',
    title: 'Zero Heavy Dependencies',
    category: 'STANDALONE CORE',
    description:
      'No Puppeteer binaries, no heavy canvas emulation packages. Built on modern SVG <foreignObject> rasterization for an ultra-lightweight ~4.8 KB client footprint.',
    icon: Feather,
  },
]

export function PillarsSection() {
  return (
    <section id="pillars" className="w-full py-16 px-4 sm:px-6 border-t border-[var(--ds-line)] bg-[var(--ds-panel)]/30 scroll-mt-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--ds-lens)] font-semibold uppercase tracking-wider">
            <Boxes size={14} />
            Core Architecture
          </div>
          <h2 className="text-3xl font-extrabold font-sans text-[var(--ds-ink)] tracking-tight">
            Engineered for Production UI
          </h2>
          <p className="text-sm text-[var(--ds-muted)]">
            Accurately captures intricate dashboard widgets, responsive grids, canvas layers, and custom typography without visual artifacts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map(({ number, title, category, description, icon: Icon }) => (
            <Capturable
              key={number}
              fileName={`dom-shot-pillar-${number}-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              title={`${number} // ${category}`}
              className="p-6 rounded-2xl border border-[var(--ds-line)] bg-[var(--ds-panel)] space-y-3 relative group hover:border-[var(--ds-lens)]/50 transition-colors shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl border border-[var(--ds-line)] bg-[var(--ds-paper)] flex items-center justify-center text-[var(--ds-lens)]">
                  <Icon size={18} />
                </div>
                <span className="text-xs font-mono font-bold text-[var(--ds-muted)] group-hover:text-[var(--ds-lens)] transition-colors">
                  {number} // {category}
                </span>
              </div>
              <h3 className="font-sans font-bold text-base text-[var(--ds-ink)]">{title}</h3>
              <p className="text-xs text-[var(--ds-muted)] leading-relaxed">{description}</p>
            </Capturable>
          ))}
        </div>
      </div>
    </section>
  )
}

