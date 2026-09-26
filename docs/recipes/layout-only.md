<script setup>
import GeneratedGrid from "../.vitepress/theme/components/GeneratedGrid.vue";
</script>

# Layout-only math

Use `calculateGridLayout` when you need deterministic cell positions without loading images—for example to size a DOM grid, reserve space, or drive a custom renderer.

The previews below draw the returned cell rectangles on a HiDPI canvas so you can see the layout the math produces.

<ClientOnly>
  <GeneratedGrid preset="layout-cell-sized" />
</ClientOnly>

```ts
import { calculateGridLayout } from "gridsy";

const layout = calculateGridLayout({
  itemCount: 10,
  cellSize: { width: 240, height: 160 },
  columns: 5,
  gap: 12,
  padding: 32
});

console.log(layout.width, layout.height); // derived canvas size
console.log(layout.cells[0]); // { index, x, y, width, height }
```

## Fixed canvas

<ClientOnly>
  <GeneratedGrid preset="layout-fixed" />
</ClientOnly>

```ts
const layout = calculateGridLayout({
  itemCount: 8,
  width: 1200,
  height: 630,
  columns: 4,
  rows: 2,
  gap: 8,
  padding: 24
});

// cells.length === 8; capacity is 8
```

With both `columns` and `rows`, capacity is `columns * rows`. Extra items do not get cells.

## Align DOM to the same grid

<ClientOnly>
  <GeneratedGrid preset="layout-dom" />
</ClientOnly>

```ts
const layout = calculateGridLayout({
  itemCount: items.length,
  cellSize: 160,
  columns: 4,
  gap: 8,
  padding: 16
});

const stage = document.querySelector<HTMLElement>("#stage")!;
stage.style.position = "relative";
stage.style.width = `${layout.width}px`;
stage.style.height = `${layout.height}px`;

for (const cell of layout.cells) {
  const el = document.createElement("div");
  el.style.position = "absolute";
  el.style.left = `${cell.x}px`;
  el.style.top = `${cell.y}px`;
  el.style.width = `${cell.width}px`;
  el.style.height = `${cell.height}px`;
  el.textContent = items[cell.index]?.label ?? "";
  stage.append(el);
}
```

Layout calculation is pure: no `document`, no image loading. Pair it with [custom rendering](/guide/custom-rendering) when you later draw to canvas.
