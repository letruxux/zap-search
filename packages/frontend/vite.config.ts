import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    /* https://vitejs.dev/config/build-options.html#build-outdir */
    outDir: "./../backend/dist",
    assetsDir: "assets",
    rollupOptions: {
      input: "index.html",
    },
  },
  resolve: {
    alias: {
      shared: path.resolve(__dirname, "../shared"), // Adjust relative path as needed
    },
  },
});
