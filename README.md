# Open Compute Markets Observatory

An evidence-first public dashboard for the AI compute supply chain. The first web release separates direct prices, operating quantities, proxies, and unobserved markets; it never presents private-market guesses as quoted prices.

**Live dashboard:** https://vivien98.github.io/open-compute-markets-observatory/

## What is here

| Route | Contents |
| --- | --- |
| `/` | Market pulse dashboard — signals, supply chain, known unknowns |
| `/guide/` | 16-chapter field guide, grouped into six reading clusters |
| `/guide/<chapter>/` | One chapter, with an on-this-page rail and linked glossary terms |
| `/glossary/` | 121 definitions across 7 domains, filterable and directly linkable |
| `/sources/` | 23 primary references — filings, manufacturer docs, agency reports, papers |

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
| `npm run build:pages` | 20 static pages in `dist-pages/` | GitHub Pages deployment |

The static target works because every page holds its content inline and makes no
server or database calls. It is a true multi-page build — one HTML file per
route — so deep links resolve without client-side routing.

`npm run preview:pages` serves the built site locally.
`npm run test:pages` renders every page to a string and asserts it contains what
it should, so a runtime error fails the build rather than shipping a blank page.
The `.github/workflows/deploy-pages.yml` workflow runs lint, that test, and the
build on every push to `main`.

## Regenerating guide content

Guide prose lives in `app/content/` as committed JSON, extracted from a local
source document that is deliberately not tracked:

```bash
npm run content   # extract-guide.mjs → build-content.mjs
```

`scripts/build-pages.mjs` then generates one HTML file and entry module per route
from `app/content/manifest.json`; `npm run build:pages` runs it for you. Because
the split content files are committed, a fresh clone builds without the source
document.

This project is public research infrastructure, not investment advice.
