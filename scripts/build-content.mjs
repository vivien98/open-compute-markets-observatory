/**
 * Compiles the guide from Markdown into per-page content modules.
 *
 * Input:  content/guide/<slug>.md      (one file per chapter)
 *         content/guide/_order.txt     (chapter order; numbers derive from it)
 *         app/content/glossary.json    (hand-maintained)
 * Output: app/content/sections/<slug>.json, app/content/manifest.json
 *
 * Splitting per page matters: every route imports only its own section, so the
 * guide never ships as one shared chunk.
 *
 * Supported Markdown subset (deliberately small so the renderer stays simple):
 *   ---            YAML-ish frontmatter: slug, title, heading, label, cluster, summary
 *                  optional: `numbered: false`, `sections: plain`
 *   ## Heading     subsection; numbered automatically, with a stable anchor
 *   {ch:slug}      "Chapter N" link; {chs:a,b} and {chs:a..b} for pairs and ranges
 *   > text         callout
 *   | a | b |      table; first row is the header
 *   - item         list item (consecutive items form one list)
 *   plain text     paragraph; blank line separates blocks
 *   [text](url)    inline link, **bold** emphasis
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync } from "node:fs";

const SRC = "content/guide";
const OUT = "app/content/sections";

const terms = JSON.parse(readFileSync("app/content/glossary.json", "utf8"));
const termRe = terms.map((t) => [
  t.term,
  new RegExp(`\\b${t.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i"),
]);

/** Inline markup → spans. Links and bold only; nothing nests. */
function spans(text) {
  const out = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    if (m[1]) out.push({ text: m[1], href: m[2] });
    else out.push({ text: m[3], bold: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

function parse(md) {
  const fm = {};
  let body = md;
  const fmMatch = md.match(/^---\n([\s\S]*?)\n---\n/);
  if (fmMatch) {
    for (const line of fmMatch[1].split("\n")) {
      const i = line.indexOf(":");
      if (i > 0) fm[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
    body = md.slice(fmMatch[0].length);
  }
  const blocks = [];
  const chunks = body.split(/\n{2,}/).map((c) => c.trim()).filter(Boolean);
  for (const chunk of chunks) {
    if (chunk.startsWith("## ")) {
      blocks.push({ type: "h2", text: chunk.slice(3).trim() });
    } else if (chunk.startsWith("> ")) {
      blocks.push({ type: "callout", spans: spans(chunk.replace(/^> ?/gm, "").replace(/\n/g, " ")) });
    } else if (chunk.startsWith("|")) {
      const rows = chunk
        .split("\n")
        .filter((l) => l.trim().startsWith("|") && !/^\|[\s:-]+\|$/.test(l.trim().replace(/\|/g, "|")))
        .filter((l) => !/^\|\s*-{2,}/.test(l.trim()))
        .map((l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => spans(c.trim())));
      blocks.push({ type: "table", rows });
    } else if (chunk.startsWith("- ")) {
      blocks.push({ type: "list", items: chunk.split(/\n(?=- )/).map((l) => spans(l.replace(/^- /, "").replace(/\n/g, " "))) });
    } else {
      blocks.push({ type: "p", spans: spans(chunk.replace(/\n/g, " ")) });
    }
  }
  return { fm, blocks };
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// Order comes from content/guide/_order.txt, so inserting a chapter is a
// one-line change and nothing is ever renumbered by hand.
const order = readFileSync(`${SRC}/_order.txt`, "utf8")
  .split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
const onDisk = readdirSync(SRC).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
for (const slug of onDisk) if (!order.includes(slug)) throw new Error(`content/guide/${slug}.md is not listed in _order.txt`);
const parsed = order.map((slug) => {
  const file = `${slug}.md`;
  const out = { file, ...parse(readFileSync(`${SRC}/${file}`, "utf8")) };
  if (out.fm.slug !== slug) throw new Error(`${file}: frontmatter slug "${out.fm.slug}" does not match filename`);
  return out;
});

// Chapter numbers are assigned here, from the order file.
const chapterNo = new Map();
let counter = 0;
for (const { fm } of parsed) if (fm.numbered !== "false") chapterNo.set(fm.slug, ++counter);

/**
 * Cross-references are written by slug and rendered with the current number:
 *   {ch:souq}                 → "Chapter 10"        (linked)
 *   {chs:silicon,data-centers}→ "Chapters 4 and 5"  (each number linked)
 *   {chs:rates..claims}       → "Chapters 13–19"    (both ends linked)
 */
function need(slug, where) {
  const n = chapterNo.get(slug);
  if (!n) throw new Error(`${where}: unknown chapter reference "${slug}"`);
  return n;
}
function linkChapters(list, where) {
  const out = [];
  for (const span of list) {
    if (span.href) { out.push(span); continue; }
    const re = /\{ch:([a-z0-9-]+)\}|\{chs:([a-z0-9-]+)(\.\.|,)([a-z0-9-]+)\}/g;
    let last = 0;
    let m;
    const push = (text, href) => out.push({ text, ...(href ? { href } : {}), ...(span.bold && !href ? { bold: true } : {}) });
    while ((m = re.exec(span.text))) {
      if (m.index > last) push(span.text.slice(last, m.index));
      if (m[1]) push(`Chapter ${need(m[1], where)}`, `/guide/${m[1]}/`);
      else {
        push("Chapters ");
        push(String(need(m[2], where)), `/guide/${m[2]}/`);
        push(m[3] === ".." ? "–" : " and ");
        push(String(need(m[4], where)), `/guide/${m[4]}/`);
      }
      last = m.index + m[0].length;
    }
    if (last < span.text.length) push(span.text.slice(last));
  }
  return out;
}
const anchor = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
for (const { blocks, fm, file } of parsed) {
  const n = chapterNo.get(fm.slug);
  const numberSections = n && fm.sections !== "plain";
  if (n) fm.title = `${n}. ${fm.title}`;
  let k = 0;
  for (const b of blocks) {
    if (b.type === "h2") {
      // The anchor comes from the bare title, so it survives renumbering.
      b.id = anchor(b.text);
      if (numberSections) b.text = `${n}.${++k} ${b.text}`;
    }
    if (b.spans) b.spans = linkChapters(b.spans, file);
    if (b.items) b.items = b.items.map((i) => linkChapters(i, file));
    if (b.rows) b.rows = b.rows.map((r) => r.map((c) => linkChapters(c, file)));
  }
  // A chapter never links to itself.
  const self = `/guide/${fm.slug}/`;
  for (const b of blocks) {
    for (const list of [b.spans, ...(b.items ?? []), ...(b.rows ?? []).flat()]) {
      if (list) for (const sp of list) if (sp.href === self) delete sp.href;
    }
  }
  const leftover = JSON.stringify(blocks).match(/\{chs?:[^}]*\}/);
  if (leftover) throw new Error(`${file}: unresolved reference ${leftover[0]}`);
}

const manifest = [];
for (const { file, fm, blocks } of parsed) {
  for (const key of ["slug", "title", "heading", "label", "cluster", "summary"]) {
    if (!fm[key]) throw new Error(`${file}: missing frontmatter "${key}"`);
  }
  const text = blocks
    .map((b) =>
      b.spans ? b.spans.map((s) => s.text).join("")
      : b.items ? b.items.flat().map((s) => s.text).join(" ")
      : b.rows ? b.rows.flat(2).map((s) => s.text).join(" ")
      : b.text,
    )
    .join(" ");
  const used = termRe.filter(([, re]) => re.test(text)).map(([t]) => t).slice(0, 18);
  const links = blocks.flatMap((b) => (b.spans ?? b.items?.flat() ?? b.rows?.flat(2) ?? []).filter((s) => s.href && !s.href.startsWith("/"))).length;
  writeFileSync(
    `${OUT}/${fm.slug}.json`,
    JSON.stringify({ slug: fm.slug, title: fm.title, heading: fm.heading, label: fm.label, summary: fm.summary, blocks, terms: used }),
  );
  manifest.push({
    slug: fm.slug, label: fm.label, cluster: fm.cluster, summary: fm.summary, heading: fm.heading,
    number: chapterNo.get(fm.slug) ?? null,
    topics: blocks.filter((b) => b.type === "h2").length,
    links,
  });
}
writeFileSync("app/content/manifest.json", JSON.stringify(manifest, null, 1));

console.log(`glossary terms : ${terms.length}`);
console.log(`guide pages    : ${manifest.length}`);
for (const m of manifest) console.log(`  /${m.slug.padEnd(18)} ${String(m.topics).padStart(3)} topics  ${String(m.links).padStart(3)} links  ${m.cluster}`);
