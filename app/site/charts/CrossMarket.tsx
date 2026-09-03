"use client";

import { useState } from "react";

import { axisLabels, COUNTRY_LABEL, crossMarket, type Horizon } from "../../content/signals";

/**
 * Six series from five countries, indexed to 100 at the start of the horizon
 * so equities, a rental index, and a token price share one axis honestly.
 *
 * Series identity uses the same fixed country hues as the linkage map, so a
 * reader can carry colour across the two charts. Every line is direct-labelled
 * at its end and listed in the legend; the shared crosshair reads all six; the
 * table beneath is the table view.
 */
const CLASS: Record<string, string> = { US: "n-us", TW: "n-tw", KR: "n-kr", EU: "n-eu", JP: "n-jp", CN: "n-cn", Global: "n-global" };

export default function CrossMarket({ horizon }: { horizon: Horizon }) {
  const [active, setActive] = useState<number | null>(null);
  const data = crossMarket;
  const n = data[0].series[horizon].length;
  const all = data.flatMap((d) => d.series[horizon]);
  const lo = Math.min(...all) - 4;
  const hi = Math.max(...all) + 4;

  const W = 760;
  const H = 250;
  const M = { top: 14, right: 178, bottom: 26, left: 40 };
  const px = (i: number) => M.left + (i / (n - 1)) * (W - M.left - M.right);
  const py = (v: number) => M.top + (1 - (v - lo) / (hi - lo)) * (H - M.top - M.bottom);
  const [first, last] = axisLabels(horizon);
  const idx = active ?? n - 1;

  const GAP = 22;
  const labelY = (() => {
    const ordered = data.map((d, i) => ({ i, y: py(d.series[horizon][n - 1]) })).sort((a, b) => a.y - b.y);
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
          <p>Equities, a rental index, and a token ask on one axis by rebasing each to its start. Direction of co-movement is the point; magnitudes are illustrative.</p>
        </div>
        <ul className="legend">
          {data.map((d) => <li key={d.id}><i className={`swatch ${CLASS[d.country]}`} aria-hidden="true" />{d.label}</li>)}
        </ul>
      </div>
      <svg className="price-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Illustrative cross-market indexed series from ${first} to ${last}.`}
        onPointerLeave={() => setActive(null)}
        onPointerMove={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          const ratio = ((e.clientX - box.left) / box.width) * W;
          const raw = ((ratio - M.left) / (W - M.left - M.right)) * (n - 1);
          setActive(Math.max(0, Math.min(n - 1, Math.round(raw))));
        }}>
        {[lo + 4, 100, hi - 4].map((v) => (
          <g key={v}>
            <line x1={M.left} x2={W - M.right} y1={py(v)} y2={py(v)} className={v === 100 ? "series-base" : "spark-axis"} />
            <text x={M.left - 6} y={py(v) + 3} textAnchor="end" className="series-sub">{v.toFixed(0)}</text>
          </g>
        ))}
        <text x={M.left} y={H - 8} className="series-sub">{first}</text>
        <text x={W - M.right} y={H - 8} textAnchor="end" className="series-sub">{last}</text>
        {data.map((d, i) => (
          <g key={d.id} className={CLASS[d.country]}>
            <path className="series-line" d={d.series[horizon].map((v, j) => `${j ? "L" : "M"}${px(j)},${py(v)}`).join(" ")} />
            <circle className="series-dot" cx={px(idx)} cy={py(d.series[horizon][idx])} r={4} />
            <text x={W - M.right + 10} y={labelY[i] + 4} className="series-label">{d.label} · {d.series[horizon][idx].toFixed(0)}</text>
          </g>
        ))}
        {active !== null && <line x1={px(idx)} x2={px(idx)} y1={M.top} y2={H - M.bottom} className="spark-cross" />}
      </svg>
      <div className="price-table" role="table" aria-label="Cross-market series, table view">
        <div className="tr head" role="row"><span>Series</span><span>Country</span><span>Unit</span><span>Start</span><span>Now</span></div>
        {data.map((d) => (
          <div className="tr" role="row" key={d.id}>
            <span><i className={`chip ${CLASS[d.country]}`} />{d.label}</span>
            <span>{COUNTRY_LABEL[d.country]}</span>
            <span>{d.unit}</span>
            <span>100</span>
            <span>{d.series[horizon][n - 1].toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
