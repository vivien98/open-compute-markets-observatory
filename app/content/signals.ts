/**
 * Illustrative preview data for the market pulse.
 *
 * Every series here is synthetic and deterministic — generated from a fixed seed
 * so the interface is stable across reloads and builds. It exists to demonstrate
 * the evidence model, not to report observations. Approved source adapters
 * should replace `series` and `latest` before any figure is read as current.
 */

export type Horizon = "7d" | "30d" | "1y";
export const HORIZONS: Horizon[] = ["7d", "30d", "1y"];
export const HORIZON_LABEL: Record<Horizon, string> = {
  "7d": "7 days",
  "30d": "30 days",
  "1y": "1 year",
};
/** Points per horizon: daily, daily, then monthly. */
const POINTS: Record<Horizon, number> = { "7d": 7, "30d": 30, "1y": 12 };

/** Deterministic PRNG so the same seed always yields the same path. */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Builds a path of `n` points ending exactly at `latest`, having moved
 * `changePct` across the window. Interpolates linearly and adds seeded noise,
 * then pins both endpoints so the rendered change matches the printed one.
 */
function path(latest: number, changePct: number, n: number, seed: number, vol = 0.35): number[] {
  const rand = mulberry32(seed);
  const start = latest / (1 + changePct / 100);
  const span = latest - start;
  const out: number[] = [];
  let drift = 0;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    drift += (rand() - 0.5) * Math.abs(span || latest * 0.02) * vol;
    out.push(start + span * t + drift * (1 - Math.abs(2 * t - 1)));
  }
  out[0] = start;
  out[n - 1] = latest;
  return out.map((v) => Math.max(v, 0));
}

export type Signal = {
  id: number;
  layer: string;
  title: string;
  unit: string;
  availability: string;
  fit: "Direct" | "Proxy" | "Gap";
  source: string;
  relevance: string;
  score: number;
  /** Guide chapter that explains what this indicator means. */
  guide: string;
  /** Absent for unobserved markets — the gap is the data point. */
  latest?: number;
  format?: (v: number) => string;
  change?: Record<Horizon, number>;
  series?: Record<Horizon, number[]>;
};

type Spec = Omit<Signal, "series"> & { change: Record<Horizon, number>; latest: number };

const money = (dp: number) => (v: number) => `$${v.toFixed(dp)}`;

const SPECS: Spec[] = [
  {
    id: 1, layer: "Compute", title: "H100 marketplace ask", unit: "GPU-hour",
    availability: "PROXY", fit: "Proxy", source: "Illustrative marketplace basket",
    relevance: "Falling asks are consistent with easing marginal rental scarcity.",
    score: 86, guide: "units", latest: 2.18, format: money(2),
    change: { "7d": -1.8, "30d": -6.4, "1y": -34.2 },
  },
  {
    id: 2, layer: "Power", title: "PJM Western Hub", unit: "MWh · average",
    availability: "OPEN_API", fit: "Direct", source: "Illustrative ISO snapshot",
    relevance: "Power repricing can change site economics before server prices move.",
    score: 82, guide: "data-centers", latest: 71, format: money(0),
    change: { "7d": 18.2, "30d": 24.6, "1y": 41.3 },
  },
  {
    id: 3, layer: "Sites", title: "US data-center build", unit: "monthly spend",
    availability: "OPEN_DOWNLOAD", fit: "Direct", source: "Illustrative Census series",
    relevance: "Construction is accelerating, but spending does not equal delivered MW.",
    score: 76, guide: "data-centers", latest: 4.7, format: (v) => `$${v.toFixed(1)}B`,
    change: { "7d": 1.2, "30d": 5.4, "1y": 24.1 },
  },
  {
    id: 4, layer: "Silicon", title: "Foundry revenue proxy", unit: "year over year",
    availability: "PUBLIC_MANUAL", fit: "Proxy", source: "Illustrative issuer release",
    relevance: "A high-frequency foundry signal, not a measure of AI wafer volume.",
    score: 72, guide: "silicon", latest: 31, format: (v) => `+${v.toFixed(0)}%`,
    change: { "7d": 0.6, "30d": 3.8, "1y": 12.4 },
  },
  {
    id: 5, layer: "Capital", title: "BBB option-adjusted spread", unit: "basis points",
    availability: "OPEN_API", fit: "Direct", source: "Illustrative FRED series",
    relevance: "Tighter spreads lower the financing hurdle for investment-grade builders.",
    score: 64, guide: "rates", latest: 116, format: (v) => v.toFixed(0),
    change: { "7d": -1.1, "30d": -4.3, "1y": -18.9 },
  },
  {
    id: 7, layer: "Tokens", title: "Cheapest ask · reference open-weight model", unit: "$ / M output tokens",
    availability: "PUBLIC_LISTING", fit: "Proxy", source: "Illustrative router listing",
    relevance: "The floor set by repricers. A quoted price, not a paid price: the cached leg is unverifiable.",
    score: 79, guide: "souq", latest: 0.42, format: money(2),
    change: { "7d": -4.5, "30d": -18.0, "1y": -61.0 },
  },
  {
    id: 8, layer: "Tokens", title: "Providers serving the reference model", unit: "count",
    availability: "PUBLIC_LISTING", fit: "Direct", source: "Illustrative router listing",
    relevance: "Contest depth. Under per-request routing, more providers raise the expected session cost.",
    score: 61, guide: "souq", latest: 32, format: (v) => v.toFixed(0),
    change: { "7d": 3.2, "30d": 14.3, "1y": 166.7 },
  },
  {
    id: 9, layer: "Compute", title: "B200 rental index", unit: "GPU-hour",
    availability: "PUBLIC_INDEX", fit: "Direct", source: "Illustrative daily index",
    relevance: "The new generation's spot rate; the futures curve will settle on an index like this.",
    score: 74, guide: "token-prices", latest: 4.85, format: money(2),
    change: { "7d": -0.6, "30d": -3.9, "1y": -22.4 },
  },
  {
    id: 10, layer: "Memory", title: "DDR5 16Gb contract price", unit: "per chip",
    availability: "PUBLIC_MANUAL", fit: "Proxy", source: "Illustrative contract survey",
    relevance: "Commodity DRAM is the visible cousin of the invisible HBM contract; both share wafers.",
    score: 66, guide: "silicon", latest: 5.2, format: money(2),
    change: { "7d": 1.4, "30d": 6.8, "1y": 38.5 },
  },
  {
    id: 11, layer: "FX", title: "Taiwan dollar per USD", unit: "TWD",
    availability: "OPEN_API", fit: "Direct", source: "Illustrative FX fix",
    relevance: "Foundry revenue is in dollars, costs are local: a stronger TWD compresses wafer margins.",
    score: 52, guide: "linkages", latest: 31.6, format: (v) => v.toFixed(1),
    change: { "7d": -0.3, "30d": -1.2, "1y": -3.4 },
  },
];

export const signals: Signal[] = [
  ...SPECS.map((spec, i) => ({
    ...spec,
    series: Object.fromEntries(
      HORIZONS.map((h) => [h, path(spec.latest, spec.change[h], POINTS[h], (i + 1) * 9973)]),
    ) as Record<Horizon, number[]>,
  })),
  {
    id: 6, layer: "Memory", title: "HBM contract price", unit: "not observed",
    availability: "NOT_PUBLIC", fit: "Gap", source: "Research gap registry",
    relevance: "The economically relevant contract market remains bilateral and opaque.",
    score: 58, guide: "silicon",
  },
  {
    id: 12, layer: "Tokens", title: "Cache-hit rate by provider", unit: "not observed",
    availability: "NOT_VERIFIABLE", fit: "Gap", source: "Research gap registry",
    relevance: "The one number that would say whether quoted token prices are paid prices. No provider attests it.",
    score: 71, guide: "souq",
  },
];

/** Posted compute prices — the multi-series comparison under the pulse. */
export type PriceSeries = {
  config: string; market: string; commitment: string;
  latest: number; change: Record<Horizon, number>; series: Record<Horizon, number[]>;
};

const PRICE_SPECS = [
  { config: "H100 · 80GB", market: "Marketplace basket", commitment: "On demand", latest: 2.18, change: { "7d": -1.8, "30d": -6.4, "1y": -34.2 } },
  { config: "H100 · 80GB", market: "Public cloud basket", commitment: "1 year", latest: 3.42, change: { "7d": 0, "30d": 0, "1y": -8.1 } },
  { config: "A100 · 80GB", market: "Marketplace basket", commitment: "On demand", latest: 1.14, change: { "7d": -0.9, "30d": -3.1, "1y": -27.5 } },
  { config: "L40S · 48GB", market: "Specialist cloud", commitment: "On demand", latest: 1.02, change: { "7d": -2.4, "30d": -8.9, "1y": -19.6 } },
] as const;

export const prices: PriceSeries[] = PRICE_SPECS.map((spec, i) => ({
  ...spec,
  change: { ...spec.change },
  series: Object.fromEntries(
    HORIZONS.map((h) => [h, path(spec.latest, spec.change[h], POINTS[h], (i + 41) * 7717, 0.22)]),
  ) as Record<Horizon, number[]>,
}));

/** X-axis tick labels for a horizon — first and last only. */
export function axisLabels(h: Horizon): [string, string] {
  if (h === "7d") return ["7 days ago", "today"];
  if (h === "30d") return ["30 days ago", "today"];
  return ["12 months ago", "this month"];
}

/* ------------------------------------------------------------------------ */
/* Market wiring: illustrative structures for the linkage, souq, and stack   */
/* charts. Every number is a placeholder for a source adapter.               */
/* ------------------------------------------------------------------------ */

export type Country = "US" | "TW" | "KR" | "EU" | "JP" | "CN" | "Global";
export const COUNTRY_LABEL: Record<Country, string> = {
  US: "United States", TW: "Taiwan", KR: "South Korea", EU: "Netherlands / Germany", JP: "Japan", CN: "China", Global: "Global / many",
};

export type MarketNode = {
  id: string; label: string; sub: string; country: Country;
  /** Column on the chain, left (tools) to right (macro). */
  col: number; row: number; guide: string;
};

export const nodes: MarketNode[] = [
  { id: "asml", label: "ASML / ZEISS", sub: "EUV lithography", country: "EU", col: 0, row: 1, guide: "silicon" },
  { id: "jptools", label: "TEL · Shin-Etsu · Ibiden", sub: "Tools, wafers, substrates", country: "JP", col: 0, row: 2.4, guide: "silicon" },
  { id: "tsmc", label: "TSMC", sub: "Logic wafers, CoWoS", country: "TW", col: 1, row: 1, guide: "silicon" },
  { id: "hbm", label: "SK hynix · Samsung · Micron", sub: "HBM / DRAM", country: "KR", col: 1, row: 2.4, guide: "silicon" },
  { id: "smic", label: "SMIC · CXMT", sub: "Domestic logic & memory", country: "CN", col: 1, row: 3.8, guide: "china" },
  { id: "nvda", label: "Nvidia · AMD · Broadcom", sub: "Accelerators, networking", country: "US", col: 2, row: 1, guide: "silicon" },
  { id: "odm", label: "Foxconn · Quanta · Wiwynn", sub: "Servers and racks", country: "TW", col: 2, row: 3.0, guide: "silicon" },
  { id: "power", label: "PJM · ERCOT hubs", sub: "Wholesale power, queues", country: "US", col: 3, row: 3.9, guide: "data-centers" },
  { id: "sites", label: "Hyperscalers · neoclouds", sub: "Sites, delivered MW", country: "US", col: 3, row: 1.9, guide: "data-centers" },
  { id: "gpuhr", label: "GPU-hour indices", sub: "Silicon Data · Ornn · Compute Desk", country: "Global", col: 4, row: 1.2, guide: "token-prices" },
  { id: "futures", label: "Compute futures", sub: "CME · ICE · Architect", country: "US", col: 4, row: 2.6, guide: "token-prices" },
  { id: "builders", label: "Z.ai · Moonshot · DeepSeek", sub: "Open-weight builders", country: "CN", col: 5, row: 3.4, guide: "souq" },
  { id: "providers", label: "Inference providers", sub: "Together · Novita · StreamLake · Cerebras", country: "Global", col: 5, row: 2, guide: "souq" },
  { id: "router", label: "Routers", sub: "OpenRouter · Databricks", country: "US", col: 5, row: 0.6, guide: "souq" },
  { id: "harness", label: "Harnesses", sub: "Agents and apps", country: "Global", col: 6, row: 0.6, guide: "souq" },
  { id: "credit", label: "Credit spreads · Treasuries", sub: "BBB OAS, term premium", country: "US", col: 6, row: 2.2, guide: "rates" },
  { id: "fx", label: "TWD · KRW · JPY", sub: "Supplier currencies", country: "Global", col: 6, row: 3.6, guide: "linkages" },
];

export type MarketEdge = { from: string; to: string; label: string; guide: string };

export const edges: MarketEdge[] = [
  { from: "asml", to: "tsmc", label: "EUV shipments gate wafer starts 12-24 months out", guide: "silicon" },
  { from: "jptools", to: "tsmc", label: "Resist, wafers, etch tools; substrates for packaging", guide: "silicon" },
  { from: "jptools", to: "hbm", label: "DRAM fab tools and test", guide: "silicon" },
  { from: "tsmc", to: "nvda", label: "Wafer and CoWoS allocation caps accelerator supply", guide: "silicon" },
  { from: "hbm", to: "nvda", label: "HBM allocation binds packaging; memory takes scarcity rent", guide: "silicon" },
  { from: "hbm", to: "smic", label: "Export controls redirect; domestic HBM lags", guide: "china" },
  { from: "smic", to: "builders", label: "Domestic accelerators shape efficiency-per-watt models", guide: "china" },
  { from: "nvda", to: "odm", label: "Boards, trays, racks; system integration", guide: "silicon" },
  { from: "odm", to: "sites", label: "Rack deliveries meet energized MW (or wait for it)", guide: "data-centers" },
  { from: "power", to: "sites", label: "Hub prices and queue length decide where the next site goes", guide: "data-centers" },
  { from: "sites", to: "gpuhr", label: "Delivered capacity sets the spot GPU-hour", guide: "token-prices" },
  { from: "gpuhr", to: "futures", label: "Index is the settlement reference", guide: "token-prices" },
  { from: "futures", to: "sites", label: "A cleared hedge can replace take-or-pay in project debt", guide: "financing" },
  { from: "gpuhr", to: "providers", label: "GPU-hour is the provider's dominant cost", guide: "token-prices" },
  { from: "builders", to: "providers", label: "Open weights: anyone can serve; builder undercut on its own model", guide: "souq" },
  { from: "providers", to: "router", label: "Three quoted prices; router ranks on input price, r = 2", guide: "souq" },
  { from: "router", to: "harness", label: "Routed tokens; payment for order flow", guide: "souq" },
  { from: "harness", to: "router", label: "Order flow and session structure (cache continuity)", guide: "souq" },
  { from: "credit", to: "sites", label: "Spreads set the cost-of-capital term in the GPU-hour", guide: "rates" },
  { from: "sites", to: "credit", label: "Issuance and lease commitments feed back into spreads", guide: "financing" },
  { from: "fx", to: "tsmc", label: "Stronger TWD compresses dollar wafer margins", guide: "linkages" },
  { from: "fx", to: "hbm", label: "Weaker KRW expands memory makers' dollar margins", guide: "linkages" },
  { from: "credit", to: "futures", label: "Rates price the carry in the futures curve", guide: "token-prices" },
];

/** Quoted three-price ladder for one reference open-weight model, by provider archetype. */
export type Quote = {
  provider: string; archetype: "Builder" | "Copy pricer" | "Specialist" | "Rebater" | "Repricer";
  input: number; output: number; cached: number;
  /** Fraction of a warm-cache prefix the provider actually reports as cached. */
  honesty: number;
};
export const quotes: Quote[] = [
  { provider: "Model builder", archetype: "Builder", input: 1.0, output: 3.2, cached: 0.2, honesty: 0.95 },
  { provider: "Copy pricer A", archetype: "Copy pricer", input: 1.0, output: 3.2, cached: 0.2, honesty: 0.9 },
  { provider: "Copy pricer B", archetype: "Copy pricer", input: 1.0, output: 3.2, cached: 0.2, honesty: 0.88 },
  { provider: "Specialist", archetype: "Specialist", input: 1.6, output: 4.8, cached: 0.4, honesty: 0.92 },
  { provider: "Rebater", archetype: "Rebater", input: 0.8, output: 2.6, cached: 0.16, honesty: 0.85 },
  { provider: "Repricer A", archetype: "Repricer", input: 0.55, output: 1.6, cached: 0.11, honesty: 0.25 },
  { provider: "Repricer B", archetype: "Repricer", input: 0.45, output: 1.2, cached: 0.05, honesty: 0.1 },
];

/** Cost multiple of per-request routing versus a session-aware router, by provider count.
 *  Fitted to the two published points (2 providers ≈ 2.33×, 32 ≈ 3.63×): m(n) = 1 + 2.66(1 − 1/n). */
export const sessionMultiple = (n: number) => 1 + 2.66 * (1 - 1 / n);

/** Cross-market indexed series (rebased to 100 at the start of each horizon). */
export type IndexedSeries = { id: string; label: string; country: Country; unit: string; series: Record<Horizon, number[]> };
const XM_SPECS: { id: string; label: string; country: Country; unit: string; change: Record<Horizon, number>; seed: number }[] = [
  { id: "tsm", label: "Foundry (TW)", country: "TW", unit: "equity", change: { "7d": 2.1, "30d": 6.4, "1y": 38 }, seed: 11 },
  { id: "hbm", label: "HBM maker (KR)", country: "KR", unit: "equity", change: { "7d": 3.4, "30d": 11.2, "1y": 74 }, seed: 12 },
  { id: "litho", label: "Lithography (NL)", country: "EU", unit: "equity", change: { "7d": 0.8, "30d": 2.1, "1y": 12 }, seed: 13 },
  { id: "accel", label: "Accelerator (US)", country: "US", unit: "equity", change: { "7d": 1.6, "30d": 4.9, "1y": 41 }, seed: 14 },
  { id: "h100", label: "H100 rental index", country: "Global", unit: "GPU-hour", change: { "7d": -1.8, "30d": -6.4, "1y": -34 }, seed: 15 },
  { id: "token", label: "Cheapest token ask", country: "CN", unit: "$/M tokens", change: { "7d": -4.5, "30d": -18, "1y": -61 }, seed: 16 },
];
export const crossMarket: IndexedSeries[] = XM_SPECS.map((s) => ({
  id: s.id, label: s.label, country: s.country, unit: s.unit,
  series: Object.fromEntries(
    HORIZONS.map((h) => {
      const raw = path(100 * (1 + s.change[h] / 100), s.change[h], POINTS[h], s.seed * 3301, 0.18);
      return [h, raw.map((v) => (v / raw[0]) * 100)];
    }),
  ) as Record<Horizon, number[]>,
}));
