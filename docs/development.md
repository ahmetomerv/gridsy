# Development

Gridsy keeps the framework-agnostic library, React demo, and documentation in separate layers inside one repository.

## Install dependencies

```sh
npm ci
npm --prefix demo ci
```

## Work on the library

```sh
npm run typecheck
npm test
npm run lint
npm run build
npm run verify
```

Tests run under Vitest with happy-dom. `test/setup.ts` stubs `HTMLCanvasElement` drawing/export APIs and a mock `Image` implementation (URLs containing `"fail"` reject). Prefer asserting on layout results, `result.failed`, and export side effects over pixel buffers unless you use a real browser.

## Run the documentation

```sh
npm run docs:dev
```

## Run the demo

```sh
npm run demo:dev
```

The demo imports the library source through a Vite alias, so local library changes are reflected without publishing the package.

## Build the complete website

```sh
npm run site:build
```

This builds VitePress at the site root and places the production demo under `docs/.vitepress/dist/demo/`, matching the GitHub Pages URL structure.

## Scope

Keep the core package small, typed, browser-first, and framework-agnostic. Prefer documenting composition recipes over adding framework-specific packages.
