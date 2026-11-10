"use client";

import { useState } from "react";

import { feed, gpuSkus, standardTier, tokenModels } from "../../content/live";
import Provenance from "./Provenance";

/**
 * The silicon spread without a throughput assumption.
 *
 * Token revenue per GPU-hour depends on how many tokens the accelerator
 * produces, which nobody publishes. So the chart turns the question round:
 * how many output tokens per second must one accelerator sustain for output
 * revenue alone to pay its rental? Each model gets two marks on a shared log
 * axis, the list price and the cheapest ask. The vertical rule is the reader's
 * own throughput assumption; marks to its right are under water at that rate.
 */
export default function BreakevenThroughput() {
  const skus = gpuSkus.length ? gpuSkus : [{ sku: "H100", median: 2.2 }];
  const [sku, setSku] = useState(skus[0].sku);
  const [assumed, setAssumed] = useState(1500);
  const cost = skus.find((s) => s.sku === sku)?.median ?? skus[0].median;

  if (!tokenModels.length) {
    return <div className="chart-card"><div className="chart-head"><div><h3>Silicon spread: break-even throughput</h3><p>No token quotes yet. This chart fills on the first successful run of the OpenRouter feed.</p></div></div></div>;
  }

  const breakeven = (pricePerM: number) => (cost / pricePerM) * 1e6 / 3600;
  const rows = tokenModels.map((m) => {
    const cheapest = Math.min(...standardTier(m).map((e) => e.output));
    return { name: m.name.replace(/^.*?: /, ""), providers: m.providers, list: m.list.output, cheapest, beList: breakeven(m.list.output), beCheap: breakeven(cheapest) };
  }).sort((a, b) => a.beList - b.beList);

  const all = rows.flatMap((r) => [r.beList, r.beCheap]).concat(assumed);
  const lo = Math.log10(Math.min(...all)) - 0.15;
  const hi = Math.log10(Math.max(...all)) + 0.15;
  const pos = (v: number) => ((Math.log10(v) - lo) / (hi - lo)) * 100;
  const ticks = [10, 30, 100, 300, 1000, 3000, 10000, 30000].filter((t) => Math.log10(t) > lo && Math.log10(t) < hi);
  const state = feed("tokens")?.state;

  return (
    <div className="chart-card">
      <div className="chart-head">
        <div>
          <h3>Silicon spread: how hard must an accelerator work?</h3>
          <p>Output tokens per second one rented accelerator must sustain for output revenue alone to cover its hourly cost, at each model&apos;s list price and at its cheapest ask.</p>
        </div>
        <Provenance state={state} asOf={feed("tokens")?.asOf} source="OpenRouter quotes ÷ Vast.ai asks" />
      </div>

      <div className="filters compact three" aria-label="Break-even inputs">
        <label>Accelerator rented
          <select value={sku} onChange={(e) => setSku(e.target.value)}>{skus.map((s) => <option key={s.sku} value={s.sku}>{s.sku} · ${s.median.toFixed(2)}/hour median ask</option>)}</select>
        </label>
        <label>Your throughput assumption <b>{assumed.toLocaleString()} tok/s per accelerator</b>
          <input type="range" min={1.3} max={4.3} step={0.05} value={Math.log10(assumed)} onChange={(e) => setAssumed(Math.round(10 ** Number(e.target.value) / 10) * 10)} />
        </label>
        <ul className="legend"><li><i className="mark-dot list" aria-hidden="true" />At the list price</li><li><i className="mark-dot cheap" aria-hidden="true" />At the cheapest ask</li></ul>
      </div>

      <div className="dumbbells">
        <div className="db-axis" aria-hidden="true">
          {ticks.map((t) => <span key={t} style={{ left: `${pos(t)}%` }}>{t.toLocaleString()}</span>)}
          <i className="db-assumed" style={{ left: `${pos(assumed)}%` }} />
        </div>
        {rows.map((r) => {
          const under = r.beCheap > assumed;
          return (
            <div className="db-row" key={r.name}>
              <span className="db-name">{r.name}<small>{r.providers} providers · ${r.list.toFixed(2)} list, ${r.cheapest.toFixed(2)} cheapest per M output</small></span>
              <span className="db-track">
                <i className="db-assumed" style={{ left: `${pos(assumed)}%` }} />
                <i className="db-bar" style={{ left: `${pos(r.beList)}%`, width: `${Math.max(pos(r.beCheap) - pos(r.beList), 0)}%` }} />
                <i className="mark-dot list" style={{ left: `${pos(r.beList)}%` }} title={`List: ${Math.round(r.beList).toLocaleString()} tok/s`} />
                <i className="mark-dot cheap" style={{ left: `${pos(r.beCheap)}%` }} title={`Cheapest: ${Math.round(r.beCheap).toLocaleString()} tok/s`} />
              </span>
              <span className={`db-value ${under ? "worse" : ""}`}><b>{Math.round(r.beCheap).toLocaleString()}</b><small>{under ? "cheapest ask is under water" : "tok/s at cheapest ask"}</small></span>
            </div>
          );
        })}
      </div>
      <p className="chart-note">Break-even tokens per second = accelerator cost per hour ÷ output price per token ÷ 3,600. Input-token revenue is ignored, so true break-evens are somewhat lower; hardware differs by provider, so this is a yardstick, not a margin. Log scale. A cheapest ask far to the right of any plausible throughput is being paid for by something other than this token: cheaper hardware, a subsidy, or the other two prices in the quote.</p>
    </div>
  );
}
