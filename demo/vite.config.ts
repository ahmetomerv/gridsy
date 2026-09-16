import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/gridsy/",
  plugins: [react()],
  resolve: {
    alias: {
      gridsy: resolve(__dirname, "../src/index.ts")
    }
  }
});
