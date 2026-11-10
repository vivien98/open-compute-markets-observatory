"use client";

import { useState } from "react";

import Provenance from "./Provenance";

/**
 * Who has financed the cluster on the day it is switched on.
 *
 * Parts of one whole, so a single stacked bar with a 2px surface gap and every
 * segment labelled; the legend repeats the identities. The point of the chart
 * is the third segment: the customer's prepayment usually covers the
 * operator's entire equity.
 */
export default function CapitalStack() {
  const [gpus, setGpus] = useState(1024);
  const [price, setPrice] = useState(3.5);
  const [years, setYears] = useState(3);
  const [prepay, setPrepay] = useState(30);
  const [advance, setAdvance] = useState(75);
  const [cost, setCost] = useState(60);

  const hardware = gpus * cost * 1000;
  const tcv = gpus * price * 8760 * years;
  const debt = (hardware * advance) / 100;
  const equityNeeded = hardware - debt;
  const prepayment = (tcv * prepay) / 100;
  const fromCustomer = Math.min(prepayment, equityNeeded);
  const fromOperator = Math.max(0, equityNeeded - prepayment);
  const surplus = Math.max(0, prepayment - equityNeeded);
  const m = (v: number) => `$${(v / 1e6).toFixed(v >= 1e8 ? 0 : 1)}M`;

  const parts = [
    { key: "lender", label: "Senior lender", value: debt },
    { key: "customer", label: "Customer prepayment", value: fromCustomer },
    { key: "operator", label: "Operator's own cash", value: fromOperator },
  ].filter((p) => p.value > 0);

  return (
    <div className="chart-card">
      <div className="chart-head">
        <div>
          <h3>Who finances day one</h3>
          <p>The hardware bill for one cluster, split by whose money pays it. The customer&apos;s prepayment arrives before the hardware is bought.</p>
        </div>
        <Provenance state="model" source="structure: Anera; example: Peak FLOPS" />
      </div>

      <div className="filters compact three" aria-label="Capital stack inputs">
        <label>Accelerators <b>{gpus.toLocaleString()}</b><input type="range" min={128} max={8192} step={128} value={gpus} onChange={(e) => setGpus(Number(e.target.value))} /></label>
        <label>Contract price <b>${price.toFixed(2)}/hr</b><input type="range" min={1.5} max={9} step={0.25} value={price} onChange={(e) => setPrice(Number(e.target.value))} /></label>
        <label>Term <b>{years} years</b><input type="range" min={1} max={5} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} /></label>
        <label>Prepayment <b>{prepay}% of contract</b><input type="range" min={0} max={50} step={5} value={prepay} onChange={(e) => setPrepay(Number(e.target.value))} /></label>
        <label>Lender advance <b>{advance}% of hardware</b><input type="range" min={50} max={90} step={5} value={advance} onChange={(e) => setAdvance(Number(e.target.value))} /></label>
        <label>Installed cost <b>${cost}k each</b><input type="range" min={20} max={120} step={5} value={cost} onChange={(e) => setCost(Number(e.target.value))} /></label>
      </div>

      <ul className="legend legend-row">{parts.map((p) => <li key={p.key}><i className={`swatch block ${p.key}`} aria-hidden="true" />{p.label}</li>)}</ul>
      <div className="stack-bar" role="img" aria-label={`Hardware cost ${m(hardware)}: ${parts.map((p) => `${p.label} ${m(p.value)}`).join(", ")}`}>
        {parts.map((p) => (
          <i key={p.key} className={`stack-seg ${p.key}`} style={{ width: `${(p.value / hardware) * 100}%` }} title={`${p.label}: ${m(p.value)}`}>
            {p.value / hardware > 0.1 && <b>{m(p.value)}</b>}
          </i>
        ))}
      </div>

      <div className="stack-readouts">
        <div><small>HARDWARE</small><b>{m(hardware)}</b><span>{gpus.toLocaleString()} accelerators installed</span></div>
        <div><small>TOTAL CONTRACT VALUE</small><b>{m(tcv)}</b><span>over {years} years, take-or-pay</span></div>
        <div><small>CUSTOMER PAYS AT SIGNING</small><b>{m(prepayment)}</b><span>8 to 16 weeks before delivery</span></div>
        <div><small>{surplus > 0 ? "OPERATOR IS LEFT HOLDING" : "OPERATOR MUST FIND"}</small><b>{m(surplus > 0 ? surplus : fromOperator)}</b><span>{surplus > 0 ? "of the customer's cash after funding its whole equity" : "of its own equity, plus a debt-service reserve"}</span></div>
      </div>
      <p className="chart-note">Illustrative. The lender also asks for about three months of debt service in reserve, not shown. At the defaults the customer funds all of the operator&apos;s equity and ends the contract owning nothing; the operator ends it owning the cluster.</p>
    </div>
  );
}
