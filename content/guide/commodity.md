---
slug: commodity
title: Two computes: is compute a commodity?
heading: Is compute a commodity?
label: Two computes
cluster: The token market
summary: Compute is two markets. One is a strategic good financed on hyperscaler credit, whose risk trades as credit default swaps. The other behaves like power and oil but is rationed by credit. The tenor curve, the silicon spread, the commodity traders, and the missing clearinghouse.
---

Will a GPU-hour trade like a barrel of oil or a megawatt-hour? The question matters for everything in this guide that touches a price, because a commodity market is the institution that turns scattered private knowledge about scarcity into one public number. {ch:token-prices} described the indices and the futures contracts that have been built for compute. This chapter asks whether the market underneath is ready for them.

The framing comes from two essays by Vishwa Naik of Anera, [A Tale of Two Computes](https://aneralabs.substack.com/p/a-tale-of-two-computes) and [Is Compute a Commodity?](https://aneralabs.substack.com/p/is-compute-a-commodity), written by a former oil trader who then made markets in compute derivatives and found almost no commercial demand for them. His short answer is that compute behaves like a commodity but is not financed like one, and that the second fact wins. One disclosure: Anera is building the clearinghouse that the essays conclude is missing. The diagnosis should be judged on the evidence, which this chapter tries to supply, and the prescription with that interest in mind.

## The test for a commodity market

Commercial hedging takes hold when two things are true. The market is liquid, with enough independent counterparties that no small group sets the price. And the people who hedge are exposed to a price that actually moves. A farmer hedges wheat because the price at harvest is unknown and because there are thousands of other farmers and millers on the other side.

Standardization, the objection raised most often, is not the real obstacle. Compute has many configurations, but so does oil. Brent, the world's main crude benchmark, is not one grade. It is a basket of North Sea crudes, Brent, Forties, Oseberg, Ekofisk, and Troll, joined since 2023 by WTI Midland from Texas, each trading at a known difference to the benchmark. A B300 with one network fabric and a B300 with another can be handled the same way. Heterogeneity produces basis, and basis can be priced.

Compute passes the first glance: there are natural buyers and natural sellers. But it is not one market. It is two, and they fail the test in different ways.

## Market one: the strategic good

Most of the industry's capital sits here. Two frontier labs, four hyperscalers, and a handful of large neoclouds built to serve them. The labs set their own token prices. The hyperscalers procure capacity under very long agreements at fixed prices. Capacity is discussed in gigawatts. Demand is insensitive to price, because falling behind the frontier costs more than any premium paid for compute.

In this market there is no floating price for anyone to hedge, so nobody hedges the GPU-hour. The risk is elsewhere: on the balance sheets of the companies that borrowed to build. That is credit risk, and credit risk has its own instrument.

A **credit default swap** is insurance on a borrower. The buyer pays a fixed annual premium, quoted in basis points of the amount insured, and is made whole by the seller if the borrower defaults. A five-year CDS quoted at 288 basis points costs $2.88 a year to insure $100 of debt. The premium is a market price for default risk that is visible daily, which makes it the closest thing market one has to a public signal. A rough conversion to probability divides the spread by the expected loss in default: at a 40% recovery, 288 basis points implies about a 4.8% chance of default per year.

By late 2026 that signal was loud. In mid-October, Oracle's five-year CDS reached a record 288 basis points and SoftBank's 424, according to S&P Global Market Intelligence data [reported at the time](https://finance.yahoo.com/markets/stocks/articles/ai-credit-default-insurance-costs-140727215.html); CoreWeave's had widened beyond 1,000, its 2032 bonds traded near 77 cents on the dollar, and the hyperscalers and Nvidia were at record wides of their own. By early November, Naik put CoreWeave at 1,200 to 1,300 basis points and Nvidia near 140. At 1,250 basis points and 40% recovery, the same arithmetic gives roughly a 21% chance of default per year and about 65% over five years, which is where the headlines about a better-than-even chance of default came from. The conversion overstates true probabilities, because spreads also contain a premium for risk and illiquidity. The direction is not in doubt.

Naik's historical comparison is the oil industry before the 1970s, when seven integrated companies set posted prices and there was no free market in crude; the story of the [Seven Sisters](https://en.wikipedia.org/wiki/Seven_Sisters_(oil_companies)), told in Anthony Sampson's book of that name, is the standard account. His forecast is that this market ends in state support, because two labs and their suppliers have become too large, too levered, and too strategically important to be allowed to fail. In the vocabulary of {ch:overview} that is a scenario, not a measurement. It should be filed with the claims in {ch:claims}, and the CDS spreads are the evidence to watch.

What matters for this chapter is the conclusion about market structure: where compute is a strategic good, it will be priced bilaterally and its risk will be transferred as credit. It is unlikely to trade as a commodity at all. The dashboard therefore tracks credit spreads for this market, not GPU-hours.

## Market two: open-weight inference

The second market is the one {ch:souq} described from above: the infrastructure that serves open-weight models. On the demand side are the large inference platforms and a long tail of startups and labs. On the supply side is something new, a boom in bare-metal operators. Open-weight inference runs well on bare metal, and all a bare-metal cloud needs is colocation space, off-the-shelf cluster software, and capital. The established neoclouds, busy building gigawatts for the hyperscalers, keep back megawatts for their own token businesses and have largely stopped supplying other inference providers. So the open market is increasingly served by operators with footprints under 25 MW, built in steps of one to two and a half megawatts.

The inference platforms are deliberately indifferent between suppliers. One describes working with more than twenty and employing a person whose job is to keep finding capacity. Naik reports that the largest still run close to half their fleets on spot and short-term capacity spread across many venues. That last figure is his and is not independently documented, but it is consistent with what the token market shows: providers enter and leave individual models week by week.

Here the commodity test is half passed. There are enough counterparties for real price discovery, and at the token level it is already happening continuously. But compute itself, as {ch:collateral} showed, is sold in a three-year credit box.

## The tenor curve is a credit pyramid

Rent the same accelerator for different lengths of time and the price changes. For a B300 in late 2026, the anchors that can be sourced are these.

| Commitment | Price per GPU-hour | Source |
| On demand | about $9.00 | Verda's posted price, as cited by Naik |
| Three years | $4.50 | Operator offer quoted in Peak FLOPS |
| Five years | $3.50 | Peak FLOPS, described as below market |

The short end costs about twice the long end. In most markets a discount for commitment is ordinary: the seller gives up some price to be rid of the risk of finding the next customer. If that were the whole story, short-term capacity would sometimes sit idle. It does not. It is oversubscribed, and operators able to offer it have more demand than those who cannot.

The explanation is credit. A senior lender will finance a cluster only against a contract of three years or more, so that is what operators must sell. But a buyer's credit horizon is roughly its cash runway. A company that has just raised money with eighteen months of cash can credibly promise a year of payments, not three. Most startups are good for a month. Anyone is good for a day. The number of buyers who can sign therefore widens sharply as the term shortens, while the supply that financing permits narrows. The curve is a picture of who is creditworthy enough to sign for each length of time.

This has a precise consequence that is easy to miss. The tenor curve is not a forward curve. A forward curve gives today's price for one month of compute delivered at some future date. A tenor curve gives the price of a strip that starts now and lasts a given time. The two are related by arithmetic: the price of a three-year strip is roughly the average of the thirty-six monthly forward prices inside it. So a steeply falling tenor curve could mean one of two things. Either the market expects the price of a B300-hour to collapse over three years as newer chips arrive, or the short end carries a premium for flexibility that the financing system keeps scarce.

There is one independent reading that helps separate them. Prediction-market ladders on the monthly average H100 rental price, described in {ch:token-prices}, give a market-implied path for the future spot price that does not pass through anyone's credit. When this chapter was written, the ladders put the median near $3.26 an hour for December 2026 and near $2.46 for August 2027: a fall at a rate of about a third per year.

Now do the arithmetic. If the rental price of the newer chip fell at that same rate, the average price over the next three years would be about 57% of today's price. The quoted three-year price is 50%. On those numbers, most of the gap between the short and long ends is an honest forecast that the hour will be worth less as newer chips arrive. What remains, a further discount of about 13%, is what the long-term buyer is paid for being able to commit, or equivalently what the short-term buyer pays for lacking the credit to do so. For the whole curve to be a forecast and nothing else, rental prices would have to be expected to fall by about 41% a year.

Three cautions belong with that calculation. The decline is borrowed from an older chip. The ladder is thin, quoted mostly by one market maker, and settles on an index that is not the same basket as the posted prices. And nothing has been discounted. The dashboard therefore shows the decomposition with every input on a slider and the ladder's bid and ask bracket drawn in, so that the inference can be checked instead of trusted.

Even taken at face value, the result sharpens the argument more than it weakens it. Credit has a modest effect on the price of a long contract and a total effect on who may buy one. A buyer who cannot sign for three years is not offered the three-year price at a premium; it is not offered the three-year contract at all. Economists call this rationing by quantity, and its signature is exactly what the short end shows: a queue. The premium is visible in the price. The exclusion is visible only in who is missing.

## Bought like power

From the buyer's side, procurement looks like running an electricity book. A buyer forecasts its traffic and assembles capacity in layers, each with its own market.

| Layer | Power-market analogue | In compute |
| Three-year baseload | Power purchase agreement, project financed | The take-or-pay contract of {ch:financing}; sized on committed customers and expected growth |
| Short-duration capacity | Bilateral monthly and quarterly blocks | Anything under three years, down to month-to-month; taken as soon as it appears |
| Day-ahead and forward | Day-ahead market | Emerging: forward capacity on venues such as SF Compute, used to offload a gap between customers |
| Intraday | Real-time balancing market | Spot auctions such as Nebius's; Naik reports B300 prices across three regions ranging from about $1 to over $10 an hour within one week |

The shared physics is that neither product can be stored. An idle GPU-hour is gone, exactly as an unsold megawatt-hour is. That is why intraday prices swing by an order of magnitude: with no inventory to absorb a surprise, price does all the work. [FERC's overview of electric power markets](https://www.ferc.gov/electric-power-markets) is a good short introduction to why power is traded in these layers.

The analogy breaks in one useful way. Power is bound to a grid, and its price differs at every node because wires congest. Compute is closer to a single global endpoint, limited by regulation, latency, and the needs of particular workloads but not by physical delivery. A perishable product with a wide delivery area can reach a much larger pool of demand than a megawatt-hour can. Locational basis exists but is small.

One sign that the power analogy is more than rhetoric can be read directly from public token listings. Some providers now quote time-of-day prices. In November 2026 the listing for one open-weight model carried a base input price and an override that doubled it during a fixed daily window. That is peak and off-peak pricing, the oldest device in electricity tariffs, appearing in a token price. Batch endpoints, which trade a discount for the right to be served later, are the same idea from the demand side: interruptible load.

## Refined like oil: the silicon spread

{ch:token-prices} defined the inference crack spread: the price of tokens less the cost of the GPU-hours needed to make them. Naik calls the same quantity the silicon spread and treats the inference provider as a refinery, a token factory. The analogy runs deep because the structure is the same at both ends.

At the input end there are grades. Accelerators of different generations and vendors, different processors, different network fabrics and memory configurations, are the grades of crude. They can be normalized by their ability to produce tokens, as crudes are normalized by yield. At the output end there is a product slate. One model is sold through a fast endpoint, a standard endpoint, a batch endpoint, and reserved capacity, each at its own price, as a refinery sells gasoline, diesel, and jet fuel from one barrel.

A refiner's first lever is its own complexity. In oil this is measured by the [Nelson complexity index](https://en.wikipedia.org/wiki/Nelson_complexity_index), which scores a refinery by how much conversion equipment it has beyond simple distillation. A complex refinery can turn almost any crude into high-value products. Naik, who traded at the most complex refinery in the world, describes what that buys: optionality. When one grade becomes scarce for the simple refineries that depend on it, the complex refiner sells its own barrels of that grade to them at a premium and runs something cheaper.

The token-factory equivalent is the ability to produce the same tokens on different hardware. Most providers depend on one vendor's accelerators and software stack. A few can serve the same open-weight model on other vendors' chips. When the short-term premium for the scarce chip spikes, such a provider can serve its tokens on the alternative hardware and rent out the scarce chips, capturing both spreads. Anera publishes an early Inference Complexity Index to track this. For the engineer this is where the kernel work of {ch:souq} becomes a financial option: portability across hardware is worth exactly the tenor premium it lets the provider capture.

## The commodity traders

Where a spread persists, traders appear. A group of firms now takes long-term capacity and sells it in shorter strips: SF Compute, Runpod, Hyperbolic, AMP, Andromeda, Ornn, Compute Desk, Liquid Compute, and trading firms from other markets. Some take principal risk and some do not. The trade is the tenor curve itself: hold three years, sell months and days, keep the difference. Naik estimates the spread available today at up to half the price.

This is how a market is supposed to work. A visible premium pulls in independent balance sheets, and their competition erodes it. What limits them now is that they are funded by equity. Leverage will not come until a lender is willing to underwrite short-term compute demand, and when it does the traders will depend on price as well as utilization and will need hedges of their own. That is the path by which a floating price that somebody needs to hedge comes into existence, which was the second condition in the test.

Oil suggests what happens next. As the spread compresses, the trader looks for another margin. The large oil traders bought refineries and, more often, midstream assets such as storage and pipelines. Naik predicts that compute traders will begin selling tokens, and asks what the midstream of compute would be.

The question deserves an answer. Midstream is storage and transport, and compute has neither in the ordinary sense. But it has two things that play the part. The first is deferrable demand. A batch job that can run any time in the next day is a battery: it lets a provider move consumption from an expensive hour to a cheap one, and the batch discount is the price of that storage. The second is the cache. The stored attention state described in {ch:souq} is compute already performed and kept for reuse, a refined product held in inventory with a shelf life of minutes. Whoever controls scheduling across sites and the placement of sessions near their caches controls the nearest thing this industry has to pipelines and tanks. On that reading the midstream already exists, and it is the router.

## Why it is not yet a commodity

Three facts stand against everything above, and they are all the same fact seen from different sides.

- **It is not financed like one.** Lenders underwrite the customer's credit and contracted cash flow. Because the customers are not investment grade, the prepayment of {ch:collateral} fills the gap. The customer has no capital structure of its own beyond venture equity.
- **Compute-hours are not treated as collateral.** A lender takes security over the hardware and the contract, but there is no agreed sequence for what happens if the customer defaults. The structure assumes that a defaulted lease could not be resold, in a market where short-term capacity is oversubscribed.
- **The term curve is rationed by credit.** Its slope is mostly a forecast about the asset, as the decomposition above showed. But access to its long end is decided by the buyer's balance sheet, so the prices on it are not offers open to everyone.

In a mature commodity market, lending runs the other way. A bank lends against oil in a tank or reserves in the ground, values the collateral every day against a public price, and knows it can sell. The identity of the borrower still matters, but the barrel carries most of the weight. Finance of this kind is called self-liquidating: the loan is repaid from the sale of the thing it financed.

## The missing institution

The list of what is absent is short and concrete.

- A standard form of offtake contract, with known covenants, risks, and rights.
- Transferability: step-in rights, a backup customer, and novation, so that when a customer defaults the contract moves to someone else instead of dying.
- Daily valuation of each contract against a real price for the remaining term.
- An orderly, central process for reselling defaulted capacity.
- A default waterfall, so that every lender knows who loses what and in what order.

Every item on the list is a function of a clearinghouse. A clearinghouse stands between the two sides of every contract, collects margin from both, marks positions to market daily, and when one side fails, takes over its positions and sells them, absorbing losses in a fixed order: the defaulter's margin, then its contribution to a shared fund, then the clearinghouse's own capital, then the other members. Grain trading in nineteenth-century Chicago was repeatedly broken by counterparty failure until clearing was introduced, and the same remedy was imposed on swaps after 2008. The Bank for International Settlements has a clear [introduction to central clearing](https://www.bis.org/publ/qtrpdf/r_qt1512g.htm).

With clearing, the chain of reasoning in a credit committee changes. The lender stops asking who the customer is and starts asking what the capacity can be resold for, how fast, and who bears the loss in between. Those questions have numerical answers, and once they do, a cluster can be financed for a customer without an investment-grade rating and without an enormous prepayment.

## A mechanism designer's caution

Readers from decentralized finance will have noticed that this is the design problem of a margined lending market, and will know where such designs fail.

The margin a clearinghouse must hold depends on how far the price can move in the time it takes to liquidate. For compute, the intraday range is an order of magnitude and the liquidation venue is thin. Margin set honestly against that volatility might be as large as the prepayment it is meant to replace. The clearinghouse needs a deep short-term market to liquidate into, and the short-term market cannot deepen until credit is available to the traders who would make it. This is a bootstrapping problem, and the usual way through is to begin with conservative margins on the most liquid, shortest contracts and extend outward as depth is proven.

Central clearing also concentrates risk as well as netting it. A clearinghouse is a single point of failure whose loss allocation rules behave, under stress, like the liquidation cascades familiar from on-chain markets: forced sales depress the price that determines the next round of margin calls. And daily valuation is only as good as the price it uses. The regulator's concern about manipulable benchmarks, quoted in {ch:collateral}, applies with more force when margin calls depend on the benchmark.

None of this argues against the institution. It argues for sequencing, and for watching whether the short-term market is becoming deep enough to carry the weight.

## What the prices are saying

Put the two markets side by side and ask, as the opening chapters did, what knowledge each price carries.

In market one, the informative price is the credit spread. It aggregates what thousands of bond investors believe about whether the build-out will pay for itself. It is public, traded, and hard to manipulate, and it says nothing about the scarcity of compute.

In market two, token prices are highly informative about the marginal cost of inference, subject to the verification problem of {ch:souq}. Intraday rental prices are informative about momentary scarcity. The multi-year contract rate, the price most people quote, mixes a forecast of the asset's decline with a payment for credit, and it is available only to buyers who pass a credit test, so it understates what compute costs everyone else.

The summary judgment is Naik's: compute behaves like a commodity, and it is not financed like one. This guide would add that the two halves are connected through the residual value question of {ch:collateral}. A market that could put a trusted number on a used accelerator, or on a year of capacity handed back early, would be able to lend against the asset instead of the customer, and the tenor curve would begin to describe the asset.

## What to watch

The observatory tracks, or registers as gaps: the ratio of on-demand to three-year prices for the current accelerator generation; the dispersion of marketplace asks, as a public stand-in for intraday volatility; five-year CDS spreads for the companies carrying the build-out, with broad credit indices as the available proxy; the implied forward curve from prediction-market ladders, and its gap to marketplace prices; the silicon spread for a basket of open-weight models; prepayment terms; the first debt facility extended to a capacity reseller; and the regulator's decision on whether compute can underlie listed futures at all.
