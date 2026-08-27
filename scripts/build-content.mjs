/**
 * Splits the extracted guide into per-page content modules.
 *
 * Input:  app/content/guide.json  (produced by extract-guide.mjs)
 * Output: app/content/sections/<slug>.json, glossary.json, sources.json, manifest.json
 *
 * Splitting per page matters: every route imports only its own section, so the
 * 175 KB guide never ships as one shared chunk.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";

const { sections } = JSON.parse(readFileSync("app/content/guide.json", "utf8"));
const byTitle = new Map(sections.map((s) => [s.title, s]));

// Slug, nav label, and one-line summary for every routed guide page, in reading order.
const PAGES = [
  ["how-to-use", "How to use this guide", "How to use this guide", "Orientation", "Four kinds of statement, and the reading discipline the rest of the guide assumes."],
  ["overview", "1. The entire podcast in one picture", "The whole argument", "Orientation", "The end-to-end chain in one map, and the four kinds of claim it mixes together."],
  ["units", "2. Units: what \"compute\" actually means", "Units", "Foundations", "Why compute is not one substance, and how power, energy, stock and flow differ."],
  ["history", "3. Historical context: why the stack looks like this", "History", "Foundations", "How integrated circuits became specialised accelerators, and why the industry fragmented."],
  ["silicon", "4. The silicon supply chain, step by step", "Silicon", "The physical stack", "Design, EDA, masks, wafers, EUV, packaging, and the actor map from sand to rack."],
  ["data-centers", "5. From chip to data center", "Data centers", "The physical stack", "Critical IT versus the facility, the power chain, cooling, and usable capacity."],
  ["accounting", "6. Accounting: CapEx, OpEx, depreciation, and margins", "Accounting", "Money", "The three statements, what gets capitalised, and why EBITDA flatters this business."],
  ["financing", "7. How AI compute is financed", "Financing", "Money", "Cash, equity, bonds, leases, take-or-pay, SPVs, and the maturity wall."],
  ["value-capture", "8. Why the best model might outbid everyone", "Value capture", "Money", "Marginal value versus average revenue, and who actually captures the surplus."],
  ["rates", "9. Interest rates, credit spreads, and asset prices", "Rates & credit", "Macro"," There is no single interest rate; spreads, discount rates, and asset-liability risk."],
  ["sovereign-debt", "10. Government debt and sovereign crises", "Sovereign debt", "Macro", "Debt dynamics, rollover risk, and whether AI investment could trigger a crisis."],
  ["china", "11. China, export controls, and quality-adjusted compute", "China & controls", "Macro", "What controls target, why smuggling is not a supply chain, and what to measure."],
  ["centralization", "12. Centralization: the final argument", "Centralization", "Argument", "Forces pushing both ways, and why ownership, control, and service must be separated."],
  ["claim-audit", "13. Claim audit: what would have to be true?", "Claim audit", "Argument", "The strongest and most fragile parts of the argument, and a forecasting discipline."],
  ["claims", "14. Podcast-by-podcast translation", "Claim-by-claim", "Argument", "Each headline claim restated precisely, with what would confirm or break it."],
  ["study-plan", "16. A study plan from beginner to expert", "Study plan", "Practice", "A five-week path from accounting basics to rebuilding the model yourself."],
];

rmSync("app/content/sections", { recursive: true, force: true });
mkdirSync("app/content/sections", { recursive: true });

// Glossary: the section is a single table whose first row is a header.
const gRows = byTitle.get("15. Glossary").blocks.find((b) => b.type === "table").rows.slice(1);
let domain = "";
const terms = [];
for (const [d, term, def] of gRows) {
  if (d) domain = d;
  if (term && def) terms.push({ domain, term, definition: def });
}
writeFileSync("app/content/glossary.json", JSON.stringify(terms));

// Source shelf: grouped by the H2 that precedes each run of links.
const shelf = [];
let group = null;
for (const b of byTitle.get("17. Source shelf").blocks) {
  if (b.type === "h2") shelf.push((group = { group: b.text, items: [] }));
  else if (b.type === "p" && group) {
    const link = b.spans.find((s) => s.href);
    const text = b.spans.map((s) => s.text).join("").trim();
    if (text) group.items.push({ text, ...(link ? { href: link.href } : {}) });
  }
}
writeFileSync("app/content/sources.json", JSON.stringify(shelf));

// Per-section files, plus a manifest carrying nav data and derived counts.
const termRe = terms.map((t) => [t.term, new RegExp(`\\b${t.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i")]);
const manifest = [];
for (const [slug, title, label, cluster, summary] of PAGES) {
  const section = byTitle.get(title);
  if (!section) throw new Error(`Missing section: ${title}`);
  const text = section.blocks.map((b) => (b.spans ? b.spans.map((s) => s.text).join("") : (b.rows || []).flat().join(" "))).join(" ");
  const used = termRe.filter(([, re]) => re.test(text)).map(([t]) => t).slice(0, 18);
  const links = section.blocks.flatMap((b) => (b.spans || []).filter((s) => s.href)).length;
  writeFileSync(`app/content/sections/${slug}.json`, JSON.stringify({ slug, title, label, summary, blocks: section.blocks, terms: used }));
  manifest.push({
    slug, label, cluster, summary,
    heading: title.replace(/^\d+\.\s*/, ""),
    topics: section.blocks.filter((b) => b.type === "h2").length,
    links,
  });
}
writeFileSync("app/content/manifest.json", JSON.stringify(manifest, null, 1));

console.log(`glossary terms : ${terms.length}`);
console.log(`source groups  : ${shelf.length} (${shelf.reduce((n, g) => n + g.items.length, 0)} entries)`);
console.log(`guide pages    : ${manifest.length}`);
for (const m of manifest) console.log(`  /${m.slug.padEnd(15)} ${String(m.topics).padStart(3)} topics  ${String(m.links).padStart(2)} links  ${m.cluster}`);
