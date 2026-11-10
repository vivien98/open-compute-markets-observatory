---
slug: study-plan
title: Thirty days from beginner to useful
heading: Thirty days from beginner to useful
label: Study plan
cluster: Practice
summary: A day-by-day month through the guide, with a calculation or a primary document every day, a way of reading any article on this market, questions to ask each kind of practitioner, and a final week that ends in choosing something to contribute.
sections: plain
---

This plan takes a reader with no background in hardware or finance through the whole guide in thirty days, at about an hour on weekdays and a longer session at each weekend. It aims at three abilities. To read any article on this market and say what it measures, what it assumes, and what its author sells. To hold a conversation with someone who builds, finances, or trades compute, and ask the question that shows where their knowledge ends. And to see which unanswered question you are unusually well placed to work on.

Every day has something to read and something to do. The doing matters more. A number you have recomputed stays with you; a number you have read does not.

## A daily habit

Before each session, open the dashboard and write three numbers in a notebook with the date: the marketplace asking price of an H100, the cheapest output price for one open-weight model of your choice, and the high-yield credit spread. It takes two minutes. By day thirty you will have your own series for a rental price, a token price, and a credit price, and you will have seen for yourself which of them moves, which is sticky, and whether they move together. That is the beginning of judgment about this market, and it cannot be got from reading.

## How to read any article on this market

Apply the same seven questions to everything, including this guide.

- **Who wrote it, and what do they sell?** An inference provider wants cheap hardware finance. A firm building a clearinghouse concludes that a clearinghouse is missing. That does not make either wrong; it tells you which claims to check first.
- **Which market?** The strategic market of two labs and four hyperscalers, or the open market for inference. Most confusion comes from an argument about one being applied to the other.
- **Which price?** A rental price has a chip, a contract length, and a venue. A token price is one of three, from one provider. A credit price has a borrower and a term.
- **What is the denominator?** Per hour or per year. Per accelerator or per megawatt. Contract value over five years or revenue over one.
- **What kind of statement is it?** A definition, a measurement, an estimate, or a scenario, in the sense of {ch:overview}.
- **Which rung of evidence?** A model, a quote, or a print, in the sense of {ch:collateral}.
- **What would show it to be wrong?** If nothing would, it is not yet a claim.

On day one, before reading anything else, read [Let's talk about how you buy compute these days](https://wafer.substack.com/p/lets-talk-about-how-you-actually) straight through and underline every term you cannot define and every number whose unit you cannot state. Keep the page. You will read it again on day ten and on day twenty-six.

## Week one: units and the physical stack

The goal of the week is to be able to follow a description of hardware and turn it into megawatts, dollars, and tokens.

| Day | Read | Do |
| 1 | The opening essay, cold. Then the introduction and {ch:overview} (the whole chain) | Copy the map of markets by hand. For each row, say whether a public price exists. |
| 2 | {ch:units} (units) | Convert 1 GW for a year into TWh and into an electricity bill at $60 per MWh. State what "a gigawatt of compute" leaves out. |
| 3 | {ch:history} (history) and the first half of {ch:silicon} (silicon), as far as yield and process nodes | Read ASML's [how microchips are made](https://www.asml.com/en/technology/all-about-microchips/how-microchips-are-made). Explain why a large die yields worse than a small one. |
| 4 | The rest of {ch:silicon} | Draw wafer, die, package, board, server, rack, cluster from memory. Mark the three steps with no public price. Redo the fab thought experiment and list what the revenue figure is not. |
| 5 | {ch:data-centers} (data centers) | Trace electricity from generator to chip, naming each conversion. Skim the executive summary of the IEA's [Energy and AI](https://www.iea.org/reports/energy-and-ai/). |
| 6 | {ch:accelerators} (reading the hardware) | Open the manufacturer pages for two accelerators. From memory size and bandwidth alone, bound the tokens per second of a 100-billion-parameter model at 8 bits and at 4 bits. |
| 7 | Weekend. Reread anything that did not stick | Work the throughput formula for three context lengths and turn each into a cost per million output tokens at today's rental price from the dashboard. Compute accelerators per megawatt for two generations, and the days of downtime allowed by a 95% and a 99.5% uptime clause. |

By the end of the week you can say why memory and packaging, not only logic wafers, limit supply; why a megawatt is the unit of capacity; why the same machine produces tokens at very different costs for a chat and for a long agent session; and what a four-bit format does to that cost.

## Week two: money

The goal is to read a filing and a loan announcement and know what each number is.

| Day | Read | Do |
| 8 | {ch:accounting} (accounting) | Read the SEC's [guide to financial statements](https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements). Rebuild the $100 billion depreciation example at five and at six years of useful life. |
| 9 | {ch:financing} (financing) | Build a one-page project model: construction, lease start, debt, and a coverage ratio. Cut the price by a third and watch the coverage. |
| 10 | {ch:collateral} (collateral and residual value), then the opening essay again | Rebuild the 128-node example. Find the place where a five-year cost meets a one-year revenue. Compare your underlining from day one with what you can now define. |
| 11 | {ch:value-capture} (who captures the surplus) | For one request to an open-weight model, list every party paid and guess each share. Keep the guess for day 15. |
| 12 | {ch:rates} (rates and credit), including credit default swaps | Convert five-year CDS spreads of 140, 288, and 1,250 basis points into annual and five-year default probabilities at 40% recovery. Say why each overstates. |
| 13 | A primary document | Open one hyperscaler annual report and find the useful-life note, the capital expenditure definition, and the leases not yet commenced. Then open a [CoreWeave credit agreement](https://www.sec.gov/Archives/edgar/data/1769628/000176962826000357/ex101creditagreement.htm) and search for appraisal, residual, advance rate, and loan-to-value. |
| 14 | Weekend | Build the capital stack for a cluster: hardware cost, senior debt at 75%, a three-month reserve, a 30% prepayment. Who has paid for what on the day it is switched on? Then compute the capital recovery per GPU-hour at residual values of 0%, 20%, and 40%, at today's [SOFR](https://www.newyorkfed.org/markets/reference-rates/sofr) plus 300 and plus 900. Check both against the dashboard's calculators. |

By the end of the week you can explain why a profitable company can have negative free cash flow, why a lender wants a three-year contract before it will fund a cluster, why the customer's prepayment ends up as the operator's equity, and why a trusted resale price would be worth more than a better interest rate.

## Week three: the markets

The goal is to read a price, say what it carries, and draw an inference from two prices that neither gives alone. This week uses the observatory's data directly.

| Day | Read | Do |
| 15 | {ch:souq} (the token market), with [The Souq](https://robvc.com/research/the-souq) | On the dashboard's quote ladder, choose a model and find the output ratio at which the cheapest-ranked endpoint stops being cheaper than the builder. Revisit your day-11 guess about who is paid. |
| 16 | The routing [documentation](https://openrouter.ai/docs/guides/routing/provider-selection) | Open the observatory's endpoint history file. For one model, sort endpoints into copy pricers, specialists, rebaters, and repricers by their prices relative to the builder. Tabulate the disclosed numerical format against price. |
| 17 | {ch:token-prices} (the price stack) | Rebuild the price stack from a megawatt-hour to a token for one accelerator, using today's rental ask. Compute the break-even tokens per second for two models and compare with your bound from day 6. |
| 18 | The section on prediction-market ladders in {ch:token-prices}, again | Take one month's H100 ladder from [Kalshi](https://kalshi.com/). Compute the implied median from bids and from asks. Do it for the nearest and furthest months and annualize the change. |
| 19 | {ch:commodity} (is compute a commodity?), with [A Tale of Two Computes](https://aneralabs.substack.com/p/a-tale-of-two-computes) and [Is Compute a Commodity?](https://aneralabs.substack.com/p/is-compute-a-commodity) | Reproduce the tenor decomposition with your annualized change from day 18. How much of the gap between short and long prices is forecast, and how much is payment for commitment? Move the sliders until the answer changes sign. |
| 20 | {ch:linkages} (how the markets are intertwined) | Pick one edge of the dashboard's linkage map and find one news item from the last month that travelled along it. Name the lag. |
| 21 | Weekend | Write one page, in your own words and with your own numbers, answering: is compute a commodity? Then write half a page designing a clearinghouse for three-year leases, what is margined, against which price, how a default is sold, who loses in what order, and half a page attacking it. |

By the end of the week you can explain why the router's ranking sends requests to endpoints that cost more, why a futures contract on a rental index does not help a lender value a rack, why nobody in the strategic market hedges the GPU-hour, and what the tenor curve does and does not forecast.

## Week four: macro and judgment

The goal is to test the large claims instead of repeating them.

| Day | Read | Do |
| 22 | {ch:sovereign-debt} (sovereign debt) | Run the debt-dynamics equation for three stylized countries: long local-currency debt, short dollar debt, a commodity exporter. Read the Federal Reserve's history of the [Latin American debt crisis](https://www.federalreservehistory.org/essays/latin-american-debt-crisis). |
| 23 | {ch:china} (China and export controls) | List what you would need to measure to compare two countries' compute. Note which items have any public source. |
| 24 | {ch:centralization} (centralization) | Take one data center and answer the seven senses of "who controls it". |
| 25 | {chs:claim-audit,claims} (the claim audit and the claims) | Choose the three claims you find most persuasive. For each, write the single observation that would most change your mind and where it would appear. |
| 26 | All three essays and The Souq again, with the seven questions | Write a one-page critique of each: its strongest measurement, its weakest inference, and the number you would ask the author for. Compare with your underlining from day one. |
| 27 | Your notebook of daily numbers | Build the three-scenario spreadsheet: constrained boom, competitive normalization, overbuild. Rows from 2026 to 2030 for delivered GW, tokens per watt, utilization, revenue per MW-year, installed cost, financing mix, and spread. Find the assumption that flips the conclusion. |
| 28 | Weekend. {ch:open-problems} (open problems) | Mark every problem you could start this week with what you already know. Mark again those where your background is unusual. The overlap is your shortlist. |

## Days twenty-nine and thirty: choose and scope

Take the top item on the shortlist and reduce it to something that can be finished in one further week: one question, one dataset, one chart, one page. Write down what result would be interesting and what result would be dull, before collecting anything. Then collect the first day of data.

If nothing on the list fits, the measurement table in {ch:open-problems} is the default. A month of a series nobody else has recorded is a contribution whatever it turns out to show.

## Questions to ask a practitioner

A good question shows that you know the structure and asks for the one number you cannot get from public sources. These are drawn from the gaps this guide registers.

| If you are talking to | Ask |
| Someone who operates a cluster | What share of contracted hours were delivered last quarter, and what does the contract say about the rest? How much prepayment did the last customer pay, and was it credited evenly or against the final year? |
| An inference provider | What does context length do to your tokens per second per accelerator? What share of your fleet is on contracts shorter than a year? Which formats do you serve, and do customers ask? |
| A lender to compute | What value do you assign the hardware at maturity, and what evidence would let you raise it? What happens, step by step, if the customer stops paying in month eighteen? |
| Someone at a router | How much traffic uses the default ranking? Do you measure cache-hit rates by provider, and would you rank on them? |
| A capacity reseller or trader | What is the spread between your three-year cost and your one-month price today, and what was it six months ago? What would you hedge with if you could? |
| Someone in chips or memory | Which input sets your delivery dates this year? How much of your capacity is committed under prepayments, and through when? |
| A credit investor | What is priced into the weakest build-out borrower, and what would have to happen at the strongest for the spreads to converge? |

## Mastery questions

One for each idea the guide depends on. If you can answer all of them aloud without notes, you can read anything in the field.

**Units and hardware**

- Why is 1 GW not a stable unit of performance across chip generations?
- Why do large dies yield worse, and why does memory need advanced packaging?
- Why are EUV mirrors a bottleneck even when customers will pay billions?
- Why does batching set the economics of inference, and what limits the batch?
- Why does a four-bit format roughly halve the hardware cost of a token, and why is it a different grade of product?
- Why does an old accelerator lose about a third of its rental value a year, and what usually ends its life?

**Money**

- Why can a profitable company have negative free cash flow?
- Why is depreciation not a cash cost this year and still an economic one?
- How does a customer commitment make a project financeable?
- Why is a prepayment both protection against the customer and equity for the operator?
- Why did the largest equipment supplier guarantee buildings and power but not its own chips?
- What is the difference between a model, a quote, and a print, and which does a rating agency need?
- Why can a lab control the use of compute without owning the data center?

**Markets**

- Why does the router rank on the input price, and why does that matter differently for an agent and a chatbot?
- Why is a cached token cheap to reuse and not free to keep, and why can the buyer not verify the count?
- Why can adding providers raise the cost of a session?
- What is in the silicon spread, and which parts are refining and which are not?
- Why is the tenor curve not a forward curve, and what lets you separate expected decline from a payment for credit?
- Why does nobody in the strategic market hedge the GPU-hour, and what do they trade instead?
- What plays the part of storage in a market for something that cannot be stored?
- What must be true of the short-term market before a clearinghouse can replace a prepayment?
- What knowledge does a rental index carry that an HBM contract price does not, and why?

**Macro and judgment**

- What is the difference between a Treasury yield and a credit spread?
- Why do bond prices fall when yields rise, and why does maturity set the speed of a rate shock?
- When does the gap between the interest rate and growth destabilize debt?
- What centralizes training, and what might decentralize inference?
- Which single assumption matters most to any forecast of concentration?
- Of the claims in {ch:claims}, which rests on a measurement, and which on a scenario?
