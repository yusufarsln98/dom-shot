/**
 * dom-shot/react — subpath entry for the React hook.
 *
 * Kept as a separate entry point so the React peer dependency is only ever
 * pulled in by consumers who explicitly import `dom-shot/react`. The core
 * (`dom-shot` / `dom-shot/core`) stays dependency-free.
 */

export * from './react/index.js'
