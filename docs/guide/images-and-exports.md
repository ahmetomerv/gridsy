# Images and exports

## Supported image inputs

Each item in `images` can be a URL string, `Blob`, `File`, existing `HTMLImageElement`, or an object wrapping one of those sources.

```ts
const images = [
  "/photo.jpg",
  uploadedFile,
  imageBlob,
  document.querySelector("img")!,
  { src: "/identified.jpg", id: "cover", alt: "Cover image" }
];
```

The optional `id` and `alt` values stay attached to the input returned in `result.failed`, which can help identify a failed source.

## Failure handling

Gridsy continues rendering when an image cannot be loaded. Failed cells use `fallbackColor`, which defaults to `#e5e7eb`.

```ts
const result = await renderImageGrid({
  images,
  cellSize: 240,
  fallbackColor: "#d1d5db"
});

for (const failure of result.failed) {
  console.error(failure.input, failure.error);
}
```

## Remote images and CORS

Remote images must be same-origin or served with CORS headers that permit your site to read them. Otherwise the browser may reject the load or mark the canvas as tainted, which prevents export.

When the image server supports it, request anonymous CORS loading:

```ts
await renderImageGrid({
  images: ["https://images.example.com/photo.jpg"],
  cellSize: 300,
  crossOrigin: "anonymous"
});
```

Setting `crossOrigin` cannot override a server that does not send compatible CORS headers.

## Export formats

PNG is the default. JPEG and WebP support depends on the browser's Canvas implementation.

```ts
const png = await result.toBlob();
const jpeg = await result.toBlob({ type: "image/jpeg", quality: 0.92 });
const webpUrl = result.toDataUrl({ type: "image/webp", quality: 0.9 });
```

`quality` is relevant to lossy formats such as JPEG and WebP and is passed to the browser's Canvas export API.
