---
name: html-shutter
description: Rules, API reference, pipeline constraints, and integration guidelines for using the html-shutter toolkit — capturing HTML elements as pixel-accurate PNG screenshots, with an optional React hook.
---

# Skill: Using html-shutter

`html-shutter` turns any live DOM element into a pixel-accurate PNG data URL. It runs a clone → inline → SVG `foreignObject` → canvas pipeline that leans on the browser's own layout engine, with zero runtime dependencies and an optional React binding. The **core is fully framework-agnostic** — usable from vanilla JS, Vue, Svelte, or anything else — while the React hook is a separate, opt-in subpath.

---

## 1. Package layout & subpath exports

One package, two import surfaces (Node `exports` map):

| Import                               | Surface                                                                                                                                                                | React required?     |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `html-shutter` / `html-shutter/core` | Framework-agnostic core: `captureElementToPngDataUrl`, `previewElementAsImage`, `downloadElementAsImage`, `copyElementToClipboard`, `CaptureElementOptions`, `VERSION` | No                  |
| `html-shutter/react`                 | `useElementCapture` hook + `UseElementCaptureOptions` / `UseElementCaptureReturn` types                                                                                | Yes (optional peer) |

The core never imports React; the React peer dependency is only resolved by consumers importing `html-shutter/react`.

## 2. Core AI Rules & Constraints

- **Browser-only rule**: The capture pipeline requires a real browser (Canvas 2D + `foreignObject` + `XMLSerializer`). It will not work in Node, server components, or default jsdom (no 2D context). In tests, only pin to the exported pure utilities (`sanitizeFileName`, `dataUrlToBlob`, `waitForNextFrames`, `shouldSkipElement`, property lists).
- **Never touch the live DOM**: The pipeline clones; it never mutates, unmounts, hides, or re-mounts the captured element. Do not add mutations — captures must be side-effect free.
- **Whitelist-driven styling**: Only properties listed in `HTML_STYLE_PROPERTIES` / `SVG_STYLE_PROPERTIES` (`src/core/utils/style-properties.ts`) survive into the clone. If a component relies on a missing property, extend the whitelist — do not add per-component hacks.
- **Skipped content**: Elements with class `no-export` or `zeugma-dev-footer`, or attribute `data-no-export="true"`, plus `script`/`noscript`/`iframe` are removed from the clone by default. Extra skip classes are passed via `extraSkipClasses`.
- **Theme resolution**: Without explicit `backgroundColor`, the pipeline uses the nearest opaque ancestor background; without `borderColor` it consults `--ant-color-border` / `--ant-color-border-secondary` (override with `borderColorVariables`) falling back to `#d9d9d9` (light) / `#303030` (dark via `data-theme="dark"`).
- **Capture timing**: Never capture a hidden element (`getBoundingClientRect` of 0 clamps to a 100×100 minimum). For CSS/image-settled captures call `captureElementToPngDataUrl` after the element is visible; `waitForNextFrames` is available for "make visible, then capture" flows.
- **Asset origins**: Remote images/fetches go CORS-first (`crossOrigin: anonymous`, `fetch mode cors`); unresolvable assets degrade to a transparent pixel instead of throwing — but prefer same-origin or data-URL assets, and remember a tainted canvas cannot be exported.
- **Output is always PNG data URL**: `captureElementToPngDataUrl` returns `data:image/png;base64,...`. Use `dataUrlToBlob` + `downloadBlob`, `downloadElementAsImage` for the file flow, or `previewElementAsImage` for the display flow. `pixelRatio` defaults to `min(devicePixelRatio, 2)`.

---

## 3. Quick Start

### React hook (`html-shutter/react`)

```tsx
import { useElementCapture } from 'html-shutter/react'

function DashboardCard() {
  const { ref, preview, download, copy, isCapturing } = useElementCapture<HTMLDivElement>({
    fileName: 'widget-export',
    pixelRatio: 2,
  })

  return (
    <div>
      <div ref={ref}>{/* target */}</div>
      <button onClick={() => void preview()} disabled={isCapturing}>
        Preview PNG
      </button>
      <button onClick={() => void download()} disabled={isCapturing}>
        Download PNG
      </button>
      <button onClick={() => void copy()} disabled={isCapturing}>
        Copy image
      </button>
    </div>
  )
}
```

Hook notes: the `ref` type defaults to `HTMLDivElement`; set the generic (`useElementCapture<HTMLElement>()`) for other tags. The hook exposes exactly three user-facing actions — `preview()` (an `ElementPreview`: `{ dataUrl, bytes, cssWidth }`, or `null` when the ref is unattached), `download()` (PNG file) and `copy()` (PNG image on the clipboard, both `Promise<boolean>`, `false` when the ref is unattached or the write failed). `preview()` already encodes the byte/CSS-size metadata, so hosts never decode the data URL themselves. Options are read through a latest-ref — callbacks stay stable, per-call `overrides` win over initialization options.

### Framework-agnostic core (`html-shutter` / `html-shutter/core`)

```ts
import {
  captureElementToPngDataUrl,
  downloadElementAsImage,
  copyElementToClipboard,
} from 'html-shutter'

const panel = document.querySelector<HTMLElement>('#panel')!
const dataUrl = await captureElementToPngDataUrl(panel, {
  backgroundColor: '#ffffff',
  borderColor: '#d9d9d9',
  borderWidth: 1,
  pixelRatio: 2,
})
await downloadElementAsImage(panel, { fileName: 'panel export' })
const ok = await copyElementToClipboard(panel) // PNG image on the clipboard
```

Works unchanged with Vue, Svelte, Angular, or a plain `<script type="module">` — no framework bindings involved.

---

## 4. API Reference

### Core (`html-shutter` / `html-shutter/core`)

#### `captureElementToPngDataUrl(element, options?): Promise<string>`

The core rasterizer. Returns a PNG data URL; throws when 2D context/streaming fails.

#### `previewElementAsImage(element, options?): Promise<ElementPreview>`

Capture → display-ready preview in one call: `{ dataUrl, bytes, cssWidth }`.
`bytes` is the exact decoded PNG size (via the internal `dataUrlToBlob`, not a
base64 length estimate) and `cssWidth` is the element's CSS layout width so
the preview renders back at 1:1. Throws when the underlying capture fails.

#### `downloadElementAsImage(element, options?): Promise<boolean>`

Capture + sanitize + `downloadBlob` flow. `false` on failure.

#### `copyElementToClipboard(element, options?): Promise<boolean>`

Capture → `image/png` `ClipboardItem` via `navigator.clipboard.write`. When the
browser cannot write images (non-secure context, permission denial, missing
`ClipboardItem`), the PNG data URL falls back to `clipboard.writeText`, so
something always lands on the clipboard. `false` when nothing could be written.

#### `CaptureElementOptions`

| Option                 | Default                                                  | Notes                                                                             |
| ---------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `fileName`             | timestamp-based                                          | used only by `downloadElementAsImage`                                             |
| `backgroundColor`      | nearest opaque ancestor                                  | body/root/dark fallback next                                                      |
| `borderColor`          | nearest visible border                                   | then `borderColorVariables`, then light/dark defaults                             |
| `borderWidth`          | `1`                                                      | CSS pixels; the painted frame replaces the element's own border ring when enabled |
| `pixelRatio`           | `min(devicePixelRatio, 2)`                               | scales the output canvas                                                          |
| `borderColorVariables` | `['--ant-color-border', '--ant-color-border-secondary']` | lookup list                                                                       |
| `extraSkipClasses`     | `[]`                                                     | appended to the built-in skip list                                                |

Frame geometry is **derived, not an option**: the clip/border radius always equals
the captured element's own computed corner radius (largest of the four corners;
`0` for square elements), so the export mirrors the live silhouette. Do not add a
`borderRadius` option back — Odak wrappers rely on the element-driven radius.

### React (`html-shutter/react`)

- `useElementCapture<T extends HTMLElement = HTMLDivElement>(options?)` — hook returning `{ ref, preview, download, copy, isCapturing }`, plus the `UseElementCaptureOptions` / `UseElementCaptureReturn` types.

### Public surface

The root/core subpath exports exactly five things: `captureElementToPngDataUrl`,
`previewElementAsImage`, `downloadElementAsImage`, `copyElementToClipboard`,
and the `CaptureElementOptions` type (plus `VERSION`; `ElementPreview` is the
return type of `previewElementAsImage`). The React subpath exports the hook and
its two types. Keep it that way — Odak wraps only these, and the
demo/homepage use the hook's actions.

### Internal-only modules (do not document as public API)

`waitForNextFrames`, `dataUrlToBlob`, `downloadBlob`, `sanitizeFileName`,
`resolveBackgroundColor`, `resolveBorderColor`, `shouldSkipElement`,
`cloneAndInlineTree`, `inlineElementStyles`, `copyRootCssVariables`,
`materializePseudoElement`, `collectSafeDocumentCss`, `buildSvgDocument`,
`renderSvgToCanvas`, `drawRoundedRectPath`, `inlineCssUrls`,
`rasterizeMaskToPngDataUrl`, `applyCssMaskToElement`, `imageElementToDataUrl`,
`fetchUrlAsDataUrl`, `normalizeSvgDataUrl`, style whitelists — reachable only
through the pipeline, not the package entry.

---

## 5. Pipeline Invariants (check before deep debugging)

1. **Clone, don't mutate** — `cloneAndInlineTree` rebuilds each node and inlines whitelisted computed styles onto the clone; `<canvas>` becomes `<img src=dataUrl>` (snapshotted at display-size × `pixelRatio`), masked backgrounds are flattened by `applyCssMaskToElement`, pseudo-element trees are materialized as real spans (`data-pseudo-cloned` guard), form values are written to the clone, scrolled containers get a translate wrapper. Bitmap images are rasterized at display-size × `pixelRatio` with high-quality smoothing (vectors draw crisply at the target size; low-res bitmaps are smooth-upscaled once instead of being block-upscaled by the final renderer).
2. **CSS is embedded, never imported** — `collectSafeDocumentCss` emits all same-origin stylesheet rules with `@import` and non-`data:`/non-fragment `url()` stripped; the clone carries inline `--*` custom properties from `copyRootCssVariables`.
3. **SVG `foreignObject` is the layout engine** — the XHTML is serialized inside `buildSvgDocument`; `renderSvgToCanvas` draws it (`pixelRatio`, rounded clip, border stroke) and WebKit needs the internal one-frame settle.
4. **Silent degradation over throwing** — missing images become a `TRANSPARENT_PIXEL`; only 2D-context and clone-root failures throw.

Common failure modes: jsdom (no 2D context) → run in a real browser; cross-origin `<img>` without CORS → transparent pixels; missing properties (e.g. scrollbar styling) → extend the whitelist; oversized captures → lower `pixelRatio` or capture a smaller tree.
