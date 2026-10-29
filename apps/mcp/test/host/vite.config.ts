import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

// Serves the test host (test/host) on :5199
export default defineConfig({
  root: path.dirname(fileURLToPath(import.meta.url)),
  server: { port: 5199, strictPort: true },
});
