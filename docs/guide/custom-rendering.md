# Custom rendering

`renderImageGrid()` covers the common path. When you need overlays, captions, watermarks, or a different draw order, compose the public primitives yourself:

1. `calculateGridLayout` — dimensions and cell rects
2. `createHiDPICanvas` — backing store + logical coordinate transform
3. Load images (your code or existing elements)
4. `drawImageInCell` / `drawPlaceholder` / `getObjectFitRect`
5. Export with `canvasToBlob`, `canvasToDataUrl`, or `downloadCanvas`

## Minimal custom pipeline

```ts
import {
  calculateGridLayout,
  createHiDPICanvas,
  drawImageInCell,
  drawPlaceholder,
  downloadCanvas
} from "gridsy";

const images = await loadYourImages(); // HTMLImageElement[]
const layout = calculateGridLayout({
  itemCount: images.length,
  cellSize: 240,
  columns: 4,
  gap: 8,
  padding: 24
});

const canvas = createHiDPICanvas(layout.width, layout.height, 2);
const context = canvas.getContext("2d")!;

context.fillStyle = "#ffffff";
context.fillRect(0, 0, layout.width, layout.height);

for (const cell of layout.cells) {
  const image = images[cell.index];

  if (image) {
    drawImageInCell(context, image, cell, "cover", 12);
  } else {
    drawPlaceholder(context, cell, "#e5e7eb", 12);
  }

  // Your overlay: index label, watermark, etc.
  context.fillStyle = "rgba(0,0,0,0.55)";
  context.font = "14px sans-serif";
  context.fillText(String(cell.index + 1), cell.x + 8, cell.y + 20);
}

await downloadCanvas(canvas, "annotated-grid.png");
```

## When to customize

| Need                                       | Approach                                                                                                              |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Labels, badges, or borders on cells        | Custom draw after `drawImageInCell`, or [precompose each cell](/recipes/precomposed-cells) then use `renderImageGrid` |
| Different background per cell              | `drawPlaceholder` / fill per cell before or after the image                                                           |
| Share layout with DOM overlays             | `calculateGridLayout` only; position HTML using `cells`                                                               |
| Exact object-fit crop math without drawing | `getObjectFitRect`                                                                                                    |

## HiDPI details

`createHiDPICanvas(width, height, pixelRatio?)` sets:

- `canvas.style.width` / `height` to the logical size
- `canvas.width` / `height` to `round(logical * ratio)`
- `context.setTransform(ratio, 0, 0, ratio, 0, 0)` so you keep drawing in logical pixels

Always draw using the layout’s logical coordinates. Export helpers read the backing store, so `pixelRatio: 2` produces a 2× PNG/JPEG/WebP.

## Object-fit helper

`getObjectFitRect` returns source and destination rectangles for `"cover"` or `"contain"`. Use it when you need the crop math for a custom `drawImage` call or for aligning DOM elements to the same crop.
