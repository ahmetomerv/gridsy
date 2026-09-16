import type { ExportOptions } from "./types";

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  options: ExportOptions = {}
): Promise<Blob> {
  const { type = "image/png", quality } = options;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas export returned an empty Blob."));
          return;
        }

        resolve(blob);
      },
      type,
      quality
    );
  });
}

export function canvasToDataUrl(
  canvas: HTMLCanvasElement,
  options: ExportOptions = {}
): string {
  const { type = "image/png", quality } = options;

  return canvas.toDataURL(type, quality);
}

export async function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  options: ExportOptions = {}
): Promise<void> {
  const blob = await canvasToBlob(canvas, options);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  try {
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = "noopener";
    anchor.style.display = "none";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
  } finally {
    URL.revokeObjectURL(url);
  }
}
