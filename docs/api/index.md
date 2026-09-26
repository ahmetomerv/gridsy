# API reference

All public functions and types are exported from `gridsy`.

## `renderImageGrid(options)`

```ts
function renderImageGrid(options: RenderImageGridOptions): Promise<RenderedImageGrid>;
```

Renders image inputs into a new high-DPI canvas.

`RenderImageGridOptions` is a discriminated union: either provide `cellSize`, or omit it and optionally set `width` / `height`. Combining `cellSize` with canvas dimensions is a type error and a runtime `TypeError`.

| Option          | Type                                     | Default                   | Description                                                                   |
| --------------- | ---------------------------------------- | ------------------------- | ----------------------------------------------------------------------------- |
| `images`        | `ImageInput[]`                           | required                  | Images to load and render.                                                    |
| `cellSize`      | `CellSize`                               | —                         | Exact logical size of every cell. Mutually exclusive with `width` / `height`. |
| `width`         | `number`                                 | `1200`                    | Logical canvas width when `cellSize` is omitted.                              |
| `height`        | `number`                                 | `1200`                    | Logical canvas height when `cellSize` is omitted.                             |
| `columns`       | `number`                                 | automatic                 | Positive integer column count.                                                |
| `rows`          | `number`                                 | automatic                 | Positive integer row count.                                                   |
| `gap`           | `number`                                 | `0`                       | Non-negative space between cells.                                             |
| `padding`       | `number`                                 | `0`                       | Non-negative space around the grid.                                           |
| `background`    | `string`                                 | `#ffffff`                 | Canvas background fill.                                                       |
| `fit`           | `ImageFit`                               | `"cover"`                 | Image fit inside each cell.                                                   |
| `pixelRatio`    | `number`                                 | `window.devicePixelRatio` | Backing-canvas scale, clamped to at least 1.                                  |
| `borderRadius`  | `number`                                 | `0`                       | Cell corner radius in logical pixels.                                         |
| `crossOrigin`   | `"" \| "anonymous" \| "use-credentials"` | —                         | Assigned to URL-backed images before load.                                    |
| `fallbackColor` | `string`                                 | `#e5e7eb`                 | Fill used when an image fails.                                                |

```ts
interface RenderedImageGrid {
  canvas: HTMLCanvasElement;
  failed: Array<{ input: ImageInput; error: unknown }>;
  toBlob(options?: ExportOptions): Promise<Blob>;
  toDataUrl(options?: ExportOptions): string;
}
```

## `calculateGridLayout(options)`

```ts
function calculateGridLayout(options: GridLayoutOptions): GridLayout;
```

Calculates canvas dimensions and deterministic cell positions without loading or drawing images. Uses the same `cellSize` versus fixed `width` / `height` rules as `renderImageGrid()`, except fixed mode requires both `width` and `height`.

| Option      | Type       | Default                | Description                                                  |
| ----------- | ---------- | ---------------------- | ------------------------------------------------------------ |
| `itemCount` | `number`   | required               | Number of items to place (floored, minimum 0).               |
| `cellSize`  | `CellSize` | —                      | Exact cell size. Mutually exclusive with `width` / `height`. |
| `width`     | `number`   | required in fixed mode | Logical canvas width.                                        |
| `height`    | `number`   | required in fixed mode | Logical canvas height.                                       |
| `columns`   | `number`   | automatic              | Positive integer column count.                               |
| `rows`      | `number`   | automatic              | Positive integer row count.                                  |
| `gap`       | `number`   | `0`                    | Non-negative gap between cells.                              |
| `padding`   | `number`   | `0`                    | Non-negative padding around the grid.                        |

```ts
interface GridLayout {
  width: number;
  height: number;
  columns: number;
  rows: number;
  gap: number;
  padding: number;
  cells: GridCell[];
}

interface GridCell {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
}
```

`cells.length` is `min(itemCount, columns * rows)`.

## `createHiDPICanvas(width, height, pixelRatio?)`

```ts
function createHiDPICanvas(
  width: number,
  height: number,
  pixelRatio?: number
): HTMLCanvasElement;
```

Creates an `HTMLCanvasElement` with:

- CSS size set to the logical `width` × `height`
- Backing store scaled by `max(1, pixelRatio)` (default `window.devicePixelRatio` or `1`)
- 2D context transform set so drawing stays in logical pixels

Requires a browser-like `document`. Throws if dimensions are not positive finite numbers.

## Export helpers

```ts
function canvasToBlob(canvas: HTMLCanvasElement, options?: ExportOptions): Promise<Blob>;

function canvasToDataUrl(canvas: HTMLCanvasElement, options?: ExportOptions): string;

function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  options?: ExportOptions
): Promise<void>;
```

```ts
interface ExportOptions {
  type?: "image/png" | "image/jpeg" | "image/webp";
  quality?: number;
}
```

Defaults: `type: "image/png"`. `downloadCanvas` creates an object URL, clicks a temporary anchor, then revokes the URL.

## Drawing helpers

Public composition primitives for custom renderers:

```ts
function drawImageInCell(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  cell: GridCell,
  fit: ImageFit,
  borderRadius?: number
): void;

function drawPlaceholder(
  context: CanvasRenderingContext2D,
  cell: GridCell,
  color: string,
  borderRadius?: number
): void;

function getObjectFitRect(
  imageWidth: number,
  imageHeight: number,
  x: number,
  y: number,
  width: number,
  height: number,
  fit: ImageFit
): ObjectFitRect;
```

`borderRadius` is clamped to half the shorter cell side. See [Custom rendering](/guide/custom-rendering).

## Public types

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

type ImageFit = "cover" | "contain";
type CellSize = number | CellDimensions;

interface CellDimensions {
  width: number;
  height: number;
}

interface ObjectFitRect {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}
```

Also exported: `ExportOptions`, `GridCell`, `GridLayout`, `GridLayoutOptions`, `RenderedImageGrid`, `RenderImageGridOptions`.
