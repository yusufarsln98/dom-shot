# html-shutter

> Capture any HTML element as a pixel-accurate PNG screenshot — a pure, framework-agnostic core with an optional React hook. Clone the DOM, inline computed styles, rasterize via SVG, and export data URLs or file downloads.

## Why

Browser-native element screenshots live behind `html2canvas`-style line-by-line re-implementations, pull in big dependencies, or lose fidelity on complex trees (masks, pseudo-elements, canvases, form values, scroll positions). `html-shutter` instead uses a **clone → inline → SVG `foreignObject` → canvas** pipeline that leans on the browser's own layout engine, keeping the capture faithful with zero runtime dependencies. It is a distilled, dependency-free version of the capture utility used in production dashboards (Odak), so it can drop in there with the same behavior.

## Structure & subpath exports

One package, two import surfaces behind a Node `exports` map:

| Import                                  | Surface                                                                                                                                                                | Requires React? |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `html-shutter` (or `html-shutter/core`) | Framework-agnostic core: `captureElementToPngDataUrl`, `previewElementAsImage`, `downloadElementAsImage`, `copyElementToClipboard`, `CaptureElementOptions`, `VERSION` | No              |
| `html-shutter/react`                    | `useElementCapture` hook + `UseElementCaptureOptions` / `UseElementCaptureReturn`                                                                                      | optional peer   |

- `src/core/` — the DOM/canvas pipeline (cloning, style inlining, SVG rasterization, exporting). **Zero imports from React or any UI framework**, so it runs in vanilla JS, Vue, Svelte, Angular, or a plain `<script type="module">`.
- `src/react/` — a thin hook wrapper that manages ref attachment and transient capture state on top of the same core functions.

## Install

```bash
npm install html-shutter
# or
pnpm add html-shutter
# React users only:
pnpm add react
```

Peer dependency: `react` is **optional** — only the `useElementCapture` hook needs it. The core capture utilities are dependency-free.

## Quick start (vanilla JavaScript / any framework)

```ts
import {
  captureElementToPngDataUrl,
  previewElementAsImage,
  downloadElementAsImage,
  copyElementToClipboard,
} from 'html-shutter'

const card = document.querySelector<HTMLElement>('#my-card')!

// 1) Everything under the hood: rasterize to a PNG data URL yourself
const dataUrl = await captureElementToPngDataUrl(card, {
  backgroundColor: '#ffffff',
  borderColor: '#d9d9d9',
  borderWidth: 1,
  pixelRatio: 2,
})

// 2) Or get a display-ready preview: data URL + decoded byte size + CSS size
const preview = await previewElementAsImage(card)
// preview.dataUrl · preview.bytes · preview.cssWidth

// 3) Trigger a file download directly
await downloadElementAsImage(card, { fileName: 'my-card' })

// 4) Or copy the PNG image to the clipboard (falls back to the data URL as text)
const ok = await copyElementToClipboard(card)
```

## Quick start (React hook)

```tsx
import { useElementCapture } from 'html-shutter/react'

export function ExportCard() {
  const { ref, download, copy, preview, isCapturing } = useElementCapture<HTMLDivElement>({
    fileName: 'analytics-export',
    pixelRatio: 2,
  })

  return (
    <div>
      <div ref={ref}>...</div>
      <button onClick={() => download()} disabled={isCapturing}>
        Download PNG
      </button>
      <button onClick={() => copy()} disabled={isCapturing}>
        Copy to clipboard
      </button>
    </div>
  )
}
```

## License

MIT © Yusuf Arslan

function DashboardCard() {
// Three user-facing actions: preview the PNG, download the file, copy the image.
const { ref, preview, download, copy, isCapturing } = useElementCapture<HTMLDivElement>({
fileName: 'my-card',
pixelRatio: 2,
})

return (
<div>
<div ref={ref}>{/* anything visual to capture */}</div>
<button
onClick={async () => {
const shot = await preview() // { dataUrl, bytes, cssWidth } | null
console.log(`captured ${(shot.bytes / 1024).toFixed(1)} KB at ${shot.cssWidth}px`)
}}
disabled={isCapturing} >
Preview PNG
</button>
<button onClick={() => download()} disabled={isCapturing}>
Download PNG
</button>
<button onClick={() => copy()} disabled={isCapturing}>
Copy image
</button>
</div>
)
}

```

The hook reads options through a latest-ref (callbacks stay referentially stable) and exposes `isCapturing` while a capture runs; every call may partially override the initialization options. `preview()` resolves `null` when the ref is unattached — it already bundles the byte-size/CSS-size math, so callers never decode the data URL themselves.

## How the pipeline works

1. **Clone** — the element tree is cloned (never touched at runtime) with skip rules applied.
2. **Inline** — computed styles are inlined from a curated property whitelist (HTML + SVG), CSS masks and `background`/` mask``url() ` references are flattened to data URLs, `<canvas>` nodes become `<img>` snapshots, `<input>`/`<textarea>`/`<select>` values and `::before`/`::after` pseudo-elements are materialized, and scroll offsets are preserved via transform wrappers.
3. **Compose** — the serialized XHTML is embedded in an `<svg><foreignObject>` document together with a sanitized copy of same-origin document CSS (external `url()`s stripped).
4. **Rasterize** — the SVG is drawn onto a canvas (background fill, rounded-corner clip mirroring the element's own corner radius — square elements get square corners, optional border, `pixelRatio` scaling) and exported as `data:image/png`.

## Documentation

- See [`SKILL.md`](../../.agents/skills/html-shutter/SKILL.md) for integration rules and pitfalls.
- See [`llms.txt`](https://github.com/yusufarsln98/react-screenshot) for an LLM-friendly API summary.

## License

MIT © Yusuf Arslan
```
