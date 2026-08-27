"use client";

import { useState } from "react";

import { HORIZON_LABEL, type Horizon, type Signal } from "../../content/signals";

/**
 * Movement across signals over the selected horizon.
 *
 * Polarity, not identity — so this is the diverging pair (blue rising / red
 * falling) around a neutral zero rule, never the categorical slots. Direction is
 * never colour-alone: every bar carries a signed value at its tip. Bars are the
 * hit target; there is no crosshair.
 */
export default function ChangeBars({ data, horizon }: { data: Signal[]; horizon: Horizon }) {
  const [active, setActive] = useState<number | null>(null);

  const rows = data
    .filter((s): s is Signal & { change: Record<Horizon, number> } => Boolean(s.change))
    .map((s) => ({ signal: s, value: s.change[horizon] }))
    .sort((a, b) => b.value - a.value);

  const extent = Math.max(...rows.map((r) => Math.abs(r.value))) * 1.25;

  return (
    <div className="chart-card">
      <div className="chart-head">
        <div>
          <h3>What moved · {HORIZON_LABEL[horizon]}</h3>
          <p>Percent change over the selected horizon, ranked. Unobserved markets are excluded.</p>
        </div>
      </div>

      <ul className="bars">
        {rows.map((row, i) => {
          const positive = row.value >= 0;
          const width = (Math.abs(row.value) / extent) * 50;
          return (
            <li
              key={row.signal.id}
              className={`bar-row ${active === i ? "on" : ""}`}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
            >
              <span className="bar-name">{row.signal.title}</span>
              <span className="bar-track">
                <i className="bar-zero" aria-hidden="true" />
                <i
                  className={`bar-fill ${positive ? "pos" : "neg"}`}
                  style={positive ? { left: "50%", width: `${width}%` } : { right: "50%", width: `${width}%` }}
                />
                <b className={`bar-value ${positive ? "pos" : "neg"}`} style={positive ? { left: `calc(50% + ${width}%)` } : { right: `calc(50% + ${width}%)` }}>
                  {positive ? "+" : "−"}
                  {Math.abs(row.value).toFixed(1)}%
                </b>
              </span>
              <span className="bar-layer">{row.signal.layer}</span>
            </li>
          );
        })}
      </ul>
      <p className="chart-note">Blue rises, red falls; the sign is printed on every bar so direction never depends on colour.</p>
    </div>
  );
}
