import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const demoOutput = resolve(projectRoot, "demo/dist");
const generatedPublic = resolve(projectRoot, "docs/.generated-public");

await rm(generatedPublic, { force: true, recursive: true });
await mkdir(generatedPublic, { recursive: true });
await cp(
  resolve(projectRoot, "demo/public/gridsy-icon.svg"),
  resolve(generatedPublic, "gridsy-icon.svg")
);
await cp(demoOutput, resolve(generatedPublic, "demo"), { recursive: true });
