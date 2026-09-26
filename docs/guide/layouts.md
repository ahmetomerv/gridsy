# Layouts

Gridsy can derive the canvas from a cell size or divide a fixed-size canvas into cells. Both paths go through `calculateGridLayout()`, which also works on its own when you only need positions and dimensions.

## Cell-sized canvas

Pass `cellSize` when every cell should have an exact size. A number creates square cells; an object creates rectangular cells.

```ts
await renderImageGrid({
  images,
  columns: 4,
  cellSize: 300,
  gap: 8,
  padding: 24
});

await renderImageGrid({
  images,
  columns: 4,
  cellSize: { width: 400, height: 225 }
});
```

Canvas size is derived as:

```
width  = padding * 2 + columns * cellWidth  + (columns - 1) * gap
height = padding * 2 + rows    * cellHeight + (rows - 1) * gap
```

`cellSize` cannot be combined with `width` or `height`. TypeScript models this as a discriminated union on `RenderImageGridOptions`.

## Fixed-size canvas

Omit `cellSize` to divide a fixed canvas into equal cells:

```ts
await renderImageGrid({
  images,
  width: 1200,
  height: 630,
  columns: 4,
  rows: 2,
  gap: 8,
  padding: 24
});
```

If neither dimensions nor `cellSize` are supplied, the canvas defaults to 1200 × 1200 logical pixels.

## Rows and columns

- With `columns`, Gridsy calculates the required number of rows.
- With `rows`, Gridsy calculates the required number of columns.
- With neither, Gridsy chooses a near-square layout (`ceil(sqrt(itemCount))` columns).
- With both, they define a fixed capacity; images beyond that capacity are not drawn and do not produce errors.

Use [`calculateGridLayout()`](/recipes/layout-only) when you only need the dimensions and cell positions.

## Fit behavior

`fit: "cover"` fills each cell and crops from the center when aspect ratios differ. This is the default.

`fit: "contain"` keeps the full image visible and centers it inside the cell. The grid background remains visible around it.

## Rounded cells

`borderRadius` applies to images and fallback cells in logical pixels. Values larger than half the shorter cell side are clamped automatically.

```ts
await renderImageGrid({
  images,
  columns: 3,
  cellSize: 300,
  borderRadius: 150
});
```

For a square cell, half the cell size creates a circle. Rectangular cells become fully rounded capsules at their maximum radius.

## Logical pixels and `pixelRatio`

Layout math and drawing use **logical** pixels. `pixelRatio` scales the canvas backing store (default `window.devicePixelRatio`, clamped to at least `1`). CSS size stays at the logical width and height; `canvas.width` / `canvas.height` are multiplied by the ratio for sharper exports.
