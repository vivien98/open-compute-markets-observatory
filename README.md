# Open Compute Markets Observatory

An evidence-first public dashboard and field guide for every market in the AI compute chain: lithography, wafers, memory, packaging, systems, sites and power, GPU-hour rental and its derivatives, the credit and collateral that finance it, and the open-weight token market (harness → router → model builder → inference provider). It separates direct prices, proxies, model outputs, and unobserved markets, and never presents a private-market guess as a quoted price.

**Live site:** https://vivien98.github.io/open-compute-markets-observatory/

## What is here

| Route | Contents |
| --- | --- |
| `/` | Dashboard: market pulse on public feeds; credit and term structure (implied forward curve, tenor decomposition, residual value, capital stack, credit ladder, resale-market depth); market wiring (linkage graph, live souq quote ladder, silicon spread, cross-market ledger, price stack); two supply-chain tracks; known unknowns; feed status |
| `/guide/` | 23-chapter field guide in eight clusters, from units to tokens to credit to macro, ending in a thirty-day study plan and a list of open problems |
| `/guide/<chapter>/` | One chapter, with an on-this-page rail and linked glossary terms |
| `/glossary/` | 237 definitions across 8 domains, filterable and directly linkable |
| `/sources/` | 116 references: filings, exchange and regulator documents, manufacturer datasheets, public APIs, papers, and a shelf of ongoing reading |

## Data: what is real and what is not

Every number on the dashboard carries one of five labels.

| Label | Meaning |
| --- | --- |
| LIVE | Fetched from a public, keyless endpoint by the scheduled job; dated |
| SEED | From a partial manual capture of the same endpoints (10 Nov 2026), until the first live run replaces it |
| REPORTED | A level quoted in a filing or the press, shown with its date and source (single-name CDS, used-hardware sales) |
| MODEL | Arithmetic on stated inputs, every input on a slider |
| ILLUSTRATIVE | Synthetic preview for a market with no keyless public source yet |

The scheduled GitHub Actions workflow runs `npm run data:fetch` once a day, commits `app/content/live/snapshot.json` and appends to `data/history/*.csv`, then rebuilds and deploys. Nothing is fetched in the browser and no API key is required. A feed that fails keeps its last values and is marked stale; it never blocks a deploy. See [`data/README.md`](data/README.md) for each feed, its caveats, and how to add one.

Feeds wired today: OpenRouter per-provider token quotes, Vast.ai marketplace GPU asks, Kalshi strike ladders on monthly rental and memory prices, New York Fed SOFR, FRED (Treasury yield, BBB / high-yield / CCC spreads, TWD, KRW, JPY, Henry Hub, construction), ERCOT hub prices, and TWSE monthly revenue for TSMC and the server ODMs. Daily equities for the chain are optional: add an `ALPHAVANTAGE_API_KEY` repository secret.

Several of these sources only publish the present. The daily rows in `data/history/` are therefore the observatory's own time series: per-endpoint token quotes, marketplace asks, and the forward curve implied by prediction-market ladders.

## Local development

```bash
npm install
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run content` | `content/guide/*.md` → `app/content/sections/*.json` + `manifest.json` |
| `npm run data:fetch` | Refresh the snapshot and history from the public feeds |
| `npm run data:seed` | Rebuild the snapshot from the recorded capture, no network |
| `npm run test:data` | Adapter parsers against recorded response shapes |
| `npm run test:pages` | Render every page to a string and assert its contents |
| `npm run build:pages` | Static multi-page build in `dist-pages/` for GitHub Pages |
| `npm run build` | Cloudflare Worker build (vinext/RSC) of the same app |

## Editing the guide

Chapters are Markdown files in `content/guide/`, one per chapter, named by slug. Their order is `content/guide/_order.txt`; chapter and section numbers are assigned from that order at build time, so inserting a chapter is a one-line change.

Frontmatter carries `slug`, `title`, `heading`, `label`, `cluster`, and `summary` (optional: `numbered: false`, `sections: plain`). The body supports `##` subsections, `>` callouts, pipe tables, `-` lists, inline links, and `**bold**`. Cross-references are written by slug and rendered with the current number:

```
{ch:souq}                    → Chapter 11
{chs:silicon,data-centers}   → Chapters 4 and 5
{chs:rates..claims}          → Chapters 14–20
```

The glossary (`app/content/glossary.json`) and source shelf (`app/content/sources.json`) are edited directly.

## The charts

Chart components live in `app/site/charts/`. Those that read data take it from `app/content/live.ts` (typed access to the snapshot); `app/content/signals.ts` binds each pulse card to a feed and falls back to a labelled synthetic preview when the feed has nothing. The linkage graph's nodes and edges mirror the guide's linkages chapter.

## Reference material

- `docs/reference/PUBLIC_AI_COMPUTE_MARKETS_DASHBOARD_PLAN.md` — the original research map and product plan.

This project is public research infrastructure, not investment advice.
