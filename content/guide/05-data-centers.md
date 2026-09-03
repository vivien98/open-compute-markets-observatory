---
slug: data-centers
title: 5. From chip to data center
heading: From chip to data center
label: Data centers
cluster: The physical stack
summary: Critical IT versus the facility, the power chain, cooling, and usable capacity.
---

## 5.1 "Critical IT" versus the whole facility

Practitioners distinguish critical IT from the broader build.

**Critical IT** usually includes accelerators, CPUs, memory, server boards, racks, switches, network cards, optics, and storage. The broader project adds:

- land and site preparation;
- the building shell and secure halls;
- substations, transformers, switchgear, and cables;
- uninterruptible power supplies and backup generation;
- cooling towers, chillers, pumps, heat exchangers, or dry coolers;
- water and wastewater infrastructure where applicable;
- fire protection, physical security, and controls;
- grid interconnection and power-generation contracts;
- roads, warehouses, spare parts, and operations staff.

A $40 billion server fleet and a $40 billion fully enabled campus are different objects. Analysts must state which boundary their CapEx number uses.

## 5.2 The power chain

Electricity reaches the chips through multiple conversions:

generation -> transmission -> substation -> distribution -> switchgear -> UPS -> rack power shelf -> board regulators -> silicon.

Each stage has capacity, efficiency, failure, and lead-time constraints. The queue to connect a new load to the grid is itself a market with a price expressed in years; Lawrence Berkeley National Laboratory's [Queued Up](https://emp.lbl.gov/queues) series documents how long US interconnection requests wait, and FERC's [Order 2023](https://www.ferc.gov/news-events/news/ferc-issues-transformative-rule-improve-interconnection-process-all) is the attempt to shorten it. Transformers and gas turbines can become bottlenecks because they are large engineered products with long order books. A developer may buy equipment before the final site is ready because losing the production slot could delay revenue by years.

## 5.3 Cooling

Nearly all electrical energy consumed by chips becomes heat. High-density accelerators increasingly use direct-to-chip liquid cooling. The facility must move heat from silicon to coolant, from coolant to facility water or another loop, and then to the outside environment.

Cooling design affects PUE, water use, rack density, reliability, and where a site can operate. More efficient chips can reduce energy per unit of work while still increasing total facility power because demand grows faster - a rebound effect related to [Jevons' paradox](https://en.wikipedia.org/wiki/Jevons_paradox). The [IEA's Energy and AI report](https://www.iea.org/reports/energy-and-ai/) is the best public estimate of the aggregate, and the [Open Compute Project](https://www.opencompute.org/) publishes the rack and cooling specifications that hyperscalers converge on.

## 5.4 Reliability and usable capacity

Nameplate power is not productive compute. Meta's account of training Llama 3 on 16,000 GPUs, in the [Llama 3 paper](https://arxiv.org/abs/2407.21783), reports hundreds of unplanned interruptions in a 54-day run, most from hardware faults; that is what "usable FLOPs" means in practice. Operators track:

- construction completion and energization;
- chip delivery and rack acceptance;
- uptime and scheduled maintenance;
- accelerator failures and network errors;
- cluster fragmentation;
- workload scheduling and utilization;
- software efficiency.

For training, many devices must cooperate. A small failure rate across a huge population produces frequent faults, so checkpointing, redundancy, and rapid repair matter. **Usable FLOPs** therefore embeds operational excellence.

## 5.5 Why power plants and buildings are built ahead

If next year's server deliveries require 20 GW of additional powered space, the substations, buildings, cooling, turbines, and grid works must begin earlier. This creates **lead-lag CapEx**: cash is spent before revenue and sometimes before the final accelerator generation is known.

Long-lived infrastructure and short-lived IT coexist:

- a power plant may operate for 30 years;
- a data-center shell and electrical plant may operate for 15-30 years;
- servers may be depreciated over roughly 5-6 years in current hyperscaler accounts (Chapter 6 quotes the filings);
- economically frontier hardware may become less attractive sooner.

This mismatch creates residual-value risk. A specialized site is only valuable if future hardware, power prices, network access, and customers keep it useful.

## 5.6 Regulation and local politics

Data centers can create investment and tax revenue but use grid capacity, land, water, and equipment. Local objections may involve electricity prices, pollution from backup or dedicated generation, noise, water, construction, property-tax incentives, and the number of permanent jobs.

Regulation can reduce supply, raise cost, change geography, or slow projects. It can also force developers to internalize costs that would otherwise be shifted to ratepayers or communities. Most commentary treats regulation mainly as a quantity constraint; a full analysis also asks who bears infrastructure costs and risks.

