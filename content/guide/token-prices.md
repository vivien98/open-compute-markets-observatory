---
slug: token-prices
title: From electrons to tokens: the price stack and the crack spread
heading: From electrons to tokens
label: Price stack & futures
cluster: The token market
summary: How a token price is built from a megawatt-hour and a GPU-hour, what the GPU rental indices and the new compute futures actually price, and why the spread between tokens and compute is the crack spread of intelligence.
---

{ch:souq} looked at the token market from above, as a contest between providers. This chapter looks at it from below. A token price is the last in a chain of prices that starts at a power plant, and each link in that chain is a market with its own transparency, its own contract form, and, increasingly, its own derivatives. If you can follow a dollar from a megawatt-hour to a token, you can read every cross-market signal on the dashboard.

## The price stack

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

Three lessons sit inside the table. Electricity is a small share of the GPU-hour at current prices, which is why a power price shock moves site economics through availability and lead time ({ch:data-centers}) more than through the hourly cost. Depreciation dominates, which is why the useful-life assumption in {ch:accounting} is the single most important accounting choice in the industry. And the spread between all-in cost and posted rental is thin, which is why the on-demand GPU-hour behaves like a commodity, and why an index could be built on it.

Now convert GPU-hours to tokens. A node of eight accelerators at $2 per GPU-hour costs $16 per hour. Serving a mid-sized open-weight model, that node might sustain a few thousand output tokens per second across a batch of concurrent users, and tens of thousands of input tokens per second in prefill. At 3,000 output tokens per second the node produces about 10.8 million output tokens per hour, so the cost is roughly $1.50 per million output tokens. At 50,000 input tokens per second in prefill, the cost is under $0.10 per million input tokens. A cached token, which is a memory lookup, costs a fraction of that. This is why the three prices of {ch:souq} have the shape they do: output is bandwidth-bound and expensive, input is compute-bound and cheap, cached is nearly free. Every quoted token price on [OpenRouter](https://openrouter.ai/models) is some provider's version of this arithmetic plus a margin, or minus a subsidy.

## The GPU-hour market

The GPU-hour is the closest thing the compute chain has to a spot commodity. It is not one market but several, distinguished by exactly the denominators the dashboard preserves.

**Configuration.** H100 80GB, H200, B200, and so on, with memory and interconnect stated. A B200-hour is not an H100-hour, any more than Brent is WTI.

**Commitment.** On-demand, one-month, one-year, three-year. Long commitments trade at a discount and are the contract market; on-demand is the spot market. When on-demand prices fall while contract prices hold, the market is telling you that marginal capacity is loose but committed capacity is not. The size of the discount is itself a signal, and {ch:commodity} argues that it measures the buyer's credit more than the seller's risk.

**Tenancy and region.** Dedicated versus shared, and which country's power and jurisdiction.

**Venue.** Hyperscaler list prices, which move rarely; neocloud posted prices; and marketplaces where many small providers post asks. The dashboard's posted-price chart normalizes only where all of these match.

Two daily indices now make the spot market legible. [Silicon Data's H100 rental index](https://www.silicondata.com/products/silicon-index/h100) aggregates posted and transacted rental rates into a single daily number, and its CEO's account of [the 2025 decline in H100 rental prices](https://medium.com/@cli_87015/a-correction-in-compute-tracing-the-decline-in-h100-rental-prices-af02da399f5a) is a good worked example of reading a compute price series. The [Ornn Compute Price Index](https://ornn.com/) is built only from printed transactions on Ornn's own venue and covers H100, H200, B200, and consumer RTX cards. [Compute Desk](https://www.prnewswire.com/news-releases/architect-financial-technologies-partners-with-compute-desk-to-launch-exchange-for-physical-market-for-gpu-compute-302820762.html) publishes indices referencing privately settled transactions and runs a clearing platform for physical delivery. They differ in construction exactly as commodity benchmarks do: an assessed price built from posted asks, a traded price from one venue, and a survey of private trades. When they disagree, the disagreement is itself a signal about the difference between posted and cleared prices.

## Futures, forwards, and prediction markets

In 2026 the GPU-hour began to acquire derivatives, and the order in which they arrived is instructive.

**Listed futures were announced first and have not yet traded.** [CME Group and Silicon Data](https://www.cmegroup.com/media-room/press-releases/2026/8/11/cme_group_and_silicondatatolaunchcomputefuturesonoctober5tounloc.html) announced H100 and B200 rental index futures for launch on NYMEX on 5 October 2026, pending regulatory review. Each contract represents one month of rental, 730 GPU-hours, settled in cash against the monthly average of the index. The launch date passed without a first trade. The derivatives regulator extended its review in September, citing novel or complex issues, and in early November the exchange agreed to a further extension to 8 January 2027, according to [CCIR's tracking of the docket](https://ccir.io/research/compute-derivatives-cftc). [ICE and Ornn](https://ir.theice.com/press/news-details/2026/ICE-and-Ornn-to-Launch-GPU-Compute-Futures-Contracts/default.aspx) announced cash-settled futures on the Ornn index, and ICE has told the regulator it still intends to list them. [Architect Financial Technologies](https://www.prnewswire.com/news-releases/architect-financial-technologies-to-launch-us-futures-exchange-for-compute-and-ai-commodities-following-dcm-acquisition-302784564.html) acquired a US exchange licence to list compute futures, partnered with [Compute Desk](https://www.prnewswire.com/news-releases/architect-financial-technologies-partners-with-compute-desk-to-launch-exchange-for-physical-market-for-gpu-compute-302820762.html) on a facility for converting a futures position into delivered capacity, and already runs perpetual futures on GPU and memory prices through an offshore affiliate.

**The regulator asked whether compute can underlie futures at all.** In August 2026 the Commodity Futures Trading Commission published a [request for comment](https://www.govinfo.gov/content/pkg/FR-2026-08-21/pdf/2026-17163.pdf) on listing compute derivatives. Its preliminary view was blunt: compute markets are fragmented, price formation occurs mainly in opaque bilateral transactions, dominant participants may have enough pricing power to make benchmarks manipulable, and compute may not yet show the fungibility, standardization, and liquidity that usually underlie a commodity derivatives market. The comment period closed on 20 October with close to a hundred letters. {ch:commodity} takes the question on its merits.

**Prediction markets got there first.** While the futures waited, binary contracts on the same indices were already trading. [Kalshi](https://kalshi.com/) lists, for each coming month, a ladder of contracts that pay one dollar if the month's average H100 rental price, as published by Ornn, finishes above a given strike; it lists similar ladders on DDR5 memory. Polymarket's US venue told the regulator it has listed contracts on daily GPU rental indices since February 2026. The volumes are small, a few million dollars in total by one comment letter's count, and many strikes are quoted by a single market maker. The same venue lists ladders for other accelerators and, more recently, contracts on the posted token prices of named labs, so that both ends of the price stack in this chapter now have a market-implied forecast, however thin.

A ladder is worth learning to read, because it is the only public, credit-free estimate of where the rental price is expected to go. The price of each contract is approximately the market's probability that the average will exceed that strike. Lined up by strike, the prices trace out a curve that falls from near one to near zero: the probability of exceeding each price level. The area under that curve is the expected price. Doing this for each listed month gives a market-implied forward curve. The dashboard computes it daily from Kalshi's public data, shows the bid and ask band so that the thinness is visible, and sets it beside marketplace asks.

**Why the usual arbitrage does not apply.** In a storable commodity the futures price is tied to the spot price by cash-and-carry: buy the barrel, store it, deliver it later, and the futures price cannot stray far from spot plus the cost of storage. A GPU-hour cannot be stored. [Bandi and Su](https://arxiv.org/abs/2607.12156) show that the link therefore fails for compute as it does for electricity, so a compute forward price is an expectation plus a risk premium, and they find that forward prices inferred from term rental contracts are likely to be upper bounds on true futures prices.

For a reader of {ch:financing}, the interesting question is what these contracts would let a lender accept. Today a neocloud that wants project debt must show a take-or-pay contract from a creditworthy customer, because the lender needs predictable cash flow to cover debt service. A liquid futures curve offers an alternative: the neocloud sells forward its rental revenue, the lender treats the hedge as support for the loan, and the customer commitment is replaced by an exchange's clearinghouse. That is how power projects moved from bilateral power purchase agreements to hedged merchant plants. It has not happened in compute, and {ch:collateral} explains the part of the problem that a rental hedge does not touch: a futures contract prices the hour, while a lender after a default needs a price for the box.

The obstacles are the usual ones for a new commodity benchmark. **Basis risk:** the index tracks one configuration in a market where the hardware generation turns over every 18 months, so a two-year hedge on H100 rates is a bet on the H100's obsolescence path as much as on scarcity. **Deliverability:** cash settlement avoids the question of what a "delivered GPU-hour" is, but exchange-for-physical facilities have to answer it, including network, storage, and region. **Manipulation:** a thin index built from posted asks can be moved by posting; one built from one venue's trades can be moved by trading there. A benchmark becomes trustworthy when many parties with opposing interests trade it, not when it is announced.

## The crack spread of intelligence

In refining, the crack spread is the difference between the price of refined products (gasoline, diesel) and the price of the crude they are made from, and the EIA's [primer](https://www.eia.gov/finance/markets/products/prices.php) explains how it captures both the real cost of refining and the market's temporary imbalances. Chitra proposes, and this guide adopts, the same construction for inference: the spread between the price of a token and the cost of the GPU-hours needed to produce it. Practitioners who came to compute from commodity trading call the same quantity the silicon spread, and {ch:commodity} develops their picture of the inference provider as a refinery.

**inference crack spread = price per token − (GPU-hour cost ÷ tokens per GPU-hour)**

The spread has legitimate components: the provider's software (batching, kernels, quantization, speculative decoding from [Leviathan et al.](https://arxiv.org/abs/2211.17192)), its reliability engineering, its margin, and the router's fee. It has illegitimate components too: the cache misreporting of {ch:souq} is an addition to the crack spread that produces no refined product. And it has one component that is neither: the model builder's subsidy, when a builder serves its own model below cost to win share or to advertise.

Why does this matter beyond the souq? Because the crack spread is where the token market and the hardware market are joined, and it moves when either side moves. A fall in GPU-hour rates with sticky token prices widens the spread and shows up as provider margin. A new kernel that doubles tokens per GPU-hour widens it for one provider until the Tullock contest passes the gain to buyers. A price war among repricers compresses it below zero for everyone honest. Watching the spread across a reference model is the cleanest way to see which layer of {ch:value-capture}'s value-capture story is winning this quarter.

## Cross-market links from the token down

Every input to the price stack is priced somewhere else in the world. The table lists the transmission channels that the dashboard's linkage map draws; {ch:linkages} covers the macro and geographic side in full.

| If this moves | Then watch | Channel |
| Wholesale power ($/MWh at PJM, ERCOT) | Neocloud all-in GPU-hour cost; siting decisions | Electricity is a small share of the hourly cost but decides where the next site goes ({ch:data-centers}) |
| HBM contract price, or SK hynix and Micron guidance | Next-generation accelerator cost; on-demand GPU-hour rates a year later | Memory is a large share of accelerator bill of materials and the binding constraint on packaging ({ch:silicon}) |
| Accelerator list price, or TSMC wafer pricing | Depreciation per GPU-hour; the cost floor under rental indices | Hardware is the dominant term in the GPU-hour (the price stack above) |
| BBB credit spread, Treasury yields | Cost-of-capital term in the GPU-hour; neocloud expansion pace | {ch:rates} |
| GPU rental index (H100, B200) | Token prices for open-weight models with a lag; futures curve | {ch:souq}'s contest passes cost changes through with the exponent r = 2 |
| Cheapest quoted output price for a reference open-weight model | The inference crack spread; the count of providers per model | The souq's most visible number, and the one most exposed to shrouded pricing |
| Taiwan dollar, Korean won | Dollar cost of wafers and memory; supplier margins | Foundry and memory revenue is in dollars, costs are local ({ch:linkages}) |

## What to measure

For the price stack, the observatory tracks: the daily H100 and B200 rental indices; the spread between on-demand and one-year committed rates for the same configuration; the forward curve implied by prediction-market ladders, the futures curve once one trades, and the basis of each to marketplace prices; the cheapest quoted and the model builder's own output-token prices for a reference open-weight model; and the implied inference crack spread. Where a number does not exist publicly (the cache-hit rate by provider, the transacted price of an accelerator), the dashboard shows the gap.
