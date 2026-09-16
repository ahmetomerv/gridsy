import { describe, expect, it } from "vitest";

import { canvasToBlob, canvasToDataUrl, renderImageGrid } from "../src";
import type { RenderImageGridOptions } from "../src";

describe("renderImageGrid", () => {
  it("renders loaded images, keeps failed images inspectable, and scales for high DPI", async () => {
    const result = await renderImageGrid({
      images: ["data:image/mock;base64,ok", "https://example.test/fail.jpg"],
      width: 200,
      height: 100,
      columns: 2,
      pixelRatio: 2,
      background: "#ffffff",
      fallbackColor: "#f3f4f6"
    });

    expect(result.canvas.width).toBe(400);
    expect(result.canvas.height).toBe(200);
    expect(result.failed).toHaveLength(1);
    expect(result.failed[0]?.input).toBe("https://example.test/fail.jpg");
    await expect(result.toBlob()).resolves.toBeInstanceOf(Blob);
    expect(result.toDataUrl()).toMatch(/^data:image\/png;base64/);
  });

  it("derives a high-DPI canvas from cell size", async () => {
    const result = await renderImageGrid({
      images: ["data:image/mock;base64,one", "data:image/mock;base64,two"],
      cellSize: { width: 120, height: 80 },
      columns: 2,
      gap: 10,
      padding: 20,
      pixelRatio: 2
    });

    expect(result.canvas.width).toBe(580);
    expect(result.canvas.height).toBe(240);
    expect(result.canvas.style.width).toBe("290px");
    expect(result.canvas.style.height).toBe("120px");
  });

  it("rejects cell size combined with canvas dimensions at runtime", async () => {
    const options = {
      images: [],
      cellSize: 100,
      width: 500
    } as unknown as RenderImageGridOptions;

    await expect(renderImageGrid(options)).rejects.toThrow(
      "cellSize cannot be combined with width or height"
    );
  });

  it("rejects an invalid border radius", async () => {
    await expect(
      renderImageGrid({
        images: [],
        cellSize: 100,
        borderRadius: -1
      })
    ).rejects.toThrow("borderRadius must be a non-negative number");
  });
});

describe("export helpers", () => {
  it("exports data URLs and blobs with the requested type", async () => {
    const canvas = document.createElement("canvas");

    expect(canvasToDataUrl(canvas, { type: "image/webp" })).toMatch(/^data:image\/webp/);
    await expect(canvasToBlob(canvas, { type: "image/jpeg" })).resolves.toMatchObject({
      type: "image/jpeg"
    });
  });
});
