/**
 * Refreshes the observatory's data snapshot from public, keyless sources.
 *
 *   node scripts/fetch-data.mjs          live fetch (what the scheduled job runs)
 *   node scripts/fetch-data.mjs --seed   build from the recorded capture, no network
 *
 * Output:
 *   app/content/live/snapshot.json   what the site renders (latest values + series)
 *   data/history/*.csv               one row per day per item, appended forever
 *
 * Design rules:
 *   - Fail soft. A feed that errors keeps its previous data and is marked stale;
 *     the script exits 0 so the site still builds and deploys.
 *   - No secrets required. ALPHAVANTAGE_API_KEY is optional and only adds equities.
 *   - History is the point. Most of these APIs only return "now", so the daily
 *     rows written here become series nobody else publishes.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";

import * as A from "./data/adapters.mjs";
import { readCsv, round, today, upsertCsv } from "./data/lib.mjs";

const SEED = process.argv.includes("--seed");
const SNAPSHOT = "app/content/live/snapshot.json";
const HISTORY = "data/history";
const now = new Date().toISOString();

const previous = existsSync(SNAPSHOT) ? JSON.parse(readFileSync(SNAPSHOT, "utf8")) : {};
const snapshot = {
  generatedAt: now,
  feeds: [],
  series: { ...(previous.series ?? {}) },
  tokens: previous.tokens ?? null,
  gpu: previous.gpu ?? null,
  ladders: previous.ladders ?? null,
  power: previous.power ?? null,
  twse: previous.twse ?? null,
};

let seed;
if (SEED) seed = await import("./data/seed-capture.mjs");
const day = SEED ? seed.CAPTURED_ON : today();

const pending = () => Object.assign(new Error("not in the recorded capture; fills on the first live run"), { pending: true });

/** Runs one feed, records its status, and never throws. */
async function feed(id, label, url, run) {
  const prior = (previous.feeds ?? []).find((f) => f.id === id);
  try {
    const { asOf, note } = await run();
    snapshot.feeds.push({ id, label, url, state: SEED ? "seed" : "live", asOf: asOf ?? day, fetchedAt: now, note });
    console.log(`  ok      ${label.padEnd(34)} ${note}`);
  } catch (error) {
    const hadData = prior && ["live", "seed", "stale"].includes(prior.state);
    snapshot.feeds.push({
      id, label, url,
      state: error.needsKey ? "needs-key" : error.pending ? "pending" : hadData ? "stale" : "failed",
      asOf: prior?.asOf ?? null, fetchedAt: now, note: String(error.message).slice(0, 160),
    });
    console.log(`  ${error.needsKey || error.pending ? "skipped" : "FAILED "} ${label.padEnd(34)} ${error.message}`);
  }
}

console.log(`${SEED ? "Seeding from recorded capture" : "Fetching live data"} (${day})`);

await feed("tokens", "OpenRouter provider quotes", "https://openrouter.ai/api/v1/models", async () => {
  let result;
  if (SEED) {
    const models = A.pickOpenModels(seed.openrouterModels)
      .map((c) => A.parseEndpoints(seed.openrouterEndpoints[c.id], c)).filter(Boolean)
      .sort((a, b) => b.providers - a.providers);
    result = { models, scanned: models.length };
  } else result = await A.fetchTokens();
  snapshot.tokens = { asOf: day, models: result.models };
  const rows = [];
  for (const m of result.models) {
    const std = m.endpoints.filter((e) => !e.tier || e.tier === "default" || e.tier === "standard");
    const pool = std.length ? std : m.endpoints;
    rows.push([day, m.id, m.providers, m.list.input, m.list.output, m.list.cached,
      Math.min(...pool.map((e) => e.input)), Math.min(...pool.map((e) => e.output))]);
  }
  upsertCsv(`${HISTORY}/token_quotes.csv`, ["date", "model", "providers", "list_input", "list_output", "list_cached", "min_input", "min_output"], rows);
  const endpointRows = result.models.flatMap((m) => m.endpoints.map((e) => [day, `${m.id}|${e.tag || e.provider}`, e.provider, e.tier ?? "", e.input, e.output, e.cached]));
  upsertCsv(`${HISTORY}/token_endpoints.csv`, ["date", "model_endpoint", "provider", "tier", "input", "output", "cached"], endpointRows);
  return { note: `${result.models.length} models, ${result.models.reduce((n, m) => n + m.endpoints.length, 0)} endpoints` };
});

await feed("gpu", "Vast.ai marketplace asks", "https://console.vast.ai/api/v0/bundles/", async () => {
  let skus;
  if (SEED) {
    skus = [["H100", "H100 SXM"], ["H200", "H200"], ["B200", "B200"]]
      .map(([sku, name]) => ({ sku, ...A.parseOffers(seed.vastOffers[name].offers) }));
  } else skus = (await A.fetchGpuAsks()).skus;
  snapshot.gpu = { asOf: day, skus };
  upsertCsv(`${HISTORY}/gpu_asks.csv`, ["date", "sku", "offers", "gpus", "min", "p25", "median", "p75", "max"],
    skus.map((s) => [day, s.sku, s.offers, s.gpus, s.min, s.p25, s.median, s.p75, s.max]));
  return { note: skus.map((s) => `${s.sku} $${s.median.toFixed(2)} (${s.offers})`).join(", ") };
});

await feed("ladders", "Kalshi strike ladders", "https://api.elections.kalshi.com/trade-api/v2/series/KXH100MS", async () => {
  let curves;
  if (SEED) curves = [{ ...A.KALSHI_SERIES[0], events: A.parseLadders(seed.kalshiMarkets.KXH100MS.markets) }];
  else curves = (await A.fetchLadders()).curves;
  snapshot.ladders = { asOf: day, curves };
  upsertCsv(`${HISTORY}/ladders.csv`, ["date", "event", "series", "month", "median", "median_bid", "median_ask", "mean", "volume", "open_interest"],
    curves.flatMap((c) => c.events.map((e) => [day, e.event, c.label, e.month, e.median.value, e.medianBid, e.medianAsk, e.mean, e.volume, e.openInterest])));
  const quoted = curves.flatMap((c) => c.events.map((e) => e.quotedAt)).filter(Boolean).sort().pop();
  return { asOf: quoted ?? day, note: curves.map((c) => `${c.label}: ${c.events.length} months`).join(", ") };
});

await feed("sofr", "New York Fed SOFR", "https://markets.newyorkfed.org/api/rates/secured/sofr/last/260.json", async () => {
  const points = SEED ? A.parseSofr(seed.nyfedSofr) : (await A.fetchSofr()).points;
  snapshot.series.SOFR = { label: "SOFR", unit: "%", source: "New York Fed", url: "https://www.newyorkfed.org/markets/reference-rates/sofr", points };
  return { asOf: points.at(-1)[0], note: `${points.at(-1)[1].toFixed(2)}%` };
});

await feed("fred", "FRED rates, spreads, FX", "https://fred.stlouisfed.org/", async () => {
  if (SEED) throw pending();
  const { series, failed } = await A.fetchFred();
  for (const [key, value] of Object.entries(series)) {
    // The New York Fed feed is the primary SOFR source; FRED only fills it if that feed is down.
    if (key === "SOFR" && snapshot.feeds.some((f) => f.id === "sofr" && f.state === "live")) continue;
    snapshot.series[key] = value;
  }
  const latest = Object.values(series).map((s) => s.points.at(-1)[0]).sort().pop();
  return { asOf: latest, note: `${Object.keys(series).length} series${failed.length ? `, missing ${failed.join(" ")}` : ""}` };
});

await feed("power", "ERCOT hub prices", "https://www.ercot.com/api/1/services/read/dashboards/systemWidePrices.json", async () => {
  const power = SEED ? A.parseErcot(seed.ercot) : await A.fetchErcot();
  snapshot.power = power;
  const date = power.asOf ?? day;
  upsertCsv(`${HISTORY}/ercot_hub.csv`, ["date", "market", "day_ahead_avg", "real_time_avg", "real_time_min", "real_time_max"],
    [[date, "HB_HUBAVG", power.dayAheadAvg, power.realTimeAvg, power.realTimeMin, power.realTimeMax]]);
  return { asOf: date, note: `real-time $${power.realTimeLatest}/MWh${power.dayAheadAvg ? `, day-ahead avg $${power.dayAheadAvg}` : ""}` };
});

await feed("twse", "TWSE monthly revenue", "https://openapi.twse.com.tw/v1/opendata/t187ap05_L", async () => {
  if (SEED) throw pending();
  const twse = await A.fetchTwse();
  snapshot.twse = twse;
  upsertCsv(`${HISTORY}/twse_revenue.csv`, ["month", "code", "name", "revenue_ntd_bn", "yoy_pct", "mom_pct"],
    twse.companies.map((c) => [twse.month, c.code, c.name, c.revenue, c.yoy, c.mom]));
  return { asOf: twse.month, note: twse.companies.map((c) => `${c.name} ${c.yoy >= 0 ? "+" : ""}${c.yoy}%`).slice(0, 4).join(", ") };
});

await feed("equities", "Chain equities (optional key)", "https://www.alphavantage.co/", async () => {
  const key = process.env.ALPHAVANTAGE_API_KEY;
  if (SEED || !key) { const e = new Error("set the ALPHAVANTAGE_API_KEY repository secret to enable"); e.needsKey = true; throw e; }
  const { series } = await A.fetchEquities(key);
  Object.assign(snapshot.series, series);
  return { asOf: Object.values(series).map((s) => s.points.at(-1)[0]).sort().pop(), note: `${Object.keys(series).length} symbols` };
});

/* ---- Series built from our own history -------------------------------- */

const own = (key, label, unit, source, url, rows, pick) => {
  const points = rows.map((r) => [r.date, Number(pick(r))]).filter((p) => Number.isFinite(p[1])).sort((a, b) => a[0].localeCompare(b[0]));
  if (points.length) snapshot.series[key] = { label, unit, source, url, points: points.slice(-400), own: true };
};
const gpuRows = readCsv(`${HISTORY}/gpu_asks.csv`);
for (const sku of new Set(gpuRows.map((r) => r.sku))) {
  own(`GPU_${sku.replace(/\W/g, "")}`, `${sku} marketplace ask, median`, "$/GPU-hour", "Vast.ai (observatory history)", "https://vast.ai/",
    gpuRows.filter((r) => r.sku === sku), (r) => r.median);
}
const tokenRows = readCsv(`${HISTORY}/token_quotes.csv`);
const reference = snapshot.tokens?.models?.[0];
if (reference) {
  const rows = tokenRows.filter((r) => r.model === reference.id);
  const url = `https://openrouter.ai/${reference.id}`;
  own("TOK_REF_MIN_OUTPUT", `${reference.name}: cheapest output ask`, "$/M tokens", "OpenRouter (observatory history)", url, rows, (r) => r.min_output);
  own("TOK_REF_LIST_OUTPUT", `${reference.name}: list output price`, "$/M tokens", "OpenRouter (observatory history)", url, rows, (r) => r.list_output);
  own("TOK_REF_PROVIDERS", `${reference.name}: providers`, "count", "OpenRouter (observatory history)", url, rows, (r) => r.providers);
}
const ercotRows = readCsv(`${HISTORY}/ercot_hub.csv`);
own("ERCOT_HUB", "ERCOT hub average", "$/MWh", "ERCOT (observatory history)", "https://www.ercot.com/mktinfo/prices", ercotRows, (r) => r.day_ahead_avg || r.real_time_avg);
const twseRows = readCsv(`${HISTORY}/twse_revenue.csv`);
for (const code of new Set(twseRows.map((r) => r.code))) {
  const rows = twseRows.filter((r) => r.code === code).map((r) => ({ ...r, date: `${r.month}-01` }));
  own(`TWSE_${code}_YOY`, `${rows[0].name} monthly revenue, year over year`, "%", "TWSE (observatory history)", "https://openapi.twse.com.tw/", rows, (r) => r.yoy_pct);
}
const ladderRows = readCsv(`${HISTORY}/ladders.csv`).filter((r) => r.series === "H100");
const frontByDate = new Map();
for (const r of ladderRows.sort((a, b) => a.month.localeCompare(b.month))) if (!frontByDate.has(r.date)) frontByDate.set(r.date, r);
own("LADDER_H100_FRONT", "H100 front-month implied median", "$/GPU-hour", "Kalshi (observatory history)", "https://kalshi.com/", [...frontByDate.values()], (r) => r.median);

// Keep the file small: at most 400 points per series, values rounded.
for (const s of Object.values(snapshot.series)) s.points = s.points.slice(-400).map(([d, v]) => [d, round(v, 4)]);

mkdirSync("app/content/live", { recursive: true });
writeFileSync(SNAPSHOT, JSON.stringify(snapshot, null, 1) + "\n");

const live = snapshot.feeds.filter((f) => f.state === "live" || f.state === "seed").length;
console.log(`\n${live}/${snapshot.feeds.length} feeds current · ${Object.keys(snapshot.series).length} series · snapshot ${(JSON.stringify(snapshot).length / 1024).toFixed(0)} KB`);
