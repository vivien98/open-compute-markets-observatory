/**
 * Static entry point for the GitHub Pages build.
 *
 * The dashboard is a self-contained client component with no data fetching,
 * so it renders identically here and under the Cloudflare Worker build in
 * `vite.config.ts`. This entry exists only so Vite can emit a plain static
 * bundle; it does not replace the app-router entry.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Dashboard from "../app/Dashboard";
import "../app/globals.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root container #root not found");

createRoot(container).render(
  <StrictMode>
    <Dashboard />
  </StrictMode>,
);
