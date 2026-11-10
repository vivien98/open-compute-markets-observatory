---
slug: open-problems
title: Open problems, and where to contribute
heading: Open problems, and where to contribute
label: Open problems
cluster: Practice
summary: The questions this market has not answered, sorted by the kind of skill each needs, with a first step for every one that can be taken on public data. For the reader who has finished the guide and wants to add something.
sections: plain
---

A field this young has more unanswered questions than people working on them. Most of the essays this guide draws on were written in the last few months by practitioners describing a problem they had personally run into. Several of the measurements on the dashboard did not exist anywhere in public before the observatory began recording them. This chapter collects the open problems the earlier chapters ran into, so that a reader who has worked through the guide can pick one.

Each problem is stated with why it matters, what kind of background it needs, and a first step small enough to finish in a week. The list is ordered roughly by how tractable each problem is for one person with public data.

## Measurement: things nobody has counted

These need care more than brilliance, and they are the most immediately useful. Every one of them would turn a registered gap on the dashboard into a series.

| Problem | Why it matters | First step |
| A public tenor curve | {ch:commodity} rests on three sourced price points. No one publishes the price of the same accelerator at every contract length across providers. | Record, weekly, every posted commitment price for one accelerator from ten providers. A month of that is a dataset no one else has. |
| The realized routing rule | The inverse-square rule is documented, and one study measured it once. Whether the realized exponent is stable, and whether it differs by model, is unknown. | Send a few hundred small requests for one model through a router and record which provider serves each. Fit the exponent. |
| A shading index | {ch:souq} found endpoints quoting a fortieth of the list input price and more than the list output price. How widespread this is, and whether it is growing, has not been tracked. | The observatory's own history file records every endpoint's three prices daily. Define the index, compute it for every model, and watch it for a month. |
| Repricing dynamics | How often providers change prices, who moves first, and how quickly others follow are the basic facts of any price war. | Same history file. Count price changes per provider per week; look for leaders and followers. |
| Pass-through | When the rental price of an accelerator falls, how much of the fall reaches token prices, and how fast? | Regress the cheapest token ask on the marketplace rental ask with lags, once a few months of history exist. |
| Disclosed precision | {ch:accelerators} argues that numerical precision is a grade. What share of routed quotes is at four bits, and what discount does it carry? | Tabulate the format tag against price for every endpoint. This is a one-evening hedonic regression. |
| Used-hardware prices | {ch:collateral} found three thousand recorded sales in three years. Listings on general marketplaces are public and uncollected. | Record asking and sold prices for one accelerator model on public resale sites for a month. Note condition and whether it is a card or a system. |
| Tokens per second per accelerator | Every provider knows it for its own fleet. No one publishes it for commercial service; the [MLPerf Inference](https://mlcommons.org/benchmarks/inference-datacenter/) results are vendor-tuned and cover a fixed list of models. | Benchmark one open-weight model on one rented accelerator at three context lengths and publish the method. Compare with the bound in {ch:accelerators} and with the vendor results. |

## Mechanism design: rules that could be better

These are problems for someone who thinks in incentives. Decentralized finance spent a decade on close relatives of each.

**The router's ranking rule.** Ranking on the input price is known to misallocate. Ranking on expected session cost is the proposed fix, but it needs a measured cache-hit rate per provider, which providers can influence. What ranking rule is robust when the quantity it depends on is reported by the party being ranked? This is a problem of scoring rules and audits, and the canary proposal in {ch:souq} is a first sketch, not a design.

**Session-aware routing.** Per-request routing destroys cache continuity; committing a session to one provider destroys contestability. The right answer is somewhere between, and it is a matching problem with switching costs. What is the optimal commitment length as a function of context size and price dispersion?

**Benchmark design for a thin market.** A rental index will settle futures and may one day size loans. The regulator's concern, quoted in {ch:collateral}, is that it can be moved. What construction, from which inputs, makes manipulation cost more than it pays? The literature on oracle design, on time-weighted prices and on trimmed medians, applies directly, and so does the experience of what failed.

**From a strike ladder to a curve.** {ch:token-prices} reads a forward curve off prediction-market ladders with a simple median. A ladder is a set of logically linked bets: the contract at one strike constrains the contract at the next, and this month constrains next month. Markets for linked outcomes, whether [combinatorial prediction markets](http://mason.gmu.edu/~rhanson/mktscore.pdf) or parlays, are designed to price exactly that structure. How should a market maker quote a whole ladder consistently, and how should an observer extract the best estimate of the distribution from thin, inconsistent quotes?

**Margin for a clearinghouse.** {ch:commodity} ends at the missing clearinghouse and warns that honest margin might be as large as the prepayment it replaces. What is the right margin for a three-year lease on an asset that cannot be stored, whose price moves tenfold within a day, and whose value declines by a third a year? Where should liquidation happen when the spot market is thinner than the position?

**Liquidating a lease.** When a customer defaults, the remaining contract has to be sold. Is that an auction, a transfer to a standing backup buyer, or a sale into the spot market in pieces? Each has a different effect on what lenders will advance.

**Spot auctions.** Several providers now clear short-term capacity by auction. Uniform price or pay-as-bid, how often, with what rules for reclaiming capacity from a running job? Electricity markets have forty years of answers and compute differs in the ways {ch:commodity} listed.

## Engineering: things that could be verified

**Attested billing.** The cached-token count is self-reported. A hardware attestation would fix it at a cost in speed and in which machines qualify. How large is that cost in practice, and is there a lighter proof that covers only the counts and not the whole computation?

**Model identity.** Is the provider serving the model and the precision it claims? Statistical tests exist; they need many samples and can be evaded. What is the cheapest test with a stated error rate?

**Portability.** {ch:commodity} argued that the ability to serve one model on different vendors' hardware is a financial option. How large is the engineering cost of that option today, per model and per chip?

**Machine health as collateral data.** A used accelerator's value depends on its hours and thermal history, and the machine records both. A standard, attestable health record would do for accelerators what a service history does for aircraft, and it is a precondition for the resale market of {ch:collateral}.

## Economics: questions about what the prices mean

**Decomposing the tenor curve.** {ch:commodity} splits the gap between short and long prices into expected decline and a payment for commitment, using one borrowed number. A proper treatment would estimate the decline for each accelerator separately, discount, and allow for the option to walk away. It is a term-structure model for an asset that depreciates and cannot be stored.

**Rationing by credit.** Markets in which lenders cannot observe borrower quality ration credit by quantity and not only by price; the classic account is [Stiglitz and Weiss](https://en.wikipedia.org/wiki/Credit_rationing). Compute contracts look like a textbook case. How much demand is excluded, and what is the welfare cost?

**The obsolescence curve.** {ch:accelerators} found that the growth of memory bandwidth and a prediction market agree on how fast an old chip's rental value falls. Is that a law or a coincidence? A [hedonic model](https://en.wikipedia.org/wiki/Hedonic_regression) of rental prices on bandwidth, memory, power, and age, across generations, would say.

**Which price leads.** When the rental index, marketplace asks, prediction-market ladders, and token prices move, which moves first? The share of price discovery contributed by each venue is measurable once the histories are long enough, and it is the direct empirical form of the question this guide opened with: which prices carry knowledge.

**Two-part tariffs under a ranking rule.** What prices do sellers set in equilibrium when buyers are allocated by a rule that looks at one of several prices? The answer would say whether the pattern in {ch:souq} is a transient or the destination.

## Policy

The regulator's request for comment on compute derivatives closed in October 2026 with about a hundred letters, most from firms with a product to list. Disinterested analysis was scarce. The questions it asked, whether the cash market is deep enough, whether benchmarks can be manipulated, what a deliverable unit is, are empirical, and several of the measurements above answer them directly. Later consultations will follow, on benchmarks if not on listing.

## Choosing one

The useful question is where your background is rare. Most people writing about this market come from one of three places: semiconductors, finance, or machine learning. The problems above sit between them.

| If you come from | You already understand | The problems where that is scarce |
| Hardware or electrical engineering | What sets throughput, what fails, what a datasheet omits | Tokens per second per accelerator; the obsolescence curve; machine health as collateral; the engineering cost of attestation |
| Mechanism design or decentralized finance | Incentives under unverifiable reports, oracle manipulation, liquidation, order flow | The ranking rule; benchmark design; margin and liquidation for leases; quoting a ladder |
| Economics | Identification, market structure, what a price can and cannot reveal | Pass-through; credit rationing; price discovery shares; equilibrium tariffs |
| Credit and structured finance | What a lender needs to see before advancing against an asset | Residual value evidence; a standard offtake contract; a default waterfall |
| Software and data | Collecting, cleaning, and publishing a series every day without fail | Any row of the measurement table |

A person with two of these backgrounds has few competitors on the problems that need both. Someone who can read a datasheet and design an auction is the natural author of the work on spot auctions for compute or on margin for a depreciating, non-storable asset. Someone who knows both prediction markets and term structures is the natural author of the work on ladders.

A second test is whether the first step can be done with data that already exists. The measurement problems pass it by construction. A good rule is to begin with one of those even if the goal is a mechanism: a month of collecting a series teaches what the mechanism has to survive.

## Where the work is read

Results in this field travel through a small number of channels: practitioner newsletters, of which the essays cited throughout this guide are examples; the public comment dockets of regulators; open repositories of measurement tools and verifiers; and the workshops where people from market microstructure and machine learning have begun to meet. A short, reproducible note with a dataset attached is the form most likely to be picked up. The observatory itself accepts new feeds and new charts, and its data directory is meant to be built on.
