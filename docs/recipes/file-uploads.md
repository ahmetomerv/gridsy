<script setup>
import GeneratedGrid from "../.vitepress/theme/components/GeneratedGrid.vue";
</script>

# File uploads

Build a grid from `<input type="file">` selections. `File` values are valid `ImageInput`s, so no extra conversion is required.

The preview below uses the same layout options as the snippet, with locally generated stand-ins for uploaded photos.

<ClientOnly>
  <GeneratedGrid preset="file-uploads" />
</ClientOnly>

```ts
import { downloadCanvas, renderImageGrid } from "gridsy";

const input = document.querySelector<HTMLInputElement>("#photos")!;

input.addEventListener("change", async () => {
  const files = Array.from(input.files ?? []);

  const result = await renderImageGrid({
    images: files,
    columns: 4,
    cellSize: 280,
    gap: 10,
    padding: 20,
    background: "#f3f4f6",
    fit: "cover",
    pixelRatio: 2
  });

  document.querySelector("#preview")?.replaceChildren(result.canvas);

  if (result.failed.length > 0) {
    console.warn("Some files could not be decoded", result.failed);
  }
});

document.querySelector("#download")?.addEventListener("click", async () => {
  const canvas = document.querySelector("#preview canvas");
  if (canvas instanceof HTMLCanvasElement) {
    await downloadCanvas(canvas, "uploads-grid.png");
  }
});
```

Tips:

- Mix URLs and files in one `images` array if needed (`[...urls, ...files]`).
- Wrap files as `{ src: file, id: file.name }` when you want stable failure identity.
- Revoke any object URLs you create yourself; Gridsy revokes the ones it creates internally for blobs/files after load.
