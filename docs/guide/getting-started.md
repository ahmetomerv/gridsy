# Getting started

## Install

```sh
npm install gridsy
```

`gridsy` is browser-first and framework-agnostic. It requires a browser-like environment with the Canvas API; rendering is not performed during server-side rendering.

## Render your first grid

```ts
import { renderImageGrid } from "gridsy";

const result = await renderImageGrid({
  images: ["/images/one.jpg", "/images/two.jpg"],
  columns: 2,
  cellSize: { width: 400, height: 225 },
  gap: 12,
  padding: 24,
  background: "#ffffff",
  fit: "cover",
  pixelRatio: 2
});

document.querySelector("#preview")?.append(result.canvas);
```

`result.canvas` is an `HTMLCanvasElement`. Failed images do not reject the entire render: their cells use the fallback color and their errors are returned in `result.failed`.

## Export the result

Use the methods on the render result:

```ts
const png = await result.toBlob();
const jpegUrl = result.toDataUrl({ type: "image/jpeg", quality: 0.9 });
```

Or use the standalone download helper:

```ts
import { downloadCanvas } from "gridsy";

await downloadCanvas(result.canvas, "grid.webp", {
  type: "image/webp",
  quality: 0.9
});
```

## Next steps

- Learn how [automatic, cell-sized, and fixed layouts work](./layouts).
- Review supported [image inputs, failure handling, CORS, and exports](./images-and-exports).
- Read the [behavior and error contract](./behavior-and-errors).
- Compose a [custom renderer](./custom-rendering) from layout and draw helpers.
- Browse [recipes](/recipes/file-uploads) for uploads, frameworks, and precomposed cells.
- See every public function and type in the [API reference](/api/).
