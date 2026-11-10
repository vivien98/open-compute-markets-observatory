"use client";

import { useState } from "react";

import { feed, fmtDate, impliedDrift, ladderCurves } from "../../content/live";
import Provenance from "./Provenance";

/**
 * The tenor curve, decomposed.
 *
 * A three-year price is roughly the average of the spot prices expected over
 * those three years. If rental prices are expected to fall, the long contract
 * should be cheaper for that reason alone. The line is that "decline only"
 * price for each contract length; the hollow markers are prices actually
 * quoted. The gap between them is what the buyer of a long contract is paid
 * for commitment, or equivalently what a short-term buyer pays for not having
 * the credit to commit.
 *
 * Two series with a clear relationship, so both are direct-labelled and the
 * legend repeats them. The strip underneath is annotation, not data.
 */
const TENORS = [
  { t: 0, label: "On demand", who: "Anyone is good for a day" },
  { t: 1 / 12, label: "1 month", who: "Most startups" },
  { t: 0.25, label: "3 months", who: "" },
  { t: 0.5, label: "6 months", who: "" },
  { t: 1, label: "1 year", who: "Funded startups, within runway" },
  { t: 2, label: "2 years", who: "" },
  { t: 3, label: "3 years", who: "A dozen creditworthy buyers" },
  { t: 5, label: "5 years", who: "Fewest of all" },
];

const strip = (spot: number, g: number, t: number) => (t === 0 || g === 0 ? spot : (spot * (1 - Math.exp(-g * t))) / (g * t));

export default function TenorCurve() {
  const drift = impliedDrift(ladderCurves.find((c) => c.label === "H100"));
  const impliedDecline = drift ? Math.max(0, Math.min(0.8, 1 - Math.exp(drift.rate))) : null;

  const [spot, setSpot] = useState(9);
  const [three, setThree] = useState(4.5);
  const [five, setFive] = useState(3.5);
  const [decline, setDecline] = useState(Math.round((impliedDecline ?? 0.33) * 100));

  const g = -Math.log(1 - Math.min(decline, 95) / 100);
  const fair = TENORS.map((x) => strip(spot, g, x.t));
  const quoted: (number | null)[] = TENORS.map((x) => (x.t === 0 ? spot : x.t === 3 ? three : x.t === 5 ? five : null));

  // The decline that would, alone, explain the three-year quote.
  let needed = 0;
  for (let lo = 0, hi = 5, i = 0; i < 40; i++) { needed = (lo + hi) / 2; if (strip(spot, needed, 3) > three) lo = needed; else hi = needed; }
  const neededPct = (1 - Math.exp(-needed)) * 100;

  const W = 760;
  const H = 240;
  const M = { top: 18, right: 150, bottom: 30, left: 58 };
  const top = spot * 1.08;
  const px = (i: number) => M.left + (i / (TENORS.length - 1)) * (W - M.left - M.right);
  const py = (v: number) => M.top + (1 - v / top) * (H - M.top - M.bottom);
  const gap3 = 1 - three / fair[6];
  const gap5 = 1 - five / fair[7];

  return (
    <div className="chart-card">
      <div className="chart-head">
        <div>
          <h3>The tenor curve: expected decline, or credit?</h3>
          <p>Price per GPU-hour by contract length for the current accelerator. The line is what each length would cost if only the expected fall in rental prices mattered. Hollow markers are quoted prices.</p>
        </div>
        <Provenance state="model" source="quotes: Verda via Anera; Peak FLOPS" asOf="2026-11" />
      </div>

      <div className="filters compact four" aria-label="Tenor curve inputs">
        <label>On demand <b>${spot.toFixed(2)}</b><input type="range" min={2} max={14} step={0.25} value={spot} onChange={(e) => setSpot(Number(e.target.value))} /></label>
        <label>Three-year quote <b>${three.toFixed(2)}</b><input type="range" min={1} max={10} step={0.25} value={three} onChange={(e) => setThree(Number(e.target.value))} /></label>
        <label>Five-year quote <b>${five.toFixed(2)}</b><input type="range" min={1} max={10} step={0.25} value={five} onChange={(e) => setFive(Number(e.target.value))} /></label>
        <label>Expected fall in rental price <b>{decline}% a year</b><input type="range" min={0} max={70} step={1} value={decline} onChange={(e) => setDecline(Number(e.target.value))} /></label>
      </div>

      <svg className="price-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Price per GPU-hour by contract length: decline-only price versus quoted prices.">
        {[0, top / 1.08 / 2, top / 1.08].map((v) => (
          <g key={v}>
            <line x1={M.left} x2={W - M.right} y1={py(v)} y2={py(v)} className="grid-rule" />
            <text x={M.left - 14} y={py(v) + 3} textAnchor="end" className="series-sub">${v.toFixed(2)}</text>
          </g>
        ))}
        <path d={fair.map((v, i) => `${i ? "L" : "M"}${px(i)},${py(v)}`).join(" ")} className="tc-fair" />
        {TENORS.map((x, i) => (
          <g key={x.label}>
            <circle cx={px(i)} cy={py(fair[i])} r={3.5} className="tc-fair-dot" />
            <text x={px(i)} y={H - 10} textAnchor="middle" className="series-sub">{x.label}</text>
            {quoted[i] !== null && x.t > 0 && (
              <>
                <line x1={px(i)} x2={px(i)} y1={py(fair[i])} y2={py(quoted[i]!)} className="tc-gap" />
                <circle cx={px(i)} cy={py(quoted[i]!)} r={6} className="tc-quote" />
                <text x={px(i) - 10} y={(py(fair[i]) + py(quoted[i]!)) / 2 + 3} textAnchor="end" className="series-label">{(x.t === 3 ? gap3 : gap5) >= 0 ? "−" : "+"}{Math.abs((x.t === 3 ? gap3 : gap5) * 100).toFixed(0)}%</text>
              </>
            )}
          </g>
        ))}
        <circle cx={px(0)} cy={py(spot)} r={6} className="tc-quote" />
        <text x={px(7) + 12} y={py(fair[7]) - 2} className="series-label">Decline only · ${fair[7].toFixed(2)}</text>
        <text x={px(7) + 12} y={py(five) + 12} className="series-label muted">Quoted · ${five.toFixed(2)}</text>
      </svg>

      <div className="pyramid" aria-label="Who can sign each contract length">
        <span className="pyramid-label">WHO CAN SIGN</span>
        <div className="pyramid-cells">
          <span style={{ flex: 1 }}>Anyone is good for a day</span>
          <span style={{ flex: 3 }}>Most startups are good for a month; a funded one for its runway</span>
          <span className="financed" style={{ flex: 2 }}>Lenders finance from 3 years: a dozen buyers</span>
        </div>
      </div>

      <div className="stack-readouts">
        <div><small>QUOTED 3-YEAR ÷ ON DEMAND</small><b>{((three / spot) * 100).toFixed(0)}%</b><span>a reseller&apos;s gross spread is {((1 - three / spot) * 100).toFixed(0)}%</span></div>
        <div><small>DECLINE ALONE WOULD GIVE</small><b>{((fair[6] / spot) * 100).toFixed(0)}%</b><span>average of 36 months of falling spot</span></div>
        <div><small>PAID FOR COMMITMENT</small><b>{gap3 >= 0 ? "" : "+"}{(gap3 * 100).toFixed(0)}%</b><span>discount to the decline-only price at 3 years</span></div>
        <div><small>DECLINE THAT EXPLAINS IT ALL</small><b>{neededPct.toFixed(0)}%</b><span>a year, for credit to play no part</span></div>
      </div>
      <p className="chart-note">
        The three quotes are sourced; every other point is arithmetic. The default decline is{" "}
        {drift ? `the ${Math.abs((Math.exp(drift.rate) - 1) * 100).toFixed(0)}% a year implied by the H100 ladder (${fmtDate(drift.from.month)} to ${fmtDate(drift.to.month)}, ${feed("ladders")?.state === "live" ? "live" : "seed capture"}), borrowed from an older chip` : "an assumed 33% a year"}.
        No discounting. If the quoted long price sits below the line, long-term buyers are being paid for their credit; if the gap is zero, the curve is only a forecast.
      </p>
    </div>
  );
}
