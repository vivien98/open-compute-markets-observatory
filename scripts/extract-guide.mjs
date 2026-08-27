/**
 * Extracts the AI compute guide (.docx) into structured JSON for the site.
 *
 * The .docx is intentionally untracked (see .gitignore), so this script is a
 * one-way authoring tool: run it locally to regenerate `app/content/guide.json`,
 * which IS committed and is what the site actually renders.
 *
 *   node scripts/extract-guide.mjs
 */
import { writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const DOCX = "docs/reference/AI_Compute_Chips_and_Capital_Guide.docx";
if (!existsSync(DOCX)) {
  console.error(`Missing ${DOCX} — this script needs the local source document.`);
  process.exit(1);
}

const unzip = (name) => execFileSync("unzip", ["-p", DOCX, name], { maxBuffer: 1 << 28 }).toString("utf8");
const xml = unzip("word/document.xml");
const rels = unzip("word/_rels/document.xml.rels");

const linkTargets = new Map();
for (const m of rels.matchAll(/Id="([^"]+)"[^>]*Target="([^"]+)"[^>]*TargetMode="External"/g)) {
  linkTargets.set(m[1], m[2]);
}

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
   .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d));

/** Pull a paragraph's text as an array of {text, href?} spans. */
function spansOf(paraXml) {
  const spans = [];
  const re = /<w:hyperlink\b[^>]*r:id="([^"]+)"[^>]*>([\s\S]*?)<\/w:hyperlink>|<w:r\b[\s\S]*?<\/w:r>/g;
  for (const m of paraXml.matchAll(re)) {
    const chunk = m[0];
    const href = m[1] ? linkTargets.get(m[1]) : undefined;
    const text = decode([...chunk.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)].map((t) => t[1]).join(""));
    if (!text) continue;
    const bold = /<w:b\/>|<w:b [^>]*\/>/.test(chunk) && !href;
    const prev = spans[spans.length - 1];
    if (prev && prev.href === href && !!prev.bold === bold) prev.text += text;
    else spans.push({ text, ...(href ? { href } : {}), ...(bold ? { bold: true } : {}) });
  }
  return spans.filter((s) => s.text.trim());
}

const plain = (spans) => spans.map((s) => s.text).join("").trim();
const styleOf = (p) => (p.match(/w:pStyle w:val="([^"]+)"/) ?? ["", "Body"])[1];

/** Walk the body in order, emitting paragraphs and tables as a flat block list. */
const body = xml.slice(xml.indexOf("<w:body>"), xml.lastIndexOf("</w:body>"));
const blocks = [];
const topRe = /<w:tbl>[\s\S]*?<\/w:tbl>|<w:p\b[\s\S]*?<\/w:p>/g;
for (const m of body.matchAll(topRe)) {
  const chunk = m[0];
  if (chunk.startsWith("<w:tbl>")) {
    const rows = [];
    for (const r of chunk.matchAll(/<w:tr\b[\s\S]*?<\/w:tr>/g)) {
      const cells = [];
      for (const c of r[0].matchAll(/<w:tc>[\s\S]*?<\/w:tc>/g)) {
        const paras = [...c[0].matchAll(/<w:p\b[\s\S]*?<\/w:p>/g)].map((p) => spansOf(p[0]));
        cells.push(paras.map(plain).filter(Boolean).join(" "));
      }
      if (cells.some(Boolean)) rows.push(cells);
    }
    if (rows.length) blocks.push({ type: "table", rows });
    continue;
  }
  const style = styleOf(chunk);
  const spans = spansOf(chunk);
  const text = plain(spans);
  if (!text) continue;
  if (style === "TOCEntry" || text === "Back to contents") continue;
  if (style === "Heading1") blocks.push({ type: "h1", text });
  else if (style === "Heading2") blocks.push({ type: "h2", text, spans });
  else if (style === "Callout") blocks.push({ type: "callout", spans });
  else blocks.push({ type: "p", spans });
}

/** Group flat blocks into sections keyed by H1. */
const sections = [];
let current = null;
for (const b of blocks) {
  if (b.type === "h1") {
    current = { title: b.text, blocks: [] };
    sections.push(current);
  } else if (current) current.blocks.push(b);
}

writeFileSync("app/content/guide.json", JSON.stringify({ sections }, null, 1));
console.log(`sections: ${sections.length}`);
for (const s of sections) console.log(`  ${String(s.blocks.length).padStart(4)} blocks  ${s.title}`);
