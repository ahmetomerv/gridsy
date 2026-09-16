import type { GridCell, ImageFit, ObjectFitRect } from "./types";

export function drawImageInCell(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  cell: GridCell,
  fit: ImageFit,
  borderRadius = 0
): void {
  const rect = getObjectFitRect(
    image.naturalWidth || image.width,
    image.naturalHeight || image.height,
    cell.x,
    cell.y,
    cell.width,
    cell.height,
    fit
  );

  context.save();
  clipRoundedRect(context, cell.x, cell.y, cell.width, cell.height, borderRadius);
  context.drawImage(
    image,
    rect.sx,
    rect.sy,
    rect.sw,
    rect.sh,
    rect.dx,
    rect.dy,
    rect.dw,
    rect.dh
  );
  context.restore();
}

export function drawPlaceholder(
  context: CanvasRenderingContext2D,
  cell: GridCell,
  color: string,
  borderRadius = 0
): void {
  context.save();
  clipRoundedRect(context, cell.x, cell.y, cell.width, cell.height, borderRadius);
  context.fillStyle = color;
  context.fillRect(cell.x, cell.y, cell.width, cell.height);
  context.restore();
}

export function getObjectFitRect(
  imageWidth: number,
  imageHeight: number,
  x: number,
  y: number,
  width: number,
  height: number,
  fit: ImageFit
): ObjectFitRect {
  if (imageWidth <= 0 || imageHeight <= 0 || width <= 0 || height <= 0) {
    return { sx: 0, sy: 0, sw: 0, sh: 0, dx: x, dy: y, dw: 0, dh: 0 };
  }

  if (fit === "contain") {
    const scale = Math.min(width / imageWidth, height / imageHeight);
    const drawWidth = imageWidth * scale;
    const drawHeight = imageHeight * scale;

    return {
      sx: 0,
      sy: 0,
      sw: imageWidth,
      sh: imageHeight,
      dx: x + (width - drawWidth) / 2,
      dy: y + (height - drawHeight) / 2,
      dw: drawWidth,
      dh: drawHeight
    };
  }

  const sourceAspect = imageWidth / imageHeight;
  const targetAspect = width / height;

  if (sourceAspect > targetAspect) {
    const sourceWidth = imageHeight * targetAspect;

    return {
      sx: (imageWidth - sourceWidth) / 2,
      sy: 0,
      sw: sourceWidth,
      sh: imageHeight,
      dx: x,
      dy: y,
      dw: width,
      dh: height
    };
  }

  const sourceHeight = imageWidth / targetAspect;

  return {
    sx: 0,
    sy: (imageHeight - sourceHeight) / 2,
    sw: imageWidth,
    sh: sourceHeight,
    dx: x,
    dy: y,
    dw: width,
    dh: height
  };
}

function clipRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  const safeRadius = Math.max(0, Math.min(radius, width / 2, height / 2));

  context.beginPath();

  if (safeRadius === 0) {
    context.rect(x, y, width, height);
  } else {
    context.moveTo(x + safeRadius, y);
    context.lineTo(x + width - safeRadius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
    context.lineTo(x + width, y + height - safeRadius);
    context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
    context.lineTo(x + safeRadius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
    context.lineTo(x, y + safeRadius);
    context.quadraticCurveTo(x, y, x + safeRadius, y);
  }

  context.closePath();
  context.clip();
}
