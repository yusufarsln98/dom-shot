/**
 * html-shutter/react — subpath entry for the React hook.
 *
 * Kept as a separate entry point so the React peer dependency is only ever
 * pulled in by consumers who explicitly import `html-shutter/react`. The core
 * (`html-shutter` / `html-shutter/core`) stays dependency-free.
 */

export * from './react/index.js'
