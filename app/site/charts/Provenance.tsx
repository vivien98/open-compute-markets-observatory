import { fmtDate, type FeedState } from "../../content/live";

const LABEL: Record<string, string> = {
  live: "LIVE", seed: "SEED CAPTURE", stale: "STALE", pending: "AWAITING FIRST RUN", failed: "FEED DOWN", "needs-key": "NEEDS KEY",
  illustrative: "ILLUSTRATIVE", model: "MODEL", reported: "REPORTED",
};

/**
 * The provenance chip every chart carries. It answers, before the reader looks
 * at a single mark, whether the numbers are observations, a recorded capture,
 * a calculation, or a synthetic preview.
 */
export default function Provenance({ state, asOf, source }: { state?: FeedState | "illustrative" | "model" | "reported"; asOf?: string | null; source?: string }) {
  const s = state ?? "illustrative";
  return (
    <span className={`prov prov-${s}`}>
      <b>{LABEL[s] ?? s.toUpperCase()}</b>
      {source && <span>{source}</span>}
      {asOf && <span>as of {fmtDate(asOf)}</span>}
    </span>
  );
}
