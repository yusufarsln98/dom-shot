/**
 * dom-shot
 *
 * Capture HTML elements as PNG screenshots — clone the DOM, inline computed
 * styles, rasterize via SVG, and export the result as a file download or a
 * clipboard image.
 *
 * The root entry is fully framework-agnostic (vanilla JS, Vue, Svelte, …).
 * React users should prefer the hook subpath:
 *
 *     import { useElementCapture } from 'dom-shot/react'
 *
 * which is a thin state wrapper around the same core functions exported here.
 */

export * from './core/index.js'

export const VERSION = '0.1.0'
