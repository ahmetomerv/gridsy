<script setup>
import GeneratedGrid from "../.vitepress/theme/components/GeneratedGrid.vue";
</script>

# User and community mosaics

Community applications can turn profile data into downloadable contributor walls, event graphics, team directories, and milestone celebrations. Gridsy keeps the composition deterministic while your application controls who appears and in what order.

The examples below are rendered in your browser by Gridsy using locally generated profile artwork.

## Contributor wall

Square avatar images become circles when `borderRadius` is half the cell size. This is useful for contributor acknowledgements, membership milestones, and community announcements.

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

await downloadCanvas(result.canvas, "contributors.png");
```

Keep the input order stable—for example, by contribution count or join date—when the generated mosaic will be reproduced later.

## Event participant board

Profile cards do not have to be square. Rectangular image inputs can carry names and roles while Gridsy handles the surrounding layout and export resolution.

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

`createParticipantCard()` can return a `Blob`, data URL, or `HTMLImageElement`, so the application can compose names, roles, badges, or sponsor marks before placing each card in the final grid.
