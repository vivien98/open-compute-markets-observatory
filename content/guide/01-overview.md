---
slug: overview
title: 1. The whole chain in one picture
heading: The whole chain in one picture
label: The whole chain
cluster: Orientation
summary: The end-to-end chain from sand to tokens in one map, the markets that price each link, and the four kinds of claim that get mixed together whenever people argue about it.
---

Every argument about AI infrastructure is an argument about one chain. Sand becomes wafers; wafers become dies; dies and stacked memory become packages; packages become servers, racks, and clusters; clusters need buildings, transformers, and turbines; the whole thing is financed with cash, leases, bonds, and customer commitments; and at the top, a model turns electricity into tokens that a harness sells to a person. Each link is a market. Some of those markets are transparent and quoted daily. Some are bilateral and invisible. Some are visible but manipulable. The purpose of this chapter is to lay the chain out once, so that every later chapter can be located on it.

## 1.1 The feedback loop

The central economic argument about the chain can be expressed as a feedback loop:

- Better models earn more revenue from each unit of scarce compute.
- The lab with the highest revenue per unit can bid more for new compute.
- More compute supports more research, training, and product use.
- If that produces a better model, the lab's willingness to pay rises again.
- Suppliers expand, but long lead times make capacity slow to respond.
- The gap between desired investment and internal cash flow is financed with leases, customer commitments, equity, and debt.
- At very large scale, this demand for capital could affect credit spreads, interest rates, asset prices, and sovereign refinancing.

Two big questions follow. First, does this loop concentrate most useful AI compute in a few labs? Second, does financing the physical build reprice capital for the rest of the world?

The word could matters. The first six steps are economically intelligible. Their magnitude, timing, and persistence are forecasts. The final macroeconomic steps depend on central-bank policy, global saving, inflation, productivity, public policy, and whether AI revenue actually arrives fast enough.

## 1.2 The map of markets

The table below is the spine of the guide. Read it top to bottom as physics (each row is made from the row above) and bottom to top as demand (each row is bought because of the row below). The third column is the observatory's central question for every layer: is there a price, and can you see it?

| Layer | What is bought and sold | Is there a public price? | Where explained |
| Lithography and fab tools | EUV/DUV scanners, deposition, etch, metrology tools | No transaction prices; order books and lead times disclosed by [ASML](https://www.asml.com/en/investors) and peers | Chapter 4 |
| Logic wafers | Leading-edge wafer starts at N3/N5/N2 | No; bilateral. Monthly revenue disclosed by [TSMC](https://investor.tsmc.com/english/monthly-revenue) is the proxy | Chapter 4 |
| Memory | DRAM, and stacked HBM tied to packaging slots | Commodity DRAM is quoted by [TrendForce/DRAMeXchange](https://www.dramexchange.com/); HBM contracts are not | Chapter 4 |
| Packaging and substrates | CoWoS-class slots, interposers, ABF substrates | No; capacity estimates only | Chapter 4 |
| Accelerators and systems | GPUs, TPUs, custom ASICs, servers, racks | List prices exist; transaction prices and allocation are private | Chapters 4-5 |
| Networking | Switches, NICs, optical transceivers, fiber | No public series; lead times are the signal | Chapter 4 |
| Sites and power | Powered shells, MW of critical IT, interconnection queues, turbines, transformers | Wholesale power is public ([PJM](https://dataminer2.pjm.com/), [ERCOT](https://www.ercot.com/mktinfo/prices)); $/MW for powered land is not | Chapter 5 |
| Compute rental | GPU-hours by configuration, region, tenancy, and commitment | Yes: posted cloud prices, marketplaces, and now daily indices ([Silicon Data](https://www.silicondata.com/products/silicon-index), [Ornn](https://ornn.com/)) | Chapters 2, 10 |
| Compute derivatives | Futures and forwards on GPU rental indices | Emerging: [CME](https://www.cmegroup.com/media-room/press-releases/2026/8/11/cme_group_and_silicondatatolaunchcomputefuturesonoctober5tounloc.html), [ICE](https://ir.theice.com/press/news-details/2026/ICE-and-Ornn-to-Launch-GPU-Compute-Futures-Contracts/default.aspx), [Architect](https://www.prnewswire.com/news-releases/architect-financial-technologies-to-launch-us-futures-exchange-for-compute-and-ai-commodities-following-dcm-acquisition-302784564.html) | Chapter 10 |
| Tokens | Input, output, and cached tokens for a named model on a named provider | Yes, and very public: [OpenRouter](https://openrouter.ai/models) lists every provider's three prices | Chapter 9 |
| Agents and applications | Subscriptions, seats, task completions | Yes, but bundled | Chapter 9 |
| Capital | Equity, bonds, project loans, leases, take-or-pay commitments | Yes for traded bonds and spreads ([FRED](https://fred.stlouisfed.org/series/BAMLC0A4CBBB)); no for private credit | Chapters 7, 11 |
| Sovereign balance sheets | Treasury yields, term premium, emerging-market refinancing | Yes | Chapter 12 |

Two features of this table drive the rest of the guide. First, the most physically binding markets (HBM, packaging, powered land) have the worst prices. Second, the most transparent market (tokens) sits at the very top, furthest from the physics, and is the one whose prices can be strategically falsified.

## 1.3 Prices as telegrams

There is a specific reason to organize an observatory around prices rather than around capacity estimates. Hayek's argument in [The Use of Knowledge in Society](https://www.econlib.org/library/Essays/hykKnw.html) is that the economically relevant facts, "the particular circumstances of time and place," are held by people who cannot be surveyed, and that the price system is a mechanism for communicating exactly the part of that knowledge which other people need to act on. His example is tin: when tin becomes scarcer, users everywhere economize on it without ever learning why, because the price moved.

Compute is a tin problem at industrial scale. Nobody can survey TSMC's packaging yields, SK hynix's HBM allocation decisions, PJM's interconnection queue, and a thousand neoclouds' utilization at once. But when the H100 rental rate falls for six months, every one of those facts has been partially telegraphed. The trouble, and the reason the observatory marks so many markets as gaps, is that where the price is missing (HBM contracts), the telegram is never sent; and where the price is present but unverifiable (cached tokens, Chapter 9), the telegram can lie.

A second Hayekian idea, from [Competition as a Discovery Procedure](https://cdn.mises.org/qjae5_3_3.pdf), is that competition is valuable precisely because we do not know in advance who can produce what most cheaply. The open-weight token market of Chapter 9 is the clearest live experiment in this: dozens of inference providers, none of whom know each other's cost curves, discover the price of a GLM-class token by quoting against each other every day. Whether that discovery produces true prices or merely cheap-looking ones turns out to depend on a verification problem, which is why an electrical engineer's question (can the router check the cache?) becomes an economist's question (does the price carry knowledge?).

## 1.4 Four kinds of statement

| Type | Meaning | Example |
| Definition | A term or accounting relationship. | CapEx buys or builds long-lived assets; depreciation allocates their recorded cost over useful life. |
| Measurement | A quantity observed or reconstructed for a stated boundary and date. | A filing's cash purchases of property and equipment in 2025; a provider's quoted output-token price on a given day. |
| Estimate/forecast | A model-based number whose assumptions may be partly private. | A lab's 2028 GW or revenue per MW; an analyst's CoWoS capacity figure. |
| Scenario | A conditional thought experiment used to expose a mechanism. | If AI raises rates by 250 bps, what happens to debt service and equities? |

This classification prevents two common mistakes. A scenario can be useful without being a forecast, and a forecast can be internally coherent without being empirically likely. The observatory tags every indicator with the same discipline: Direct, Proxy, or Gap.

## 1.5 How the chapters fit

Chapters 2 and 3 build the units and the history. Chapters 4 and 5 walk the physical stack from photomask to substation. Chapters 6 to 8 follow the money: accounting, financing, and who captures the surplus. Chapters 9 and 10 are the market at the top of the chain: the open-weight token market with its harnesses, routers, model builders, and inference providers, and the price stack that connects a token back to a megawatt-hour. Chapters 11 to 14 are the macro layer: rates, sovereign debt, export controls, and the map of how all these markets move each other across Taiwan, Korea, the Netherlands, Japan, the United States, and China. Chapters 15 to 17 audit the big claims. Chapter 18 is a study plan.
