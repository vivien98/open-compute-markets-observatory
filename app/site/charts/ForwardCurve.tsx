"use client";

import { useState } from "react";

import { feed, fmtDate, gpuSku, impliedDrift, ladderCurves } from "../../content/live";
import Provenance from "./Provenance";

/**
 * The forward curve implied by prediction-market strike ladders.
 *
 * One series, so no legend: the title names it. The band is the bid/ask
 * bracket around the implied median, drawn so that the thinness of the quotes
 * is part of the picture. The dashed rule is today's marketplace ask for the
 * same accelerator, a different basket from the index the ladders settle on,
 * which is why the two are labelled separately and never joined.
 */
export default function ForwardCurve() {
  const [which, setWhich] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const state = feed("ladders");

  if (!ladderCurves.length) {
    return (
      <div className="chart-card">
        <div className="chart-head"><div><h3>Market-implied forward curve</h3><p>No ladder data yet. This chart fills on the first successful run of the Kalshi feed.</p></div></div>
      </div>
    );
  }

  const curve = ladderCurves[Math.min(which, ladderCurves.length - 1)];
  const events = curve.events.filter((e) => e.median.value !== null);
  const spot = gpuSku(curve.label);
  const drift = impliedDrift(curve);
  const values = events.flatMap((e) => [e.medianBid ?? e.median.value!, e.medianAsk ?? e.median.value!, e.median.value!]);
  if (spot) values.push(spot.median);
  const lo = Math.min(...values) * 0.9;
  const hi = Math.max(...values) * 1.08;

  const W = 760;
  const H = 250;
  const M = { top: 16, right: 150, bottom: 30, left: 44 };
  const n = events.length;
  const px = (i: number) => M.left + (n === 1 ? 0.5 : i / (n - 1)) * (W - M.left - M.right);
  const py = (v: number) => M.top + (1 - (v - lo) / (hi - lo)) * (H - M.top - M.bottom);
  const band =
    events.map((e, i) => `${i ? "L" : "M"}${px(i)},${py(e.medianAsk ?? e.median.value!)}`).join(" ") +
    [...events].reverse().map((e, i) => ` L${px(n - 1 - i)},${py(e.medianBid ?? e.median.value!)}`).join("") + " Z";
  const focus = events[active ?? n - 1];
  const dollars = curve.unit.startsWith("$");
  const fmt = (v: number | null | undefined) => (v === null || v === undefined ? "—" : `${dollars ? "$" : ""}${v.toFixed(2)}`);

  return (
    <div className="chart-card">
      <div className="chart-head">
        <div>
          <h3>{curve.label} forward curve implied by strike ladders</h3>
          <p>For each month, the price at which the market sees even odds of the monthly average finishing above or below. The band is the same estimate from bids and from asks.</p>
        </div>
        <Provenance state={state?.state} asOf={state?.asOf} source="Kalshi, settles on Ornn" />
      </div>

      {ladderCurves.length > 1 && (
        <div className="domain-tabs chart-tabs" role="group" aria-label="Choose a ladder">
          {ladderCurves.map((c, i) => (
            <button key={c.ticker} type="button" className={i === which ? "on" : undefined} aria-pressed={i === which} onClick={() => { setWhich(i); setActive(null); }}>{c.label}</button>
          ))}
        </div>
      )}

      <svg className="price-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Implied median ${curve.label} price by settlement month, with bid and ask bracket.`} onPointerLeave={() => setActive(null)}
        onPointerMove={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - box.left) / box.width) * W;
          const i = n === 1 ? 0 : Math.round(((x - M.left) / (W - M.left - M.right)) * (n - 1));
          setActive(Math.max(0, Math.min(n - 1, i)));
        }}>
        {[lo / 0.9, (lo / 0.9 + hi / 1.08) / 2, hi / 1.08].map((v) => (
          <g key={v}>
            <line x1={M.left} x2={W - M.right} y1={py(v)} y2={py(v)} className="grid-rule" />
            <text x={M.left - 6} y={py(v) + 3} textAnchor="end" className="series-sub">{fmt(v)}</text>
          </g>
        ))}
        {n > 1 && <path d={band} className="fc-band" />}
        <path d={events.map((e, i) => `${i ? "L" : "M"}${px(i)},${py(e.median.value!)}`).join(" ")} className="fc-line" />
        {events.map((e, i) => (
          <g key={e.event}>
            <line x1={px(i)} x2={px(i)} y1={py(e.medianBid ?? e.median.value!)} y2={py(e.medianAsk ?? e.median.value!)} className="fc-whisker" />
            <circle cx={px(i)} cy={py(e.median.value!)} r={active === i ? 6 : 4.5} className={`fc-dot ${e.median.censored ? "censored" : ""}`} />
            <text x={px(i)} y={H - 10} textAnchor="middle" className="series-sub">{fmtDate(e.month)}</text>
          </g>
        ))}
        <text x={px(n - 1) + 10} y={py(events[n - 1].median.value!) + 4} className="series-label">Implied median · {fmt(events[n - 1].median.value)}</text>
        {spot && (
          <g>
            <line x1={M.left} x2={W - M.right} y1={py(spot.median)} y2={py(spot.median)} className="fc-spot" />
            <text x={W - M.right + 10} y={py(spot.median) + 4} className="series-label muted">Marketplace ask · {fmt(spot.median)}</text>
          </g>
        )}
      </svg>

      <div className="stack-readouts">
        <div><small>{fmtDate(focus.month).toUpperCase()}</small><b>{fmt(focus.median.value)}</b><span>{focus.median.censored ? `ladder does not reach even odds: ${focus.median.censored} this` : `bracket ${fmt(focus.medianBid)} to ${fmt(focus.medianAsk)}`}</span></div>
        <div><small>CONTRACTS OUTSTANDING</small><b>{focus.openInterest.toLocaleString()}</b><span>{focus.volume.toLocaleString()} traded · $1 notional each</span></div>
        <div><small>IMPLIED ANNUAL CHANGE</small><b>{drift ? `${drift.rate >= 0 ? "+" : "−"}${Math.abs((Math.exp(drift.rate) - 1) * 100).toFixed(0)}%` : "—"}</b><span>{drift ? `${fmtDate(drift.from.month)} to ${fmtDate(drift.to.month)}, annualised` : "needs two months"}</span></div>
        <div><small>BASIS TO MARKETPLACE</small><b>{spot ? `${events[0].median.value! >= spot.median ? "+" : "−"}${Math.abs((events[0].median.value! / spot.median - 1) * 100).toFixed(0)}%` : "—"}</b><span>{spot ? "front month over today's median ask" : "no marketplace ask for this item"}</span></div>
      </div>

      <div className="price-table" role="table" aria-label="Implied forward curve, table view">
        <div className="tr head five" role="row"><span>Month</span><span>Implied median</span><span>Bid–ask bracket</span><span>Traded</span><span>Outstanding</span></div>
        {events.map((e) => (
          <div className="tr five" role="row" key={e.event}>
            <span>{fmtDate(e.month)}</span><span>{fmt(e.median.value)}{e.median.censored ? ` (${e.median.censored})` : ""}</span>
            <span>{fmt(e.medianBid)} – {fmt(e.medianAsk)}</span><span>{e.volume.toLocaleString()}</span><span>{e.openInterest.toLocaleString()}</span>
          </div>
        ))}
      </div>
      <p className="chart-note">Quotes last changed {fmtDate(events.map((e) => e.quotedAt).filter(Boolean).sort().pop())}. Many strikes are quoted by one market maker, so read the bracket, not the point. A non-storable good has no cash-and-carry link: this curve is an expectation plus a risk premium, not spot plus storage.</p>
    </div>
  );
}
