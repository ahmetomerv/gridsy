import { describe, expect, it } from "vitest";

import { getObjectFitRect } from "../src/draw";
import { calculateGridLayout } from "../src/layout";

describe("calculateGridLayout", () => {
  it("creates a predictable square-ish default grid", () => {
    const layout = calculateGridLayout({
      itemCount: 5,
      width: 300,
      height: 200,
      gap: 10,
      padding: 20
    });

    expect(layout.columns).toBe(3);
    expect(layout.rows).toBe(2);
    expect(layout.cells).toHaveLength(5);
    expect(layout.cells[0]).toEqual({ index: 0, x: 20, y: 20, width: 80, height: 75 });
    expect(layout.cells[4]).toEqual({ index: 4, x: 110, y: 105, width: 80, height: 75 });
  });

  it("uses fixed rows and columns as a capacity", () => {
    const layout = calculateGridLayout({
      itemCount: 8,
      width: 400,
      height: 400,
      columns: 2,
      rows: 2
    });

    expect(layout.cells).toHaveLength(4);
  });

  it("rejects invalid dimensions", () => {
    expect(() =>
      calculateGridLayout({
        itemCount: 1,
        width: 0,
        height: 100
      })
    ).toThrow("width must be a positive number");
  });
});

describe("getObjectFitRect", () => {
  it("crops wide images for cover", () => {
    expect(getObjectFitRect(400, 200, 0, 0, 100, 100, "cover")).toEqual({
      sx: 100,
      sy: 0,
      sw: 200,
      sh: 200,
      dx: 0,
      dy: 0,
      dw: 100,
      dh: 100
    });
  });

  it("letterboxes wide images for contain", () => {
    expect(getObjectFitRect(400, 200, 0, 0, 100, 100, "contain")).toEqual({
      sx: 0,
      sy: 0,
      sw: 400,
      sh: 200,
      dx: 0,
      dy: 25,
      dw: 100,
      dh: 50
    });
  });
});
