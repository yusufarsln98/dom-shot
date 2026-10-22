/**
 * html-shutter/react
 *
 * React bindings on top of the framework-agnostic core. Exposes a single
 * hook, `useElementCapture`, which manages the ref attachment and the
 * transient `isCapturing` state while the download/copy actions run.
 *
 * Import it from the dedicated subpath so non-React consumers never resolve
 * the React peer dependency:
 *
 *     import { useElementCapture } from 'html-shutter/react'
 */

export { useElementCapture } from './use-element-capture.js'
export type { UseElementCaptureOptions, UseElementCaptureReturn } from './use-element-capture.js'
