# Behavior and errors

This page documents what Gridsy guarantees so callers can integrate without reading the source.

## Soft failures vs thrown errors

| Situation                                                                     | Outcome                                                                                |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| One or more images fail to load                                               | Render completes. Failed cells use `fallbackColor`. Entries appear in `result.failed`. |
| More images than `rows * columns`                                             | Extra images are skipped. No error.                                                    |
| Invalid options (bad types, negative sizes, `cellSize` with `width`/`height`) | Throws `TypeError` or `RangeError` before drawing.                                     |
| No browser `document` when creating a canvas                                  | Throws (`gridsy requires a browser-like document...`).                                 |
| 2D context unavailable                                                        | Throws (`Could not create a 2D canvas context.`).                                      |
| Canvas export returns an empty blob                                           | `toBlob` / `downloadCanvas` reject with an error.                                      |
| Tainted canvas (CORS)                                                         | Browser blocks `toBlob` / `toDataURL`; treat as an environment/CORS issue.             |

Load failures never reject `renderImageGrid()`. Always inspect `result.failed` when inputs are untrusted or remote.

## Option validation

- `images` must be an array.
- `cellSize` cannot be combined with `width` or `height`.
- `width`, `height`, and `cellSize` dimensions must be positive finite numbers.
- `columns` and `rows` must be positive integers when provided.
- `gap`, `padding`, and `borderRadius` must be non-negative finite numbers.
- `pixelRatio` is clamped to at least `1`.

## Layout capacity

When both `columns` and `rows` are set, they define a fixed grid capacity. Only the first `columns * rows` images receive cells. Remaining inputs are neither loaded into cells nor reported as failures—they are simply outside the grid.

```ts
const result = await renderImageGrid({
  images: manyImages, // length 20
  width: 800,
  height: 800,
  columns: 3,
  rows: 3
});
// 9 cells drawn; images[9..] ignored
```

## Defaults

| Option                             | Default                                                   |
| ---------------------------------- | --------------------------------------------------------- |
| `width` / `height` (no `cellSize`) | `1200`                                                    |
| `gap` / `padding` / `borderRadius` | `0`                                                       |
| `background`                       | `#ffffff`                                                 |
| `fallbackColor`                    | `#e5e7eb`                                                 |
| `fit`                              | `"cover"`                                                 |
| `pixelRatio`                       | `window.devicePixelRatio` (or `1` if `window` is missing) |
| Export `type`                      | `"image/png"`                                             |

## SSR and environments

Gridsy expects `document`, `Image`, and canvas APIs. Call `renderImageGrid` and `createHiDPICanvas` from client-only code (for example inside `useEffect`, `onMounted`, or after a browser check). Layout math via `calculateGridLayout` is pure and safe anywhere.

## Testing

The package tests use Vitest with happy-dom and stubs for `HTMLCanvasElement` and `Image`. When testing your own callers:

- Stub or mock `Image` so URL loads resolve or reject deterministically.
- Stub `canvas.getContext("2d")` and export methods if you assert on side effects.
- Prefer asserting on `result.failed`, layout outputs, or that `downloadCanvas` was invoked—not on pixel buffers—unless you run in a real browser.
