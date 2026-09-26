![gridsy icon](https://raw.githubusercontent.com/ahmetomerv/gridsy/main/demo/public/gridsy-icon.svg)

# gridsy

Browser-first TypeScript library for rendering high-DPI image grids to canvas and exporting them as PNG, JPEG, or WebP. Framework-agnostic.

[Documentation](https://ahmetomerv.github.io/gridsy/) · [Live demo](https://ahmetomerv.github.io/gridsy/demo/)

Use it when you need deterministic contact sheets, dataset previews, upload UI previews, or downloadable composite images from URLs, files, blobs, or existing `HTMLImageElement`s—without a server-side image pipeline.

## Install

```sh
npm install gridsy
```

Requires a browser-like environment with the Canvas API. Rendering is not performed during server-side rendering.

## Quick Start

```ts
import { downloadCanvas, renderImageGrid } from "gridsy";

const result = await renderImageGrid({
  images: ["https://example.com/one.jpg", "https://example.com/two.jpg"],
  cellSize: 300,
  columns: 4,
  gap: 8,
  padding: 24,
  fit: "cover",
  background: "#ffffff",
  pixelRatio: 2,
  crossOrigin: "anonymous"
});

await downloadCanvas(result.canvas, "grid.png");
```

`result.canvas` is an `HTMLCanvasElement`. Failed loads do not reject the render: those cells use `fallbackColor` and appear in `result.failed`.

Pass `cellSize` for exact cell dimensions (number = square, `{ width, height }` = rectangle), or omit it and set `width` / `height` for a fixed canvas. The two modes cannot be combined.

## Documentation

- [Getting started](https://ahmetomerv.github.io/gridsy/guide/getting-started)
- [Layouts](https://ahmetomerv.github.io/gridsy/guide/layouts)
- [Images and exports](https://ahmetomerv.github.io/gridsy/guide/images-and-exports)
- [Behavior and errors](https://ahmetomerv.github.io/gridsy/guide/behavior-and-errors)
- [Custom rendering](https://ahmetomerv.github.io/gridsy/guide/custom-rendering)
- [Recipes](https://ahmetomerv.github.io/gridsy/recipes/file-uploads)
- [API reference](https://ahmetomerv.github.io/gridsy/api/)

## Demo

[Open the live demo](https://ahmetomerv.github.io/gridsy/demo/)

![gridsy demo](https://raw.githubusercontent.com/ahmetomerv/gridsy/main/docs/demo.jpeg)

A Vite React demo lives in `demo/`.

```sh
npm install
npm run build
npm --prefix demo install
npm run demo:dev
```

## Development

```sh
npm install
npm run typecheck
npm test
npm run lint
npm run build
npm run verify
npm run docs:dev
npm run site:build
```

The core library is independent from React. The demo imports the library source during local development through a Vite alias.

## Contributing

Issues and pull requests are welcome. Please keep the core package small, typed, browser-first, and framework-agnostic.

## License

MIT
