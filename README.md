# Open Compute Markets Observatory

An evidence-first public dashboard and field guide for every market in the AI compute chain: lithography, wafers, memory, packaging, systems, sites and power, GPU-hour rental and the new compute futures, the open-weight token market (harness → router → model builder → inference provider), and the capital that finances all of it. It separates direct prices, operating quantities, proxies, and unobserved markets, and never presents private-market guesses as quoted prices.

**Live dashboard:** https://vivien98.github.io/open-compute-markets-observatory/

## What is here

| Route | Contents |
| --- | --- |
| `/` | Market pulse dashboard — signals, market wiring (linkage graph, souq price ladder, cross-market ledger, price stack), two supply-chain tracks, known unknowns |
| `/guide/` | 19-chapter field guide, grouped into eight reading clusters, from units to the token market to macro |
| `/guide/<chapter>/` | One chapter, with an on-this-page rail and linked glossary terms |
| `/glossary/` | 167 definitions across 8 domains, filterable and directly linkable |
| `/sources/` | 63 primary references — filings, manufacturer docs, agency reports, exchange announcements, papers |

## Reference material

- `docs/reference/PUBLIC_AI_COMPUTE_MARKETS_DASHBOARD_PLAN.md` — research map and product plan.

The interface currently uses clearly marked illustrative preview data. Approved source adapters should replace those records before the figures are treated as current observations.

## Local development

```bash
npm install
npm run dev
```

## Build targets

There are two, sharing the same `app/Dashboard.tsx`:

| Command | Output | Use |
| --- | --- | --- |
| `npm run build` | Cloudflare Worker (vinext/RSC, D1 binding available) | Full server-rendered app |
| `npm run build:pages` | 23 static pages in `dist-pages/` | GitHub Pages deployment |

The static target works because every page holds its content inline and makes no
server or database calls. It is a true multi-page build — one HTML file per
route — so deep links resolve without client-side routing.

`npm run preview:pages` serves the built site locally.
`npm run test:pages` renders every page to a string and asserts it contains what
it should, so a runtime error fails the build rather than shipping a blank page.
The `.github/workflows/deploy-pages.yml` workflow runs lint, that test, and the
build on every push to `main`.

## Editing the guide

Guide chapters are Markdown files in `content/guide/`, one per chapter, ordered by
their numeric prefix. Frontmatter carries the slug, title, nav label, cluster, and
summary; the body supports `##` subsections, `>` callouts, pipe tables, `-` lists,
inline links, and `**bold**`. Any "Chapter N" in prose is linked automatically.

```bash
npm run content   # content/guide/*.md → app/content/sections/*.json + manifest.json
```

The glossary (`app/content/glossary.json`) and source shelf (`app/content/sources.json`)
are edited directly. `scripts/build-pages.mjs` then generates one HTML file and entry
module per route from the manifest; `npm run build:pages` runs both for you.

## The charts

Everything on the dashboard is illustrative until a source adapter replaces it.
`app/content/signals.ts` holds the signal cards, posted prices, the linkage graph
(nodes and transmission edges, mirroring the guide's Chapter 14), the souq price
ladder (provider archetypes and cache honesty), the session-cost multiple, and the
cross-market indexed series. Chart components live in `app/site/charts/`.

This project is public research infrastructure, not investment advice.
