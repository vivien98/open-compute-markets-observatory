/** Asserts every page renders and contains the content it is supposed to. */
import { run } from "../dist-smoke/smoke-entry.js";

const EXPECT = {
  "/": ["Open Compute Markets", "H100 marketplace ask", "Understand the whole chain", "/guide/silicon/"],
  "/guide/": ["How compute markets", "The silicon supply chain", "CapEx"],
  "/glossary/": ["Say it precisely", "CapEx", "Depreciation", "EBITDA"],
  "/sources/": ["Go to the primary", "asml.com", "iea.org"],
  "/guide/silicon/": ["EUV", "CoWoS", "On this page", "Terms used here"],
  "/guide/accounting/": ["Depreciation", "EBITDA", "Next"],
  "/guide/sovereign-debt/": ["Rollover risk", "debt dynamics"],
};

let failures = 0;
const pages = run();
for (const { name, length, text } of pages) {
  const missing = (EXPECT[name] ?? []).filter((needle) => !text.toLowerCase().includes(needle.toLowerCase()));
  const thin = length < 2000;
  const ok = !missing.length && !thin;
  if (!ok) failures++;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${name.padEnd(26)} ${String(length).padStart(7)} chars` +
      (thin ? "  [suspiciously short]" : "") +
      (missing.length ? `  missing: ${missing.join(", ")}` : ""),
  );
}
console.log(`\n${pages.length - failures}/${pages.length} pages rendered as expected`);
process.exit(failures ? 1 : 0);
