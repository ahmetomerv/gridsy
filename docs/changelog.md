# Changelog

Package version: **0.2.1** (see `package.json`).

## Shipped

- Core renderer with URL, `File`, `Blob`, and `HTMLImageElement` inputs
- Cell-sized and fixed-canvas layout modes via `calculateGridLayout`
- `cover` / `contain` fit, `borderRadius`, HiDPI `pixelRatio`
- Soft failure handling with `fallbackColor` and `result.failed`
- PNG, JPEG, and WebP export helpers (`toBlob`, `toDataUrl`, `downloadCanvas`)
- Public drawing helpers for custom pipelines (`drawImageInCell`, `drawPlaceholder`, `getObjectFitRect`)
- Framework-agnostic TypeScript package; React demo app for local experimentation

## Possible next primitives

These stay optional and library-shaped—not product templates:

- `AbortSignal` (or equivalent) for cancelable image loads
- Narrower typed load errors instead of `unknown` in `failed`
- Small overlay helpers (for example captions) as draw utilities, not layout templates

A React wrapper is intentionally deferred; compose from client lifecycle hooks instead ([framework usage](/recipes/framework-usage)).
