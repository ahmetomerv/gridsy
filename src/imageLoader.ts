import type { ImageInput } from "./types";

export interface LoadedImage {
  input: ImageInput;
  image?: HTMLImageElement;
  error?: unknown;
}

export async function loadImageInputs(
  inputs: ImageInput[],
  crossOrigin?: "" | "anonymous" | "use-credentials"
): Promise<LoadedImage[]> {
  return Promise.all(
    inputs.map(async (input) => {
      try {
        return {
          input,
          image: await loadImageInput(input, crossOrigin)
        };
      } catch (error) {
        return {
          input,
          error
        };
      }
    })
  );
}

function loadImageInput(
  input: ImageInput,
  crossOrigin?: "" | "anonymous" | "use-credentials"
): Promise<HTMLImageElement> {
  const source = unwrapImageInput(input);

  if (source instanceof HTMLImageElement) {
    return waitForImage(source);
  }

  const isBlob = source instanceof Blob;
  const src = isBlob ? URL.createObjectURL(source) : source;

  return new Promise((resolve, reject) => {
    const image = new Image();

    if (!isBlob && crossOrigin !== undefined) {
      image.crossOrigin = crossOrigin;
    }

    image.onload = () => {
      if (isBlob) {
        URL.revokeObjectURL(src);
      }

      resolve(image);
    };

    image.onerror = () => {
      if (isBlob) {
        URL.revokeObjectURL(src);
      }

      reject(new Error(`Failed to load image: ${describeSource(src)}`));
    };

    image.src = src;
  });
}

function waitForImage(image: HTMLImageElement): Promise<HTMLImageElement> {
  if (image.complete && image.naturalWidth > 0 && image.naturalHeight > 0) {
    return Promise.resolve(image);
  }

  return new Promise((resolve, reject) => {
    image.addEventListener("load", () => resolve(image), { once: true });
    image.addEventListener(
      "error",
      () => reject(new Error("Failed to load image element.")),
      {
        once: true
      }
    );
  });
}

function unwrapImageInput(input: ImageInput): string | Blob | File | HTMLImageElement {
  if (
    typeof input === "object" &&
    !(input instanceof Blob) &&
    !(input instanceof HTMLImageElement)
  ) {
    return input.src;
  }

  return input;
}

function describeSource(source: string): string {
  return source.length > 120 ? `${source.slice(0, 117)}...` : source;
}
