"use client";

import { useState } from "react";

import { quotes, sessionMultiple } from "../../content/signals";

/**
 * The souq in one chart: every provider's three quoted prices for one
 * reference open-weight model, and what a session actually costs once the
 * cache-hit rate and each provider's cache honesty are applied.
 *
 * Archetype is identity (categorical, fixed order). Bars are magnitude with a
 * printed value; the routing share column is the Tullock rule 1/p² applied to
 * the price the router ranks on. Two sliders make the mechanism inspectable:
 * the true cache-hit rate of the workload, and whether the router ranks on the
 * quoted input price or on the blended expected price.
 */
const ARCH_CLASS: Record<string, string> = {
  Builder: "a1", "Copy pricer": "a2", Specialist: "a3", Rebater: "a4", Repricer: "a5",
};

export default function TokenLadder() {
  const [hit, setHit] = useState(0.8);
  const [rankOn, setRankOn] = useState<"quoted" | "blended">("quoted");
  const [providers, setProviders] = useState(8);

  // Effective price per million prefix tokens once the provider's cache reporting is applied.
  const rows = quotes.map((q) => {
    const reported = hit * q.honesty;
    const effective = reported * q.cached + (1 - reported) * q.input;
    const blended = hit * q.cached + (1 - hit) * q.input;
    const rankPrice = rankOn === "quoted" ? q.input : effective;
    return { ...q, effective, blended, rankPrice };
  });
  const weights = rows.map((r) => 1 / (r.rankPrice * r.rankPrice));
  const wsum = weights.reduce((a, b) => a + b, 0);
  const shares = weights.map((w) => w / wsum);
  const maxPrice = Math.max(...rows.map((r) => Math.max(r.input, r.effective)));
  const builder = rows[0];

  return (
    <div className="chart-card ladder">
      <div className="chart-head">
        <div>
          <h3>The souq: quoted price versus paid price</h3>
          <p>One reference open-weight model, seven provider archetypes. Quoted input price beside the effective price of a warm-cache prefix, and the router&apos;s allocation under the inverse-square rule.</p>
        </div>
        <ul className="legend">
          <li><i className="swatch quoted" aria-hidden="true" />Quoted input $/M</li>
          <li><i className="swatch effective" aria-hidden="true" />Effective $/M on a warm prefix</li>
        </ul>
      </div>

      <div className="filters compact" aria-label="Souq model controls">
        <label>True cache-hit rate <b>{Math.round(hit * 100)}%</b>
          <input type="range" min={0} max={0.95} step={0.05} value={hit} onChange={(e) => setHit(Number(e.target.value))} />
        </label>
        <label>Router ranks on
          <select value={rankOn} onChange={(e) => setRankOn(e.target.value as "quoted" | "blended")}>
            <option value="quoted">Quoted input price (default)</option>
            <option value="blended">Measured effective price (fix)</option>
          </select>
        </label>
        <label>Providers in the contest <b>{providers}</b>
          <input type="range" min={1} max={32} step={1} value={providers} onChange={(e) => setProviders(Number(e.target.value))} />
        </label>
      </div>

      <ul className="ladder-rows">
        {rows.map((r, i) => (
          <li key={r.provider} className="ladder-row">
            <span className="ladder-name"><i className={`dot-swatch ${ARCH_CLASS[r.archetype]}`} aria-hidden="true" />{r.provider}<small>{r.archetype} · reports {Math.round(r.honesty * 100)}% of hits</small></span>
            <span className="ladder-bars">
              <i className="ladder-bar quoted" style={{ width: `${(r.input / maxPrice) * 100}%` }}><b>${r.input.toFixed(2)}</b></i>
              <i className="ladder-bar effective" style={{ width: `${(r.effective / maxPrice) * 100}%` }}><b>${r.effective.toFixed(2)}</b></i>
            </span>
            <span className={`ladder-share ${r.effective > builder.effective ? "worse" : ""}`}>
              <b>{(shares[i] * 100).toFixed(0)}%</b>
              <small>{r.effective > builder.effective ? `+${((r.effective / builder.effective - 1) * 100).toFixed(0)}% vs builder` : "of routed tokens"}</small>
            </span>
          </li>
        ))}
      </ul>

      <div className="ladder-foot">
        <div>
          <span className="kicker">SESSION COST MULTIPLE</span>
          <b>{sessionMultiple(providers).toFixed(2)}×</b>
          <p>Per-request routing versus a session-aware router with {providers} provider{providers === 1 ? "" : "s"}: each turn lands cold with probability 1 − 1/n. Fitted to the two published points (2 ≈ 2.33×, 32 ≈ 3.63×).</p>
        </div>
        <p className="chart-note">Illustrative quotes. Effective price = reported cached share × cached price + (1 − reported share) × input price, where reported share = true hit rate × the provider&apos;s honesty. The router&apos;s default share is ∝ 1/p². Switching the ranking to the measured effective price is the short-term fix from the guide&apos;s Chapter 9.</p>
      </div>
    </div>
  );
}
