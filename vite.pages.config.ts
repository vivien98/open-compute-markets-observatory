import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/postcss";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url));

/**
 * Static build used for GitHub Pages.
 *
 * The Cloudflare/vinext build in `vite.config.ts` is unchanged and remains the
 * deployment path for the server-rendered app. This config emits a plain SPA
 * bundle of the same dashboard, which is possible only because `Dashboard.tsx`
 * holds its data inline and performs no server or database access.
 *
 * `base` must match the repository name so asset URLs resolve under
 * `https://<user>.github.io/<repo>/`.
 */
export default defineConfig({
  root: resolve("./web"),
  publicDir: resolve("./public"),
  base: process.env.PAGES_BASE ?? "/open-compute-markets-observatory/",
  plugins: [react()],
  // Point PostCSS at this file explicitly: Vite resolves postcss config from
  // `root`, which is `web/`, not the project root where the config lives.
  css: { postcss: { plugins: [tailwindcss()] } },
  build: {
    outDir: resolve("./dist-pages"),
    emptyOutDir: true,
    rollupOptions: {
      // `Dashboard.tsx` carries a "use client" directive for the RSC build.
      // It is meaningless in a plain SPA bundle and Rollup warns about it.
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
    },
  },
});
