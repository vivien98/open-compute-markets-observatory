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
