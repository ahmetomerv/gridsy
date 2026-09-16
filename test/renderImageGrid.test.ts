import { describe, expect, it } from "vitest";

import { canvasToBlob, canvasToDataUrl, renderImageGrid } from "../src";

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
