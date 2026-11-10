# Data

Everything the dashboard labels LIVE comes from public endpoints that need no
API key. `npm run data:fetch` (run daily by the GitHub Actions workflow) writes:

- `app/content/live/snapshot.json` — the latest values and series the site renders.
- `data/history/*.csv` — one row per day per item, appended forever.

The history files matter most. Several of these sources only ever return the
present, so the daily rows recorded here become time series that are not
published anywhere else: per-provider token quotes, marketplace GPU asks, and
the forward curve implied by prediction-market ladders.

## Feeds

| Feed | Source | What it gives | Notes |
| --- | --- | --- | --- |
| `tokens` | [OpenRouter API](https://openrouter.ai/api/v1/models) | Input, output and cached price per provider for the open-weight models with the most providers | Quotes, not paid prices. Cache-hit rates are not observable. |
| `gpu` | [Vast.ai offers](https://console.vast.ai/api/v0/bundles/) | Distribution of on-demand asks per accelerator (H100, H200, B200, ...) | Peer marketplace asks, not transactions; one observation per offer. |
| `ladders` | [Kalshi market data](https://api.elections.kalshi.com/trade-api/v2/series/KXH100MS) | Strike ladders on monthly-average rental and memory prices; implied median per month with a bid/ask bracket | Thin, often single-dealer quotes. Settles on Ornn's index, which is not the same basket as marketplace asks. |
| `sofr` | [New York Fed](https://www.newyorkfed.org/markets/reference-rates/sofr) | SOFR | Official. |
| `fred` | [FRED](https://fred.stlouisfed.org/) `fredgraph.csv` | Treasury yield, BBB / high-yield / CCC spreads, TWD, KRW, JPY, Henry Hub, construction spending | ICE BofA index series are © ICE Data Indices and redistributed by FRED; keep the attribution. |
| `power` | [ERCOT dashboards](https://www.ercot.com/mktinfo/prices) | Hub-average real-time and day-ahead prices | Texas only. PJM needs a key and is not wired. |
| `twse` | [TWSE open data](https://openapi.twse.com.tw/) | Monthly revenue and year-over-year change for TSMC, ASE, and the server ODMs | The highest-frequency public read on the Taiwanese hardware chain. |
| `equities` | [Alpha Vantage](https://www.alphavantage.co/) | Daily closes for NVDA, TSM, ASML, MU, CRWV, ORCL | Optional: set the `ALPHAVANTAGE_API_KEY` repository secret. |

## Not wired, and why

- **Single-name CDS** (CoreWeave, Oracle, Nvidia): no free feed. The dashboard shows reported levels with their date and source, and tracks index spreads as a proxy.
- **Rental indices** (Silicon Data, Ornn, Compute Desk): proprietary. Linked, not redistributed.
- **Used-hardware prints** (CCIR): published as aggregates on a web page; quoted with date.
- **HBM contracts, packaging slots, powered land, prepayment terms**: no public price. These are the registered gaps.

## Seed data

`npm run data:seed` builds a snapshot from `scripts/data/seed-capture.mjs`, a
partial manual capture of the same endpoints taken on 10 November 2026. Feeds
built from it are labelled SEED on the site. The first live run replaces them.

## Adding a feed

Write a pure `parseX` and a thin `fetchX` in `scripts/data/adapters.mjs`, add a
recorded sample to the capture file and a test in `tests/adapters.test.mjs`,
then register it with `feed(...)` in `scripts/fetch-data.mjs`. A feed must fail
soft: throw, and the orchestrator keeps the previous data and marks it stale.
