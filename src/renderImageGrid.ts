import { drawImageInCell, drawPlaceholder } from "./draw";
import { canvasToBlob, canvasToDataUrl } from "./export";
import { loadImageInputs } from "./imageLoader";
import { calculateGridLayout } from "./layout";
import type { RenderedImageGrid, RenderImageGridOptions } from "./types";

const DEFAULT_SIZE = 1200;
const DEFAULT_BACKGROUND = "#ffffff";
const DEFAULT_FALLBACK = "#e5e7eb";

export async function renderImageGrid(
  options: RenderImageGridOptions
): Promise<RenderedImageGrid> {
  if (!Array.isArray(options.images)) {
    throw new TypeError("images must be an array.");
  }

  if (
    options.cellSize !== undefined &&
    (options.width !== undefined || options.height !== undefined)
  ) {
    throw new TypeError("cellSize cannot be combined with width or height.");
  }

  const fit = options.fit ?? "cover";
  const background = options.background ?? DEFAULT_BACKGROUND;
  const fallbackColor = options.fallbackColor ?? DEFAULT_FALLBACK;
  const borderRadius = nonNegativeNumber(options.borderRadius ?? 0, "borderRadius");
  const layout =
    options.cellSize !== undefined
      ? calculateGridLayout({
          itemCount: options.images.length,
          cellSize: options.cellSize,
          columns: options.columns,
          rows: options.rows,
          gap: options.gap,
          padding: options.padding
        })
      : calculateGridLayout({
          itemCount: options.images.length,
          width: options.width ?? DEFAULT_SIZE,
          height: options.height ?? DEFAULT_SIZE,
          columns: options.columns,
          rows: options.rows,
          gap: options.gap,
          padding: options.padding
        });
  const canvas = createHiDPICanvas(layout.width, layout.height, options.pixelRatio);
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create a 2D canvas context.");
  }

  context.fillStyle = background;
  context.fillRect(0, 0, layout.width, layout.height);
  const loadedImages = await loadImageInputs(options.images, options.crossOrigin);

  for (const cell of layout.cells) {
    const loaded = loadedImages[cell.index];

    if (loaded?.image) {
      drawImageInCell(context, loaded.image, cell, fit, borderRadius);
    } else {
      drawPlaceholder(context, cell, fallbackColor, borderRadius);
    }
  }

  return {
    canvas,
    failed: loadedImages
      .filter((result) => result.error !== undefined)
      .map((result) => ({
        input: result.input,
        error: result.error
      })),
    toBlob: (exportOptions) => canvasToBlob(canvas, exportOptions),
    toDataUrl: (exportOptions) => canvasToDataUrl(canvas, exportOptions)
  };
}

export function createHiDPICanvas(
  width: number,
  height: number,
  pixelRatio = getDefaultPixelRatio()
): HTMLCanvasElement {
  if (typeof document === "undefined") {
    throw new Error("gridsy requires a browser-like document to create a canvas.");
  }

  if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) {
    throw new RangeError("width and height must be positive numbers.");
  }

  const ratio = Math.max(1, pixelRatio || 1);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  if (context) {
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  return canvas;
}

function getDefaultPixelRatio(): number {
  return typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
}

function nonNegativeNumber(value: number, name: string): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a non-negative number.`);
  }

  return value;
}
