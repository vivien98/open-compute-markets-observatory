/**
 * Source adapters. Each one is a pure `parse*` function (tested against
 * recorded fixtures) plus a thin `fetch*` wrapper that does the HTTP.
 *
 * Every source here is public and needs no API key. Response shapes were
 * confirmed against the live endpoints in November 2026; see data/README.md.
 */
import { get, num, quantile, round, sleep } from "./lib.mjs";

/* ------------------------------------------------------------------ */
/* OpenRouter: per-provider token prices for open-weight models        */
/* ------------------------------------------------------------------ */

const perMillion = (v) => { const n = num(v); return n === null ? null : round(n * 1e6, 6); };
const squash = (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
/** Builders whose models are open weights even if the listing omits a Hugging Face id. */
const OPEN_PREFIXES = ["z-ai/", "moonshotai/", "deepseek/", "minimax/", "qwen/", "xiaomi/", "meta-llama/", "openai/gpt-oss", "google/gemma", "nvidia/", "stepfun", "tencent/"];

/** Picks the open-weight models worth asking for endpoints: newest first, no variants. */
export function pickOpenModels(modelsJson, limit = 40) {
  const data = modelsJson?.data ?? [];
  return data
    .filter((m) => typeof m.id === "string" && !m.id.includes(":"))
    .filter((m) => (m.hugging_face_id && m.hugging_face_id.length > 0) || OPEN_PREFIXES.some((p) => m.id.startsWith(p)))
    .sort((a, b) => (b.created ?? 0) - (a.created ?? 0))
    .slice(0, limit)
    .map((m) => ({ id: m.id, name: m.name, created: m.created ?? null, timeOfDay: Boolean(m.pricing?.overrides) }));
}

/** One model's endpoints response → normalised quotes in dollars per million tokens. */
export function parseEndpoints(json, meta = {}) {
  const d = json?.data;
  if (!d || !Array.isArray(d.endpoints)) return null;
  const author = String(d.id ?? meta.id ?? "").split("/")[0];
  const endpoints = d.endpoints
    .map((e) => ({
      provider: e.provider_name ?? "unknown",
      tag: e.tag ?? "",
      tier: e.service_tier ?? null,
      quant: e.quantization ?? null,
      input: perMillion(e.pricing?.prompt),
      output: perMillion(e.pricing?.completion),
      cached: perMillion(e.pricing?.input_cache_read),
      uptime: num(e.uptime_last_30m),
      status: num(e.status),
      timeOfDay: Boolean(e.pricing?.overrides),
    }))
    .filter((e) => e.input !== null && e.output !== null && e.input > 0 && e.output > 0);
  if (!endpoints.length) return null;

  // The builder's own standard-tier endpoint, if it serves its model here.
  const own = endpoints
    .filter((e) => squash(e.provider) === squash(author) && (!e.tier || e.tier === "default" || e.tier === "standard"))
    .sort((a, b) => a.input - b.input)[0];
  // Otherwise the most common (input, output) pair is the de facto list price.
  const counts = new Map();
  for (const e of endpoints) { const k = `${e.input}|${e.output}`; counts.set(k, (counts.get(k) ?? 0) + 1); }
  const [modeKey, modeN] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  const mode = endpoints.find((e) => `${e.input}|${e.output}` === modeKey);
  const list = own ?? mode;

  return {
    id: d.id ?? meta.id,
    name: d.name ?? meta.name ?? d.id,
    created: d.created ?? meta.created ?? null,
    author,
    list: { input: list.input, output: list.output, cached: list.cached, from: own ? "builder" : "mode", copies: modeN },
    providers: new Set(endpoints.map((e) => e.provider)).size,
    timeOfDay: Boolean(meta.timeOfDay) || endpoints.some((e) => e.timeOfDay),
    endpoints: endpoints.sort((a, b) => a.input - b.input),
  };
}

export async function fetchTokens({ maxModels = 40, keep = 8 } = {}) {
  const base = "https://openrouter.ai/api/v1";
  const candidates = pickOpenModels(await get(`${base}/models`), maxModels);
  const models = [];
  for (const c of candidates) {
    try {
      const parsed = parseEndpoints(await get(`${base}/models/${c.id}/endpoints`), c);
      if (parsed && parsed.providers >= 3) models.push(parsed);
    } catch { /* a single model failing is not a feed failure */ }
    await sleep(150);
  }
  if (!models.length) throw new Error("no open-weight model with three or more providers found");
  models.sort((a, b) => b.providers - a.providers || (b.created ?? 0) - (a.created ?? 0));
  return { models: models.slice(0, keep), scanned: candidates.length };
}

/* ------------------------------------------------------------------ */
/* Kalshi: strike ladders on monthly-average rental and memory prices  */
/* ------------------------------------------------------------------ */

export const KALSHI_SERIES = [
  { ticker: "KXH100MS", label: "H100", unit: "$/GPU-hour" },
  { ticker: "KXH200MS", label: "H200", unit: "$/GPU-hour" },
  { ticker: "KXB200MS", label: "B200", unit: "$/GPU-hour" },
  { ticker: "KXA100MS", label: "A100", unit: "$/GPU-hour" },
  { ticker: "KXRTX5090MS", label: "RTX 5090", unit: "$/GPU-hour" },
  { ticker: "KXDDR5MS", label: "DDR5 16Gb", unit: "$ spot" },
];

/** Makes a survival curve non-increasing in strike (thin quotes are not always consistent). */
function monotone(values) {
  const out = [...values];
  for (let i = 1; i < out.length; i++) if (out[i] > out[i - 1]) out[i] = out[i - 1];
  return out;
}

/** Strike at which the probability of finishing above crosses one half. */
function medianOf(strikes, surv) {
  if (!strikes.length) return { value: null, censored: null };
  if (surv[0] < 0.5) return { value: strikes[0], censored: "below" };
  if (surv[surv.length - 1] > 0.5) return { value: strikes[strikes.length - 1], censored: "above" };
  for (let i = 1; i < strikes.length; i++) {
    if (surv[i] <= 0.5) {
      const span = surv[i - 1] - surv[i];
      const t = span > 0 ? (surv[i - 1] - 0.5) / span : 0;
      return { value: round(strikes[i - 1] + t * (strikes[i] - strikes[i - 1]), 3), censored: null };
    }
  }
  return { value: strikes[strikes.length - 1], censored: null };
}

/** Area under the survival curve, with a flat head and an exponential tail. Tail-sensitive. */
function meanOf(strikes, surv) {
  if (strikes.length < 2) return null;
  let area = strikes[0];
  for (let i = 1; i < strikes.length; i++) area += ((surv[i - 1] + surv[i]) / 2) * (strikes[i] - strikes[i - 1]);
  const n = strikes.length - 1;
  const step = strikes[n] - strikes[n - 1];
  const rate = surv[n] > 0 && surv[n - 1] > surv[n] ? Math.log(surv[n - 1] / surv[n]) / step : null;
  area += rate ? surv[n] / rate : surv[n] * step;
  return round(area, 3);
}

/**
 * A list of binary "above strike" markets → one entry per settlement month,
 * with the implied median from mid, bid, and ask quotes. The bid/ask medians
 * bracket the mid and show how much the estimate owes to a single market maker.
 */
export function parseLadders(markets) {
  const byEvent = new Map();
  for (const m of markets ?? []) {
    if (m.strike_type && m.strike_type !== "greater") continue;
    const k = num(m.floor_strike);
    const bid = num(m.yes_bid_dollars);
    const ask = num(m.yes_ask_dollars);
    if (k === null || bid === null || ask === null || ask <= 0) continue;
    if (!byEvent.has(m.event_ticker)) byEvent.set(m.event_ticker, []);
    byEvent.get(m.event_ticker).push({
      k, bid, ask, last: num(m.last_price_dollars),
      volume: num(m.volume_fp) ?? 0, oi: num(m.open_interest_fp) ?? 0,
      close: m.close_time, updated: m.updated_time,
    });
  }
  const events = [];
  for (const [event, rows] of byEvent) {
    rows.sort((a, b) => a.k - b.k);
    if (rows.length < 3) continue;
    const strikes = rows.map((r) => r.k);
    const mid = monotone(rows.map((r) => (r.bid + r.ask) / 2));
    const bid = monotone(rows.map((r) => r.bid));
    const ask = monotone(rows.map((r) => r.ask));
    // Contracts close just after the month ends, so step back a day to name the month.
    const close = rows[0].close ? new Date(new Date(rows[0].close).getTime() - 36e5 * 24) : null;
    events.push({
      event,
      month: close ? close.toISOString().slice(0, 7) : null,
      median: medianOf(strikes, mid),
      medianBid: medianOf(strikes, bid).value,
      medianAsk: medianOf(strikes, ask).value,
      mean: meanOf(strikes, mid),
      volume: round(rows.reduce((n, r) => n + r.volume, 0), 0),
      openInterest: round(rows.reduce((n, r) => n + r.oi, 0), 0),
      quotedAt: rows.map((r) => r.updated).filter(Boolean).sort().pop()?.slice(0, 10) ?? null,
      strikes: rows.map((r, i) => ({ k: r.k, bid: r.bid, ask: r.ask, p: round(mid[i], 4) })),
    });
  }
  return events.filter((e) => e.month).sort((a, b) => a.month.localeCompare(b.month));
}

export async function fetchLadders() {
  const base = "https://api.elections.kalshi.com/trade-api/v2/markets";
  const curves = [];
  for (const series of KALSHI_SERIES) {
    try {
      const markets = [];
      let cursor = "";
      for (let page = 0; page < 10; page++) {
        const json = await get(`${base}?series_ticker=${series.ticker}&status=open&limit=200${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`);
        markets.push(...(json.markets ?? []));
        cursor = json.cursor ?? "";
        if (!cursor || !(json.markets ?? []).length) break;
        await sleep(200);
      }
      const events = parseLadders(markets);
      if (events.length) curves.push({ ...series, events });
    } catch { /* one series missing is not a feed failure */ }
  }
  if (!curves.length) throw new Error("no ladders returned");
  return { curves };
}

/* ------------------------------------------------------------------ */
/* Vast.ai: on-demand marketplace asks per accelerator                 */
/* ------------------------------------------------------------------ */

export const GPU_FAMILIES = [
  { sku: "H100", names: ["H100 SXM", "H100 NVL", "H100 PCIE"] },
  { sku: "H200", names: ["H200", "H200 NVL"] },
  { sku: "B200", names: ["B200"] },
  { sku: "B300", names: ["B300"] },
  { sku: "A100", names: ["A100 SXM4", "A100 PCIE", "A100X"] },
  { sku: "L40S", names: ["L40S"] },
  { sku: "RTX 5090", names: ["RTX 5090"] },
];

/**
 * Offers → hourly ask per accelerator. Each offer counts once: a host that
 * lists the same machine in 1-, 2-, 4- and 8-GPU slices would otherwise
 * dominate the distribution.
 */
export function parseOffers(offers) {
  const asks = [];
  let gpus = 0;
  let verified = 0;
  for (const o of offers ?? []) {
    const n = num(o.num_gpus);
    const total = num(o.dph_total);
    if (!n || !total || o.rentable === false) continue;
    asks.push(total / n);
    gpus += n;
    if (o.verification === "verified") verified += 1;
  }
  asks.sort((a, b) => a - b);
  if (!asks.length) return null;
  return {
    offers: asks.length,
    gpus,
    verifiedShare: round(verified / asks.length, 3),
    min: round(asks[0], 3),
    p25: round(quantile(asks, 0.25), 3),
    median: round(quantile(asks, 0.5), 3),
    p75: round(quantile(asks, 0.75), 3),
    max: round(asks[asks.length - 1], 3),
  };
}

export async function fetchGpuAsks() {
  const skus = [];
  for (const family of GPU_FAMILIES) {
    const offers = [];
    for (const name of family.names) {
      try {
        const q = encodeURIComponent(JSON.stringify({ gpu_name: { eq: name }, rentable: { eq: true }, type: "on-demand", limit: 200 }));
        const json = await get(`https://console.vast.ai/api/v0/bundles/?q=${q}`);
        // Keep only exact matches in case the filter is ever ignored.
        offers.push(...(json.offers ?? []).filter((o) => o.gpu_name === name));
      } catch { /* try the next name */ }
      await sleep(200);
    }
    const stats = parseOffers(offers);
    if (stats) skus.push({ sku: family.sku, ...stats });
  }
  if (!skus.length) throw new Error("no offers returned");
  return { skus };
}

/* ------------------------------------------------------------------ */
/* FRED: rates, credit spreads, FX, gas, construction                  */
/* ------------------------------------------------------------------ */

export const FRED_SERIES = [
  { id: "SOFR", key: "SOFR", label: "SOFR", unit: "%" },
  { id: "DGS10", key: "UST10", label: "10-year Treasury yield", unit: "%" },
  { id: "BAMLC0A4CBBB", key: "BBB_OAS", label: "BBB option-adjusted spread", unit: "%" },
  { id: "BAMLH0A0HYM2", key: "HY_OAS", label: "High-yield option-adjusted spread", unit: "%" },
  { id: "BAMLH0A3HYC", key: "CCC_OAS", label: "CCC and lower option-adjusted spread", unit: "%" },
  { id: "DEXTAUS", key: "USDTWD", label: "Taiwan dollars per US dollar", unit: "TWD" },
  { id: "DEXKOUS", key: "USDKRW", label: "Korean won per US dollar", unit: "KRW" },
  { id: "DEXJPUS", key: "USDJPY", label: "Japanese yen per US dollar", unit: "JPY" },
  { id: "DHHNGSP", key: "HENRY_HUB", label: "Henry Hub natural gas spot", unit: "$/MMBtu" },
  { id: "TLMFGCONS", key: "MFG_CONSTRUCTION", label: "US manufacturing construction spending (annual rate)", unit: "$M" },
  { id: "TLPWRCONS", key: "POWER_CONSTRUCTION", label: "US power construction spending (annual rate)", unit: "$M" },
];

/** fredgraph.csv → [[date, value], ...]; blanks and "." are missing observations. */
export function parseFredCsv(text) {
  const lines = String(text).trim().split(/\r?\n/);
  if (lines.length < 2 || !/date/i.test(lines[0])) throw new Error("unexpected FRED response");
  const points = [];
  for (const line of lines.slice(1)) {
    const [date, raw] = line.split(",");
    const value = raw === "." ? null : num(raw);
    if (/^\d{4}-\d{2}-\d{2}$/.test(date) && value !== null) points.push([date, value]);
  }
  return points;
}

export async function fetchFred() {
  const since = new Date(Date.now() - 400 * 864e5).toISOString().slice(0, 10);
  const series = {};
  const failed = [];
  for (const s of FRED_SERIES) {
    try {
      const points = parseFredCsv(await get(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${s.id}&cosd=${since}`, { as: "text" }));
      if (points.length) series[s.key] = { label: s.label, unit: s.unit, source: "FRED", url: `https://fred.stlouisfed.org/series/${s.id}`, points };
      else failed.push(s.id);
    } catch { failed.push(s.id); }
    await sleep(250);
  }
  if (!Object.keys(series).length) throw new Error("no series returned");
  return { series, failed };
}

/* ------------------------------------------------------------------ */
/* New York Fed: SOFR (official, and independent of FRED)              */
/* ------------------------------------------------------------------ */

export function parseSofr(json) {
  const rows = (json?.refRates ?? []).filter((r) => r.type === "SOFR" && num(r.percentRate) !== null);
  return rows.map((r) => [r.effectiveDate, num(r.percentRate)]).sort((a, b) => a[0].localeCompare(b[0]));
}
export async function fetchSofr() {
  const points = parseSofr(await get("https://markets.newyorkfed.org/api/rates/secured/sofr/last/260.json"));
  if (!points.length) throw new Error("no rates returned");
  return { points };
}

/* ------------------------------------------------------------------ */
/* ERCOT: Texas wholesale power, hub average                           */
/* ------------------------------------------------------------------ */

export function parseErcot(json) {
  const rt = (json?.rtSppData ?? []).map((r) => num(r.hbHubAvg)).filter((v) => v !== null);
  const dam = (json?.damSppData ?? []).map((r) => num(r.hbHubAvg)).filter((v) => v !== null);
  if (!rt.length && !dam.length) return null;
  const mean = (a) => (a.length ? round(a.reduce((x, y) => x + y, 0) / a.length, 2) : null);
  return {
    asOf: String(json.lastUpdated ?? "").slice(0, 10) || null,
    realTimeLatest: rt.length ? round(rt[rt.length - 1], 2) : null,
    realTimeAvg: mean(rt),
    realTimeMin: rt.length ? round(Math.min(...rt), 2) : null,
    realTimeMax: rt.length ? round(Math.max(...rt), 2) : null,
    dayAheadAvg: mean(dam),
  };
}
export async function fetchErcot() {
  const parsed = parseErcot(await get("https://www.ercot.com/api/1/services/read/dashboards/systemWidePrices.json"));
  if (!parsed) throw new Error("no price rows returned");
  return parsed;
}

/* ------------------------------------------------------------------ */
/* TWSE: monthly revenue of the Taiwanese AI hardware chain            */
/* ------------------------------------------------------------------ */

export const TWSE_CODES = {
  2330: { name: "TSMC", role: "Foundry and packaging" },
  3711: { name: "ASE", role: "Packaging and test" },
  2317: { name: "Hon Hai (Foxconn)", role: "Servers and racks" },
  2382: { name: "Quanta", role: "Servers and racks" },
  6669: { name: "Wiwynn", role: "Servers and racks" },
  3231: { name: "Wistron", role: "Servers and boards" },
  2376: { name: "Gigabyte", role: "Servers and boards" },
  3037: { name: "Unimicron", role: "Substrates" },
};

/** Field names are matched by fragment because the feed's own keys are inconsistent. */
function field(row, ...fragments) {
  const key = Object.keys(row).find((k) => fragments.every((f) => k.includes(f)));
  return key ? row[key] : undefined;
}
export function parseTwse(rows) {
  if (!Array.isArray(rows)) throw new Error("unexpected TWSE response");
  const companies = [];
  let month = null;
  for (const row of rows) {
    const code = String(field(row, "公司代號") ?? "").trim();
    if (!TWSE_CODES[code]) continue;
    const ym = String(field(row, "資料年月") ?? "");
    if (/^\d{5}$/.test(ym)) month = `${Number(ym.slice(0, 3)) + 1911}-${ym.slice(3)}`;
    const revenue = num(field(row, "當月營收"));
    companies.push({
      code, ...TWSE_CODES[code],
      // Reported in thousands of New Taiwan dollars; stored in NT$ billions.
      revenue: revenue === null ? null : round(revenue / 1e6, 2),
      yoy: num(field(row, "去年同月增減")),
      mom: num(field(row, "上月比較增減")),
    });
  }
  if (!companies.length) throw new Error("none of the tracked companies found");
  return { month, companies: companies.sort((a, b) => (b.revenue ?? 0) - (a.revenue ?? 0)) };
}
export async function fetchTwse() {
  return parseTwse(await get("https://openapi.twse.com.tw/v1/opendata/t187ap05_L"));
}

/* ------------------------------------------------------------------ */
/* Alpha Vantage (optional, needs a free key): chain equities          */
/* ------------------------------------------------------------------ */

export const EQUITIES = [
  { symbol: "NVDA", label: "Nvidia", country: "US" },
  { symbol: "TSM", label: "TSMC (ADR)", country: "TW" },
  { symbol: "ASML", label: "ASML", country: "EU" },
  { symbol: "MU", label: "Micron", country: "US" },
  { symbol: "CRWV", label: "CoreWeave", country: "US" },
  { symbol: "ORCL", label: "Oracle", country: "US" },
];
export function parseAlphaVantage(json) {
  const daily = json?.["Time Series (Daily)"];
  if (!daily) throw new Error(json?.Note || json?.Information || "unexpected Alpha Vantage response");
  return Object.entries(daily).map(([date, bar]) => [date, num(bar["4. close"])]).filter((p) => p[1] !== null).sort((a, b) => a[0].localeCompare(b[0]));
}
export async function fetchEquities(key) {
  const series = {};
  for (const eq of EQUITIES) {
    try {
      const points = parseAlphaVantage(await get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${eq.symbol}&outputsize=compact&apikey=${key}`));
      series[`EQ_${eq.symbol}`] = { label: eq.label, unit: "$", source: "Alpha Vantage", url: "https://www.alphavantage.co/", points, country: eq.country };
    } catch { /* skip this symbol */ }
    await sleep(1300);
  }
  if (!Object.keys(series).length) throw new Error("no symbols returned");
  return { series };
}
