# Layouts

Gridsy can derive the canvas from a cell size or divide a fixed-size canvas into cells.

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

The canvas dimensions are derived from the rows, columns, cell dimensions, gaps, and padding. `cellSize` cannot be combined with `width` or `height`.

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
- With neither, Gridsy chooses a near-square layout.
- With both, they define a fixed capacity; images beyond that capacity are not drawn.

Use `calculateGridLayout()` when you only need the dimensions and cell positions.

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
