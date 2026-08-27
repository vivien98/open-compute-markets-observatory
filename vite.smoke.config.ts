import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url));

/** SSR bundle used only by `npm run test:pages` to smoke-render every page. */
export default defineConfig({
  plugins: [react()],
  base: "/open-compute-markets-observatory/",
  build: {
    ssr: resolve("./web/smoke-entry.tsx"),
    outDir: resolve("./dist-smoke"),
    emptyOutDir: true,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
    },
  },
});
