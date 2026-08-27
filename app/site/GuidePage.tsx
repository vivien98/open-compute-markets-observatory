import Blocks, { type Block, slugify } from "./Blocks";
import Chrome from "./Chrome";
import { guide, url } from "./nav";

type Section = {
  slug: string; title: string; label: string; summary: string;
  blocks: Block[]; terms: string[];
};

/** One guide section: contents rail, prose, key terms, and prev/next. */
export default function GuidePage({ section }: { section: Section }) {
  const index = guide.findIndex((g) => g.slug === section.slug);
  const prev = guide[index - 1];
  const next = guide[index + 1];
  const entry = guide[index];
  const topics = section.blocks.filter((b): b is Extract<Block, { type: "h2" }> => b.type === "h2");

  return (
    <Chrome active="guide/">
      <main id="top" className="doc">
        <div className="doc-head">
          <a className="doc-back" href={url("guide/")}>
            ← Guide
          </a>
          <span className="kicker">{entry?.cluster}</span>
          <h1>{section.title.replace(/^\d+\.\s*/, "")}</h1>
          <p className="doc-summary">{section.summary}</p>
        </div>

        <div className="doc-body">
          <aside className="doc-rail" aria-label="On this page">
            {topics.length > 0 && (
              <>
                <span className="rail-label">On this page</span>
                <ol className="rail-list">
                  {topics.map((topic) => (
                    <li key={topic.text}>
                      <a href={`#${slugify(topic.text)}`}>{topic.text.replace(/^[\d.]+\s*/, "")}</a>
                    </li>
                  ))}
                </ol>
              </>
            )}
            {section.terms.length > 0 && (
              <div className="rail-terms">
                <span className="rail-label">Terms used here</span>
                <div className="term-chips">
                  {section.terms.map((term) => (
                    <a key={term} href={url(`glossary/#${slugify(term)}`)}>
                      {term}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <article className="prose">
            <Blocks blocks={section.blocks} />
          </article>
        </div>

        <nav className="doc-pager" aria-label="Guide navigation">
          {prev ? (
            <a href={url(`guide/${prev.slug}/`)}>
              <small>Previous</small>
              <b>{prev.label}</b>
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a className="next" href={url(`guide/${next.slug}/`)}>
              <small>Next</small>
              <b>{next.label}</b>
            </a>
          ) : (
            <span />
          )}
        </nav>
      </main>
    </Chrome>
  );
}
