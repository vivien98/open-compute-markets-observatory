---
slug: linkages
title: How the markets are intertwined
heading: How the markets are intertwined
label: Market linkages
cluster: Macro
summary: A map of which price moves which, across Taiwan, Korea, the Netherlands, Japan, the United States, and China; the firms that sit on each link; and the order in which shocks travel through the chain.
---

The earlier chapters treat each market on its own. This one is about the wiring between them. The AI hardware economy is unusual in that a single product, the accelerator system, draws on the most concentrated suppliers in half a dozen countries at once, is financed in a seventh, and is consumed as tokens everywhere. A shock anywhere on the chain shows up as a price somewhere else, usually with a lag and usually in a different unit. The dashboard's linkage map draws this graph; this chapter is its legend.

## The geography of the chain

| Country | What it supplies | Firms on the link | The prices that carry the signal |
| Netherlands | EUV and DUV lithography, the only source of the former | [ASML](https://www.asml.com/en/investors) | Order backlog, system shipments, guidance; no transaction price |
| Germany | EUV optics | [ZEISS SMT](https://www.zeiss.com/semiconductor-manufacturing-technology/home.html) | Disclosed only through ASML |
| Japan | Photoresist, wafers, deposition and etch tools, test, substrates | Tokyo Electron, Shin-Etsu, SUMCO, JSR, Advantest, Ibiden | Supplier earnings; yen |
| Taiwan | Leading-edge logic wafers, CoWoS packaging, servers and racks | [TSMC](https://investor.tsmc.com/english/monthly-revenue), ASE, Foxconn, Quanta, Wiwynn | TSMC monthly revenue (the highest-frequency public foundry signal), Taiwan dollar, TAIEX |
| South Korea | HBM and DRAM | [SK hynix](https://www.skhynix.com/ir/), Samsung | Quarterly HBM commentary, DRAM contract prices via [TrendForce](https://www.trendforce.com/), Korean won, KOSPI |
| United States | Chip design, EDA, networking, hyperscale demand, most of the capital | Nvidia, AMD, Broadcom, Cadence, Synopsys, Micron (memory), the hyperscalers, neoclouds such as CoreWeave, Applied Materials, Lam, KLA | Equities, investment-grade and high-yield spreads ([FRED BBB OAS](https://fred.stlouisfed.org/series/BAMLC0A4CBBB)), Treasury yields, wholesale power ([PJM](https://dataminer2.pjm.com/), [ERCOT](https://www.ercot.com/mktinfo/prices)), [Census data-center construction](https://www.census.gov/construction/c30/c30index.html) |
| China | Domestic logic (SMIC), memory (CXMT), the largest open-weight model builders, and the most aggressive inference repricers | SMIC, CXMT, Huawei, Z.ai, Moonshot, DeepSeek, MiniMax, StreamLake, Novita | Export-control notices from [BIS](https://www.bis.gov/), domestic shipment estimates, quoted token prices on [OpenRouter](https://openrouter.ai/models) |
| Gulf and elsewhere | Sovereign capital, power-rich sites | Sovereign funds, national compute programs | Deal announcements; no price |

Two structural facts follow. The physical chain runs east to west (Netherlands and Japan supply Taiwan and Korea, which supply the United States) while the money runs west to east (US capital pays for Taiwanese and Korean capacity). And the token market at the top of the chain has become, through open weights, substantially Chinese in its model builders and its price-setting providers, while the routers and harnesses are largely American. A tariff, a control, or a currency move therefore hits different layers of the same product in different directions.

## The transmission table

The heart of the chapter. Each row is an edge on the dashboard's linkage map. "Lag" is an order of magnitude, not a measurement.

| Origin | Destination | Mechanism | Lag |
| Frontier model revenue per MW rises | Lab willingness to pay for compute rises; contract GPU-hour prices firm | {ch:value-capture}'s marginal-value argument | Quarters |
| Lab capacity contracts signed | TSMC and SK hynix capacity plans; ASML orders | Take-or-pay commitments make upstream CapEx financeable ({ch:financing}) | 2-4 quarters upstream, 2-3 years to output |
| ASML EUV shipments | Leading-edge wafer starts 12-24 months later | Tool install, qualification, ramp ({ch:silicon}) | Years |
| HBM allocation tightens | Accelerator shipments capped; memory makers' margin rises; packaging slots re-priced | The two-wafer problem ({chs:silicon,china}) | Quarters |
| CoWoS capacity added | Accelerator supply rises; on-demand GPU-hour rates soften a year later | Packaging is the last physical gate before systems | 2-4 quarters |
| Accelerator supply rises | GPU rental indices fall; then open-weight token prices fall | {ch:token-prices}'s price stack, passed through by {ch:souq}'s contest | Months |
| Wholesale power rises in a hub | Data-center siting shifts; construction spending re-routes; turbine and transformer lead times lengthen | {ch:data-centers} | Quarters to years |
| Interconnection queue lengthens | Energization dates slip; delivered MW lags contracted MW; lease commencement dates slip in filings | The lead-lag pattern in {ch:financing} | Years |
| Credit spreads widen | Neocloud and developer cost of capital rises; project finance slows; GPU-hour cost floor rises | {ch:rates} | Weeks to quarters |
| Treasury term premium rises | Long-duration equities (including AI) de-rate; sovereign refinancing tightens | {chs:rates..sovereign-debt} | Weeks |
| Taiwan dollar strengthens | TSMC dollar margins compress; wafer pricing pressure | Costs local, revenue in dollars | Quarters |
| Korean won weakens | SK hynix and Samsung dollar margins expand | Same, opposite sign | Quarters |
| Export control tightens | China's frontier accelerator access falls; domestic substitutes accelerate; Chinese open-weight builders optimize for efficiency per watt | {ch:china} | Immediate on announcement, years on capacity |
| Open-weight model released | Token price for that capability class falls; provider count rises; the inference crack spread compresses | {ch:souq} | Days |
| Cache misreporting detected | Router re-ranks; repricer share falls; effective price rises toward honest cost | {ch:souq}'s fixes | Days to weeks |
| CDS spreads on build-out borrowers widen | New bond and loan issuance slows; projects that depend on those balance sheets are delayed; weaker operators must offer more prepayment or shorter terms | {chs:rates,commodity} | Weeks to quarters |
| A used-hardware price becomes trusted | Lenders advance more against the cluster and ask for less prepayment; shorter contracts become financeable; the tenor premium narrows | {ch:collateral} | Years |
| Short-tenor rental premium rises | Capacity resellers enter; inference providers pull chips from serverless endpoints to serve contracts; providers per model fall and token prices firm | {ch:commodity} | Weeks |
| Hardware-portable providers gain share | The scarce accelerator is rented out and tokens are served on alternatives; the premium for the scarce chip is arbitraged down | {ch:commodity} | Quarters |

## The order of things

Because the chain has lead times, shocks arrive in a characteristic order, and knowing the order lets you tell a supply story from a demand story.

A **demand shock** (a new model that earns much more per MW) shows up first in lab contract announcements and hyperscaler CapEx guidance, then in TSMC monthly revenue and ASML orders, then in HBM commentary, then, a year or more later, in delivered MW, and only then in rental indices, which fall as the capacity lands. The token price falls last.

A **supply shock** (a packaging outage, an export control, a transformer shortage) shows up first in lead times and allocation notices, then in the rental index, which rises as marginal capacity tightens, then in token prices for the affected capability class, and finally in the financing layer, as projects that assumed delivery dates renegotiate.

A **financial shock** (spreads widen, term premium rises) enters in the middle. It does not change today's physical supply, but it changes which planned supply gets built, so its first visible effect is on announcements and cancellations, and its physical effect arrives a year later as a supply shock.

The practical rule is that the same movement in a rental index means opposite things depending on what moved before it. A falling H100 rate after a year of rising TSMC revenue is capacity landing; a falling rate after a quarter of widening spreads is demand retreating.

## Where the graph is dense and where it is thin

The linkage map is dense in the middle of the chain (foundry, memory, packaging, systems) because those layers are complementary: an accelerator needs all of them, so a shortage in one reprices the rest. It is thin at the ends. At the bottom, lithography has one supplier and no price, so ASML enters the graph as quantities and lead times. At the top, the token market has dozens of suppliers and very public prices, but, as {ch:souq} shows, prices that can be false; it enters the graph as a spread rather than a level.

For a Hayekian reader the density is the point. Where the graph is dense, prices in one market tell you about scarcity in another, which is the knowledge-communicating function working as designed. Where it is thin, either there is no price to carry the signal (HBM contracts) or the price is not trusted to carry it (cached tokens). The observatory's job is to draw the dense part faithfully and mark the thin part honestly.

## Reading the dashboard's linkage map

The map on the dashboard is a graph, not a diagram. Nodes are markets and the firms that sit on them, colored by country. Edges are rows of the transmission table. Hovering a node lights up everything one step away; clicking opens the chapter that explains the edge. The map is drawn from this chapter's tables, so it changes when the tables do, and it makes no claim about correlation strength: the edge says that a mechanism exists, not that the mechanism was active last quarter. Correlation is what the cross-market chart beneath it is for, and that chart, like everything on the dashboard, is illustrative until source adapters replace it.
