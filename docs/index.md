---
layout: home

hero:
  name: gridsy
  text: Typed image grids for the browser
  tagline: A small, framework-agnostic TypeScript API that loads image inputs, lays out a high-DPI canvas, and exports PNG, JPEG, or WebP.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: API reference
      link: /api/
    - theme: alt
      text: Open the demo
      link: /demo/
      target: _self

features:
  - title: Browser-first
    details: Render directly to an HTML canvas. No server-side image pipeline required.
  - title: Composable primitives
    details: Use renderImageGrid end-to-end, or compose layout, HiDPI canvas, and draw helpers yourself.
  - title: Export-ready
    details: Create PNG, JPEG, or WebP blobs, data URLs, and downloads from the same canvas.
---

## A grid in a few lines

```ts
import { downloadCanvas, renderImageGrid } from "gridsy";

const result = await renderImageGrid({
  images: ["/one.jpg", "/two.jpg", "/three.jpg"],
  columns: 3,
  cellSize: 300,
  gap: 8,
  padding: 24,
  pixelRatio: 2
});

await downloadCanvas(result.canvas, "grid.png");
```

[Install gridsy and render your first grid →](/guide/getting-started)
