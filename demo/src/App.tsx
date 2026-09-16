import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { downloadCanvas, ImageFit, ImageInput, renderImageGrid } from "gridsy";

const sampleImageUrl = "https://farm2.staticflickr.com/1853/29870511967_321daf808f_o.jpg";
const sampleImages = Array.from({ length: 6 }, () => sampleImageUrl);

export default function App() {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [urlText, setUrlText] = useState(sampleImages.join("\n"));
  const [files, setFiles] = useState<File[]>([]);
  const [columns, setColumns] = useState(3);
  const [cellSize, setCellSize] = useState(300);
  const [gap, setGap] = useState(10);
  const [padding, setPadding] = useState(24);
  const [background, setBackground] = useState("#f3f4f6");
  const [fit, setFit] = useState<ImageFit>("cover");
  const [failedCount, setFailedCount] = useState(0);
  const [isRendering, setIsRendering] = useState(false);

  const images = useMemo<ImageInput[]>(
    () => [
      ...urlText
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean),
      ...files
    ],
    [files, urlText]
  );

  useEffect(() => {
    let isActive = true;

    async function renderPreview() {
      setIsRendering(true);

      try {
        const result = await renderImageGrid({
          images,
          cellSize,
          columns,
          gap,
          padding,
          background,
          fit,
          borderRadius: 18,
          pixelRatio: 2,
          fallbackColor: "#d1d5db",
          crossOrigin: "anonymous"
        });

        if (!isActive) {
          return;
        }

        canvasRef.current = result.canvas;
        setFailedCount(result.failed.length);
        canvasHostRef.current?.replaceChildren(result.canvas);
      } finally {
        if (isActive) {
          setIsRendering(false);
        }
      }
    }

    void renderPreview();

    return () => {
      isActive = false;
    };
  }, [background, cellSize, columns, files, fit, gap, images, padding]);

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(event.target.files ?? []));
  }

  async function handleDownload() {
    if (canvasRef.current) {
      await downloadCanvas(canvasRef.current, "gridsy-grid.png");
    }
  }

  return (
    <main>
      <h1>gridsy demo</h1>

      <form>
        <table>
          <tbody>
            <tr>
              <td>
                <label htmlFor="image-urls">Image URLs</label>
                <br />
                <textarea
                  id="image-urls"
                  value={urlText}
                  onChange={(event) => setUrlText(event.target.value)}
                  spellCheck={false}
                  rows={10}
                  cols={80}
                />
              </td>
              <td>
                <label htmlFor="local-images">Local images</label>
                <br />
                <input
                  id="local-images"
                  accept="image/*"
                  multiple
                  onChange={handleFiles}
                  type="file"
                />
              </td>
              <td>
                <label htmlFor="columns">Columns</label>
                <br />
                <input
                  id="columns"
                  min="1"
                  max="12"
                  onChange={(event) => setColumns(Number(event.target.value))}
                  type="number"
                  value={columns}
                />
              </td>
              <td>
                <label htmlFor="gap">Gap</label>
                <br />
                <input
                  id="gap"
                  min="0"
                  max="80"
                  onChange={(event) => setGap(Number(event.target.value))}
                  type="number"
                  value={gap}
                />
              </td>
              <td>
                <label htmlFor="cell-size">Size</label>
                <br />
                <input
                  id="cell-size"
                  min="1"
                  max="1200"
                  onChange={(event) => setCellSize(Number(event.target.value))}
                  type="number"
                  value={cellSize}
                />
              </td>
              <td>
                <label htmlFor="padding">Padding</label>
                <br />
                <input
                  id="padding"
                  min="0"
                  max="120"
                  onChange={(event) => setPadding(Number(event.target.value))}
                  type="number"
                  value={padding}
                />
              </td>
              <td>
                <label htmlFor="background">Background</label>
                <br />
                <input
                  id="background"
                  onChange={(event) => setBackground(event.target.value)}
                  type="color"
                  value={background}
                />
              </td>
              <td>
                <fieldset>
                  <legend>Fit</legend>
                  <label>
                    <input
                      checked={fit === "cover"}
                      name="fit"
                      onChange={() => setFit("cover")}
                      type="radio"
                      value="cover"
                    />
                    Cover
                  </label>
                  <br />
                  <label>
                    <input
                      checked={fit === "contain"}
                      name="fit"
                      onChange={() => setFit("contain")}
                      type="radio"
                      value="contain"
                    />
                    Contain
                  </label>
                </fieldset>
              </td>
              <td>
                <button onClick={handleDownload} type="button">
                  Download PNG
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      <p>
        {isRendering ? "Rendering..." : `${images.length} images`}
        {failedCount > 0 ? `, ${failedCount} failed` : ""}
      </p>

      <section aria-label="Canvas preview">
        <div ref={canvasHostRef} />
      </section>
    </main>
  );
}
