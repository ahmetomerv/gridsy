# Framework usage

Gridsy is framework-agnostic. Call it from client-only lifecycle hooks, mount `result.canvas` into the DOM, and cancel stale renders when inputs change.

## React

```tsx
import { useEffect, useRef, useState } from "react";
import { renderImageGrid, type ImageInput } from "gridsy";

export function ImageGridPreview({ images }: { images: ImageInput[] }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(0);

  useEffect(() => {
    let active = true;

    void (async () => {
      const result = await renderImageGrid({
        images,
        columns: 3,
        cellSize: 240,
        gap: 8,
        padding: 16,
        pixelRatio: 2,
        crossOrigin: "anonymous"
      });

      if (!active) {
        return;
      }

      setFailed(result.failed.length);
      hostRef.current?.replaceChildren(result.canvas);
    })();

    return () => {
      active = false;
    };
  }, [images]);

  return (
    <div>
      <div ref={hostRef} />
      {failed > 0 ? <p>{failed} image(s) failed</p> : null}
    </div>
  );
}
```

Keep the abort flag (or an `AbortController` you own for upstream fetches) so a slow render cannot replace a newer one.

## Vue

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref, watchEffect } from "vue";
import { renderImageGrid, type ImageInput } from "gridsy";

const props = defineProps<{ images: ImageInput[] }>();
const host = ref<HTMLDivElement>();
let active = true;

onBeforeUnmount(() => {
  active = false;
});

watchEffect(async () => {
  const result = await renderImageGrid({
    images: props.images,
    columns: 3,
    cellSize: 240,
    gap: 8,
    padding: 16,
    pixelRatio: 2
  });

  if (!active) {
    return;
  }

  host.value?.replaceChildren(result.canvas);
});
</script>

<template>
  <div ref="host" />
</template>
```

## Plain JavaScript

```ts
import { renderImageGrid } from "gridsy";

const result = await renderImageGrid({
  images: ["/a.jpg", "/b.jpg"],
  cellSize: 200,
  columns: 2
});

document.querySelector("#preview")?.append(result.canvas);
```

SSR frameworks (Next.js, Nuxt, etc.) should import and call Gridsy only in client components or after hydration. `calculateGridLayout` alone is safe on the server if you need layout numbers without a canvas.
