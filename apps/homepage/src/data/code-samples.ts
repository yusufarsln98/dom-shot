export interface CodeSample {
  id: string
  title: string
  filename: string
  description: string
  code: string
}

export const CODE_SAMPLES: CodeSample[] = [
  {
    id: 'react-hook',
    title: 'React Hook Integration',
    filename: 'WidgetExport.tsx',
    description:
      'Attach useElementCapture to any DOM node to provide reactive download, preview, and clipboard actions.',
    code: `import { useElementCapture } from 'dom-shot/react'

export function WidgetExport() {
  const { ref, preview, download, copy, isCapturing } = useElementCapture<HTMLDivElement>({
    pixelRatio: 2,               // 2x Retina super-sampled resolution
    fileName: 'quarterly-metric', // Clean sanitized file output
    backgroundColor: '#ffffff',   // Frame background fill paint
  })

  return (
    <div className="card-container">
      {/* 1. Attach ref to the DOM node you want to capture */}
      <div ref={ref} className="dashboard-metric-card">
        <h3>Gross Revenue Performance</h3>
        <p className="no-export">Internal audit tag (omitted from PNG)</p>
      </div>

      {/* 2. Invoke reactive capture actions */}
      <div className="actions">
        <button onClick={() => preview()} disabled={isCapturing}>
          Preview
        </button>
        <button onClick={() => download()} disabled={isCapturing}>
          Download PNG
        </button>
        <button onClick={() => copy()} disabled={isCapturing}>
          Copy Image
        </button>
      </div>
    </div>
  )
}`,
  },
  {
    id: 'vanilla-core',
    title: 'Vanilla TS Core Pipeline',
    filename: 'capture-service.ts',
    description:
      'Direct framework-agnostic pipeline without React peer dependencies, usable in Vue, Svelte, or Node browser contexts.',
    code: `import {
  previewElementAsImage,
  downloadElementAsImage,
  captureElementToPngDataUrl,
} from 'dom-shot'

// Locate target DOM node in document
const element = document.getElementById('analytics-viewport')

if (element) {
  // 1. Generate an in-memory preview (returns dataUrl, cssWidth, byte size)
  const result = await previewElementAsImage(element, {
    pixelRatio: 2,
    fileName: 'telemetry-report',
  })
  console.log('Generated PNG payload size:', result.bytes, 'bytes')

  // 2. Trigger instant native browser download
  await downloadElementAsImage(element, {
    fileName: 'telemetry-snapshot',
    pixelRatio: 3, // Ultra-high resolution
  })
}`,
  },
  {
    id: 'clipboard',
    title: 'OS Clipboard Copy',
    filename: 'clipboard-export.ts',
    description:
      'Writes PNG images directly to the operating system clipboard via ClipboardItem for instant pasting into Slack, Figma, or Notion.',
    code: `import { copyElementToClipboard } from 'dom-shot'

export async function copyChartToClipboard(targetNode: HTMLElement): Promise<boolean> {
  try {
    const success = await copyElementToClipboard(targetNode, {
      pixelRatio: 2,
      extraSkipClasses: ['live-cursor', 'debug-overlay'],
    })

    if (success) {
      console.log('Copied PNG bitmap directly to system clipboard!')
    }
    return success
  } catch (error) {
    console.error('Clipboard copy rejected or unsupported:', error)
    return false
  }
}`,
  },
  {
    id: 'exclusions',
    title: 'Selective Exclusion Engine',
    filename: 'SecureDashboard.tsx',
    description:
      'Omit interactive buttons, debug tags, and sensitive PII from exported PNGs using built-in skip classes.',
    code: `import { useElementCapture } from 'dom-shot/react'

export function SecureDashboard() {
  const { ref, download } = useElementCapture<HTMLDivElement>({
    fileName: 'customer-summary',
    extraSkipClasses: ['sensitive-admin-only'],
  })

  return (
    <div ref={ref} className="customer-card">
      <h2>Account Summary: Corp Holdings</h2>
      
      {/* 1. Stripped via built-in .no-export class */}
      <span className="no-export">Staff Action Bar</span>

      {/* 2. Stripped via data-no-export attribute */}
      <div data-no-export="true">Secret Internal Notes</div>

      {/* 3. Stripped via options.extraSkipClasses */}
      <p className="sensitive-admin-only">SSN: ***-**-1234</p>
    </div>
  )
}`,
  },
]

