/** Small shared helpers for the data adapters. No dependencies. */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const UA = "open-compute-markets-observatory/1.0 (+https://github.com/vivien98/open-compute-markets-observatory)";

/** GET with a timeout, a descriptive User-Agent, and two retries on network errors and 5xx/429. */
export async function get(url, { as = "json", headers = {}, timeoutMs = 25000, retries = 2 } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "user-agent": UA, accept: as === "json" ? "application/json" : "text/csv,text/plain,*/*", ...headers },
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`);
      if (!res.ok) { const e = new Error(`HTTP ${res.status}`); e.permanent = true; throw e; }
      return as === "json" ? await res.json() : await res.text();
    } catch (error) {
      lastError = error;
      if (error.permanent || attempt === retries) break;
      await sleep(800 * (attempt + 1));
    }
  }
  throw new Error(`${new URL(url).host}: ${lastError?.message ?? "request failed"}`);
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const today = () => new Date().toISOString().slice(0, 10);
export const num = (v) => { const n = typeof v === "number" ? v : Number.parseFloat(v); return Number.isFinite(n) ? n : null; };
export const round = (v, dp = 4) => (v === null || v === undefined ? null : Math.round(v * 10 ** dp) / 10 ** dp);

/** Linear-interpolated quantile of an ascending-sorted array. */
export function quantile(sorted, q) {
  if (!sorted.length) return null;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

/**
 * Appends rows to a CSV keyed on its first `keyCols` columns: a row whose key
 * already exists replaces the old one, so re-running on the same day is
 * idempotent. This is how the observatory keeps history for sources whose APIs
 * only ever return "now".
 */
export function upsertCsv(path, header, rows, keyCols = 2) {
  mkdirSync(dirname(path), { recursive: true });
  const existing = existsSync(path) ? readFileSync(path, "utf8").trim().split("\n").slice(1).filter(Boolean) : [];
  const key = (cells) => cells.slice(0, keyCols).join(",");
  const map = new Map(existing.map((line) => [key(line.split(",")), line]));
  for (const row of rows) {
    const cells = row.map((c) => (c === null || c === undefined ? "" : String(c).replace(/[,\n]/g, " ")));
    map.set(key(cells), cells.join(","));
  }
  const body = [...map.values()].sort();
  writeFileSync(path, [header.join(","), ...body].join("\n") + "\n");
  return body.length;
}

export function readCsv(path) {
  if (!existsSync(path)) return [];
  const [head, ...lines] = readFileSync(path, "utf8").trim().split("\n");
  const cols = head.split(",");
  return lines.filter(Boolean).map((line) => Object.fromEntries(line.split(",").map((c, i) => [cols[i], c])));
}
