---
slug: rates
title: Interest rates, credit spreads, and asset prices
heading: Interest rates, credit spreads, and asset prices
label: Rates & credit
cluster: Macro
summary: There is no single interest rate: spreads, discount rates, and asset-liability risk.
---

## There is no single "interest rate"

Commentary often speaks as if one rate moves for everyone. In reality:

- the Federal Reserve sets a target range for an overnight interbank rate;
- Treasury yields reflect expected short rates, inflation, and term premium;
- corporate yields add credit and liquidity spreads;
- bank loans may float over a benchmark;
- mortgages embed duration, prepayment, credit, and funding costs;
- emerging-market sovereign yields add country, currency, and liquidity risk.

AI borrowing could affect some components without moving all rates one-for-one.

## How massive AI investment could raise borrowing costs

In a loanable-funds intuition, many profitable projects compete for finite saving. Borrowers offer higher expected returns to attract capital, interest rates rise, saving increases, marginal non-AI projects are canceled, foreign capital enters, or some combination occurs.

Economists call this **crowding out**. The mechanism is economically standard, but its magnitude is uncertain. Capital markets are global; AI investment may create new saving through higher income; central banks react to inflation and employment; and productivity gains can expand resources. CBO's [working paper on government debt and interest rates](https://www.cbo.gov/system/files/2019-03/55018-Debt%20Rates%20WP.pdf) shows how empirical estimates depend on assumptions about crowding out.

## Credit spreads are not the policy rate

Suppose the Treasury yield remains 4%, but a riskier AI borrower pays 12%. The 8 percentage point difference is primarily a credit and liquidity spread. That does not force a safe consumer or government to pay 8 points more. However, a huge volume of attractive corporate issuance can absorb investor demand and cause spreads or benchmark yields elsewhere to adjust.

A 250 bps transmission from hyperscaler yields to "everyone else" is a scenario, not an identity.

## Credit default swaps: where the build-out's risk is priced

A corporate bond's spread is observed only when the bond trades, and each bond has its own maturity and terms. The cleaner instrument is the credit default swap, introduced in {ch:commodity}: a contract that insures a standard amount of a company's debt for a standard term, usually five years, for an annual premium quoted in basis points. Because the contract is standardized, CDS spreads can be compared across companies and through time, and they often move before the bonds do.

For the AI build-out this is the market that matters most. The companies financing it are borrowers of very different quality: hyperscalers with enormous cash flows, an equipment supplier that guarantees parts of its customers' projects, and neoclouds whose debt is many times their earnings. Their CDS spreads are the public record of what investors think of each. In the autumn of 2026 the spreads on the weakest names were above a thousand basis points while the strongest were near one hundred, a spread between borrowers far wider than anything in the rental price of a GPU-hour. That gap is the cost-of-capital term in every project that depends on those balance sheets.

Single-name CDS quotes are not freely published, so the dashboard treats them as a gap and tracks the nearest public proxies: the option-adjusted spreads of broad investment-grade, high-yield, and CCC-rated bond indices. When the high-yield and CCC indices widen while investment grade holds, stress is concentrated in the weaker borrowers, which is the pattern to expect if the neoclouds are carrying risk that the hyperscalers have passed to them.

## Inflation and real resource competition

Borrowing is the financial mirror of a real allocation. The build requires electricians, engineers, steel, copper, turbines, transformers, fabs, water systems, and electricity. If these resources cannot expand quickly, money bids up prices. A central bank may tighten policy if the boom raises economy-wide inflation.

If AI simultaneously raises productivity and supply, inflation pressure may be smaller. The timing matters: construction demand may arrive years before productivity benefits.

## Discount rates and equity values

An asset is worth the present value of future cash flows:

present value = sum of expected cash flow at time t / (1 + discount rate)^t.

For a perpetual $10 annual cash flow:

- at 5%, value = $10 / 0.05 = $200;
- at 10%, value = $10 / 0.10 = $100.

Higher discount rates hurt long-duration assets - businesses whose value depends on distant cash flows - more. Existing fixed-rate bond prices also fall when market yields rise; the [SEC interest-rate risk bulletin](https://www.investor.gov/sites/default/files/ib_interestraterisk.pdf) explains the inverse relationship.

The claim that all non-AI equities would crater is directionally understandable under an extreme rate shock but too categorical. Cash-flow growth, pricing power, debt, duration, cyclicality, and AI exposure differ by firm. Even AI companies can fall if their expected cash flows are distant or their investment disappoints.

## Banks and asset-liability mismatch

Banks fund loans and securities with deposits and other liabilities. If funding costs rise faster than asset yields, net interest margin compresses. Fixed-rate long-duration assets lose market value as rates rise. But balance sheets differ: floating-rate loans can reprice, deposits may be sticky, hedges can help, and credit losses can dominate.

"Debt reprices faster than assets" describes one vulnerability, not every bank. The correct analysis compares the timing, duration, optionality, and credit quality of both sides of the balance sheet.

