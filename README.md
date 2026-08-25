# Open Compute Markets Observatory

An evidence-first public dashboard for the AI compute supply chain. The first web release separates direct prices, operating quantities, proxies, and unobserved markets; it never presents private-market guesses as quoted prices.

**Live dashboard:** https://vivien98.github.io/open-compute-markets-observatory/

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
| `npm run build:pages` | Static SPA bundle in `dist-pages/` | GitHub Pages deployment |

The static target works because the dashboard holds its data inline and makes no
server or database calls. If a future version reads from D1 or an API, the Pages
build will need a data-fetching story before it stays accurate.

`npm run preview:pages` serves the static bundle locally. The
`.github/workflows/deploy-pages.yml` workflow publishes it on every push to `main`.

This project is public research infrastructure, not investment advice.
