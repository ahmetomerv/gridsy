<script setup>
import GeneratedGrid from "../.vitepress/theme/components/GeneratedGrid.vue";
</script>

# Precomposed cells

Gridsy lays out and exports images; it does not draw text or chrome inside cells. When a cell needs labels, badges, or card chrome, compose each cell first (SVG, offscreen canvas, or your own renderer), then pass the results as `ImageInput`s.

The demos below are rendered in the browser with locally generated SVG artwork.

## Circular avatars

Square sources become circles when `borderRadius` is half the cell size.

<ClientOnly>
  <GeneratedGrid preset="community-contributors" />
</ClientOnly>

```ts
const result = await renderImageGrid({
  images: contributors.map((contributor) => contributor.avatarUrl),
  columns: 6,
  cellSize: 224,
  gap: 28,
  padding: 44,
  background: "#111827",
  borderRadius: 112,
  pixelRatio: 2
});

await downloadCanvas(result.canvas, "avatars.png");
```

Keep input order stable when the grid must be reproducible.

## Cards with text

Build each card as a `Blob`, data URL, or `HTMLImageElement`, then grid the cards.

<ClientOnly>
  <GeneratedGrid preset="community-event" />
</ClientOnly>

```ts
const cards = await Promise.all(
  attendees.map((attendee) => createParticipantCard(attendee))
);

const result = await renderImageGrid({
  images: cards,
  columns: 3,
  cellSize: { width: 440, height: 240 },
  gap: 24,
  padding: 36,
  background: "#eef2ff",
  borderRadius: 28,
  pixelRatio: 2
});

const image = await result.toBlob({ type: "image/png" });
```

`createParticipantCard()` is application code: draw name, role, and marks onto an offscreen canvas (or SVG), export a blob, and hand it to Gridsy.

## Alternative: draw overlays after layout

If you prefer one canvas, skip precomposition and use the [custom rendering](/guide/custom-rendering) pipeline: `calculateGridLayout` → `drawImageInCell` → your `fillText` / badge draws → export.
