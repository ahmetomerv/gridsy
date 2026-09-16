# gridsy

Render high quality, downloadable image grids from URLs, files, or blobs. Browser-first, TypeScript-first, framework-agnostic.

`gridsy` turns image inputs into a high-DPI browser canvas and gives you small export helpers for PNG, JPEG, and WebP. It is useful for social cards, moodboards, portfolio grids, product previews, contact sheets, collection posters, dataset previews, and API result snapshots.

## Install

```sh
npm install gridsy
```

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
  pixelRatio: 2
});

await downloadCanvas(result.canvas, "grid.png");
```

## API

### `renderImageGrid(options)`

Creates a canvas grid from image inputs.

Use `cellSize` to make the canvas fit cells of an exact size. A number creates square cells,
while an object creates rectangular cells:

```ts
const square = await renderImageGrid({
  images,
  columns: 4,
  cellSize: 300,
  gap: 8,
  padding: 24
});

const landscape = await renderImageGrid({
  images,
  columns: 4,
  cellSize: { width: 400, height: 225 },
  gap: 8,
  padding: 24
});
```

The canvas dimensions are derived from the resolved rows and columns, cell dimensions, gaps,
and padding. `cellSize` cannot be combined with canvas `width` or `height`.

To keep using a fixed canvas, omit `cellSize` and provide `width` and `height`:

```ts
const result = await renderImageGrid({
  images,
  width: 1200,
  height: 1200,
  columns: 4,
  rows: 3,
  gap: 8,
  padding: 24,
  background: "#ffffff",
  fit: "cover",
  pixelRatio: 2,
  borderRadius: 12,
  crossOrigin: "anonymous",
  fallbackColor: "#e5e7eb"
});
```

Supported image inputs:

```ts
type ImageInput =
  | string
  | Blob
  | File
  | HTMLImageElement
  | {
      src: string | Blob | File | HTMLImageElement;
      alt?: string;
      id?: string;
    };
```

Return value:

```ts
interface RenderedImageGrid {
  canvas: HTMLCanvasElement;
  failed: Array<{ input: ImageInput; error: unknown }>;
  toBlob: (options?: ExportOptions) => Promise<Blob>;
  toDataUrl: (options?: ExportOptions) => string;
}
```

Failed images are represented in the canvas with `fallbackColor` and returned in `failed` so the caller can inspect what happened without losing the whole render.

### `calculateGridLayout(options)`

Returns deterministic cell positions for a grid. If both `columns` and `rows` are provided, they act as a fixed capacity and extra images are not assigned cells.

```ts
const layout = calculateGridLayout({
  itemCount: 10,
  cellSize: { width: 240, height: 160 },
  columns: 5,
  gap: 12,
  padding: 32
});
```

### `createHiDPICanvas(width, height, pixelRatio?)`

Creates a canvas whose internal pixel dimensions are scaled for high-DPI output while keeping CSS dimensions at the requested size.

### Export Helpers

```ts
await canvasToBlob(canvas, { type: "image/webp", quality: 0.9 });
canvasToDataUrl(canvas, { type: "image/jpeg", quality: 0.92 });
await downloadCanvas(canvas, "grid.png");
```

## Fit Behavior

`cover` fills each cell by cropping from the center when aspect ratios differ.

`contain` keeps the full image visible and centers it inside the cell, leaving the grid background visible around it.

## Border Radius

`borderRadius` controls the corner radius of every image and fallback cell in logical pixels. It defaults to `0`. Values larger than half the shorter cell side are clamped automatically. For a square cell, setting the radius to half the cell size creates a circle:

```ts
await renderImageGrid({
  images,
  columns: 3,
  cellSize: 300,
  borderRadius: 150
});
```

Rectangular cells become fully rounded capsules at their maximum radius rather than circles.

## Browser and CORS Notes

Remote images must be same-origin, served with permissive CORS headers, or proxied/fetched in a way that avoids canvas tainting.

If a remote image does not allow CORS, rendering may fail or export may be blocked by the browser. Pass `crossOrigin: "anonymous"` before loading remote images when the server supports it.

## Demo

![gridsy demo](https://raw.githubusercontent.com/ahmetomerv/gridsy/main/docs/demo.jpeg)

A Vite React demo lives in `demo/`.

```sh
npm install
npm run build
npm --prefix demo install
npm run demo:dev
```

The hosted demo URL will be added after the first deployment.

## Development

```sh
npm install
npm run typecheck
npm test
npm run lint
npm run build
npm run verify
```

The core library is independent from React. The demo imports the library source during local development through a Vite alias.

## Roadmap

- Core renderer with URL, file, blob, and `HTMLImageElement` support.
- PNG, JPEG, and WebP export helpers.
- Demo app for URLs and uploaded files.
- Captions and reusable layout templates.
- Optional React wrapper after the core API is proven.

## Contributing

Issues and pull requests are welcome. Please keep the core package small, typed, browser-first, and framework-agnostic.

## License

MIT
