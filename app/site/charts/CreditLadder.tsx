"use client";

import { useState } from "react";

import { SOFR, feed, fmtDate, latest } from "../../content/live";
import Provenance from "./Provenance";

/**
 * The price of credit across the build-out, on one axis: basis points over
 * the risk-free benchmark.
 *
 * Magnitude on a shared scale, so horizontal bars sorted by value. The bars
 * are one colour because they measure one thing; what differs is the evidence
 * behind each, and that is carried by a text tag on every row, never by
 * colour. Index rows are live when the FRED feed is up. Single-name rows are
 * reported levels with their date, because CDS quotes are not freely published.
 */
type Row = { name: string; bps: number; kind: "index" | "cds" | "loan"; tier: string; when: string; note: string };

const REPORTED: Row[] = [
  { name: "Nvidia · 5-year CDS", bps: 140, kind: "cds", tier: "Reported", when: "Nov 2026", note: "Anera, citing market data" },
  { name: "Oracle · 5-year CDS", bps: 288, kind: "cds", tier: "Reported", when: "15 Oct 2026", note: "S&P Global Market Intelligence, via press" },
  { name: "Lambda term loan · SOFR +", bps: 300, kind: "loan", tier: "Disclosed", when: "Aug 2026", note: "Company announcement; investment-grade offtaker" },
  { name: "SoftBank · 5-year CDS", bps: 424, kind: "cds", tier: "Reported", when: "15 Oct 2026", note: "Press report of market data" },
  { name: "Startup GPU loan · SOFR +", bps: 900, kind: "loan", tier: "Practitioner estimate", when: "Sep 2026", note: "Peak FLOPS; the author's own figure" },
  { name: "CoreWeave · 5-year CDS", bps: 1250, kind: "cds", tier: "Reported", when: "Nov 2026", note: "Anera: 1,200 to 1,300; LSEG via press: above 1,000 in October" },
];

export default function CreditLadder() {
  const [active, setActive] = useState<number | null>(null);
  const fred = feed("fred");
  const index = (key: string, name: string): Row | null => {
    const p = latest(key);
    return p ? { name, bps: p.value * 100, kind: "index", tier: fred?.state === "live" ? "Live" : "Last fetched", when: fmtDate(p.date), note: "FRED, ICE BofA option-adjusted spread" } : null;
  };
  const rows = [
    index("BBB_OAS", "BBB corporate index"), index("HY_OAS", "High-yield index"), index("CCC_OAS", "CCC and lower index"),
    ...REPORTED,
  ].filter((r): r is Row => r !== null).sort((a, b) => a.bps - b.bps);
  const max = Math.max(...rows.map((r) => r.bps)) * 1.18;
  const focus = active === null ? null : rows[active];
  // Annual default intensity implied by a CDS spread at 40% recovery, and its five-year cumulative.
  const hazard = focus ? focus.bps / 1e4 / 0.6 : 0;

  return (
    <div className="chart-card">
      <div className="chart-head">
        <div>
          <h3>The price of credit across the build-out</h3>
          <p>Basis points over the benchmark. Where compute is a strategic good, this is the market that prices its risk. Hover a default-swap row for the probability it implies.</p>
        </div>
        <Provenance state={rows.some((r) => r.kind === "index") ? fred?.state : "reported"} asOf={rows.some((r) => r.kind === "index") ? fred?.asOf : undefined} source="indices: FRED · names: as reported" />
      </div>

      <ul className="hbars">
        {rows.map((r, i) => (
          <li key={r.name} className={`hbar-row ${active === i ? "on" : ""}`} onPointerEnter={() => setActive(i)} onPointerLeave={() => setActive(null)}>
            <span className="hbar-name">{r.name}<small>{r.tier} · {r.when}</small></span>
            <span className="hbar-track"><i className={`hbar-fill ${r.kind}`} style={{ width: `${(r.bps / max) * 100}%` }} /><b style={{ left: `calc(${(r.bps / max) * 100}% + 6px)` }}>{Math.round(r.bps).toLocaleString()} bp</b></span>
          </li>
        ))}
      </ul>

      <p className="chart-note readout-line">
        {focus
          ? focus.kind === "cds"
            ? `${focus.name}: ${focus.note}. At 40% recovery, ${Math.round(focus.bps)} bp implies about ${(hazard * 100).toFixed(1)}% a year and ${((1 - Math.exp(-5 * hazard)) * 100).toFixed(0)}% over five years. Spreads include risk and liquidity premia, so this overstates the true probability.`
            : focus.kind === "loan"
              ? `${focus.name}: ${focus.note}. With SOFR at ${SOFR.value.toFixed(2)}%, an all-in rate near ${(SOFR.value + focus.bps / 100).toFixed(1)}%.`
              : `${focus.name}: ${focus.note}.`
          : `Solid bars are published index spreads; outlined bars are single-name levels as reported in the press, and striped bars are loan spreads. ${rows.some((r) => r.kind === "index") ? "" : "Index rows appear after the first live run of the FRED feed. "}Single-name CDS is quoted daily to subscribers and is a registered gap here.`}
      </p>
    </div>
  );
}
