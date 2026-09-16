import { describe, expect, it } from "vitest";

import { getObjectFitRect } from "../src/draw";
import { calculateGridLayout } from "../src/layout";
import type { GridLayoutOptions } from "../src/types";

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

  it("derives the canvas dimensions from a square cell size", () => {
    const layout = calculateGridLayout({
      itemCount: 5,
      cellSize: 100,
      columns: 3,
      gap: 10,
      padding: 20
    });

    expect(layout.width).toBe(360);
    expect(layout.height).toBe(250);
    expect(layout.cells[0]).toEqual({ index: 0, x: 20, y: 20, width: 100, height: 100 });
    expect(layout.cells[4]).toEqual({
      index: 4,
      x: 130,
      y: 130,
      width: 100,
      height: 100
    });
  });

  it("supports rectangular cell dimensions", () => {
    const layout = calculateGridLayout({
      itemCount: 4,
      cellSize: { width: 160, height: 90 },
      columns: 2,
      gap: 8,
      padding: 12
    });

    expect(layout.width).toBe(352);
    expect(layout.height).toBe(212);
    expect(layout.cells[3]).toEqual({ index: 3, x: 180, y: 110, width: 160, height: 90 });
  });

  it("rejects cell size combined with canvas dimensions", () => {
    const options = {
      itemCount: 1,
      cellSize: 100,
      width: 500,
      height: 500
    } as unknown as GridLayoutOptions;

    expect(() => calculateGridLayout(options)).toThrow(
      "cellSize cannot be combined with width or height"
    );
  });

  it("rejects invalid dimensions", () => {
    expect(() =>
      calculateGridLayout({
        itemCount: 1,
        width: 0,
        height: 100
      })
    ).toThrow("width must be a positive number");

    expect(() =>
      calculateGridLayout({
        itemCount: 1,
        cellSize: { width: 100, height: 0 }
      })
    ).toThrow("cellSize.height must be a positive number");
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
