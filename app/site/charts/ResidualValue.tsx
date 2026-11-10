"use client";

import { useState } from "react";

import { SOFR, feed } from "../../content/live";
import Provenance from "./Provenance";

/**
 * What a residual value is worth, in dollars per GPU-hour.
 *
 * Two series (two borrowers) over a continuous x-axis, so a line chart with
 * both lines direct-labelled. The marker shows the selected residual; the
 * readouts compare the value of a better residual with the value of a better
 * spread, which is the comparison lenders and borrowers actually argue about.
 */
const recovery = (cost: number, rate: number, years: number, residual: number) => {
  const crf = rate / (1 - Math.pow(1 + rate, -years));
  return ((cost - (residual * cost) / Math.pow(1 + rate, years)) * crf) / 8760;
};

export default function ResidualValue() {
  const [cost, setCost] = useState(60);
  const [years, setYears] = useState(5);
  const [residual, setResidual] = useState(0);
  const [tight, setTight] = useState(300);
  const [wide, setWide] = useState(900);

  const base = SOFR.value / 100;
  const rates = [base + tight / 1e4, base + wide / 1e4];
  const xs = Array.from({ length: 13 }, (_, i) => i * 0.05);
  const lines = rates.map((r) => xs.map((x) => recovery(cost * 1000, r, years, x)));
  const hi = lines[1][0] * 1.08;
  const lo = Math.min(...lines[0]) * 0.85;

  const W = 520;
  const H = 230;
  const M = { top: 14, right: 120, bottom: 30, left: 44 };
  const px = (x: number) => M.left + (x / 0.6) * (W - M.left - M.right);
  const py = (v: number) => M.top + (1 - (v - lo) / (hi - lo)) * (H - M.top - M.bottom);
  const at = rates.map((r) => recovery(cost * 1000, r, years, residual / 100));
  const zero = rates.map((r) => recovery(cost * 1000, r, years, 0));
  const spreadWorth = zero[1] - zero[0];
  const residualWorth = zero[1] - recovery(cost * 1000, rates[1], years, 0.4);

  return (
    <div className="chart-card">
      <div className="chart-head">
        <div>
          <h3>What a residual value is worth</h3>
          <p>Capital an accelerator must recover per hour, before power and space, as the resale value a lender will accept rises from zero.</p>
        </div>
        <Provenance state="model" source={`SOFR ${SOFR.value.toFixed(2)}% ${feed("sofr")?.state === "live" ? "live" : "seed"}`} asOf={SOFR.date} />
      </div>

      <div className="filters compact four" aria-label="Residual value inputs">
        <label>Installed cost <b>${cost}k</b><input type="range" min={20} max={120} step={5} value={cost} onChange={(e) => setCost(Number(e.target.value))} /></label>
        <label>Term <b>{years} years</b><input type="range" min={3} max={7} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} /></label>
        <label>Residual accepted <b>{residual}%</b><input type="range" min={0} max={60} step={5} value={residual} onChange={(e) => setResidual(Number(e.target.value))} /></label>
        <label>Spreads <b>+{tight} / +{wide} bp</b>
          <span className="dual"><input aria-label="Tighter spread" type="range" min={100} max={600} step={25} value={tight} onChange={(e) => setTight(Number(e.target.value))} /><input aria-label="Wider spread" type="range" min={500} max={1500} step={50} value={wide} onChange={(e) => setWide(Number(e.target.value))} /></span>
        </label>
      </div>

      <svg className="price-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Required capital recovery per GPU-hour against residual value, for two financing spreads.">
        {[lo / 0.85, (lo / 0.85 + hi / 1.08) / 2, hi / 1.08].map((v) => (
          <g key={v}>
            <line x1={M.left} x2={W - M.right} y1={py(v)} y2={py(v)} className="grid-rule" />
            <text x={M.left - 6} y={py(v) + 3} textAnchor="end" className="series-sub">${v.toFixed(2)}</text>
          </g>
        ))}
        {[0, 0.2, 0.4, 0.6].map((x) => <text key={x} x={px(x)} y={H - 10} textAnchor="middle" className="series-sub">{x * 100}% residual</text>)}
        <line x1={px(residual / 100)} x2={px(residual / 100)} y1={M.top} y2={H - M.bottom} className="spark-cross" />
        {lines.map((line, i) => (
          <g key={i} className={i === 0 ? "rv-tight" : "rv-wide"}>
            <path className="series-line" d={line.map((v, j) => `${j ? "L" : "M"}${px(xs[j])},${py(v)}`).join(" ")} />
            <circle className="series-dot" cx={px(residual / 100)} cy={py(at[i])} r={4.5} />
            <text x={W - M.right + 8} y={py(line[line.length - 1]) + 4} className="series-label">SOFR +{i === 0 ? tight : wide} · ${at[i].toFixed(2)}</text>
          </g>
        ))}
      </svg>

      <div className="stack-readouts three">
        <div><small>THE BETTER SPREAD IS WORTH</small><b>${spreadWorth.toFixed(2)}</b><span>per GPU-hour, at zero residual</span></div>
        <div><small>A 40% RESIDUAL IS WORTH</small><b>${residualWorth.toFixed(2)}</b><span>per GPU-hour, at the wider spread</span></div>
        <div><small>LENDERS TODAY ASSUME</small><b>0%</b><span>no resale market to point to</span></div>
      </div>
      <p className="chart-note">Level annuity over the term at SOFR plus the spread; residual discounted at the same rate; 8,760 hours a year. SOFR + 300 is the Lambda term loan; + 900 is one practitioner&apos;s figure for a startup, not published data.</p>
    </div>
  );
}
