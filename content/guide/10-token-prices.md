---
slug: token-prices
title: 10. From electrons to tokens: the price stack and the crack spread
heading: From electrons to tokens
label: Price stack & futures
cluster: The token market
summary: How a token price is built from a megawatt-hour and a GPU-hour, what the GPU rental indices and the new compute futures actually price, and why the spread between tokens and compute is the crack spread of intelligence.
---

Chapter 9 looked at the token market from above, as a contest between providers. This chapter looks at it from below. A token price is the last in a chain of prices that starts at a power plant, and each link in that chain is a market with its own transparency, its own contract form, and, increasingly, its own derivatives. If you can follow a dollar from a megawatt-hour to a token, you can read every cross-market signal on the dashboard.

## 10.1 The price stack

Write the chain as a stack of unit conversions. Each arrow is a market; each conversion factor is an engineering fact that the market has to price.

- **$ per MWh** (wholesale electricity, plus delivery and demand charges) →
- **$ per GPU-hour of electricity**, via watts per GPU and PUE →
- **$ per GPU-hour all-in**, adding hardware depreciation, facility, networking, staff, and the operator's cost of capital →
- **$ per million tokens**, via tokens per GPU-hour, which depends on the model, the batch size, the context length, and whether the work is prefill, decode, or a cache lookup →
- **$ per task**, via tokens per task, which the harness controls.

Here is the arithmetic for one illustrative H100-class accelerator. The numbers are round and dated; the structure is what matters.

| Step | Assumption | Result |
| Power draw | 700 W accelerator, roughly 1.3 kW per accelerator including host, network and cooling at PUE 1.2 | 1.5 kW per GPU |
| Electricity | $60 per MWh | $0.09 per GPU-hour |
| Hardware | $30,000 installed, 5-year straight line, 70% utilization | $0.98 per GPU-hour |
| Facility and other | Shell, power gear, staff, spares, software | $0.30-0.50 per GPU-hour |
| Cost of capital | 10% on the undepreciated balance, averaged | $0.20-0.35 per GPU-hour |
| All-in cost | Sum | $1.6-2.0 per GPU-hour |
| Posted rental | Marketplace on-demand ask in the same period | about $2.2 per GPU-hour |

Three lessons sit inside the table. Electricity is a small share of the GPU-hour at current prices, which is why a power price shock moves site economics through availability and lead time (Chapter 5) more than through the hourly cost. Depreciation dominates, which is why the useful-life assumption in Chapter 6 is the single most important accounting choice in the industry. And the spread between all-in cost and posted rental is thin, which is why the on-demand GPU-hour behaves like a commodity, and why an index could be built on it.

Now convert GPU-hours to tokens. A node of eight accelerators at $2 per GPU-hour costs $16 per hour. Serving a mid-sized open-weight model, that node might sustain a few thousand output tokens per second across a batch of concurrent users, and tens of thousands of input tokens per second in prefill. At 3,000 output tokens per second the node produces about 10.8 million output tokens per hour, so the cost is roughly $1.50 per million output tokens. At 50,000 input tokens per second in prefill, the cost is under $0.10 per million input tokens. A cached token, which is a memory lookup, costs a fraction of that. This is why the three prices of Chapter 9 have the shape they do: output is bandwidth-bound and expensive, input is compute-bound and cheap, cached is nearly free. Every quoted token price on [OpenRouter](https://openrouter.ai/models) is some provider's version of this arithmetic plus a margin, or minus a subsidy.

## 10.2 The GPU-hour market

The GPU-hour is the closest thing the compute chain has to a spot commodity. It is not one market but several, distinguished by exactly the denominators the dashboard preserves.

**Configuration.** H100 80GB, H200, B200, and so on, with memory and interconnect stated. A B200-hour is not an H100-hour, any more than Brent is WTI.

**Commitment.** On-demand, one-month, one-year, three-year. Long commitments trade at a discount and are the contract market; on-demand is the spot market. When on-demand prices fall while contract prices hold, the market is telling you that marginal capacity is loose but committed capacity is not.

**Tenancy and region.** Dedicated versus shared, and which country's power and jurisdiction.

**Venue.** Hyperscaler list prices, which move rarely; neocloud posted prices; and marketplaces where many small providers post asks. The dashboard's posted-price chart normalizes only where all of these match.

Two daily indices now make the spot market legible. [Silicon Data's H100 rental index](https://www.silicondata.com/products/silicon-index/h100) aggregates posted and transacted rental rates into a single daily number, and its CEO's account of [the 2025 decline in H100 rental prices](https://medium.com/@cli_87015/a-correction-in-compute-tracing-the-decline-in-h100-rental-prices-af02da399f5a) is a good worked example of reading a compute price series. The [Ornn Compute Price Index](https://ornn.com/) is built only from printed transactions on Ornn's own venue and covers H100, H200, B200, and consumer RTX cards. [Compute Desk](https://www.prnewswire.com/news-releases/architect-financial-technologies-partners-with-compute-desk-to-launch-exchange-for-physical-market-for-gpu-compute-302820762.html) publishes indices referencing privately settled transactions and runs a clearing platform for physical delivery. They differ in construction exactly as commodity benchmarks do: an assessed price built from posted asks, a traded price from one venue, and a survey of private trades. When they disagree, the disagreement is itself a signal about the difference between posted and cleared prices.

## 10.3 Compute futures and forwards

In 2026 the GPU-hour acquired derivatives. Three venues matter.

[CME Group and Silicon Data](https://www.cmegroup.com/media-room/press-releases/2026/8/11/cme_group_and_silicondatatolaunchcomputefuturesonoctober5tounloc.html) announced H100 and B200 rental index futures for launch on NYMEX on 5 October 2026, pending regulatory review, each contract representing one month of GPU rental cost. [ICE and Ornn](https://ir.theice.com/press/news-details/2026/ICE-and-Ornn-to-Launch-GPU-Compute-Futures-Contracts/default.aspx) announced cash-settled, dollar-denominated futures referencing the Ornn index. [Architect Financial Technologies](https://www.prnewswire.com/news-releases/architect-financial-technologies-to-launch-us-futures-exchange-for-compute-and-ai-commodities-following-dcm-acquisition-302784564.html), founded by a former FTX US president, acquired a designated contract market to list compute and AI commodity futures and options, partnered with [Compute Desk](https://www.prnewswire.com/news-releases/architect-financial-technologies-partners-with-compute-desk-to-launch-exchange-for-physical-market-for-gpu-compute-302820762.html) for an exchange-for-physical facility so that a futures position can be converted into delivered GPU capacity, and runs perpetual futures through an offshore affiliate. Brokers such as Marex have begun quoting compute.

For a reader of Chapter 7, the interesting question is not whether these contracts trade but what they let a lender accept. Today a neocloud that wants project debt must show a take-or-pay contract from a creditworthy customer, because the lender needs predictable cash flow to cover debt service. A liquid futures curve offers an alternative: the neocloud sells forward its rental revenue, the lender treats the hedge as the collateral-like support that Chapter 7 describes, and the customer commitment is replaced by an exchange's clearing house. That is exactly how power projects moved from bilateral power purchase agreements to hedged merchant plants. If compute futures develop depth at the one- to three-year tenor, the financing chapter of this guide changes.

The obstacles are the usual ones for a new commodity benchmark. **Basis risk:** the index tracks one configuration in a market where the hardware generation turns over every 18 months, so a two-year hedge on H100 rates is a bet on the H100's obsolescence path as much as on scarcity. **Deliverability:** cash settlement avoids the question of what a "delivered GPU-hour" is, but exchange-for-physical facilities have to answer it, including network, storage, and region. **Manipulation:** a thin index built from posted asks can be moved by posting; one built from one venue's trades can be moved by trading there. The **[crack spread](https://www.eia.gov/todayinenergy/detail.php?id=1630)** literature in oil is the right reference: a benchmark becomes trustworthy when many parties with opposing interests trade it, not when it is announced.

## 10.4 The crack spread of intelligence

In refining, the crack spread is the difference between the price of refined products (gasoline, diesel) and the price of the crude they are made from, and the EIA's [primer](https://www.eia.gov/finance/markets/products/prices.php) explains how it captures both the real cost of refining and the market's temporary imbalances. Chitra proposes, and this guide adopts, the same construction for inference: the spread between the price of a token and the cost of the GPU-hours needed to produce it.

**inference crack spread = price per token − (GPU-hour cost ÷ tokens per GPU-hour)**

The spread has legitimate components: the provider's software (batching, kernels, quantization, speculative decoding from [Leviathan et al.](https://arxiv.org/abs/2211.17192)), its reliability engineering, its margin, and the router's fee. It has illegitimate components too: the cache misreporting of Chapter 9 is an addition to the crack spread that produces no refined product. And it has one component that is neither: the model builder's subsidy, when a builder serves its own model below cost to win share or to advertise.

Why does this matter beyond the souq? Because the crack spread is where the token market and the hardware market are joined, and it moves when either side moves. A fall in GPU-hour rates with sticky token prices widens the spread and shows up as provider margin. A new kernel that doubles tokens per GPU-hour widens it for one provider until the Tullock contest passes the gain to buyers. A price war among repricers compresses it below zero for everyone honest. Watching the spread across a reference model is the cleanest way to see which layer of Chapter 8's value-capture story is winning this quarter.

## 10.5 Cross-market links from the token down

Every input to the price stack is priced somewhere else in the world. The table lists the transmission channels that the dashboard's linkage map draws; Chapter 14 covers the macro and geographic side in full.

| If this moves | Then watch | Channel |
| Wholesale power ($/MWh at PJM, ERCOT) | Neocloud all-in GPU-hour cost; siting decisions | Electricity is a small share of the hourly cost but decides where the next site goes (Chapter 5) |
| HBM contract price, or SK hynix and Micron guidance | Next-generation accelerator cost; on-demand GPU-hour rates a year later | Memory is a large share of accelerator bill of materials and the binding constraint on packaging (Chapter 4) |
| Accelerator list price, or TSMC wafer pricing | Depreciation per GPU-hour; the cost floor under rental indices | Hardware is the dominant term in the GPU-hour (Section 10.1) |
| BBB credit spread, Treasury yields | Cost-of-capital term in the GPU-hour; neocloud expansion pace | Chapter 11 |
| GPU rental index (H100, B200) | Token prices for open-weight models with a lag; futures curve | Chapter 9's contest passes cost changes through with the exponent r = 2 |
| Cheapest quoted output price for a reference open-weight model | The inference crack spread; the count of providers per model | The souq's most visible number, and the one most exposed to shrouded pricing |
| Taiwan dollar, Korean won | Dollar cost of wafers and memory; supplier margins | Foundry and memory revenue is in dollars, costs are local (Chapter 14) |

## 10.6 What to measure

For the price stack, the observatory tracks: the daily H100 and B200 rental indices; the spread between on-demand and one-year committed rates for the same configuration; the futures curve once it exists, and its basis to the spot index; the cheapest quoted and the model builder's own output-token prices for a reference open-weight model; and the implied inference crack spread. Where a number does not exist publicly (the cache-hit rate by provider, the transacted price of an accelerator), the dashboard shows the gap.
