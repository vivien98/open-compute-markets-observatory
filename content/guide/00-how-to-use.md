---
slug: how-to-use
title: How to use this guide
heading: How to read this guide
label: How to read this
cluster: Orientation
summary: Four kinds of statement, the reading discipline the rest of the guide assumes, and why prices are the thread that ties every chapter together.
---

Discussions of AI infrastructure move unusually fast because practitioners compress several industries into one shorthand. When someone says "a gigawatt of compute," they are simultaneously talking about electricity, accelerator performance, a cluster, a data-center site, a set of contracts, and an economic claim. When they say "CapEx," they may slide between the chip-factory layer, the server layer, the building layer, and the power-plant layer. When they say "a token costs $2 per million," they are quoting one of three prices for one model on one provider through one router, with a cache state that nobody can verify. The first skill is therefore not memorizing acronyms. It is learning to keep the layers, the units, and the prices separate.

This guide assumes no background in semiconductors, data centers, accounting, or finance. Every chapter starts from the physical or contractual object and works up to the market that prices it. Read it in order the first time; afterwards, open the layer you need. Every chapter ends where the next one begins, and the [glossary](/glossary/) carries a stable anchor for every term, so any sentence here can be checked against its definition.

## Three passes

**Orientation pass.** Read Chapters 1-3. Your goal is to recognize the nouns and the units: watts versus watt-hours, FLOP versus FLOP/s, stock versus flow, wafer versus die versus package.

**Mechanics pass.** Read Chapters 4-10 with a pencil. Recalculate the worked examples. Your goal is to understand how physical capacity becomes revenue, how the build is financed, and how a token price is assembled from electricity, hardware, and software.

**Judgment pass.** Read Chapters 11-17. Your goal is to identify what must be true for the popular forecasts to hold, what could break the chain, and which statements are accounting identities versus contestable assumptions.

## Five questions for every number

Whenever you encounter a number, ask:

- Is it a **stock** at a date or a **flow** per year?
- Is it electrical power, energy, peak arithmetic performance, or useful delivered work?
- Is it owned capacity, leased capacity, or capacity serving a company's models?
- Is the money revenue, gross profit, operating profit, cash flow, or asset value?
- Is it observed, estimated, contracted, forecast, or a thought experiment?

> UNIT DISCIPLINE. The single most important reading habit is to restore the denominator. "$15 million per megawatt" is incomplete unless you know whether it means per MW-year of reserved IT capacity, a one-time construction cost, or annual revenue. "$0.40 per million tokens" is incomplete unless you know whether it is the input, output, or cached price, which provider quoted it, and whether the cache was actually honoured. Most public discussion drops the convention; this guide restores it every time.

## Why prices are the thread

Every chapter in this guide ends at a price: a wafer price, a GPU-hour rental, a megawatt-hour, a credit spread, a token. That is not an accident of presentation. In [The Use of Knowledge in Society](https://www.econlib.org/library/Essays/hykKnw.html), Friedrich Hayek argued that the knowledge needed to run an economy is dispersed across millions of people, that no central planner can collect it, and that prices are the compressed telegram by which the dispersed knowledge is communicated. A rising HBM contract price tells a data-center developer in Texas something a Korean fab engineer knows and the developer does not. A falling H100 rental rate tells a lab something about every neocloud's utilization at once.

Reading this guide from that angle means asking, for every market: does a price exist, who can see it, what knowledge does it carry, and can it be trusted? Some of the most important compute markets, such as HBM contracts and advanced packaging slots, have no public price at all: the knowledge exists but is not telegraphed. Others, such as the open-weight token market of Chapter 9, have very public prices that can be quietly false. The [dashboard](/) is organized around exactly this distinction: direct prices, operating quantities, proxies, and unobserved markets are never allowed to share an unlabelled axis.

## Two readings of the same chain

There are two ways to look at the chain from sand to tokens. The engineering reading follows matter and energy: photons through mirrors, electrons through transformers, bytes through interconnects. The market reading follows claims: a wafer allocation, a take-or-pay contract, a bond covenant, a routing decision. This guide keeps both in view because the interesting failures happen where they diverge: a facility that is energized but not accepted, a chip that is shipped but not yielding, a token that is billed as uncached when it was served from cache.

If you already know one of the two readings well, the chapters where the other reading is foreign are the ones worth slowing down on.
