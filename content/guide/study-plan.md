---
slug: study-plan
title: A study plan from beginner to expert
heading: A study plan, beginner to expert
label: Study plan
cluster: Practice
summary: A seven-week path from accounting basics to rebuilding the numbers yourself, ending in the token market, its derivatives, and the credit that rations it.
sections: plain
---

## Week 1: accounting and units

Read the [SEC financial statement guide](https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements).

Rebuild the $100 billion server depreciation example.

Convert MW to GW, MWh, GWh, and TWh without notes.

Explain why revenue per MW needs a time denominator.

Read the CapEx, lease, depreciation, and commitments notes in Meta's and Amazon's 2025 filings.

## Week 2: chips and systems

Read ASML's [chip manufacturing](https://www.asml.com/en/technology/all-about-microchips/how-microchips-are-made) and [EUV](https://www.asml.com/en/products/euv-lithography-systems) primers.

Draw wafer -> die -> package -> board -> server -> rack -> cluster from memory.

Explain why logic wafers, DRAM wafers, and advanced packaging are separate constraints.

Compare arithmetic FLOPs, HBM bandwidth, and inter-chip bandwidth in the [Google TPU specs](https://docs.cloud.google.com/tpu/docs/tpu7x).

## Week 3: data centers and finance

Trace electricity from generation to the silicon.

Build a one-page project-finance model with construction, lease start, debt, and DSCR.

Explain the difference between corporate debt, project debt, finance leases, and operating leases.

Read the [IEA Energy and AI report](https://www.iea.org/reports/energy-and-ai/) executive material.

## Week 4: macro and sovereigns

Learn risk-free rate, term premium, credit spread, duration, and basis points.

Price the $10 perpetuity at 3%, 5%, 8%, and 12%.

Use the debt-dynamics equation with three countries: local-currency long maturity; dollar short maturity; commodity exporter.

Read the [Fed history of the Latin American debt crisis](https://www.federalreservehistory.org/essays/latin-american-debt-crisis) and the [CBO 2026 outlook](https://www.cbo.gov/publication/61882).

## Week 5: rebuild the model yourself

Create a spreadsheet with annual rows from 2026 to 2030 and these variables:

- global new facility GW;
- share serving each lab;
- PUE and IT share;
- useful FLOPs per IT watt;
- utilization;
- inference share and R&D share;
- revenue per inference MW-year;
- critical IT CapEx per MW;
- building and power CapEx per MW;
- cash-flow funding, leases, and debt;
- interest rate and credit spread.

Run the three scenarios from {ch:claim-audit}. If the conclusion changes when one assumption moves slightly, the forecast is fragile.

## Week 6: the token market

Read [The Souq](https://robvc.com/research/the-souq) alongside {ch:souq}, then open [OpenRouter's model pages](https://openrouter.ai/models) and pick one open-weight model with more than ten providers.

- Record every provider's input, output, and cached price. Sort them into copy pricers, specialists, rebaters, and repricers.
- Compute the router's default allocation share for each provider from the inverse-square rule in the [routing documentation](https://openrouter.ai/docs/guides/routing/provider-selection).
- Assume a session of 40 requests with a 30,000-token stable prefix. Compute the session cost on each provider under two assumptions: the cache is honoured, and the cache is reported as zero. Find the crossover request count.
- Compute the blended price p̄ = h · pᶜ + (1 − h) · pᴵ for cache-hit rates of 0, 0.5, and 0.9, and re-rank the providers.
- Read the [K2 Vendor Verifier](https://github.com/MoonshotAI/K2-Vendor-Verifier) and describe how you would build a canary session that detects cache misreporting from outside.
- Explain how [MEV-Boost](https://docs.flashbots.net/flashbots-mev-boost/introduction) separates ordering from execution, and what the equivalent relay would have to check in the souq.
- Rebuild the price stack in {ch:token-prices} from a megawatt-hour to a token for one accelerator generation, then read the [CME compute futures announcement](https://www.cmegroup.com/media-room/press-releases/2026/8/11/cme_group_and_silicondatatolaunchcomputefuturesonoctober5tounloc.html) and write down what a neocloud would hedge with it and what basis risk it would keep.

## Week 7: credit, collateral, and the commodity question

Read [Let's talk about how you buy compute these days](https://wafer.substack.com/p/lets-talk-about-how-you-actually), [A Tale of Two Computes](https://aneralabs.substack.com/p/a-tale-of-two-computes), and [Is Compute a Commodity?](https://aneralabs.substack.com/p/is-compute-a-commodity) alongside {chs:collateral,commodity}.

- Rebuild the 128-node example. Compute total contract value, the down payment, and the cost per MW-year. Find the place where a five-year cost is compared with a one-year revenue figure.
- Build the capital stack for the same cluster: hardware cost, senior debt at 75%, operator equity, a three-month debt service reserve, and a 30% prepayment. Who has financed what on the day the cluster is switched on?
- Compute the required capital recovery per GPU-hour for residual values of 0%, 20%, and 40% at SOFR plus 300 and SOFR plus 900, using today's [SOFR](https://www.newyorkfed.org/markets/reference-rates/sofr). Which is worth more, the residual or the spread?
- Open one of the [CoreWeave credit agreements](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=1769628&type=8-K) on EDGAR and search it for appraisal, residual, advance rate, and loan-to-value. Record what you find.
- Take a [Kalshi H100 ladder](https://kalshi.com/) for one month. Convert the strikes and prices into an implied expected price, once using bids and once using asks. How wide is the band?
- Convert a five-year CDS spread into an annual and a five-year default probability at 40% recovery. Say why the result overstates the true probability.
- Collect posted prices for one accelerator at every commitment length one provider offers. Compute the implied average forward price for months 13 to 36 from the one-year and three-year prices. What would have to be true for that number to be a forecast?
- Write a one-page design for a clearinghouse for three-year compute leases: what is margined, against which price, how a default is liquidated, and who loses in what order. Then attack it.

## Mastery questions

Why can a lab control the economic use of compute without owning the data center?

Why is 1 GW not a stable performance unit across chip generations?

Why do large AI dies have a yield disadvantage?

Why are EUV mirrors a bottleneck even when customers are willing to spend billions?

Why does HBM need advanced packaging?

Why can a profitable company have negative free cash flow?

Why is depreciation non-cash today but still economically real?

How does a customer commitment become collateral-like support for project financing?

What is the difference between a Treasury yield and a corporate credit spread?

Why do bond prices fall when market yields rise?

Why does debt maturity determine the speed of a sovereign rate shock?

When does r minus g destabilize debt?

Why is the Volcker analogy stronger for foreign-currency, floating, or short debt?

What centralizes model training, and what might decentralize inference or applications?

Which single assumption matters most to any 2028 concentration forecast?

Why does the router rank on the input price, and why does that matter more for an agent than for a chatbot?

Why is a cached token cheaper than an input token in hardware terms, and why can the buyer not verify the count?

Why can adding inference providers raise the expected cost of a session?

What is the inference crack spread, and which of its components is extraction rather than refining?

Why would a lender accept a compute futures hedge in place of a take-or-pay contract, and what would it still worry about?

In Hayek's terms, what knowledge does the H100 rental index communicate, and what knowledge does the HBM contract market fail to communicate?

Why is a prepayment both credit protection and equity funding for the operator?

Why did the largest equipment supplier guarantee the value of buildings and power but not of its own chips?

What is the difference between a model, a quote, and a print, and which does a rating agency need?

Why is the tenor curve not a forward curve, and what second source would let you separate expected depreciation from a credit premium?

Why does nobody in the hyperscaler market hedge the GPU-hour, and what do they trade instead?

What plays the part of storage in a market for something that cannot be stored?

What does a clearinghouse need from the short-term market before it can replace a prepayment?
