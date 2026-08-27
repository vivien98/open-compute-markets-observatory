"use client";

import { useMemo, useState } from "react";

import { slugify } from "./Blocks";
import Chrome from "./Chrome";
import terms from "../content/glossary.json";

const DOMAINS = [...new Set(terms.map((t) => t.domain))];

/** Filterable glossary. Every term carries a stable anchor so pages can link in. */
export default function GlossaryPage() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("All domains");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return terms.filter(
      (t) =>
        (domain === "All domains" || t.domain === domain) &&
        (!q || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)),
    );
  }, [query, domain]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof terms>();
    for (const t of filtered) map.set(t.domain, [...(map.get(t.domain) ?? []), t]);
    return [...map];
  }, [filtered]);

  return (
    <Chrome active="glossary/">
      <main id="top" className="doc">
        <div className="doc-head wide">
          <span className="kicker">GLOSSARY</span>
          <h1>Say it precisely.</h1>
          <p className="doc-summary">
            {terms.length} definitions across {DOMAINS.length} domains. Most disagreements about AI
            infrastructure are unit disagreements wearing a disguise.
          </p>
        </div>

        <div className="glossary-controls">
          <label className="search">
            <span className="sr-only">Search terms</span>
            <input
              type="search"
              value={query}
              placeholder="Search terms and definitions…"
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="domain-tabs" role="group" aria-label="Filter by domain">
            {["All domains", ...DOMAINS].map((d) => (
              <button
                key={d}
                type="button"
                className={d === domain ? "on" : undefined}
                aria-pressed={d === domain}
                onClick={() => setDomain(d)}
              >
                {d}
              </button>
            ))}
          </div>
          <span className="result-count">
            {filtered.length} of {terms.length}
          </span>
        </div>

        {grouped.length === 0 && <div className="empty">No terms match that search.</div>}

        {grouped.map(([name, items]) => (
          <section className="glossary-group" key={name}>
            <h2 className="glossary-domain">{name}</h2>
            <dl className="glossary-list">
              {items.map((t) => (
                <div className="glossary-row" id={slugify(t.term)} key={t.term}>
                  <dt>
                    <a href={`#${slugify(t.term)}`}>{t.term}</a>
                  </dt>
                  <dd>{t.definition}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </main>
    </Chrome>
  );
}
