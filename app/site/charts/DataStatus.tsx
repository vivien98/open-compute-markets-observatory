import { feeds, fmtDate, snapshot } from "../../content/live";

const LABEL: Record<string, string> = { live: "Live", seed: "Seed capture", stale: "Stale", pending: "Awaiting first run", failed: "Down", "needs-key": "Needs a key" };

/** One line per feed: what state it is in, how fresh, and where it comes from. */
export default function DataStatus() {
  return (
    <div className="data-status">
      <div className="ds-head"><span className="kicker">DATA FEEDS</span><span>Snapshot built {fmtDate(snapshot.generatedAt)} · refreshed daily by a scheduled job · no API keys required</span></div>
      <ul>
        {feeds.map((f) => (
          <li key={f.id}>
            <span className={`ds-state ${f.state}`}>{LABEL[f.state] ?? f.state}</span>
            <a href={f.url} target="_blank" rel="noreferrer noopener">{f.label} ↗</a>
            <span className="ds-asof">{f.asOf ? `as of ${fmtDate(f.asOf)}` : "—"}</span>
            <span className="ds-note">{f.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
