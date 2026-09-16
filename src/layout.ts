import type { CellDimensions, CellSize, GridLayout, GridLayoutOptions } from "./types";

export function calculateGridLayout(options: GridLayoutOptions): GridLayout {
  const itemCount = Math.max(0, Math.floor(options.itemCount));
  const gap = nonNegativeNumber(options.gap ?? 0, "gap");
  const padding = nonNegativeNumber(options.padding ?? 0, "padding");

  const columns = resolveColumns(itemCount, options.columns, options.rows);
  const rows = resolveRows(itemCount, columns, options.rows);
  const dimensions = resolveDimensions(options, columns, rows, gap, padding);
  const { width, height } = dimensions;
  const visibleCount = Math.min(itemCount, columns * rows);
  const drawableWidth = Math.max(0, width - padding * 2 - gap * Math.max(0, columns - 1));
  const drawableHeight = Math.max(0, height - padding * 2 - gap * Math.max(0, rows - 1));
  const cellWidth =
    dimensions.cellSize?.width ?? (columns > 0 ? drawableWidth / columns : 0);
  const cellHeight =
    dimensions.cellSize?.height ?? (rows > 0 ? drawableHeight / rows : 0);

  return {
    width,
    height,
    columns,
    rows,
    gap,
    padding,
    cells: Array.from({ length: visibleCount }, (_, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);

      return {
        index,
        x: padding + column * (cellWidth + gap),
        y: padding + row * (cellHeight + gap),
        width: cellWidth,
        height: cellHeight
      };
    })
  };
}

function resolveDimensions(
  options: GridLayoutOptions,
  columns: number,
  rows: number,
  gap: number,
  padding: number
): { width: number; height: number; cellSize?: CellDimensions } {
  if (options.cellSize !== undefined) {
    if (options.width !== undefined || options.height !== undefined) {
      throw new TypeError("cellSize cannot be combined with width or height.");
    }

    const cellSize = normalizeCellSize(options.cellSize);

    return {
      width: padding * 2 + columns * cellSize.width + Math.max(0, columns - 1) * gap,
      height: padding * 2 + rows * cellSize.height + Math.max(0, rows - 1) * gap,
      cellSize
    };
  }

  return {
    width: positiveNumber(options.width, "width"),
    height: positiveNumber(options.height, "height")
  };
}

function normalizeCellSize(cellSize: CellSize): CellDimensions {
  if (typeof cellSize === "number") {
    const size = positiveNumber(cellSize, "cellSize");
    return { width: size, height: size };
  }

  if (!cellSize || typeof cellSize !== "object") {
    throw new TypeError(
      "cellSize must be a positive number or an object with width and height."
    );
  }

  return {
    width: positiveNumber(cellSize.width, "cellSize.width"),
    height: positiveNumber(cellSize.height, "cellSize.height")
  };
}

function resolveColumns(itemCount: number, columns?: number, rows?: number): number {
  if (columns !== undefined) {
    return positiveInteger(columns, "columns");
  }

  if (rows !== undefined) {
    return Math.max(1, Math.ceil(itemCount / positiveInteger(rows, "rows")));
  }

  return Math.max(1, Math.ceil(Math.sqrt(itemCount || 1)));
}

function resolveRows(itemCount: number, columns: number, rows?: number): number {
  if (rows !== undefined) {
    return positiveInteger(rows, "rows");
  }

  return Math.max(1, Math.ceil(itemCount / columns));
}

function positiveNumber(value: number, name: string): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive number.`);
  }

  return value;
}

function nonNegativeNumber(value: number, name: string): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a non-negative number.`);
  }

  return value;
}

function positiveInteger(value: number, name: string): number {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive integer.`);
  }

  return value;
}
