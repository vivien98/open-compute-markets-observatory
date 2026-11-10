/**
 * Typed access to the data snapshot written by scripts/fetch-data.mjs.
 *
 * The site never fetches at runtime: the scheduled job commits a snapshot and
 * the pages are rebuilt from it. Everything here is therefore synchronous, and
 * every value carries the date it was observed.
 */
import raw from "./live/snapshot.json";

export type FeedState = "live" | "seed" | "stale" | "pending" | "failed" | "needs-key";
export type Feed = { id: string; label: string; url: string; state: FeedState; asOf: string | null; fetchedAt: string; note: string };
export type Point = [string, number];
export type LiveSeries = { label: string; unit: string; source: string; url: string; points: Point[]; own?: boolean; country?: string };

export type Endpoint = {
  provider: string; tag: string; tier: string | null; quant: string | null;
  input: number; output: number; cached: number | null; uptime: number | null; status: number | null; timeOfDay: boolean;
};
export type TokenModel = {
  id: string; name: string; created: number | null; author: string;
  list: { input: number; output: number; cached: number | null; from: "builder" | "mode"; copies: number };
  providers: number; timeOfDay: boolean; endpoints: Endpoint[];
};
export type GpuSku = { sku: string; offers: number; gpus: number; verifiedShare: number; min: number; p25: number; median: number; p75: number; max: number };
export type LadderEvent = {
  event: string; month: string;
  median: { value: number | null; censored: "above" | "below" | null };
  medianBid: number | null; medianAsk: number | null; mean: number | null;
  volume: number; openInterest: number; quotedAt: string | null;
  strikes: { k: number; bid: number; ask: number; p: number }[];
};
export type LadderCurve = { ticker: string; label: string; unit: string; events: LadderEvent[] };

type Snapshot = {
  generatedAt: string;
  feeds: Feed[];
  series: Record<string, LiveSeries>;
  tokens: { asOf: string; models: TokenModel[] } | null;
  gpu: { asOf: string; skus: GpuSku[] } | null;
  ladders: { asOf: string; curves: LadderCurve[] } | null;
  power: { asOf: string | null; realTimeLatest: number | null; realTimeAvg: number | null; realTimeMin: number | null; realTimeMax: number | null; dayAheadAvg: number | null } | null;
  twse: { month: string | null; companies: { code: string; name: string; role: string; revenue: number | null; yoy: number | null; mom: number | null }[] } | null;
};

export const snapshot = raw as unknown as Snapshot;
export const feeds: Feed[] = snapshot.feeds ?? [];
export const feed = (id: string) => feeds.find((f) => f.id === id);
/** A feed whose numbers can be shown as observations (possibly old ones). */
export const usable = (id: string) => ["live", "seed", "stale"].includes(feed(id)?.state ?? "");
export const currentFeeds = feeds.filter((f) => f.state === "live" || f.state === "seed").length;

export const series = (key: string): LiveSeries | undefined => snapshot.series?.[key];
export const latest = (key: string): { value: number; date: string } | null => {
  const p = series(key)?.points.at(-1);
  return p ? { date: p[0], value: p[1] } : null;
};

export type Horizon = "7d" | "30d" | "1y";
const DAYS: Record<Horizon, number> = { "7d": 7, "30d": 30, "1y": 365 };

/**
 * The slice of a series inside a horizon, ending at its last observation.
 * Returns null when fewer than two points fall inside the window, which is the
 * normal state for a self-recorded series in its first days.
 */
export function windowOf(key: string, horizon: Horizon, scale = 1): { values: number[]; change: number; from: string; to: string } | null {
  const points = series(key)?.points;
  if (!points || points.length < 2) return null;
  const end = new Date(points[points.length - 1][0]).getTime();
  const start = end - DAYS[horizon] * 864e5;
  let inside = points.filter((p) => new Date(p[0]).getTime() >= start);
  if (inside.length < 2) return null;
  // Charts stay legible: thin long windows to about sixty points, keeping both ends.
  if (inside.length > 60) {
    const step = (inside.length - 1) / 59;
    inside = Array.from({ length: 60 }, (_, i) => inside[Math.round(i * step)]);
  }
  const values = inside.map((p) => p[1] * scale);
  const first = values[0];
  const last = values[values.length - 1];
  return { values, change: first ? ((last - first) / Math.abs(first)) * 100 : 0, from: inside[0][0], to: inside[inside.length - 1][0] };
}

/** SOFR in percent: the live print if there is one, otherwise the last value quoted in the guide. */
export const SOFR = latest("SOFR") ?? { value: 3.88, date: "2026-11-09" };

export const tokenModels: TokenModel[] = snapshot.tokens?.models ?? [];
export const gpuSku = (sku: string): GpuSku | undefined => snapshot.gpu?.skus.find((s) => s.sku === sku);
export const gpuSkus: GpuSku[] = snapshot.gpu?.skus ?? [];
export const ladderCurves: LadderCurve[] = snapshot.ladders?.curves ?? [];
export const power = snapshot.power;
export const twse = snapshot.twse;

/** Endpoints a default request can be routed to: priority and flex tiers are opt-in. */
export const standardTier = (m: TokenModel): Endpoint[] => {
  const std = m.endpoints.filter((e) => !e.tier || e.tier === "default" || e.tier === "standard");
  return std.length ? std : m.endpoints;
};

/**
 * Annualised rate of change implied by a ladder curve, first listed month to
 * last. Continuous compounding; negative means the market prices a decline.
 */
export function impliedDrift(curve: LadderCurve | undefined): { rate: number; from: LadderEvent; to: LadderEvent } | null {
  const usableEvents = (curve?.events ?? []).filter((e) => e.median.value && !e.median.censored);
  if (usableEvents.length < 2) return null;
  const from = usableEvents[0];
  const to = usableEvents[usableEvents.length - 1];
  const months = (Number(to.month.slice(0, 4)) - Number(from.month.slice(0, 4))) * 12 + Number(to.month.slice(5)) - Number(from.month.slice(5));
  if (months <= 0) return null;
  return { rate: Math.log(to.median.value! / from.median.value!) / (months / 12), from, to };
}

export const fmtDate = (iso: string | null | undefined) => {
  if (!iso) return "—";
  const d = new Date(iso.length === 7 ? `${iso}-01` : iso);
  return d.toLocaleDateString("en-GB", iso.length === 7 ? { month: "short", year: "numeric", timeZone: "UTC" } : { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
};
