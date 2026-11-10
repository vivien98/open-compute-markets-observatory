"use client";

import { useState } from "react";

import { COUNTRY_LABEL, edges, nodes, type Country } from "../../content/signals";
import { url } from "../nav";

/**
 * The market linkage graph: nodes are markets and the firms that sit on them,
 * edges are transmission channels from the guide's chapter on market linkages.
 *
 * Country is identity, so it is categorical and fixed-order; "Global" is the
 * hollow "other" slot rather than a seventh hue. Every node carries its label,
 * so nothing depends on colour alone. Hover lights up one hop; click opens the
 * chapter. The edge list under the graph is the table view.
 */
const COUNTRY_CLASS: Record<Country, string> = {
  US: "n-us", TW: "n-tw", KR: "n-kr", EU: "n-eu", JP: "n-jp", CN: "n-cn", Global: "n-global",
};
const COUNTRY_ORDER: Country[] = ["US", "TW", "KR", "EU", "JP", "CN", "Global"];
const COLS = ["Tools", "Wafers & memory", "Systems", "Sites & power", "Compute rental", "Token market", "Users & capital"];

export default function LinkageMap() {
  const [active, setActive] = useState<string | null>(null);

  const W = 1040;
  const H = 470;
  const M = { top: 34, right: 70, bottom: 18, left: 70 };
  const colX = (c: number) => M.left + (c / (COLS.length - 1)) * (W - M.left - M.right);
  const rowY = (r: number) => M.top + (r / 4.5) * (H - M.top - M.bottom);
  const pos = new Map(nodes.map((n) => [n.id, { x: colX(n.col), y: rowY(n.row) }]));

  const touching = (id: string) => (e: { from: string; to: string }) => e.from === id || e.to === id;
  const neighbours = active ? new Set(edges.filter(touching(active)).flatMap((e) => [e.from, e.to])) : null;
  const activeEdges = active ? edges.filter(touching(active)) : [];
  const activeNode = nodes.find((n) => n.id === active);

  return (
    <div className="chart-card linkage">
      <div className="chart-head">
        <div>
          <h3>How the markets are wired</h3>
          <p>Nodes are markets and the firms on them, coloured by country. Edges are transmission channels. Hover a node to isolate one hop; click to open the chapter.</p>
        </div>
        <ul className="legend legend-row">
          {COUNTRY_ORDER.map((c) => (
            <li key={c}><i className={`dot-swatch ${COUNTRY_CLASS[c]}`} aria-hidden="true" />{COUNTRY_LABEL[c]}</li>
          ))}
        </ul>
      </div>

      <svg className="linkage-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Graph of transmission channels between AI hardware, compute, token, and capital markets across countries." onPointerLeave={() => setActive(null)}>
        <defs>
          <marker id="lk-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 z" className="lk-arrowhead" />
          </marker>
        </defs>
        {COLS.map((label, i) => (
          <text key={label} x={colX(i)} y={14} textAnchor="middle" className="lk-col">{label.toUpperCase()}</text>
        ))}
        {edges.map((e, i) => {
          const a = pos.get(e.from)!;
          const b = pos.get(e.to)!;
          const dim = active !== null && !(e.from === active || e.to === active);
          const dx = b.x - a.x;
          const bend = Math.abs(dx) < 1 ? 60 : 0;
          const d = `M${a.x},${a.y} C${a.x + dx * 0.5 + bend},${a.y} ${b.x - dx * 0.5 + bend},${b.y} ${b.x},${b.y}`;
          return <path key={i} d={d} className={`lk-edge ${dim ? "dim" : ""} ${active && !dim ? "on" : ""}`} markerEnd="url(#lk-arrow)" />;
        })}
        {nodes.map((n) => {
          const p = pos.get(n.id)!;
          const dim = neighbours !== null && !neighbours.has(n.id);
          return (
            <a key={n.id} href={url(`guide/${n.guide}/`)} className={`lk-node ${COUNTRY_CLASS[n.country]} ${dim ? "dim" : ""} ${active === n.id ? "on" : ""}`} onPointerEnter={() => setActive(n.id)} onFocus={() => setActive(n.id)}>
              <circle cx={p.x} cy={p.y} r={active === n.id ? 12 : 9} />
              <text x={p.x} y={p.y - 15} textAnchor="middle" className="lk-label">{n.label}</text>
              <text x={p.x} y={p.y + 25} textAnchor="middle" className="lk-sub">{n.sub}</text>
            </a>
          );
        })}
      </svg>

      <div className="lk-readout" aria-live="polite">
        {activeNode ? (
          <>
            <b>{activeNode.label}</b>
            <ul>
              {activeEdges.map((e, i) => {
                const other = nodes.find((n) => n.id === (e.from === active ? e.to : e.from))!;
                return (
                  <li key={i}>
                    <span>{e.from === active ? "→" : "←"} {other.label}</span>
                    <em>{e.label}</em>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p className="chart-note">{edges.length} channels between {nodes.length} markets. The physical chain runs east to west; the money runs west to east; the token market at the top is largely Chinese in builders and price-setters, American in routers. Drawn from the guide&apos;s transmission table, not from measured correlation.</p>
        )}
      </div>
    </div>
  );
}
