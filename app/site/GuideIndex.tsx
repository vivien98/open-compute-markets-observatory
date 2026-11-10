import Chrome from "./Chrome";
import { clusters, guide, url } from "./nav";
import glossary from "../content/glossary.json";

/** Landing page for the guide: every section, grouped into reading clusters. */
export default function GuideIndex() {
  const topics = guide.reduce((n, g) => n + g.topics, 0);
  return (
    <Chrome active="guide/">
      <main id="top" className="doc">
        <div className="doc-head wide">
          <span className="kicker">FIELD GUIDE</span>
          <h1>How compute markets<br />actually work.</h1>
          <p className="doc-summary">
            Most arguments about AI infrastructure are unit arguments in disguise: a price quoted
            without its denominator, capital spending mistaken for delivered capacity, a proxy read as
            a market. This guide builds the vocabulary from the ground up — units and accounting
            first, then silicon, sites, financing, the open-weight token market with its harnesses,
            routers, model builders and inference providers, the price stack that ties a token back to a
            megawatt-hour, the credit and collateral that decide who can buy compute at all, and the macro claims that rest on all of it. Read it in order, or open the layer
            you need.
          </p>
          <div className="hero-meta">
            <span><b>{guide.length}</b> chapters</span><i />
            <span><b>{topics}</b> topics</span><i />
            <span><b>{glossary.length}</b> glossary terms</span>
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
