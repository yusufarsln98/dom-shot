import type { ReleaseItem } from './types'

export const RELEASES: ReleaseItem[] = [
  {
    version: '0.1.0',
    date: 'October 2026',
    tag: 'Latest Stable',
    title: 'Initial Public Release & Core Architecture',
    description:
      'The inaugural release of html-shutter — a high-performance, pixel-accurate DOM-to-PNG screenshot engine engineered for modern web apps and data dashboards.',
    changes: [
      {
        category: 'Features',
        items: [
          'High-fidelity DOM cloning pipeline that snapshots full recursive computed styles.',
          'Native system clipboard support via ClipboardItem(["image/png"]) to paste screenshots directly into chat or document tools.',
          'Configurable pixelRatio multiplier (1x, 2x, 3x) for retina and ultra-crisp display exports.',
          'Selective exclusion engine (.no-export / .rs-demo-noexport) to strip buttons, tooltips, or watermarks from capture.',
          'Lossless HTML5 <canvas> and inline <svg> rasterization into embedded PNG data URLs.',
        ],
      },
      {
        category: 'Architecture',
        items: [
          'Dual subpath packaging: zero-dependency framework-agnostic core (html-shutter) and dedicated React hook (html-shutter/react).',
          'Pure SVG <foreignObject> rasterization without Puppeteer or heavy canvas emulation dependencies.',
          'Dual CJS and ESM module exports bundled with tsup, with full TypeScript typings (.d.ts).',
        ],
      },
      {
        category: 'Performance',
        items: [
          'Average DOM rasterization latency under 35ms on standard desktop viewports.',
          'Lazy font and resource resolution to minimize blocking time during cloning.',
        ],
      },
    ],
  },
]
