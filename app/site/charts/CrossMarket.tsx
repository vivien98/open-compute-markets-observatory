"use client";

import { useState } from "react";

import { feed, series as liveSeries, windowOf } from "../../content/live";
import { axisLabels, crossMarket, type Horizon } from "../../content/signals";
import Provenance from "./Provenance";

/**
 * Up to six series on one honest axis: each is rebased to 100 at the start of
 * the horizon, so a credit spread, an exchange rate, and a rental price can be
 * compared for direction without pretending they share a unit.
 *
 * Which six depends on what the feeds have. With an equities key: the chain's
 * listed companies. Without one: credit, rates, currencies, and gas from FRED.
 * With neither: a synthetic preview, labelled as such. Colour follows the
 * entity and is fixed; every line is direct-labelled and listed in the legend,
 * and the table beneath is the table view.
 */
type Line = { id: string; label: string; cls: string; unit: string; values: number[] };

const SETS: { feed: string; source: string; keys: [string, string, string][] }[] = [
  { feed: "equities", source: "Alpha Vantage daily closes", keys: [["EQ_NVDA", "Nvidia", "n-us"], ["EQ_TSM", "TSMC", "n-tw"], ["EQ_MU", "Micron", "n-kr"], ["EQ_ASML", "ASML", "n-eu"], ["EQ_ORCL", "Oracle", "n-jp"], ["EQ_CRWV", "CoreWeave", "n-cn"]] },
  { feed: "fred", source: "FRED", keys: [["HY_OAS", "High-yield spread", "n-us"], ["USDTWD", "TWD per USD", "n-tw"], ["USDKRW", "KRW per USD", "n-kr"], ["UST10", "10-year Treasury", "n-eu"], ["HENRY_HUB", "Henry Hub gas", "n-jp"], ["CCC_OAS", "CCC spread", "n-cn"]] },
];

/** Stretches a series to `n` points so lines with different observation counts share an x-axis. */
const resample = (values: number[], n: number) =>
  Array.from({ length: n }, (_, i) => {
    const pos = (i / (n - 1)) * (values.length - 1);
    const lo = Math.floor(pos);
    return values[lo] + (values[Math.min(lo + 1, values.length - 1)] - values[lo]) * (pos - lo);
  });

export default function CrossMarket({ horizon }: { horizon: Horizon }) {
  const [active, setActive] = useState<number | null>(null);

  let lines: Line[] = [];
  let source = "synthetic preview";
  let state: "illustrative" | "live" | "seed" | "stale" = "illustrative";
  let asOf: string | null | undefined;
  for (const set of SETS) {
    const found = set.keys
      .map(([key, label, cls]) => ({ key, label, cls, w: windowOf(key, horizon) }))
      .filter((x) => x.w && x.w.values.length >= 2);
    if (found.length >= 4) {
      const n = Math.min(60, Math.max(...found.map((x) => x.w!.values.length)));
      lines = found.map((x) => {
        const v = resample(x.w!.values, n);
        return { id: x.key, label: x.label, cls: x.cls, unit: liveSeries(x.key)?.unit ?? "", values: v.map((p) => (p / v[0]) * 100) };
      });
      source = set.source;
      const f = feed(set.feed);
      state = f?.state === "live" ? "live" : f?.state === "seed" ? "seed" : "stale";
      asOf = f?.asOf;
      break;
    }
  }
  if (!lines.length) lines = crossMarket.map((d) => ({ id: d.id, label: d.label, cls: `n-${d.country === "Global" ? "global" : d.country.toLowerCase()}`, unit: d.unit, values: d.series[horizon] }));

  const n = lines[0].values.length;
  const all = lines.flatMap((d) => d.values);
  const pad = (Math.max(...all) - Math.min(...all)) * 0.08 || 2;
  const lo = Math.min(...all) - pad;
  const hi = Math.max(...all) + pad;

  const W = 760;
  const H = 250;
  const M = { top: 14, right: 178, bottom: 26, left: 40 };
  const px = (i: number) => M.left + (i / (n - 1)) * (W - M.left - M.right);
  const py = (v: number) => M.top + (1 - (v - lo) / (hi - lo)) * (H - M.top - M.bottom);
  const [first, last] = axisLabels(horizon);
  const idx = active ?? n - 1;

  const GAP = 22;
  const labelY = (() => {
    const ordered = lines.map((d, i) => ({ i, y: py(d.values[n - 1]) })).sort((a, b) => a.y - b.y);
    for (let k = 1; k < ordered.length; k++) if (ordered[k].y - ordered[k - 1].y < GAP) ordered[k].y = ordered[k - 1].y + GAP;
    const overflow = ordered[ordered.length - 1].y - (H - M.bottom - 6);
    if (overflow > 0) for (const o of ordered) o.y -= overflow;
    const out: number[] = [];
    for (const o of ordered) out[o.i] = Math.max(o.y, M.top + 6);
    return out;
  })();

  return (
    <div className="chart-card">
      <div className="chart-head">
        <div>
          <h3>Cross-market ledger · indexed to 100</h3>
          <p>Different units on one axis by rebasing each series to its value at the start of the window. Read direction and co-movement, not level.</p>
        </div>
        <Provenance state={state} asOf={asOf} source={source} />
      </div>
      <ul className="legend legend-row">
        {lines.map((d) => <li key={d.id}><i className={`swatch ${d.cls}`} aria-hidden="true" />{d.label}</li>)}
      </ul>
      <svg className="price-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Cross-market indexed series from ${first} to ${last}.`}
        onPointerLeave={() => setActive(null)}
        onPointerMove={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          const ratio = ((e.clientX - box.left) / box.width) * W;
          const raw = ((ratio - M.left) / (W - M.left - M.right)) * (n - 1);
          setActive(Math.max(0, Math.min(n - 1, Math.round(raw))));
        }}>
        {[lo + pad, 100, hi - pad].map((v, i) => (
          <g key={i}>
            <line x1={M.left} x2={W - M.right} y1={py(v)} y2={py(v)} className={v === 100 ? "series-base" : "grid-rule"} />
            <text x={M.left - 6} y={py(v) + 3} textAnchor="end" className="series-sub">{v.toFixed(0)}</text>
          </g>
        ))}
        <text x={M.left} y={H - 8} className="series-sub">{first}</text>
        <text x={W - M.right} y={H - 8} textAnchor="end" className="series-sub">{last}</text>
        {lines.map((d, i) => (
          <g key={d.id} className={d.cls}>
            <path className="series-line" d={d.values.map((v, j) => `${j ? "L" : "M"}${px(j)},${py(v)}`).join(" ")} />
            <circle className="series-dot" cx={px(idx)} cy={py(d.values[idx])} r={4} />
            <text x={W - M.right + 10} y={labelY[i] + 4} className="series-label">{d.label} · {d.values[idx].toFixed(0)}</text>
          </g>
        ))}
        {active !== null && <line x1={px(idx)} x2={px(idx)} y1={M.top} y2={H - M.bottom} className="spark-cross" />}
      </svg>
      <div className="price-table" role="table" aria-label="Cross-market series, table view">
        <div className="tr head four" role="row"><span>Series</span><span>Unit</span><span>Start</span><span>Now</span></div>
        {lines.map((d) => (
          <div className="tr four" role="row" key={d.id}>
            <span><i className={`chip ${d.cls}`} />{d.label}</span><span>{d.unit}</span><span>100</span><span>{d.values[n - 1].toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
