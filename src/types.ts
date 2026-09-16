export type ImageInput =
  | string
  | Blob
  | File
  | HTMLImageElement
  | {
      src: string | Blob | File | HTMLImageElement;
      alt?: string;
      id?: string;
    };

export type ImageFit = "cover" | "contain";

export interface RenderImageGridOptions {
  images: ImageInput[];
  width?: number;
  height?: number;
  columns?: number;
  rows?: number;
  gap?: number;
  padding?: number;
  background?: string;
  fit?: ImageFit;
  pixelRatio?: number;
  borderRadius?: number;
  crossOrigin?: "" | "anonymous" | "use-credentials";
  fallbackColor?: string;
}

export interface ExportOptions {
  type?: "image/png" | "image/jpeg" | "image/webp";
  quality?: number;
}

export interface RenderedImageGrid {
  canvas: HTMLCanvasElement;
  failed: Array<{
    input: ImageInput;
    error: unknown;
  }>;
  toBlob: (options?: ExportOptions) => Promise<Blob>;
  toDataUrl: (options?: ExportOptions) => string;
}

export interface GridCell {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GridLayout {
  width: number;
  height: number;
  columns: number;
  rows: number;
  gap: number;
  padding: number;
  cells: GridCell[];
}

export interface ObjectFitRect {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}
