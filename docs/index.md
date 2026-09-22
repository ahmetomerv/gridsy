---
layout: home

hero:
  name: gridsy
  text: High-DPI image grids for the browser
  tagline: Turn URLs, files, blobs, and image elements into downloadable canvas grids with a small, typed API.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: Open the demo
      link: /demo/
      target: _self

features:
  - title: Browser-first
    details: Render directly to an HTML canvas without a server-side image pipeline.
  - title: Framework-agnostic
    details: Use the same TypeScript API from React, Vue, Svelte, or plain JavaScript.
  - title: Export-ready
    details: Create PNG, JPEG, or WebP blobs, data URLs, and downloads.
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
