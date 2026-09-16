import { vi } from "vitest";

const canvasContext = {
  fillStyle: "#000000",
  setTransform: vi.fn(),
  fillRect: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  rect: vi.fn(),
  roundRect: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  quadraticCurveTo: vi.fn(),
  closePath: vi.fn(),
  clip: vi.fn()
};

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  configurable: true,
  value: vi.fn(() => canvasContext)
});

Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
  configurable: true,
  value(callback: BlobCallback, type = "image/png") {
    callback(new Blob(["mock-canvas"], { type }));
  }
});

Object.defineProperty(HTMLCanvasElement.prototype, "toDataURL", {
  configurable: true,
  value(type = "image/png") {
    return `data:${type};base64,bW9jay1jYW52YXM=`;
  }
});

class MockImage extends EventTarget {
  crossOrigin: "" | "anonymous" | "use-credentials" | null = null;
  complete = false;
  naturalWidth = 200;
  naturalHeight = 100;
  onload: ((this: GlobalEventHandlers, event: Event) => unknown) | null = null;
  onerror: OnErrorEventHandler = null;
  private currentSrc = "";

  get src(): string {
    return this.currentSrc;
  }

  set src(value: string) {
    this.currentSrc = value;

    queueMicrotask(() => {
      if (value.includes("fail")) {
        const event = new Event("error");
        this.onerror?.(event, "", 0, 0, new Error("Mock image failed"));
        this.dispatchEvent(event);
        return;
      }

      this.complete = true;
      const event = new Event("load");
      this.onload?.call(this as unknown as GlobalEventHandlers, event);
      this.dispatchEvent(event);
    });
  }

  get width(): number {
    return this.naturalWidth;
  }

  get height(): number {
    return this.naturalHeight;
  }
}

vi.stubGlobal("Image", MockImage);

if (!URL.createObjectURL) {
  vi.stubGlobal("URL", {
    ...URL,
    createObjectURL: vi.fn(() => "blob:mock"),
    revokeObjectURL: vi.fn()
  });
} else {
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock");
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
}
