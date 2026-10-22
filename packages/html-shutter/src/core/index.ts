/**
 * dom-shot — core (framework-agnostic)
 *
 * Capture HTML elements as PNG screenshots — clone the DOM, inline computed
 * styles, rasterize via SVG, and export the result as a file download or a
 * clipboard image.
 *
 * This module is the entire framework-agnostic public surface. It has zero
 * dependency on React or any UI framework, so it can be used directly from
 * vanilla JavaScript, Vue, Svelte, Angular, or a plain `<script>` tag.
 *
 * Public surface is deliberately small:
 * - `captureElementToPngDataUrl` — core rasterizer (returns a PNG data URL)
 * - `previewElementAsImage` — capture → display-ready preview (data URL, byte size, CSS size)
 * - `downloadElementAsImage` — capture → PNG file download
 * - `copyElementToClipboard` — capture → PNG image on the clipboard
 * - `CaptureElementOptions` — the shared options type
 *
 * Everything else is an internal pipeline module and not exported.
 * React users: see `dom-shot/react` for the `useElementCapture` hook.
 */

export type { CaptureElementOptions } from './types/index.js'
export type { ElementPreview } from './features/preview-element.js'
export { captureElementToPngDataUrl } from './features/capture-element.js'
export { previewElementAsImage } from './features/preview-element.js'
export { downloadElementAsImage } from './features/download-element.js'
export { copyElementToClipboard } from './features/copy-image.js'
