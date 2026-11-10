---
slug: overview
title: The whole chain in one picture
heading: The whole chain in one picture
label: The whole chain
cluster: Orientation
summary: The end-to-end chain from sand to tokens in one map, the markets that price each link, and the four kinds of claim that get mixed together whenever people argue about it.
---

Every argument about AI infrastructure is an argument about one chain. Sand becomes wafers; wafers become dies; dies and stacked memory become packages; packages become servers, racks, and clusters; clusters need buildings, transformers, and turbines; the whole thing is financed with cash, leases, bonds, and customer commitments; and at the top, a model turns electricity into tokens that a harness sells to a person. Each link is a market. Some of those markets are transparent and quoted daily. Some are bilateral and invisible. Some are visible but manipulable. The purpose of this chapter is to lay the chain out once, so that every later chapter can be located on it.

## The feedback loop

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

## The map of markets

The table below is the spine of the guide. Read it top to bottom as physics (each row is made from the row above) and bottom to top as demand (each row is bought because of the row below). The third column is the observatory's central question for every layer: is there a price, and can you see it?

| Layer | What is bought and sold | Is there a public price? | Where explained |
| Lithography and fab tools | EUV/DUV scanners, deposition, etch, metrology tools | No transaction prices; order books and lead times disclosed by [ASML](https://www.asml.com/en/investors) and peers | {ch:silicon} |
| Logic wafers | Leading-edge wafer starts at N3/N5/N2 | No; bilateral. Monthly revenue disclosed by [TSMC](https://investor.tsmc.com/english/monthly-revenue) is the proxy | {ch:silicon} |
| Memory | DRAM, and stacked HBM tied to packaging slots | Commodity DRAM is quoted by [TrendForce/DRAMeXchange](https://www.dramexchange.com/); HBM contracts are not | {ch:silicon} |
| Packaging and substrates | CoWoS-class slots, interposers, ABF substrates | No; capacity estimates only | {ch:silicon} |
| Accelerators and systems | GPUs, TPUs, custom ASICs, servers, racks | List prices exist; transaction prices and allocation are private | {chs:silicon..data-centers} |
| Networking | Switches, NICs, optical transceivers, fiber | No public series; lead times are the signal | {ch:silicon} |
| Sites and power | Powered shells, MW of critical IT, interconnection queues, turbines, transformers | Wholesale power is public ([PJM](https://dataminer2.pjm.com/), [ERCOT](https://www.ercot.com/mktinfo/prices)); $/MW for powered land is not | {ch:data-centers} |
| Compute rental | GPU-hours by configuration, region, tenancy, and commitment length | Yes: posted cloud prices, marketplaces, and now daily indices ([Silicon Data](https://www.silicondata.com/products/silicon-index), [Ornn](https://ornn.com/)) | {chs:units,token-prices} |
| Compute derivatives | Futures and forwards on GPU rental indices | Emerging: [CME](https://www.cmegroup.com/media-room/press-releases/2026/8/11/cme_group_and_silicondatatolaunchcomputefuturesonoctober5tounloc.html), [ICE](https://ir.theice.com/press/news-details/2026/ICE-and-Ornn-to-Launch-GPU-Compute-Futures-Contracts/default.aspx), [Architect](https://www.prnewswire.com/news-releases/architect-financial-technologies-to-launch-us-futures-exchange-for-compute-and-ai-commodities-following-dcm-acquisition-302784564.html) | {ch:token-prices} |
| Tokens | Input, output, and cached tokens for a named model on a named provider | Yes, and very public: [OpenRouter](https://openrouter.ai/models) lists every provider's three prices | {ch:souq} |
| Agents and applications | Subscriptions, seats, task completions | Yes, but bundled | {ch:souq} |
| Used hardware | Second-hand accelerators and servers; the residual value a lender could rely on | Barely: about three thousand recorded sales in three years ([CCIR](https://ccir.io/hardware)); models and quotes otherwise | {ch:collateral} |
| Capital | Equity, bonds, project loans, leases, take-or-pay commitments, prepayments | Yes for traded bonds and broad spreads ([FRED](https://fred.stlouisfed.org/series/BAMLC0A4CBBB)); single-name credit default swaps are quoted but not freely published; private credit terms are not public | {chs:financing,collateral}, {ch:rates} |
| Sovereign balance sheets | Treasury yields, term premium, emerging-market refinancing | Yes | {ch:sovereign-debt} |

Three features of this table drive the rest of the guide. First, the most physically binding markets (HBM, packaging, powered land) have the worst prices. Second, the most transparent market (tokens) sits at the very top, furthest from the physics, and is the one whose prices can be strategically falsified. Third, the prices that finance everything else, the rate on a GPU-backed loan and the size of the prepayment, depend more on who the customer is than on what the hardware is worth, because the hardware itself has almost no resale price to point to.

## Prices as telegrams

There is a specific reason to organize an observatory around prices rather than around capacity estimates. Hayek's argument in [The Use of Knowledge in Society](https://www.econlib.org/library/Essays/hykKnw.html) is that the economically relevant facts, "the particular circumstances of time and place," are held by people who cannot be surveyed, and that the price system is a mechanism for communicating exactly the part of that knowledge which other people need to act on. His example is tin: when tin becomes scarcer, users everywhere economize on it without ever learning why, because the price moved.

Compute is a tin problem at industrial scale. Nobody can survey TSMC's packaging yields, SK hynix's HBM allocation decisions, PJM's interconnection queue, and a thousand neoclouds' utilization at once. But when the H100 rental rate falls for six months, every one of those facts has been partially telegraphed. The trouble, and the reason the observatory marks so many markets as gaps, is that where the price is missing (HBM contracts), the telegram is never sent; and where the price is present but unverifiable (cached tokens, {ch:souq}), the telegram can lie.

A second Hayekian idea, from [Competition as a Discovery Procedure](https://cdn.mises.org/qjae5_3_3.pdf), is that competition is valuable precisely because we do not know in advance who can produce what most cheaply. The open-weight token market of {ch:souq} is the clearest live experiment in this: dozens of inference providers, none of whom know each other's cost curves, discover the price of a GLM-class token by quoting against each other every day. Whether that discovery produces true prices or merely cheap-looking ones turns out to depend on a verification problem, which is why an electrical engineer's question (can the router check the cache?) becomes an economist's question (does the price carry knowledge?).

## Four kinds of statement

| Type | Meaning | Example |
| Definition | A term or accounting relationship. | CapEx buys or builds long-lived assets; depreciation allocates their recorded cost over useful life. |
| Measurement | A quantity observed or reconstructed for a stated boundary and date. | A filing's cash purchases of property and equipment in 2025; a provider's quoted output-token price on a given day. |
| Estimate/forecast | A model-based number whose assumptions may be partly private. | A lab's 2028 GW or revenue per MW; an analyst's CoWoS capacity figure. |
| Scenario | A conditional thought experiment used to expose a mechanism. | If AI raises rates by 250 bps, what happens to debt service and equities? |

This classification prevents two common mistakes. A scenario can be useful without being a forecast, and a forecast can be internally coherent without being empirically likely. The observatory tags every indicator with the same discipline: Direct, Proxy, or Gap.

## How the chapters fit

{chs:units,history} build the units and the history. {chs:silicon,data-centers} walk the physical stack from photomask to substation. {chs:accounting..value-capture} follow the money: accounting, financing, what the financing is secured on, and who captures the surplus. {chs:souq..commodity} are the market at the top of the chain: the open-weight token market with its harnesses, routers, model builders, and inference providers; the price stack that connects a token back to a megawatt-hour; and the question of whether compute is becoming a commodity or remains a credit product. {chs:rates..linkages} are the macro layer: rates, sovereign debt, export controls, and the map of how all these markets move each other across Taiwan, Korea, the Netherlands, Japan, the United States, and China. {chs:centralization..claims} audit the big claims. {ch:study-plan} is a study plan.
