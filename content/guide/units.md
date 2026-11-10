---
slug: units
title: Units: what "compute" actually means
heading: Units: what compute actually means
label: Units
cluster: Foundations
summary: Why compute is not one substance, and how power, energy, stock and flow differ.
---

## Compute is not one physical substance

"Compute" is a bundle of resources used to execute numerical operations. In modern AI, that bundle includes accelerator chips, high-bandwidth memory, interconnects, host CPUs, storage, networking, power conversion, cooling, buildings, software, and people. A cluster can have many theoretical FLOPs but deliver poor useful performance if memory bandwidth, networking, reliability, or software is weak.

A helpful hierarchy is:

**Operation:** one arithmetic action, such as a multiply or add.

**FLOP:** one floating-point operation. FLOP is a count; FLOP/s is a rate.

**Peak FLOP/s:** the chip's theoretical ceiling at a specified numerical precision.

**Achieved FLOP/s:** what a workload actually sustains after communication, memory stalls, and inefficiency.

**Useful model throughput:** tokens per second, training examples per second, or time to train a target model.

**Economic output:** revenue, cost savings, or research progress produced with that throughput.

The [Google TPU7x documentation](https://docs.cloud.google.com/tpu/docs/tpu7x) illustrates why a single headline is inadequate: it reports arithmetic throughput, HBM capacity and bandwidth, and inter-chip bandwidth separately. All three can bind.

## Power versus energy

A watt is a rate of using energy. A watt-hour is an amount of energy. Industry discussion uses megawatts and gigawatts as a shorthand for cluster scale.

| Unit | Equals | What it measures |
| 1 kW | 1,000 W | Power rate; roughly a small appliance-scale reference. |
| 1 MW | 1,000 kW | Power rate; common unit for a data-center module or capacity contract. |
| 1 GW | 1,000 MW | Power rate; campus, fleet, or power-plant scale. |
| 1 MWh | 1 MW for 1 hour | Energy consumed or produced. |
| 1 TWh | 1 million MWh | Large annual energy quantity. |
| FLOP | 1 floating-point operation | A count of arithmetic work. |
| FLOP/s | operations per second | A rate of arithmetic work, always tied to precision and assumptions. |

If a facility draws 1 GW continuously for a year, it consumes:

1 GW x 8,760 hours = 8.76 TWh.

That is an energy quantity. The cost depends on the electricity price. At $60/MWh, 8.76 million MWh costs about $526 million before demand charges, grid fees, fuel arrangements, and backup power.

But there is another distinction. A "1 GW data center" may mean total facility power or IT power delivered to servers. **Power Usage Effectiveness (PUE)** is total facility energy divided by IT-equipment energy. At PUE 1.20, a site drawing 1.0 GW from the grid supplies roughly 0.833 GW to IT and uses the remainder for cooling, conversion losses, lighting, and other overhead. The [Lawrence Berkeley National Laboratory PUE guide](https://datacenters.lbl.gov/sites/default/files/WP49-PUE%20A%20Comprehensive%20Examination%20of%20the%20Metric_v6.pdf) explains the metric, and the [IEA Energy and AI report](https://www.iea.org/reports/energy-and-ai/) provides wider energy-system context.

## Why watts are used as a proxy

Chips require electricity, so power availability puts a hard upper bound on the cluster. It is often easier to estimate contracted megawatts than secret chip counts. Yet equal watts do not imply equal compute:

- a newer accelerator may provide more operations per watt;
- lower precision can increase peak arithmetic throughput;
- better networking and software can raise utilization;
- one workload may be memory-bound while another is compute-bound;
- a cluster may sit idle or be unavailable due to failures;
- a Chinese domestic accelerator and a frontier Western accelerator may deliver different useful work per watt.

That is why careful analysts switch from raw gigawatts to **usable FLOPs** or quality-adjusted compute. It is also why a claim like "two labs control most compute" may mean their models are the end use of the capacity, not that those labs own every building and chip.

## Stock, flow, and marginal compute

The **installed base** is all capacity already operating. **Incremental compute** is the new capacity added during a period. **Marginal compute** usually means the next unit available for allocation or the newest capacity that sets the market price.

If new machines are much more efficient than old machines, the newest year's additions can be a modest fraction of electrical capacity but a large fraction of useful FLOPs. The centralization argument ({ch:centralization}) relies on this composition effect: capture a large share of new capacity while each new watt is more productive than the legacy stock.

## Training, inference, research, and development

**Pre-training** adjusts model parameters using a large corpus. **Post-training** includes supervised fine-tuning, reinforcement learning, preference optimization, and other procedures that shape behavior. **Inference** runs a trained model to answer users or perform tasks. Each involves forward passes; training also requires storing intermediate states and computing gradients.

Labs use a broader budget taxonomy:

**Research compute:** many experiments on architectures, data mixtures, scaling, and algorithms.

**Development-run compute:** the large run that produces a candidate model, plus post-training.

**Inference compute:** serving internal and external users.

The boundaries are fuzzy. Synthetic-data generation, evaluation, agent rollouts, continual learning, and automated research can look like inference in one accounting system and R&D in another. The [MLCommons benchmarks](https://mlcommons.org/benchmarks/) separate training and inference performance because they are different measurement problems.

## Tokens, context, throughput, and latency

A **token** is a chunk of text or code processed by a model. A request has input tokens and generated output tokens. Economic capacity is not just tokens per second:

**Latency** is the time until a response starts or finishes.

**Throughput** is work completed per unit of time.

**Batching** combines requests to use hardware efficiently, often trading latency for throughput.

**Context length** affects memory and attention costs.

**Utilization** is the fraction of time expensive hardware does productive work.

**Time to train** matters because a result delivered six months late may be economically obsolete.

