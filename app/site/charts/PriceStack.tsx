"use client";

import { useState } from "react";

import Provenance from "./Provenance";

/**
 * From a megawatt-hour to a token: the price stack from the guide's token-prices chapter as a live
 * calculation. One stacked bar shows the composition of an all-in GPU-hour;
 * the readouts convert it to $/M tokens for prefill and decode.
 *
 * Segments are parts of one whole, so this is the categorical order with 2px
 * surface gaps and every segment labelled. Sliders expose the three inputs a
 * reader is most likely to disagree with.
 */
export default function PriceStack() {
  const [power, setPower] = useState(60); // $/MWh
  const [hardware, setHardware] = useState(30); // $k installed per accelerator
  const [util, setUtil] = useState(0.7);
  const [life, setLife] = useState(5);

  const kw = 1.5; // all-in kW per accelerator at PUE ~1.2
  const electricity = (power / 1000) * kw; // $/GPU-hour
  const hours = life * 8760 * util;
  const depreciation = (hardware * 1000) / hours;
  const facility = 0.4;
  const capital = (hardware * 1000 * 0.1 * 0.5) / hours; // 10% on the average undepreciated balance
  const total = electricity + depreciation + facility + capital;

  const node = total * 8; // $/hour for an 8-accelerator node
  const decodeTps = 3000;
  const prefillTps = 50000;
  const perMOut = (node / (decodeTps * 3600)) * 1e6;
  const perMIn = (node / (prefillTps * 3600)) * 1e6;

  const parts = [
    { key: "electricity", label: "Electricity", value: electricity },
    { key: "depreciation", label: "Depreciation", value: depreciation },
    { key: "facility", label: "Facility & ops", value: facility },
    { key: "capital", label: "Cost of capital", value: capital },
  ];

  return (
    <div className="chart-card stack">
      <div className="chart-head">
        <div>
          <h3>From electrons to tokens</h3>
          <p>The composition of an all-in accelerator-hour, and what it implies per million tokens on an eight-accelerator node. Move the inputs.</p>
        </div>
        <Provenance state="model" source="every input adjustable" />
      </div>
      <div className="chart-head tight">
        <ul className="legend legend-row">
          {parts.map((p) => <li key={p.key}><i className={`swatch ${p.key}`} aria-hidden="true" />{p.label}</li>)}
        </ul>
      </div>

      <div className="filters compact four" aria-label="Price stack inputs">
        <label>Power <b>${power}/MWh</b><input type="range" min={20} max={200} step={5} value={power} onChange={(e) => setPower(Number(e.target.value))} /></label>
        <label>Installed hardware <b>${hardware}k</b><input type="range" min={10} max={60} step={1} value={hardware} onChange={(e) => setHardware(Number(e.target.value))} /></label>
        <label>Utilization <b>{Math.round(util * 100)}%</b><input type="range" min={0.3} max={0.95} step={0.05} value={util} onChange={(e) => setUtil(Number(e.target.value))} /></label>
        <label>Useful life <b>{life} y</b><input type="range" min={3} max={7} step={1} value={life} onChange={(e) => setLife(Number(e.target.value))} /></label>
      </div>

      <div className="stack-bar" role="img" aria-label={`All-in cost ${total.toFixed(2)} dollars per accelerator-hour`}>
        {parts.map((p) => (
          <i key={p.key} className={`stack-seg ${p.key}`} style={{ width: `${(p.value / total) * 100}%` }} title={`${p.label}: $${p.value.toFixed(2)}`}>
            {p.value / total > 0.09 && <b>${p.value.toFixed(2)}</b>}
          </i>
        ))}
      </div>

      <div className="stack-readouts">
        <div><small>ALL-IN COST</small><b>${total.toFixed(2)}</b><span>per accelerator-hour</span></div>
        <div><small>ELECTRICITY SHARE</small><b>{((electricity / total) * 100).toFixed(0)}%</b><span>of the hour</span></div>
        <div><small>OUTPUT TOKENS</small><b>${perMOut.toFixed(2)}</b><span>per million · decode at {decodeTps.toLocaleString()} tok/s</span></div>
        <div><small>INPUT TOKENS</small><b>${perMIn.toFixed(3)}</b><span>per million · prefill at {prefillTps.toLocaleString()} tok/s</span></div>
      </div>
      <p className="chart-note">Illustrative H100-class arithmetic: 1.5 kW all-in per accelerator at PUE 1.2; facility and operations fixed at $0.40; capital at 10% on the average undepreciated balance. Cached tokens cost a fraction of the input figure. Compare against the posted rental above to read the operator&apos;s spread.</p>
    </div>
  );
}
