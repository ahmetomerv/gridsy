<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import {
  renderImageGrid,
  type ImageInput,
  type RenderImageGridOptions
} from "../../../../src/index";

type PresetName = "community-contributors" | "community-event";

const props = defineProps<{
  preset: PresetName;
}>();

const host = ref<HTMLDivElement>();
const errorMessage = ref("");
let isActive = true;

const people = [
  ["Ari", "AR", "#fb923c"],
  ["Bea", "BE", "#38bdf8"],
  ["Chen", "CH", "#a78bfa"],
  ["Dara", "DA", "#34d399"],
  ["Eli", "EL", "#f472b6"],
  ["Farah", "FA", "#facc15"],
  ["Gio", "GI", "#60a5fa"],
  ["Hana", "HA", "#c084fc"],
  ["Imani", "IM", "#2dd4bf"],
  ["Jon", "JO", "#fb7185"],
  ["Kai", "KA", "#a3e635"],
  ["Luz", "LU", "#f59e0b"]
] as const;

const eventPeople = [
  ["Mina Park", "Host", "MP", "#7c3aed"],
  ["Noah Reed", "Speaker", "NR", "#2563eb"],
  ["Omar Aziz", "Speaker", "OA", "#0891b2"],
  ["Priya Shah", "Mentor", "PS", "#059669"],
  ["Rina Cole", "Builder", "RC", "#ea580c"],
  ["Sam Lee", "Builder", "SL", "#db2777"],
  ["Tara West", "Designer", "TW", "#9333ea"],
  ["Uma Roy", "Organizer", "UR", "#0284c7"],
  ["Vic Stone", "Organizer", "VS", "#16a34a"]
] as const;

onMounted(async () => {
  try {
    const result = await renderImageGrid(createPreset(props.preset));

    if (!isActive) {
      return;
    }

    host.value?.replaceChildren(result.canvas);
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Could not render grid.";
  }
});

onBeforeUnmount(() => {
  isActive = false;
});

function createPreset(preset: PresetName): RenderImageGridOptions {
  switch (preset) {
    case "community-contributors":
      return {
        images: people.map(([name, initials, color]) =>
          avatarImage(name, initials, color)
        ),
        columns: 6,
        cellSize: 112,
        gap: 14,
        padding: 22,
        background: "#111827",
        borderRadius: 56,
        pixelRatio: 2
      };
    case "community-event":
      return {
        images: eventPeople.map(([name, role, initials, color]) =>
          memberCardImage(name, role, initials, color)
        ),
        columns: 3,
        cellSize: { width: 220, height: 120 },
        gap: 12,
        padding: 18,
        background: "#eef2ff",
        borderRadius: 14,
        pixelRatio: 2
      };
  }
}

function avatarImage(name: string, initials: string, color: string): ImageInput {
  return svgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" width="112" height="112" viewBox="0 0 112 112">
      <rect width="112" height="112" fill="${color}"/>
      <circle cx="56" cy="50" r="27" fill="#fff" fill-opacity=".22"/>
      <text x="56" y="59" text-anchor="middle" font-family="system-ui, sans-serif" font-size="25" font-weight="800" fill="#fff">${escapeXml(initials)}</text>
      <text x="56" y="92" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#fff">${escapeXml(name)}</text>
    </svg>
  `);
}

function memberCardImage(
  name: string,
  role: string,
  initials: string,
  color: string
): ImageInput {
  return svgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" width="220" height="120" viewBox="0 0 220 120">
      <rect width="220" height="120" fill="#fff"/>
      <circle cx="55" cy="60" r="36" fill="${color}"/>
      <text x="55" y="68" text-anchor="middle" font-family="system-ui, sans-serif" font-size="22" font-weight="800" fill="#fff">${escapeXml(initials)}</text>
      <text x="108" y="55" font-family="system-ui, sans-serif" font-size="16" font-weight="750" fill="#172033">${escapeXml(name)}</text>
      <text x="108" y="78" font-family="system-ui, sans-serif" font-size="13" fill="#64748b">${escapeXml(role)}</text>
    </svg>
  `);
}

function svgDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}`;
}

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;"
    };

    return entities[character];
  });
}
</script>

<template>
  <div class="generated-grid">
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <div ref="host" class="canvas-host" aria-live="polite" />
  </div>
</template>

<style scoped>
.generated-grid {
  margin: 20px 0 28px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.canvas-host {
  display: grid;
  min-height: 180px;
  place-items: center;
  overflow: auto;
  padding: 16px;
}

.canvas-host :deep(canvas) {
  display: block;
  width: auto !important;
  max-width: 100%;
  height: auto !important;
}

.error {
  margin: 0;
  padding: 16px;
  color: var(--vp-c-danger-1);
}
</style>
