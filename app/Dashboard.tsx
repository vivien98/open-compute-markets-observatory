"use client";

import { useEffect, useMemo, useState } from "react";

import { clusters, url } from "./site/nav";

type Signal = {
  id: number; layer: string; title: string; value: string; unit: string; change: string;
  direction: "up" | "down" | "flat"; availability: string; fit: "Direct" | "Proxy" | "Gap";
  source: string; relevance: string; score: number; points: number[];
};

const signals: Signal[] = [
  { id:1, layer:"Compute", title:"H100 marketplace ask", value:"$2.18", unit:"GPU-hour", change:"−6.4% / 30d", direction:"down", availability:"PROXY", fit:"Proxy", source:"Illustrative marketplace basket", relevance:"Falling asks are consistent with easing marginal rental scarcity.", score:86, points:[82,76,80,70,65,67,58,61,54,48] },
  { id:2, layer:"Power", title:"PJM Western Hub", value:"$71", unit:"MWh · 7d avg", change:"+18.2% / 7d", direction:"up", availability:"OPEN_API", fit:"Direct", source:"Illustrative ISO snapshot", relevance:"Power repricing can change site economics before server prices move.", score:82, points:[35,41,38,50,45,58,62,55,68,78] },
  { id:3, layer:"Sites", title:"US data-center build", value:"$4.7B", unit:"monthly spend", change:"+24.1% YoY", direction:"up", availability:"OPEN_DOWNLOAD", fit:"Direct", source:"Illustrative Census series", relevance:"Construction is accelerating, but spending does not equal delivered MW.", score:76, points:[25,30,34,42,40,48,52,61,68,79] },
  { id:4, layer:"Silicon", title:"Foundry revenue proxy", value:"+31%", unit:"year over year", change:"+3.8pp / 1m", direction:"up", availability:"PUBLIC_MANUAL", fit:"Proxy", source:"Illustrative issuer release", relevance:"A high-frequency foundry signal, not a measure of AI wafer volume.", score:72, points:[40,45,43,50,56,58,64,62,72,77] },
  { id:5, layer:"Capital", title:"BBB option-adjusted spread", value:"116", unit:"basis points", change:"−5bp / 30d", direction:"down", availability:"OPEN_API", fit:"Direct", source:"Illustrative FRED series", relevance:"Tighter spreads lower the financing hurdle for investment-grade builders.", score:64, points:[75,70,68,72,62,58,55,52,50,46] },
  { id:6, layer:"Memory", title:"HBM contract price", value:"—", unit:"not observed", change:"No public series", direction:"flat", availability:"NOT_PUBLIC", fit:"Gap", source:"Research gap registry", relevance:"The economically relevant contract market remains bilateral and opaque.", score:58, points:[50,50,50,50,50,50,50,50,50,50] },
];

const unknowns = [
  { market:"HBM contract pricing", last:"Producer guidance only", next:"Quarterly earnings", tier:"Company disclosure", confidence:"Low" },
  { market:"Advanced packaging slots", last:"Capacity estimate · Q2", next:"Supplier updates", tier:"Industry estimate", confidence:"Medium" },
  { market:"Powered land · $/MW", last:"3 verified records", next:"Deeds + PUC dockets", tier:"Primary records", confidence:"Medium" },
  { market:"Project loan spreads", last:"Selected deal reports", next:"Rating presales", tier:"Professional reporting", confidence:"Low" },
];

const chain = [
  {n:"01",name:"Compute",detail:"Rental price",state:"Easing",tone:"cool",guide:"units"},
  {n:"02",name:"Accelerators",detail:"Selling price",state:"Opaque",tone:"quiet",guide:"silicon"},
  {n:"03",name:"Memory",detail:"HBM allocation",state:"Binding",tone:"warm",guide:"silicon"},
  {n:"04",name:"Networks",detail:"Optics lead time",state:"Watch",tone:"warm",guide:"silicon"},
  {n:"05",name:"Sites",detail:"Delivered MW",state:"Tight",tone:"warm",guide:"data-centers"},
  {n:"06",name:"Power",detail:"Hub basis",state:"Rising",tone:"warm",guide:"data-centers"},
  {n:"07",name:"Capital",detail:"Credit hurdle",state:"Open",tone:"cool",guide:"financing"},
];

function Sparkline({points, direction}:{points:number[];direction:Signal["direction"]}) {
  const coords = points.map((p,i)=>`${(i/(points.length-1))*100},${100-p}`).join(" ");
  return <svg className={`sparkline ${direction}`} viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Illustrative recent trend"><line x1="0" y1="50" x2="100" y2="50"/><polyline points={coords}/><circle cx="100" cy={100-points[points.length-1]} r="2.7"/></svg>;
}

export default function Dashboard() {
  const [layer,setLayer] = useState("All layers");
  const [fit,setFit] = useState("All evidence");
  const [period,setPeriod] = useState("30 days");
  const [showMethods,setShowMethods] = useState(false);
  const [showContribute,setShowContribute] = useState(false);
  useEffect(()=>{
    if(!showContribute) return;
    const onKey=(e:KeyboardEvent)=>{ if(e.key==="Escape") setShowContribute(false); };
    document.addEventListener("keydown",onKey);
    return ()=>document.removeEventListener("keydown",onKey);
  },[showContribute]);
  const filtered = useMemo(()=>signals.filter(s=>(layer==="All layers"||s.layer===layer)&&(fit==="All evidence"||s.fit===fit)),[layer,fit]);
  return <main id="top">
    <header className="topbar">
      <a className="brand" href="#top"><span className="brand-mark">O</span><span>Open Compute Markets</span></a>
      <nav aria-label="Primary navigation"><a className="active" href="#overview">Overview</a><a href="#markets">Markets</a><a href="#chain">Supply chain</a><a href={url("guide/")}>Guide</a><a href={url("glossary/")}>Glossary</a><a href={url("sources/")}>Sources</a></nav>
      <button className="contribute" onClick={()=>setShowContribute(true)}>Contribute a source <span>↗</span></button>
    </header>

    <section className="hero" id="overview">
      <div className="eyebrow"><span className="pulse"/> RESEARCH PREVIEW · ILLUSTRATIVE DATA</div>
      <h1>Where AI infrastructure<br/>meets the market.</h1>
      <p className="lede">An open, evidence-first view of the prices, bottlenecks, and financing conditions shaping the AI compute supply chain.</p>
      <div className="hero-meta"><span><b>64</b> indicators mapped</span><i/><span><b>8</b> supply-chain layers</span><i/><span><b>6</b> preview signals</span></div>
      <div className="orbit" aria-hidden="true"><span/><span/><span/><b>OCMO</b></div>
    </section>

    <section className="market-panel" id="markets">
      <div className="section-head">
        <div><span className="kicker">MARKET PULSE</span><h2>What changed?</h2></div>
        <p>Ranked by materiality, rarity, confirmation,<br/>centrality, confidence, and recency.</p>
      </div>
      <div className="filters" aria-label="Signal filters">
        <label>Layer<select value={layer} onChange={e=>setLayer(e.target.value)}><option>All layers</option>{[...new Set(signals.map(s=>s.layer))].map(x=><option key={x}>{x}</option>)}</select></label>
        <label>Evidence<select value={fit} onChange={e=>setFit(e.target.value)}><option>All evidence</option><option>Direct</option><option>Proxy</option><option>Gap</option></select></label>
        <label>Horizon<select value={period} onChange={e=>setPeriod(e.target.value)}><option>7 days</option><option>30 days</option><option>1 year</option></select></label>
        <div className="filter-note"><span className="dot direct"/>Direct <span className="dot proxy"/>Proxy <span className="dot gap"/>Gap</div>
      </div>
      <div className="signal-grid">
        {filtered.map(signal=><article className="signal-card" key={signal.id}>
          <div className="card-top"><span className="layer-label">{signal.layer}</span><span className={`evidence ${signal.fit.toLowerCase()}`}>{signal.availability}</span></div>
          <h3>{signal.title}</h3><div className="metric"><strong>{signal.value}</strong><span>{signal.unit}</span></div>
          <div className="chart-row"><span className={`change ${signal.direction}`}>{signal.direction==="up"?"↗":signal.direction==="down"?"↘":"—"} {signal.change}</span><Sparkline points={signal.points} direction={signal.direction}/></div>
          <p>{signal.relevance}</p><footer><span>{signal.source}</span><b title="Interest score">{signal.score}</b></footer>
        </article>)}
        {filtered.length===0&&<div className="empty">No signals match these filters.</div>}
      </div>
      <p className="data-caveat">Preview figures demonstrate the interface and evidence model; connect approved source adapters before treating them as current observations. Selected horizon: {period}.</p>
    </section>

    <section className="chain" id="chain">
      <div className="chain-head"><div><span className="kicker">THE PHYSICAL STACK</span><h2>One chain. Many constraints.</h2></div><p>Read left to right—from the service users buy back to the physical and financial capacity that makes it possible.</p></div>
      <div className="chain-track">{chain.map((item,i)=><a className="chain-node" href={url(`guide/${item.guide}/`)} key={item.name}><span>{item.n}</span><div className="node-icon">{["◇","▦","▤","⌁","⌂","ϟ","$ "][i]}</div><h3>{item.name}</h3><small>{item.detail}</small><b className={item.tone}>{item.state}</b><em className="node-learn">Read →</em>{i<chain.length-1&&<i>→</i>}</a>)}</div>
      <div className="chain-insight"><span>WATCH</span><p><b>Power is moving upstream.</b> More projects are being shaped by energization dates and grid equipment availability before the accelerator order is finalized.</p><em>Consistent with multiple public planning dockets—not a causal claim.</em></div>
    </section>

    <section className="compare">
      <div className="section-head"><div><span className="kicker">COMPARABLE CONFIGURATIONS</span><h2>Posted compute prices</h2></div><p>Normalized only where hardware, memory,<br/>region, tenancy, and commitment match.</p></div>
      <div className="price-table" role="table" aria-label="Illustrative compute price comparison">
        <div className="tr head" role="row"><span>Configuration</span><span>Market</span><span>Commitment</span><span>$/GPU-hour</span><span>30d</span></div>
        {[["NVIDIA H100 · 80GB","Marketplace basket","On demand","$2.18","−6.4%"],["NVIDIA A100 · 80GB","Marketplace basket","On demand","$1.14","−3.1%"],["NVIDIA H100 · 80GB","Public cloud basket","1 year","$3.42","0.0%"],["NVIDIA L40S · 48GB","Specialist cloud","On demand","$1.02","−8.9%"]].map((r,i)=><div className="tr" role="row" key={i}>{r.map((x,j)=><span key={j}>{j===0&&<i className="chip"/>}{x}</span>)}</div>)}
      </div>
    </section>

    <section className="unknowns" id="unknowns">
      <div className="unknowns-intro"><span className="kicker">KNOWN UNKNOWNS</span><h2>Absence is also<br/>a data point.</h2><p>Some of the most important AI infrastructure markets are negotiated privately. We show the gap instead of inventing a number.</p><button onClick={()=>setShowContribute(true)}>Contribute a source lead ↗</button></div>
      <div className="unknown-list">{unknowns.map((u,i)=><article key={u.market}><span className="unknown-num">0{i+1}</span><div><h3>{u.market}</h3><p>Last credible observation: {u.last}</p></div><div><small>NEXT DISCLOSURE</small><b>{u.next}</b></div><div><small>SOURCE TIER</small><b>{u.tier}</b></div><span className={`confidence ${u.confidence.toLowerCase()}`}>{u.confidence}</span></article>)}</div>
    </section>

    <section className="methods">
      <div><span className="kicker">METHODS & PROVENANCE</span><h2>Trust the evidence,<br/>inspect the method.</h2></div>
      <div className="method-grid"><article><b>01</b><h3>Separate evidence</h3><p>Market prices, operating quantities, proxies, and unobserved markets never share an unlabeled axis.</p></article><article><b>02</b><h3>Restore the denominator</h3><p>Every compute observation retains hardware, memory, region, commitment, tenancy, and availability.</p></article><article><b>03</b><h3>Keep flags inspectable</h3><p>Deterministic thresholds and robust statistics rank attention; they do not manufacture causal stories.</p></article></div>
      <button className="method-button" onClick={()=>setShowMethods(!showMethods)}>{showMethods?"Hide":"View"} methodology {showMethods?"↑":"↓"}</button>
      {showMethods&&<div className="method-detail"><p><b>Interest score:</b> magnitude 30% · historical rarity 20% · cross-source confirmation 20% · supply-chain centrality 15% · source confidence 10% · recency 5%.</p><p><b>Verification:</b> a community observation needs two independent sources or one primary document. Licensed and private sources default to link-out.</p></div>}
    </section>

    <section className="learn" id="learn">
      <div className="section-head"><div><span className="kicker">FIELD GUIDE</span><h2>Understand the whole chain.</h2></div><p>Every indicator above rests on definitions,<br/>accounting boundaries, and financing structures.</p></div>
      <div className="learn-grid">{clusters.map(cluster=><div className="learn-col" key={cluster.name}><span className="kicker">{cluster.name}</span><ul>{cluster.pages.map(page=><li key={page.slug}><a href={url(`guide/${page.slug}/`)}>{page.label}</a></li>)}</ul></div>)}</div>
      <div className="learn-cta"><a className="primary" href={url("guide/")}>Open the guide ↗</a><a href={url("glossary/")}>121 glossary terms</a><a href={url("sources/")}>23 primary sources</a></div>
    </section>

    <footer className="site-footer"><div className="brand"><span className="brand-mark">O</span><span>Open Compute Markets Observatory</span></div><p>Public research infrastructure. Not investment advice.</p><a href="#top">Back to top ↑</a></footer>

    {showContribute&&
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- pointer-only convenience; Escape and the close button are the accessible paths
      <div className="modal-backdrop" role="presentation" onMouseDown={()=>setShowContribute(false)}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={e=>e.stopPropagation()}><button className="close" aria-label="Close" onClick={()=>setShowContribute(false)}>×</button><span className="kicker">SOURCE LEAD</span><h2 id="modal-title">Help close a gap.</h2><p>Submit a URL, date, market, short description, and access status. Unsupported numbers are not accepted as observations.</p><form onSubmit={e=>{e.preventDefault();setShowContribute(false)}}><label>Source URL<input required type="url" placeholder="https://…"/></label><label>Market<input required placeholder="e.g. HBM contracts"/></label><label>Why it matters<textarea required rows={3} placeholder="What does this source add?"/></label><button type="submit">Prepare source lead</button></form></div></div>}
  </main>;
}
