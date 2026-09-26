<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import {
  calculateGridLayout,
  createHiDPICanvas,
  drawPlaceholder,
  renderImageGrid,
  type ImageInput,
  type RenderImageGridOptions
} from "../../../../src/index";

type PresetName =
  | "community-contributors"
  | "community-event"
  | "file-uploads"
  | "framework-usage"
  | "layout-cell-sized"
  | "layout-fixed"
  | "layout-dom";

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

const photoColors = [
  "#0f766e",
  "#1d4ed8",
  "#b45309",
  "#be123c",
  "#6d28d9",
  "#047857",
  "#0369a1",
  "#c2410c"
] as const;

onMounted(async () => {
  try {
    const canvas = await renderPreset(props.preset);

    if (!isActive) {
      return;
    }

    host.value?.replaceChildren(canvas);
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Could not render grid.";
  }
});

onBeforeUnmount(() => {
  isActive = false;
});

async function renderPreset(preset: PresetName): Promise<HTMLCanvasElement> {
  switch (preset) {
    case "layout-cell-sized":
      return renderLayoutPreview({
        itemCount: 10,
        cellSize: { width: 120, height: 80 },
        columns: 5,
        gap: 12,
        padding: 32,
        background: "#ffffff",
        label: (index) => String(index)
      });
    case "layout-fixed":
      return renderLayoutPreview({
        itemCount: 8,
        width: 600,
        height: 315,
        columns: 4,
        rows: 2,
        gap: 8,
        padding: 24,
        background: "#f8fafc",
        label: (index) => String(index)
      });
    case "layout-dom":
      return renderLayoutPreview({
        itemCount: 8,
        cellSize: 80,
        columns: 4,
        gap: 8,
        padding: 16,
        background: "#ffffff",
        label: (index) => `Item ${index + 1}`
      });
    default: {
      const result = await renderImageGrid(createImagePreset(preset));
      return result.canvas;
    }
  }
}

function createImagePreset(
  preset: Exclude<PresetName, "layout-cell-sized" | "layout-fixed" | "layout-dom">
): RenderImageGridOptions {
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
    case "file-uploads":
      return {
        images: photoColors.map((color, index) =>
          photoTileImage(`IMG_${String(index + 1).padStart(2, "0")}`, color)
        ),
        columns: 4,
        cellSize: 140,
        gap: 10,
        padding: 20,
        background: "#f3f4f6",
        fit: "cover",
        borderRadius: 8,
        pixelRatio: 2
      };
    case "framework-usage":
      return {
        images: photoColors
          .slice(0, 6)
          .map((color, index) => photoTileImage(`Photo ${index + 1}`, color)),
        columns: 3,
        cellSize: 120,
        gap: 8,
        padding: 16,
        background: "#ffffff",
        fit: "cover",
        borderRadius: 10,
        pixelRatio: 2
      };
  }
}

function renderLayoutPreview(options: {
  itemCount: number;
  cellSize?: number | { width: number; height: number };
  width?: number;
  height?: number;
  columns?: number;
  rows?: number;
  gap?: number;
  padding?: number;
  background: string;
  label: (index: number) => string;
}): HTMLCanvasElement {
  const layout =
    options.cellSize !== undefined
      ? calculateGridLayout({
          itemCount: options.itemCount,
          cellSize: options.cellSize,
          columns: options.columns,
          rows: options.rows,
          gap: options.gap,
          padding: options.padding
        })
      : calculateGridLayout({
          itemCount: options.itemCount,
          width: options.width!,
          height: options.height!,
          columns: options.columns,
          rows: options.rows,
          gap: options.gap,
          padding: options.padding
        });

  const canvas = createHiDPICanvas(layout.width, layout.height, 2);
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create a 2D canvas context.");
  }

  context.fillStyle = options.background;
  context.fillRect(0, 0, layout.width, layout.height);

  for (const cell of layout.cells) {
    drawPlaceholder(context, cell, "#e2e8f0", 8);
    context.fillStyle = "#334155";
    context.font = "600 14px ui-sans-serif, system-ui, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(
      options.label(cell.index),
      cell.x + cell.width / 2,
      cell.y + cell.height / 2
    );
  }

  return canvas;
}

function photoTileImage(label: string, color: string): ImageInput {
  return svgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" width="280" height="280" viewBox="0 0 280 280">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${color}"/>
          <stop offset="100%" stop-color="#0f172a" stop-opacity=".35"/>
        </linearGradient>
      </defs>
      <rect width="280" height="280" fill="url(#g)"/>
      <circle cx="96" cy="88" r="28" fill="#fff" fill-opacity=".2"/>
      <path d="M28 214 L104 138 L152 186 L196 142 L252 214 Z" fill="#fff" fill-opacity=".22"/>
      <text x="24" y="252" font-family="ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="700" fill="#fff">${escapeXml(label)}</text>
    </svg>
  `);
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
