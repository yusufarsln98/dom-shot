# dom-shot

> Capture any HTML element as a pixel-accurate PNG screenshot — pure, framework-agnostic core, with an optional React hook. Clone the DOM, inline computed styles, rasterize through SVG, and export data URLs or file downloads.

`dom-shotany live DOM element into a pixel-accurate PNG data URL. It is engineered for element screenshots in dashboards, reports, and exports — usable directly from vanilla JavaScript, Vue, Svelte, or Angular, and wired into React through a dedicated `dom-shot/react` subpath. It is faithfully derived from a battle-tested capture pipeline used in production dashboards (Odak).

## Architecture

This repository is structured as a monorepo modeled after the `react-leaflet-canvas` architecture. The package itself is split into a **framework-agnostic core** (`src/core/`) and a **React binding** (`src/react/`) behind subpath exports:

````
├── packages/
│   └── dom-shot        # The core NPM library
│       ├── src/
│       │   ├── core/           # Framework-agnostic capture pipeline
│       │   │   ├── features/   # Cloning, inlining, rasterizing, exporting
│       │   │   ├── utils/      # Constants, style maps, timing, DOM helpers
│       │   │   ├── types/      # Public TypeScript interfaces
│       │   │   └── index.ts    # Core public surface (zero React)
│       │   ├── react/          # React hook wrapper (`useElementCapture`)
│       │   ├── index.ts        # Root entry → core (framework-agnostic)
│       │   └── react.ts        # `./react` subpath entry → React hook
│       ├── tsup.config.ts      # Dual CJS/ESM bundling + DTS generation
│       └── tsconfig.json
├── apps/
│   └── demo/                   # Minimal Vite playground used to validate the library in a real browser
├── .changeset/                 # Changeset versioning & release management
└── .github/workflows/          # CI & automated release pipelines
```dom-shot

### Import surfaces (Node `exports` map)

| Import | What you get |
| --- | --- |
| `dom-shot` | Framework-agnostic core (also available as `dom-shot/core`) |
| `dom-shot/react` | The `useElementCapture` hook (optional `react` peer) |

The core never imports React, so vanilla and non-React framework consumers never resolve an optional peer dependency; React consumers get state management via the dedicated subpath.

## Workspaces

- **Library**: `packages/dom-shot`
- **Demo playground**: `apps/demo` (temporary — will be removed once the real homepage app lands)

## Development Scripts

```bash
npm install                     # Install all dependencies across workspaces
npm run dev:lib                 # Watch & rebuild library with tsup
npm run dev:demo                # Run the Vite demo playground
npm run build:lib               # Build library dist (ESM, CJS, .d.ts)
npm run build:demo              # Build the demo playground
npm run test                    # Run tests with Vitest
npm run typecheck               # Type-check TypeScript sources
npm run changeset               # Generate a changeset for versioning
````

## License

MIT © Yusuf Arslan
