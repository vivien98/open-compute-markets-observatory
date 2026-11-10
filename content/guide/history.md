---
slug: history
title: Historical context: why the stack looks like this
heading: Why the stack looks like this
label: History
cluster: Foundations
summary: How integrated circuits became specialised accelerators, and why the industry fragmented.
---

## From integrated circuits to specialized accelerators

In 1965 Gordon Moore observed that the economically optimal number of components on an integrated circuit was rising rapidly. His original paper, [Cramming More Components onto Integrated Circuits](https://www.cs.princeton.edu/courses/archive/fall04/cos576/papers/moore65.pdf), was an industry forecast, not a law of physics. For decades, denser transistors made computing cheaper.

Early transistor scaling also improved performance without proportionally increasing power, a pattern associated with Dennard scaling. By the mid-2000s, power density and leakage made frequency scaling harder. The industry gained more performance from multicore processors and specialized parallel hardware.

GPUs were designed to execute many similar graphics operations in parallel. Neural networks also rely heavily on parallel matrix multiplication, so GPUs became effective AI accelerators. Software ecosystems made the hardware usable at scale. The 2017 Transformer paper, [Attention Is All You Need](https://papers.nips.cc/paper/7181-attention-is-all-you-need.pdf), introduced an architecture that parallelized training effectively. The 2020 [neural scaling laws paper](https://arxiv.org/pdf/2001.08361v1) documented predictable improvements with more model size, data, and compute over the ranges studied. Together, these trends strengthened the business case for enormous clusters.

## Why the semiconductor industry fragmented

The earliest chip companies often designed and manufactured their own products. As factories became more expensive, the industry specialized:

**Fabless firms** concentrate on chip design.

**Foundries** manufacture designs for customers.

**Integrated device manufacturers (IDMs)** still combine design and manufacturing.

Separate firms provide design software, equipment, materials, memory, packaging, testing, boards, and systems.

TSMC, founded in 1987, popularized the dedicated foundry model. Specialization spreads fixed costs across many customers and allows each supplier to become extraordinary at one narrow task. It also creates single points of failure. ASML's [microchip manufacturing overview](https://www.asml.com/en/technology/all-about-microchips/how-microchips-are-made) distinguishes fabless firms, foundries, and IDMs and notes that fabrication involves hundreds of steps over months.

## Why AI made old bottlenecks newly strategic

AI accelerators are large, advanced logic dies paired with unusually fast memory and elaborate packaging. A leading accelerator therefore consumes scarce capacity in several industries at once:

- leading-edge logic wafers;
- HBM memory wafers and stacking;
- advanced packaging and silicon interposers;
- substrates and printed circuit boards;
- high-speed switches, network interface cards, optics, and fiber;
- power-generation and grid equipment;
- transformers, switchgear, backup systems, and cooling equipment.

A shortage in any one stage can strand the rest. The industry does not scale by printing more GPUs in isolation.

## The policy turn after 2022

Semiconductor supply chains were already geopolitically concentrated. The pandemic shortages made that dependence visible, and AI made leading-edge capacity a national-security concern. In October 2022, the US Bureau of Industry and Security imposed controls on certain advanced computing chips, supercomputer end uses, semiconductor manufacturing equipment, and support for specified Chinese fabs. The official [BIS 2022 announcement](https://www.bis.gov/node/20292) gives the policy rationale and thresholds. Later rules revised and clarified the controls.

The China question ({ch:china}) is therefore about two constraints at once: access to finished accelerators and access to the tools, software, materials, memory, and expertise required to manufacture comparable systems domestically.

