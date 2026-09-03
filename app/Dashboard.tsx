"use client";

import { useEffect, useMemo, useState } from "react";

import { axisLabels, HORIZON_LABEL, HORIZONS, prices, signals, type Horizon } from "./content/signals";
import ChangeBars from "./site/charts/ChangeBars";
import CrossMarket from "./site/charts/CrossMarket";
import LinkageMap from "./site/charts/LinkageMap";
import PriceChart from "./site/charts/PriceChart";
import PriceStack from "./site/charts/PriceStack";
import Sparkline from "./site/charts/Sparkline";
import TokenLadder from "./site/charts/TokenLadder";
import { clusters, guide, url } from "./site/nav";
import glossary from "./content/glossary.json";
import shelf from "./content/sources.json";

const SOURCES = shelf.reduce((n, g) => n + g.items.length, 0);

const chain = [
  { n: "01", name: "Compute", detail: "Rental price", state: "Easing", tone: "cool", guide: "units", icon: "◇" },
  { n: "02", name: "Accelerators", detail: "Selling price", state: "Opaque", tone: "quiet", guide: "silicon", icon: "▦" },
  { n: "03", name: "Memory", detail: "HBM allocation", state: "Binding", tone: "warm", guide: "silicon", icon: "▤" },
  { n: "04", name: "Networks", detail: "Optics lead time", state: "Watch", tone: "warm", guide: "silicon", icon: "⌁" },
  { n: "05", name: "Sites", detail: "Delivered MW", state: "Tight", tone: "warm", guide: "data-centers", icon: "⌂" },
  { n: "06", name: "Power", detail: "Hub basis", state: "Rising", tone: "warm", guide: "data-centers", icon: "ϟ" },
  { n: "07", name: "Capital", detail: "Credit hurdle", state: "Open", tone: "cool", guide: "financing", icon: "$" },
];

const tokenChain = [
  { n: "08", name: "Harness", detail: "Owns the user & context", state: "Capturing", tone: "cool", guide: "souq", icon: "◉" },
  { n: "09", name: "Router", detail: "Ranks on input price", state: "Thin fee", tone: "quiet", guide: "souq", icon: "⇶" },
  { n: "10", name: "Model builder", detail: "Bears training CapEx", state: "Squeezed", tone: "warm", guide: "souq", icon: "⊛" },
  { n: "11", name: "Inference provider", detail: "Cache unverifiable", state: "Capturing", tone: "cool", guide: "souq", icon: "▣" },
  { n: "12", name: "Compute rental", detail: "GPU-hour index & futures", state: "Emerging", tone: "quiet", guide: "token-prices", icon: "◇" },
];

const unknowns = [
  { market: "HBM contract pricing", last: "Producer guidance only", next: "Quarterly earnings", tier: "Company disclosure", confidence: "Low", guide: "silicon" },
  { market: "Advanced packaging slots", last: "Capacity estimate · Q2", next: "Supplier updates", tier: "Industry estimate", confidence: "Medium", guide: "silicon" },
  { market: "Powered land · $/MW", last: "3 verified records", next: "Deeds + PUC dockets", tier: "Primary records", confidence: "Medium", guide: "data-centers" },
  { market: "Project loan spreads", last: "Selected deal reports", next: "Rating presales", tier: "Professional reporting", confidence: "Low", guide: "financing" },
  { market: "Cache-hit rate by inference provider", last: "One independent canary study", next: "Router audits or attestations", tier: "Independent research", confidence: "Low", guide: "souq" },
  { market: "Accelerator transaction prices", last: "List prices; allocation private", next: "Customer 10-K commitments", tier: "Company disclosure", confidence: "Low", guide: "silicon" },
];

export default function Dashboard() {
  const [layer, setLayer] = useState("All layers");
  const [fit, setFit] = useState("All evidence");
  const [horizon, setHorizon] = useState<Horizon>("30d");
  const [showMethods, setShowMethods] = useState(false);
  const [showContribute, setShowContribute] = useState(false);

  useEffect(() => {
    if (!showContribute) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShowContribute(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showContribute]);

  const filtered = useMemo(
    () => signals.filter((s) => (layer === "All layers" || s.layer === layer) && (fit === "All evidence" || s.fit === fit)),
    [layer, fit],
  );

  return (
    <main id="top">
      <header className="topbar">
        <a className="brand" href={url("")}><span className="brand-mark">O</span><span>Open Compute Markets</span></a>
        <nav aria-label="Primary navigation">
          <a className="active" href="#markets">Markets</a>
          <a href="#wiring">Wiring</a>
          <a href="#chain">Supply chain</a>
          <a href={url("guide/")}>Guide</a>
          <a href={url("glossary/")}>Glossary</a>
          <a href={url("sources/")}>Sources</a>
        </nav>
        <button className="contribute" onClick={() => setShowContribute(true)}>Contribute a source <span>↗</span></button>
      </header>

      <section className="hero" id="overview">
        <div className="eyebrow"><span className="pulse" /> RESEARCH PREVIEW · ILLUSTRATIVE DATA</div>
        <h1>Where AI infrastructure<br />meets the market.</h1>
        <p className="lede">An open, evidence-first view of every market in the AI compute chain — from lithography and memory to power, GPU-hours, compute futures, and the open-weight token market — with the markets nobody can observe marked as gaps rather than filled with guesses.</p>
        <div className="hero-meta"><span><b>{signals.length}</b> indicators shown</span><i /><span><b>12</b> supply-chain layers</span><i /><span><b>{guide.length}</b> guide chapters</span></div>
        <div className="orbit" aria-hidden="true"><span /><span /><span /><b>OCMO</b></div>
      </section>

      <section className="market-panel" id="markets">
        <div className="section-head">
          <div><span className="kicker">MARKET PULSE</span><h2>What changed?</h2></div>
          <p>Ranked by materiality, rarity, confirmation,<br />centrality, confidence, and recency.</p>
        </div>

        <div className="filters" aria-label="Signal filters">
          <label>Horizon
            <select value={horizon} onChange={(e) => setHorizon(e.target.value as Horizon)}>
              {HORIZONS.map((h) => <option key={h} value={h}>{HORIZON_LABEL[h]}</option>)}
            </select>
          </label>
          <label>Layer
            <select value={layer} onChange={(e) => setLayer(e.target.value)}>
              <option>All layers</option>
              {[...new Set(signals.map((s) => s.layer))].map((x) => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label>Evidence
            <select value={fit} onChange={(e) => setFit(e.target.value)}>
              <option>All evidence</option><option>Direct</option><option>Proxy</option><option>Gap</option>
            </select>
          </label>
          <div className="filter-note"><span className="dot direct" />Direct <span className="dot proxy" />Proxy <span className="dot gap" />Gap</div>
        </div>

        <div className="signal-grid">
          {filtered.map((signal) => {
            const series = signal.series?.[horizon];
            const change = signal.change?.[horizon];
            const direction = change === undefined ? "flat" : change >= 0 ? "up" : "down";
            return (
              <article className="signal-card" key={signal.id}>
                <div className="card-top">
                  <span className="layer-label">{signal.layer}</span>
                  <span className={`evidence ${signal.fit.toLowerCase()}`}>{signal.availability}</span>
                </div>
                <h3>{signal.title}</h3>
                <div className="metric">
                  <strong>{signal.latest !== undefined && signal.format ? signal.format(signal.latest) : "—"}</strong>
                  <span>{signal.unit}</span>
                </div>
                {series && change !== undefined && signal.format ? (
                  <>
                    <span className={`change ${direction}`}>
                      {direction === "up" ? "↗" : "↘"} {change >= 0 ? "+" : "−"}{Math.abs(change).toFixed(1)}% · {HORIZON_LABEL[horizon]}
                    </span>
                    <Sparkline points={series} direction={direction as "up" | "down"} format={signal.format} labels={axisLabels(horizon)} />
                  </>
                ) : (
                  <div className="gap-state">
                    <b>No public series</b>
                    <span>The contract market is bilateral. Absence is the observation.</span>
                  </div>
                )}
                <p>{signal.relevance}</p>
                <footer>
                  <a className="card-guide" href={url(`guide/${signal.guide}/`)}>Understand this →</a>
                  <b title="Interest score">{signal.score}</b>
                </footer>
              </article>
            );
          })}
          {filtered.length === 0 && <div className="empty">No signals match these filters.</div>}
        </div>

        <div className="chart-stack">
          <PriceChart data={prices} horizon={horizon} />
          <ChangeBars data={signals} horizon={horizon} />
        </div>

        <div className="price-table" role="table" aria-label="Posted compute prices, table view">
          <div className="tr head" role="row"><span>Configuration</span><span>Market</span><span>Commitment</span><span>$/GPU-hour</span><span>{HORIZON_LABEL[horizon]}</span></div>
          {prices.map((row, i) => (
            <div className="tr" role="row" key={i}>
              <span><i className={`chip s${i + 1}`} />{row.config}</span>
              <span>{row.market}</span>
              <span>{row.commitment}</span>
              <span>${row.latest.toFixed(2)}</span>
              <span>{row.change[horizon] >= 0 ? "+" : "−"}{Math.abs(row.change[horizon]).toFixed(1)}%</span>
            </div>
          ))}
        </div>
        <p className="data-caveat">Preview figures demonstrate the interface and evidence model; connect approved source adapters before treating them as current observations.</p>
      </section>

      <section className="wiring" id="wiring">
        <div className="section-head">
          <div><span className="kicker">MARKET WIRING</span><h2>How the markets move each other.</h2></div>
          <p>Prices are telegrams. These charts show who sends them,<br />who reads them, and where the line is cut.</p>
        </div>
        <div className="wiring-grid">
          <LinkageMap />
          <TokenLadder />
          <div className="wiring-pair">
            <CrossMarket horizon={horizon} />
            <PriceStack />
          </div>
        </div>
        <p className="data-caveat">The linkage map is drawn from the guide&apos;s transmission table; the souq and price-stack figures are illustrative parameters, not observations.</p>
      </section>

      <section className="chain" id="chain">
        <div className="chain-head">
          <div><span className="kicker">THE PHYSICAL STACK · THE TOKEN STACK</span><h2>Two chains. Many constraints.</h2></div>
          <p>The first track is the physical chain from rental price back to capital. The second is the open-weight token chain from the harness a user touches down to the GPU-hour it consumes. Every node links to the chapter that explains it.</p>
        </div>
        <div className="chain-track">
          {chain.map((item, i) => (
            <a className="chain-node" href={url(`guide/${item.guide}/`)} key={item.name}>
              <span>{item.n}</span>
              <div className="node-icon">{item.icon}</div>
              <h3>{item.name}</h3>
              <small>{item.detail}</small>
              <b className={item.tone}>{item.state}</b>
              <em className="node-learn">Read →</em>
              {i < chain.length - 1 && <i>→</i>}
            </a>
          ))}
        </div>
        <p className="chain-sub">THE TOKEN STACK</p>
        <div className="chain-track five">
          {tokenChain.map((item, i) => (
            <a className="chain-node" href={url(`guide/${item.guide}/`)} key={item.name}>
              <span>{item.n}</span>
              <div className="node-icon">{item.icon}</div>
              <h3>{item.name}</h3>
              <small>{item.detail}</small>
              <b className={item.tone}>{item.state}</b>
              <em className="node-learn">Read →</em>
              {i < tokenChain.length - 1 && <i>→</i>}
            </a>
          ))}
        </div>
        <div className="chain-insight">
          <span>WATCH</span>
          <p><b>Power is moving upstream.</b> More projects are being shaped by energization dates and grid equipment availability before the accelerator order is finalized.</p>
          <em>Consistent with multiple public planning dockets—not a causal claim.</em>
        </div>
      </section>

      <section className="unknowns" id="unknowns">
        <div className="unknowns-intro">
          <span className="kicker">KNOWN UNKNOWNS</span>
          <h2>Absence is also<br />a data point.</h2>
          <p>Some of the most important AI infrastructure markets are negotiated privately. We show the gap instead of inventing a number.</p>
          <button onClick={() => setShowContribute(true)}>Contribute a source lead ↗</button>
        </div>
        <div className="unknown-list">
          {unknowns.map((u, i) => (
            <article key={u.market}>
              <span className="unknown-num">0{i + 1}</span>
              <div><h3><a href={url(`guide/${u.guide}/`)}>{u.market}</a></h3><p>Last credible observation: {u.last}</p></div>
              <div><small>NEXT DISCLOSURE</small><b>{u.next}</b></div>
              <div><small>SOURCE TIER</small><b>{u.tier}</b></div>
              <span className={`confidence ${u.confidence.toLowerCase()}`}>{u.confidence}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="methods">
        <div><span className="kicker">METHODS &amp; PROVENANCE</span><h2>Trust the evidence,<br />inspect the method.</h2></div>
        <div className="method-grid">
          <article><b>01</b><h3>Separate evidence</h3><p>Market prices, operating quantities, proxies, and unobserved markets never share an unlabeled axis.</p></article>
          <article><b>02</b><h3>Restore the denominator</h3><p>Every compute observation retains hardware, memory, region, commitment, tenancy, and availability.</p></article>
          <article><b>03</b><h3>Keep flags inspectable</h3><p>Deterministic thresholds and robust statistics rank attention; they do not manufacture causal stories.</p></article>
        </div>
        <button className="method-button" onClick={() => setShowMethods(!showMethods)}>{showMethods ? "Hide" : "View"} methodology {showMethods ? "↑" : "↓"}</button>
        {showMethods && (
          <div className="method-detail">
            <p><b>Interest score:</b> magnitude 30% · historical rarity 20% · cross-source confirmation 20% · supply-chain centrality 15% · source confidence 10% · recency 5%.</p>
            <p><b>Verification:</b> a community observation needs two independent sources or one primary document. Licensed and private sources default to link-out.</p>
            <p><b>Charts:</b> categorical hues carry identity only; direction uses a diverging blue/red pair with the sign printed on every mark, so nothing depends on colour alone. Every plotted value is also in a table.</p>
          </div>
        )}
      </section>

      <section className="learn" id="learn">
        <div className="section-head">
          <div><span className="kicker">FIELD GUIDE</span><h2>Understand the whole chain.</h2></div>
          <p>Every indicator above rests on definitions,<br />accounting boundaries, and financing structures.</p>
        </div>
        <div className="learn-grid">
          {clusters.map((cluster) => (
            <div className="learn-col" key={cluster.name}>
              <span className="kicker">{cluster.name}</span>
              <ul>{cluster.pages.map((page) => <li key={page.slug}><a href={url(`guide/${page.slug}/`)}>{page.label}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="learn-cta">
          <a className="primary" href={url("guide/")}>Open the guide ↗</a>
          <a href={url("glossary/")}>{glossary.length} glossary terms</a>
          <a href={url("sources/")}>{SOURCES} primary sources</a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="brand"><span className="brand-mark">O</span><span>Open Compute Markets Observatory</span></div>
        <p>Public research infrastructure. Not investment advice.</p>
        <a href="#top">Back to top ↑</a>
      </footer>

      {showContribute && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setShowContribute(false); }}
        >
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button className="close" aria-label="Close" onClick={() => setShowContribute(false)}>×</button>
            <span className="kicker">SOURCE LEAD</span>
            <h2 id="modal-title">Help close a gap.</h2>
            <p>Submit a URL, date, market, short description, and access status. Unsupported numbers are not accepted as observations.</p>
            <form onSubmit={(e) => { e.preventDefault(); setShowContribute(false); }}>
              <label>Source URL<input required type="url" placeholder="https://…" /></label>
              <label>Market<input required placeholder="e.g. HBM contracts" /></label>
              <label>Why it matters<textarea required rows={3} placeholder="What does this source add?" /></label>
              <button type="submit">Prepare source lead</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
