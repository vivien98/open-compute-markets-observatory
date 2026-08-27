"use client";

import { useState } from "react";

import { axisLabels, type Horizon, type PriceSeries } from "../../content/signals";

/**
 * Four posted configurations over the selected horizon.
 *
 * Categorical slots 1–4 carry identity. At four series the palette's contrast
 * relief and the series-count ladder both require secondary encoding, so every
 * line is direct-labelled at its end AND listed in the legend; the price table
 * below the chart is the table view. One shared crosshair reads out all four,
 * so the pointer never has to land on a line.
 */
export default function PriceChart({ data, horizon }: { data: PriceSeries[]; horizon: Horizon }) {
  const [active, setActive] = useState<number | null>(null);

  const n = data[0].series[horizon].length;
  const all = data.flatMap((d) => d.series[horizon]);
  const lo = Math.min(...all) * 0.92;
  const hi = Math.max(...all) * 1.06;

  const W = 760;
  const H = 230;
  const M = { top: 14, right: 132, bottom: 26, left: 40 };
  const px = (i: number) => M.left + (i / (n - 1)) * (W - M.left - M.right);
  const py = (v: number) => M.top + (1 - (v - lo) / (hi - lo)) * (H - M.top - M.bottom);

  const ticks = [lo, (lo + hi) / 2, hi].map((v) => Math.round(v * 10) / 10);

  /**
   * End labels are two lines tall, so a label anchored to its own line can
   * collide with a neighbour whose series ends nearby. Resolve by pushing
   * overlapping labels apart in y, then lifting the stack if it runs past the
   * bottom — labels are never clipped or allowed to overlap.
   */
  const LABEL_GAP = 27;
  const labelY = (() => {
    const wanted = data.map((d, i) => ({ i, y: py(d.series[horizon][n - 1]) }));
    const ordered = [...wanted].sort((a, b) => a.y - b.y);
    for (let k = 1; k < ordered.length; k++) {
      if (ordered[k].y - ordered[k - 1].y < LABEL_GAP) ordered[k].y = ordered[k - 1].y + LABEL_GAP;
    }
    const overflow = ordered[ordered.length - 1].y - (H - M.bottom - 8);
    if (overflow > 0) for (const o of ordered) o.y -= overflow;
    const out: number[] = [];
    for (const o of ordered) out[o.i] = Math.max(o.y, M.top + 8);
    return out;
  })();
  const [first, last] = axisLabels(horizon);
  const idx = active ?? n - 1;

  return (
    <div className="chart-card">
      <div className="chart-head">
        <div>
          <h3>Posted compute prices</h3>
          <p>Normalised only where hardware, memory, region, tenancy, and commitment match.</p>
        </div>
        <ul className="legend">
          {data.map((d, i) => (
            <li key={`${d.config}-${d.commitment}`}>
              <i className={`swatch s${i + 1}`} aria-hidden="true" />
              {d.config} · {d.commitment}
            </li>
          ))}
        </ul>
      </div>

      <svg
        className="price-svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Illustrative posted compute prices per GPU-hour over ${first} to ${last}.`}
        onPointerLeave={() => setActive(null)}
        onPointerMove={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          const ratio = ((e.clientX - box.left) / box.width) * W;
          const raw = ((ratio - M.left) / (W - M.left - M.right)) * (n - 1);
          setActive(Math.max(0, Math.min(n - 1, Math.round(raw))));
        }}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line className="grid" x1={M.left} y1={py(t)} x2={W - M.right} y2={py(t)} />
            <text className="tick" x={M.left - 8} y={py(t) + 3} textAnchor="end">
              ${t.toFixed(1)}
            </text>
          </g>
        ))}
        <line className="axis" x1={M.left} y1={H - M.bottom} x2={W - M.right} y2={H - M.bottom} />
        <text className="tick" x={M.left} y={H - M.bottom + 15}>{first}</text>
        <text className="tick" x={W - M.right} y={H - M.bottom + 15} textAnchor="end">{last}</text>

        {active !== null && <line className="cross" x1={px(idx)} y1={M.top} x2={px(idx)} y2={H - M.bottom} />}

        {data.map((d, i) => {
          const pts = d.series[horizon];
          return (
            <g key={`${d.config}-${d.commitment}`} className={`series s${i + 1}`}>
              <polyline className="series-line" points={pts.map((v, j) => `${px(j)},${py(v)}`).join(" ")} />
              <circle className="series-dot" cx={px(idx)} cy={py(pts[idx])} r="4" />
              {/* Leader line bridges the gap when a label was pushed off its own line. */}
              <line
                className="series-leader"
                x1={px(n - 1)}
                y1={py(pts[pts.length - 1])}
                x2={W - M.right + 6}
                y2={labelY[i]}
              />
              <text className="series-label" x={W - M.right + 10} y={labelY[i] + 3}>
                ${pts[pts.length - 1].toFixed(2)}
              </text>
              <text className="series-sub" x={W - M.right + 10} y={labelY[i] + 15}>
                {d.config.split(" · ")[0]}{d.commitment === "1 year" ? " · 1yr" : ""}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="chart-note">
        {active !== null ? (
          <>
            Reading at point {idx + 1} of {n}:{" "}
            {data.map((d, i) => (
              <span key={i} className="readout">
                <i className={`swatch s${i + 1}`} aria-hidden="true" />
                <b>${d.series[horizon][idx].toFixed(2)}</b>
              </span>
            ))}
          </>
        ) : (
          <>Hover the chart to read every series at one date. Values are illustrative.</>
        )}
      </p>
    </div>
  );
}
