"use client";

import { useState } from "react";

import { feed, standardTier, tokenModels, type Endpoint } from "../../content/live";
import { quotes, sessionMultiple } from "../../content/signals";
import Provenance from "./Provenance";

/**
 * The souq in one chart, on real quotes.
 *
 * For one open-weight model, every standard-tier endpoint's quoted input price
 * (what the router ranks on) beside what a session actually costs per million
 * input tokens once the cached share and the output those tokens generate are
 * included. The share column applies the router's inverse-square rule to
 * whichever price it is told to rank on.
 *
 * Two bars per row measure the same unit on one axis, so they share a scale:
 * the quoted bar is the lighter step of the same ink, the effective bar the
 * full step, and both print their value. Identity is the row label.
 */
type Row = { key: string; provider: string; sub: string; input: number; output: number; cached: number | null; builder: boolean };

const illustrative: Row[] = quotes.map((q) => ({ key: q.provider, provider: q.provider, sub: q.archetype, input: q.input, output: q.output, cached: q.cached, builder: q.archetype === "Builder" }));
const rowsOf = (endpoints: Endpoint[], author: string): Row[] =>
  endpoints.map((e) => ({
    key: `${e.provider}|${e.tag}`, provider: e.provider, sub: [...new Set([...e.tag.split("/").slice(1), e.quant && e.quant !== "unknown" ? e.quant : ""].filter(Boolean))].join(" · "),
    input: e.input, output: e.output, cached: e.cached,
    builder: e.provider.toLowerCase().replace(/[^a-z0-9]/g, "") === author.replace(/[^a-z0-9]/g, ""),
  }));

export default function TokenLadder() {
  const live = tokenModels.length > 0;
  // Open on the model whose cheapest input quote is furthest below list: the one where the ranking matters most.
  const preferred = tokenModels.reduce((best, m, i) => {
    const ratio = m.list.input / Math.min(...standardTier(m).map((e) => e.input));
    return ratio > best.ratio ? { i, ratio } : best;
  }, { i: 0, ratio: 0 }).i;
  const [which, setWhich] = useState(preferred);
  const [cachedShare, setCachedShare] = useState(0.8);
  const [outPerK, setOutPerK] = useState(200);
  const [honoured, setHonoured] = useState(1);
  const [rankOn, setRankOn] = useState<"quoted" | "effective">("quoted");
  const [showAll, setShowAll] = useState(false);

  const model = live ? tokenModels[Math.min(which, tokenModels.length - 1)] : null;
  const list = model ? model.list : { input: quotes[0].input, output: quotes[0].output, cached: quotes[0].cached as number | null };
  const base = model ? rowsOf(standardTier(model), model.author) : illustrative;
  const r = outPerK / 1000;

  // Effective cost per million input tokens of a session: uncached input, cached input, and the output generated.
  const effective = (q: { input: number; output: number; cached: number | null }, honour: number) => {
    const hit = cachedShare * honour;
    return (1 - hit) * q.input + hit * (q.cached ?? q.input) + r * q.output;
  };
  const listEffective = effective(list, 1);
  const rows = base
    .map((q) => {
      const deep = q.input < list.input * 0.6 && !q.builder;
      const eff = effective(q, deep ? honoured : 1);
      // Output tokens per thousand input above which this quote costs more than the list price.
      const slope = q.output - list.output;
      const gap = effective({ ...list, output: 0 }, 1) - effective({ ...q, output: 0 }, deep ? honoured : 1);
      const crossover = slope > 0 && gap > 0 ? (gap / slope) * 1000 : null;
      return { ...q, deep, eff, crossover, rank: rankOn === "quoted" ? q.input : eff };
    })
    .sort((a, b) => a.input - b.input);
  const weightSum = rows.reduce((n, q) => n + 1 / (q.rank * q.rank), 0);
  const shares = rows.map((q) => 1 / (q.rank * q.rank) / weightSum);
  const shrouded = rows.map((q, i) => ({ q, share: shares[i] })).filter(({ q }) => q.input < list.input && q.eff > listEffective);
  const shroudedShare = shrouded.reduce((n, s) => n + s.share, 0);
  const paid = rows.reduce((n, q, i) => n + shares[i] * q.eff, 0);

  const visible = showAll ? rows : rows.filter((q, i) => i < 10 || q.builder);
  const max = Math.max(...visible.map((q) => Math.max(q.input, q.eff)), listEffective);
  const providers = model?.providers ?? rows.length;
  const state = live ? feed("tokens")?.state : "illustrative";
  const money = (v: number) => `$${v < 0.1 ? v.toFixed(3) : v.toFixed(2)}`;

  return (
    <div className="chart-card ladder">
      <div className="chart-head">
        <div>
          <h3>The souq: the price the router ranks, and the price a session pays</h3>
          <p>Every standard-tier endpoint for one open-weight model. Quoted input price beside the effective cost per million input tokens, counting the cached share and the output those tokens generate.</p>
        </div>
        <Provenance state={state} asOf={live ? feed("tokens")?.asOf : undefined} source={live ? "OpenRouter public quotes" : "synthetic archetypes"} />
      </div>

      <div className="filters compact five" aria-label="Souq controls">
        {live && (
          <label>Model
            <select value={which} onChange={(e) => { setWhich(Number(e.target.value)); setShowAll(false); }}>
              {tokenModels.map((m, i) => <option key={m.id} value={i}>{m.name.replace(/^.*?: /, "")} · {m.providers} providers</option>)}
            </select>
          </label>
        )}
        <label>Input served from cache <b>{Math.round(cachedShare * 100)}%</b>
          <input type="range" min={0} max={0.95} step={0.05} value={cachedShare} onChange={(e) => setCachedShare(Number(e.target.value))} />
        </label>
        <label>Output per 1,000 input tokens <b>{outPerK}</b>
          <input type="range" min={5} max={500} step={5} value={outPerK} onChange={(e) => setOutPerK(Number(e.target.value))} />
        </label>
        <label>Router ranks on
          <select value={rankOn} onChange={(e) => setRankOn(e.target.value as "quoted" | "effective")}>
            <option value="quoted">Quoted input price (default rule)</option>
            <option value="effective">Effective session cost (the fix)</option>
          </select>
        </label>
        <label title="A hypothetical: cache-hit counts are reported by the seller and cannot be checked.">Cache hits reported by deep discounters <b>{Math.round(honoured * 100)}%</b>
          <input type="range" min={0} max={1} step={0.05} value={honoured} onChange={(e) => setHonoured(Number(e.target.value))} />
        </label>
      </div>

      <ul className="legend legend-row">
        <li><i className="swatch block quoted" aria-hidden="true" />Quoted input, $ per M tokens</li>
        <li><i className="swatch block effective" aria-hidden="true" />Effective cost, $ per M input tokens of session</li>
        <li><i className="list-rule" aria-hidden="true" />List price, effective: {money(listEffective)}</li>
      </ul>

      <ul className="ladder-rows">
        {visible.map((q) => {
          const i = rows.indexOf(q);
          const worse = q.eff > listEffective * 1.001;
          return (
            <li key={q.key} className="ladder-row">
              <span className="ladder-name">{q.provider}{q.builder && <em className="tag">builder</em>}<small>{q.sub || "standard"} · out {money(q.output)}{q.cached !== null ? ` · cached ${money(q.cached)}` : " · no cache price"}</small></span>
              <span className="ladder-bars">
                <i className="list-rule in-track" style={{ left: `${(listEffective / max) * 100}%` }} />
                <i className="ladder-bar quoted" style={{ width: `${(q.input / max) * 100}%` }}><b>{money(q.input)}</b></i>
                <i className="ladder-bar effective" style={{ width: `${(q.eff / max) * 100}%` }}><b>{money(q.eff)}</b></i>
              </span>
              <span className={`ladder-share ${worse && q.input < list.input ? "worse" : ""}`}>
                <b>{(shares[i] * 100).toFixed(shares[i] < 0.1 ? 1 : 0)}%</b>
                <small>{worse && q.input < list.input ? `ranked cheaper, costs ${((q.eff / listEffective - 1) * 100).toFixed(0)}% more` : q.crossover ? `cheaper below ${Math.round(q.crossover)} out/1k` : "of default routing"}</small>
              </span>
            </li>
          );
        })}
      </ul>
      {rows.length > visible.length && <button className="method-button" onClick={() => setShowAll(true)}>Show all {rows.length} endpoints ↓</button>}

      <div className="stack-readouts">
        <div><small>RANKED CHEAPER, COSTS MORE</small><b>{shrouded.length} of {rows.length}</b><span>endpoints, for this workload mix</span></div>
        <div><small>ROUTING SHARE THEY RECEIVE</small><b>{(shroudedShare * 100).toFixed(0)}%</b><span>under the {rankOn === "quoted" ? "default" : "corrected"} rule</span></div>
        <div><small>AVERAGE PAID VS LIST</small><b>{paid >= listEffective ? "+" : "−"}{Math.abs((paid / listEffective - 1) * 100).toFixed(0)}%</b><span>{money(paid)} against {money(listEffective)} effective</span></div>
        <div><small>SESSION COST MULTIPLE</small><b>{sessionMultiple(providers).toFixed(2)}×</b><span>per-request routing across {providers} providers</span></div>
      </div>
      <p className="chart-note">
        Effective cost = (1 − cached share) × input + cached share × cached price + output per input × output price. A missing cached price is charged at the input price. Routing share is proportional to 1 ÷ price², the router&apos;s documented default, over standard-tier endpoints only.
        The last slider is a hypothetical: cache counts are self-reported, so it shows what the same quotes would cost if endpoints priced more than 40% under list reported only part of their cache hits. Session multiple is fitted to two published points and assumes each turn lands on a random provider.
      </p>
    </div>
  );
}
