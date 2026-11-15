import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  // "artifact" mode: a self-contained build with relative paths and fixed file names, for hosted previews.
  ...(mode === "artifact"
    ? {
        base: "./",
        build: {
          outDir: "dist-artifact",
          rollupOptions: { output: { entryFileNames: "assets/app.js", assetFileNames: "assets/[name][extname]" } },
        },
      }
    : {}),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
