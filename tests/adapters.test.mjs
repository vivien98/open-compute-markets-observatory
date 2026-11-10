/** Adapter parsers against the recorded capture: real response shapes, real values. */
import assert from "node:assert/strict";
import { test } from "node:test";

import * as A from "../scripts/data/adapters.mjs";
import * as S from "../scripts/data/seed-capture.mjs";

test("OpenRouter: picks open-weight models and skips variants and closed models", () => {
  const picks = A.pickOpenModels(S.openrouterModels).map((p) => p.id);
  assert.ok(picks.includes("z-ai/glm-5.2"));
  assert.ok(!picks.some((id) => id.includes(":")), "variant ids are skipped");
  assert.ok(!picks.includes("baidu/ernie-5.5-flash-preview"), "no Hugging Face id, not an open-weight prefix");
  assert.equal(A.pickOpenModels(S.openrouterModels).find((p) => p.id === "minimax/minimax-m3.1-flash").timeOfDay, true);
});

test("OpenRouter: endpoints become $/M quotes with the builder's list price", () => {
  const glm = A.parseEndpoints(S.openrouterEndpoints["z-ai/glm-5.2"]);
  assert.equal(glm.endpoints.length, 34);
  assert.equal(glm.providers, 25);
  assert.deepEqual(glm.list, { input: 1.4, output: 4.4, cached: 0.26, from: "builder", copies: 11 });
  const cheapest = glm.endpoints[0];
  assert.equal(cheapest.provider, "Relace");
  assert.equal(cheapest.input, 0.0324);
  assert.equal(cheapest.output, 7.1524);
  // The cheapest input quote carries an output price above the builder's.
  assert.ok(cheapest.input < glm.list.input / 40 && cheapest.output > glm.list.output);
});

test("OpenRouter: falls back to the modal price when the builder does not serve the model", () => {
  const oss = A.parseEndpoints(S.openrouterEndpoints["openai/gpt-oss-120b"]);
  assert.equal(oss.list.from, "mode");
  assert.equal(oss.list.input, 0.15);
  assert.equal(oss.endpoints.find((e) => e.provider === "DeepInfra").cached, null, "a missing cache price stays missing");
});

test("Kalshi: ladders give a monotone curve, a median, and a bid/ask bracket", () => {
  const events = A.parseLadders(S.kalshiMarkets.KXH100MS.markets);
  assert.deepEqual(events.map((e) => e.month), ["2026-12", "2027-03", "2027-07", "2027-08"]);
  for (const e of events) {
    assert.ok(e.medianBid <= e.median.value && e.median.value <= e.medianAsk, `${e.month} bracket`);
    for (let i = 1; i < e.strikes.length; i++) assert.ok(e.strikes[i].p <= e.strikes[i - 1].p, "survival curve is non-increasing");
  }
  assert.equal(events[0].median.value, 3.259);
  assert.ok(events.at(-1).median.value < events[0].median.value, "the captured curve slopes down");
});

test("Kalshi: a ladder that never crosses one half is reported as censored", () => {
  const rows = [1, 2, 3].map((k) => ({ event_ticker: "X-27JAN", strike_type: "greater", floor_strike: k, yes_bid_dollars: "0.80", yes_ask_dollars: "0.90", close_time: "2027-02-01T04:59:59Z" }));
  assert.deepEqual(A.parseLadders(rows)[0].median, { value: 3, censored: "above" });
});

test("Vast.ai: asks are per accelerator and each offer counts once", () => {
  const h100 = A.parseOffers(S.vastOffers["H100 SXM"].offers);
  assert.equal(h100.offers, 14);
  assert.equal(h100.gpus, 25);
  assert.equal(h100.median, 2.202);
  const b200 = A.parseOffers(S.vastOffers.B200.offers);
  assert.ok(b200.min >= 5.5 && b200.max <= 12.6);
  assert.equal(A.parseOffers([]), null);
});

test("FRED: blanks and dots are missing observations", () => {
  assert.deepEqual(A.parseFredCsv(S.fredCsvShape), [["2026-11-05", 3.92], ["2026-11-06", 3.89], ["2026-11-09", 3.88]]);
  assert.throws(() => A.parseFredCsv("<html>blocked</html>"));
});

test("New York Fed: SOFR comes back oldest first", () => {
  assert.deepEqual(A.parseSofr(S.nyfedSofr).at(-1), ["2026-11-09", 3.88]);
});

test("ERCOT: hub average statistics", () => {
  const p = A.parseErcot(S.ercot);
  assert.equal(p.realTimeLatest, 36.11);
  assert.equal(p.asOf, "2026-11-10");
  assert.equal(p.dayAheadAvg, null);
  assert.equal(A.parseErcot({}), null);
});

test("TWSE: tracked companies only, ROC month decoded, revenue in NT$ billions", () => {
  const t = A.parseTwse(S.twseShape);
  assert.equal(t.month, "2026-09");
  assert.equal(t.companies.length, 1);
  assert.deepEqual({ code: t.companies[0].code, revenue: t.companies[0].revenue, yoy: t.companies[0].yoy }, { code: "2330", revenue: 100, yoy: 25 });
});

test("Alpha Vantage: rate-limit notes surface as errors", () => {
  assert.throws(() => A.parseAlphaVantage({ Note: "rate limit" }), /rate limit/);
  assert.deepEqual(A.parseAlphaVantage({ "Time Series (Daily)": { "2026-11-09": { "4. close": "10.5" } } }), [["2026-11-09", 10.5]]);
});
