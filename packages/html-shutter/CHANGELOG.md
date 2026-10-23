# html-shutter

## 1.0.0

### Features & Capabilities

- Pixel-accurate DOM element screenshots for modern web apps.
- Framework-agnostic core engine (`html-shutter`) utilizing native SVG `<foreignObject>` rasterization with ~4.8 KB gzipped footprint and zero canvas emulator dependencies.
- Dedicated React integration (`html-shutter/react`) via the `useElementCapture` hook alongside the standalone universal core.
- Recursive computed style inlining: snapshots all cascade styles, CSS variables, pseudo-elements (`::before`/`::after`), borders, and box shadows.
- Native system clipboard integration: writes PNG blobs directly via `ClipboardItem(["image/png"])` for instant pasting into Slack, Figma, Notion, or Linear.
- Super-sampled Retina resolution: configurable `pixelRatio` multiplier up to 3x for vector-grade exports without blur.
- Selective exclusion filter: automatically strips elements marked with `.no-export` or `data-no-export="true"` from the final output.
- Lossless canvas and SVG flattening: converts live HTML5 `<canvas>` drawings and SVG graphics into embedded data URLs before rasterization.
- Dual CJS and ESM bundle outputs with complete TypeScript type declarations (`.d.ts`).
