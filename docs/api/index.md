# API reference

All public functions and types are exported from `gridsy`.

## `renderImageGrid(options)`

```ts
function renderImageGrid(options: RenderImageGridOptions): Promise<RenderedImageGrid>;
```

Renders image inputs into a new high-DPI canvas.

| Option          | Type                                     | Default                   | Description                                                                    |
| --------------- | ---------------------------------------- | ------------------------- | ------------------------------------------------------------------------------ |
| `images`        | `ImageInput[]`                           | required                  | Images to load and render.                                                     |
| `cellSize`      | `number \| { width; height }`            | —                         | Exact logical size of every cell. Cannot be combined with `width` or `height`. |
| `width`         | `number`                                 | `1200`                    | Logical canvas width when `cellSize` is omitted.                               |
| `height`        | `number`                                 | `1200`                    | Logical canvas height when `cellSize` is omitted.                              |
| `columns`       | `number`                                 | automatic                 | Positive integer column count.                                                 |
| `rows`          | `number`                                 | automatic                 | Positive integer row count.                                                    |
| `gap`           | `number`                                 | `0`                       | Non-negative space between cells.                                              |
| `padding`       | `number`                                 | `0`                       | Non-negative space around the grid.                                            |
| `background`    | `string`                                 | `#ffffff`                 | Canvas background fill.                                                        |
| `fit`           | `"cover" \| "contain"`                   | `"cover"`                 | Image fit inside each cell.                                                    |
| `pixelRatio`    | `number`                                 | `window.devicePixelRatio` | Backing-canvas scale, clamped to at least 1.                                   |
| `borderRadius`  | `number`                                 | `0`                       | Cell corner radius in logical pixels.                                          |
| `crossOrigin`   | `"" \| "anonymous" \| "use-credentials"` | —                         | `crossOrigin` assigned to URL-backed images.                                   |
| `fallbackColor` | `string`                                 | `#e5e7eb`                 | Fill used when an image fails.                                                 |

The result contains:

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

Calculates canvas dimensions and deterministic cell positions without loading or drawing images. It uses the same `cellSize` versus fixed `width` and `height` rules as `renderImageGrid()`.

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

## `createHiDPICanvas(width, height, pixelRatio?)`

Creates an `HTMLCanvasElement` with scaled backing dimensions and the requested logical CSS dimensions. The returned 2D context is transformed so drawing coordinates stay in logical pixels.

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

## Drawing helpers

These lower-level helpers are available when you want to compose your own canvas renderer:

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
type CellSize = number | { width: number; height: number };
```

The package also exports `CellDimensions`, `ExportOptions`, `GridCell`, `GridLayout`, `GridLayoutOptions`, `ObjectFitRect`, `RenderedImageGrid`, and `RenderImageGridOptions`.
