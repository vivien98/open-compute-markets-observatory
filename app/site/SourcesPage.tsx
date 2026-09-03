import Chrome from "./Chrome";
import shelf from "../content/sources.json";
import { guide, url } from "./nav";

const total = shelf.reduce((n, g) => n + g.items.length, 0);

/** The source shelf: primary references, grouped by how deep you want to go. */
export default function SourcesPage() {
  return (
    <Chrome active="sources/">
      <main id="top" className="doc">
        <div className="doc-head wide">
          <span className="kicker">SOURCE SHELF</span>
          <h1>Go to the primary<br />document.</h1>
          <p className="doc-summary">
            {total} references behind the guide — regulator filings, manufacturer documentation,
            agency reports, and the foundational papers. Company forecasts and analyst estimates are
            inputs to a model, not facts about the world.
          </p>
        </div>

        <div className="shelf">
          {shelf.map((group) => (
            <section className="shelf-group" key={group.group}>
              <div className="shelf-label">
                <span className="kicker">{group.group}</span>
                <b>{group.items.length}</b>
              </div>
              <ul className="shelf-list">
                {group.items.map((item) => {
                  const host = item.href ? new URL(item.href).hostname.replace(/^www\./, "") : null;
                  return (
                    <li key={item.text}>
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noreferrer noopener">
                          <span>{item.text}</span>
                          <small>{host} ↗</small>
                        </a>
                      ) : (
                        <span className="no-link">{item.text}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <aside className="prose-callout shelf-rule">
          Treat company forecasts, analyst estimates, and quoted prices as inputs to a model, not as
          facts carved into the world. Preserve units, dates, accounting boundaries, and source type.
        </aside>

        <div className="shelf-next">
          <span className="kicker">KEEP READING</span>
          <div className="term-chips">
            {guide.slice(0, 8).map((page) => (
              <a key={page.slug} href={url(`guide/${page.slug}/`)}>
                {page.label}
              </a>
            ))}
          </div>
        </div>
      </main>
    </Chrome>
  );
}
