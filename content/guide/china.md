---
slug: china
title: China, export controls, and quality-adjusted compute
heading: China, export controls, and quality-adjusted compute
label: China & controls
cluster: Macro
summary: What controls target, why smuggling is not a supply chain, and what to measure.
---

## What export controls target

Controls can target finished accelerators, chip performance characteristics, manufacturing equipment, software, technical support, or end uses. Advanced semiconductor production is a network technology: limiting one critical input may slow the entire system.

The [2022 BIS rules](https://www.bis.gov/node/20292) targeted certain advanced computing chips, supercomputer end uses, specified semiconductor manufacturing equipment, and support for advanced PRC fabs. The standard argument is that these measures reduced China's share of newly deployed frontier AI compute.

## Why smuggling does not equal a domestic supply chain

Smuggled chips can support clusters, but they create uncertain volume, maintenance, networking, replacement, firmware, and legal risk. A domestic supply chain provides repeatable production, service, and the ability to improve generations.

Conversely, export controls are porous and adaptive. Designs can be modified, intermediaries used, inventories accumulated, and domestic substitutes improved. Measuring effectiveness requires more than announced shipment rules. CSIS's analysis of the controls, [Choking Off China's Access to the Future of AI](https://www.csis.org/analysis/choking-chinas-access-future-ai), lays out the logic of targeting the tool layer rather than the chip layer.

## SMIC, CXMT, and the two-wafer problem

SMIC is a major Chinese foundry; CXMT is a major Chinese memory producer. A domestic AI system needs both logic and memory, plus packaging, substrates, networking, software, and power. Improving logic without adequate HBM can still leave the system constrained.

A common forecast is that domestic Chinese production rises in 2027-2029 but remains less efficient than leading Western systems. The correct comparison is useful model work per total system cost and watt, not process-node labels alone. The clearest evidence that Chinese labs are optimizing for exactly this is in the open-weight market of {ch:souq}: DeepSeek, Z.ai, Moonshot, and MiniMax release models whose training and serving efficiency is the product, and Chinese inference providers set the floor price for those models on Western routers.

## Financial-system differences

US markets are often willing to fund speculative startups through venture capital, public equity, high-yield debt, and private credit. China's state-directed system can mobilize large subsidies, policy-bank lending, local-government support, and industrial investment once a sector becomes a priority.

These systems may excel at different phases. Decentralized risk capital can explore many designs; coordinated industrial policy can scale selected supply chains. Neither guarantees technical success or capital efficiency.

## What to measure

To evaluate any China compute forecast, track:

- advanced logic wafer starts and yields;
- domestic HBM capacity and performance;
- advanced packaging throughput;
- accelerator shipments and deployed clusters;
- interconnect and software efficiency;
- electricity and data-center completions;
- export-control scope, licensing, and enforcement;
- model capability per training and inference cost.

Raw national data-center electricity is not a clean proxy because much of it serves non-AI workloads.

