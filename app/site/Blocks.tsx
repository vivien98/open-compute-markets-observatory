import { Fragment } from "react";

export type Span = { text: string; href?: string; bold?: boolean };
export type Block =
  | { type: "h2"; text: string; spans?: Span[] }
  | { type: "p"; spans: Span[] }
  | { type: "callout"; spans: Span[] }
  | { type: "table"; rows: string[][] };

/** Stable, readable anchor id so every subsection is directly linkable. */
export const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

function Spans({ spans }: { spans: Span[] }) {
  return (
    <>
      {spans.map((span, i) =>
        span.href ? (
          <a key={i} className="inline-link" href={span.href} target="_blank" rel="noreferrer noopener">
            {span.text}
          </a>
        ) : span.bold ? (
          <strong key={i}>{span.text}</strong>
        ) : (
          <Fragment key={i}>{span.text}</Fragment>
        ),
      )}
    </>
  );
}

/** Renders the extracted guide block list. Tables scroll rather than overflow. */
export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === "h2") {
          const id = slugify(block.text);
          return (
            <h2 className="prose-h2" id={id} key={i}>
              <a href={`#${id}`} aria-label={`Link to ${block.text}`}>
                {block.text}
              </a>
            </h2>
          );
        }
        if (block.type === "callout") {
          return (
            <aside className="prose-callout" key={i}>
              <Spans spans={block.spans} />
            </aside>
          );
        }
        if (block.type === "table") {
          const [head, ...rows] = block.rows;
          return (
            <div className="prose-table-wrap" key={i}>
              <table className="prose-table">
                <thead>
                  <tr>
                    {head.map((cell, j) => (
                      <th key={j}>{cell}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, j) => (
                    <tr key={j}>
                      {row.map((cell, k) => (
                        <td key={k}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return (
          <p className="prose-p" key={i}>
            <Spans spans={block.spans} />
          </p>
        );
      })}
    </>
  );
}
