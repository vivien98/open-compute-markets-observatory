import Chrome from "./Chrome";
import { clusters, guide, url } from "./nav";

/** Landing page for the guide: every section, grouped into reading clusters. */
export default function GuideIndex() {
  const topics = guide.reduce((n, g) => n + g.topics, 0);
  return (
    <Chrome active="guide/">
      <main id="top" className="doc">
        <div className="doc-head wide">
          <span className="kicker">FIELD GUIDE</span>
          <h1>Everything that matters,<br />from the ground up.</h1>
          <p className="doc-summary">
            A structured explainer for the AI compute supply chain — units and accounting first, then
            silicon, sites, financing, and the macro arguments that rest on them. Written to be read
            in order, or opened at whichever layer you need.
          </p>
          <div className="hero-meta">
            <span><b>{guide.length}</b> chapters</span><i />
            <span><b>{topics}</b> topics</span><i />
            <span><b>121</b> glossary terms</span>
          </div>
        </div>

        <div className="cluster-list">
          {clusters.map((cluster) => (
            <section className="cluster" key={cluster.name}>
              <div className="cluster-label">
                <span className="kicker">{cluster.name}</span>
              </div>
              <div className="cluster-cards">
                {cluster.pages.map((page) => (
                  <a className="chapter-card" href={url(`guide/${page.slug}/`)} key={page.slug}>
                    <h3>{page.heading}</h3>
                    <p>{page.summary}</p>
                    <footer>
                      {page.topics > 0 && <span>{page.topics} topics</span>}
                      {page.links > 0 && <span>{page.links} sources</span>}
                      <b aria-hidden="true">→</b>
                    </footer>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </Chrome>
  );
}
