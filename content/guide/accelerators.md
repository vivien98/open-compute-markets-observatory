---
slug: accelerators
title: Reading the hardware: accelerators, nodes, and tokens per second
heading: Reading the hardware
label: Accelerators
cluster: The physical stack
summary: The accelerator generations by name, what sits in a node and a rack, the three networks, how to get from a datasheet to tokens per second, why numerical precision is a grade, why old chips get cheaper, and the vocabulary practitioners use when they buy all of it.
---

{chs:silicon,data-centers} explained how an accelerator is made and what it takes to power one. This chapter is the practical companion. People who buy and run this hardware write in a shorthand of model numbers and acronyms: a thousand B300s, air cooled, with InfiniBand, fourteen weeks to ready-for-service, ninety-five percent uptime. By the end of the chapter each of those words should carry a number, and you should be able to estimate, from a public datasheet, roughly how many tokens a machine can produce in an hour. That estimate is the missing link between the physical chapters and the token prices of {ch:souq}.

Specifications here were read from the manufacturers' pages in November 2026 and are linked. Hardware changes fast; treat the method as durable and the numbers as dated.

## The generations by name

An accelerator's name encodes its generation. For reading the market, three numbers per generation matter more than any benchmark: how much fast memory it has, how quickly that memory can be read, and how much power it draws.

| Accelerator | First shipped | Fast memory | Memory bandwidth | Power |
| NVIDIA [A100](https://www.nvidia.com/en-us/data-center/a100/) | 2020 | 80 GB | about 2 TB/s | 400 W |
| NVIDIA [H100](https://www.nvidia.com/en-us/data-center/h100/) | 2022 | 80 GB | 3.35 TB/s | up to 700 W |
| NVIDIA [H200](https://www.nvidia.com/en-us/data-center/h200/) | 2024 | 141 GB | 4.8 TB/s | up to 700 W |
| NVIDIA B200 (Blackwell), as in the [DGX B200](https://www.nvidia.com/en-us/data-center/dgx-b200/) | 2025 | 180 GB (1,440 GB across eight) | 8 TB/s | 14.3 kW for a node of eight |
| NVIDIA B300 (Blackwell Ultra), as in [HGX B300 systems](https://www.supermicro.com/datasheet/datasheet_SuperCluster_B300_Front_IO.pdf) | 2025 | 288 GB | about 8 TB/s | 1.1 to 1.4 kW reported |
| AMD [Instinct MI355X](https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html) | 2025 | 288 GB | 8 TB/s | 1,400 W |
| NVIDIA Rubin, as in the [Vera Rubin NVL72](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/) | 2026 | 288 GB | 19.2 TB/s | not published |

Two things are worth noticing before any arithmetic. Power per accelerator has doubled in four years, which is why {ch:data-centers} spent so long on cooling and why the megawatt has become the unit of capacity. And memory bandwidth has grown faster than memory capacity. The second fact turns out to govern the economics of inference, and most of this chapter is about why.

Alongside these sit accelerators designed by the companies that use them: Google's TPU, Amazon's Trainium, Microsoft's Maia, Meta's MTIA. They are not sold as chips, only rented as services, so they appear in this market through their owners' prices and never through a resale price. A few firms sell inference on unconventional silicon, such as Cerebras's wafer-scale processor; they are the specialists of {ch:souq}.

## What is in a node, and what is in a rack

Accelerators are bought in two shapes.

**The eight-accelerator node.** A server holding eight accelerators on one baseboard, with two CPUs, system memory, storage, and network cards. NVIDIA's reference design for the baseboard is called HGX; its own complete system is a DGX. Servers built around the same baseboard are sold by OEMs, companies that sell under their own brand such as Dell, HPE, and Supermicro, and built by ODMs, the Taiwanese contract manufacturers such as Quanta, Wiwynn, and Foxconn whose monthly revenue the dashboard tracks. A node of eight B200s draws about 14 kW. It can be cooled by air, in which case it is tall, or by liquid, in which case it is short and a rack of them needs plumbing.

**The rack-scale system.** From the Blackwell generation, the largest buyers take the rack as the unit. A [GB200 NVL72](https://www.nvidia.com/en-us/data-center/gb200-nvl72/) is 72 accelerators and 36 CPUs in one liquid-cooled rack, wired so that all 72 behave as a single very large accelerator. Racks of this kind draw well over 100 kW, against 10 to 15 kW for a traditional server rack, which is why they cannot be installed in most existing buildings.

The distinction maps onto the two markets of {ch:commodity}. Rack-scale systems are bought in thousands by hyperscalers for training and for serving the largest models. Eight-accelerator nodes, often air cooled, are what a small operator can put into rented colocation space, and they are what most open-weight inference runs on. The worked example in {ch:collateral} was 128 such nodes.

## Three networks

A cluster has three networks, and practitioners name them constantly.

- **Scale-up.** The links between accelerators inside one node or one rack. NVIDIA's is called NVLink. It is what lets several accelerators hold one model that is too large for any one of them.
- **Scale-out, or east-west.** The links between nodes, carrying traffic from accelerator to accelerator across the cluster. The two choices are InfiniBand, a specialised high-performance fabric, and Ethernet using a protocol called RoCE. Training needs this network to be very fast, because thousands of accelerators exchange data at every step.
- **North-south.** The ordinary network connecting the cluster to storage, to users, and to the internet.

When a buyer says to add InfiniBand to an order, they are choosing the east-west fabric. The choice matters for the market structure. A training cluster is worth little without an expensive east-west network. An inference fleet serving models that fit inside one node hardly uses it. That is one reason a bare-metal inference operator can enter with modest capital and standard parts, and one reason a cluster built for inference has a different resale value from one built for training: part of what a training buyer would pay for is not there.

## From a datasheet to tokens per second

{ch:souq} described the two phases of answering a request. Prefill reads the whole prompt in one parallel pass and is limited by arithmetic. Decode produces output tokens one at a time and is limited by memory. The second claim can be made quantitative with nothing but the table above.

To produce one token, the accelerator must read every weight of the model once. So the time for one decoding step is at least the size of the model divided by the memory bandwidth. Take a model of 100 billion parameters stored at 8 bits each: 100 GB. On an H200, which reads 4.8 TB per second, that is at most 48 steps per second. One user, alone on the machine, cannot receive more than about 48 tokens per second however fast the arithmetic is.

Nobody runs one user per machine. In a **batch**, many requests share each pass through the weights: the weights are read once and applied to every request in the batch. A batch of 32 gets 32 tokens out of each step. This is the single most important fact in inference economics. It is why utilization decides margins, and why a provider with steady traffic can undercut one with bursty traffic on identical hardware.

Batching has a limit, and the limit is the cache. Each request in the batch has its own attention state, the KV cache of {ch:souq}, which must sit in the accelerator's memory and be read at every step. For an illustrative model with 64 layers, 8 key-value heads of width 128, and 16-bit values, the cache takes about 0.26 MB per token of context. A conversation of 2,000 tokens holds half a gigabyte. An agent working over 100,000 tokens of code holds 26 GB.

Put the two together. One decoding step reads the weights plus every cache in the batch, and yields one token per request:

**tokens per second ≈ batch size × memory bandwidth ÷ (model size + batch size × cache per request)**

Run it for one H200 rented at $3.72 an hour and holding the same model compressed to 56 GB, a format discussed in the next section.

| Workload | Batch | Tokens per second | Cost per million output tokens |
| Short conversations, 2,000 tokens of context each | 32 | about 2,100 | about $0.50 |
| Long agent sessions, 100,000 tokens of context each | 3 | about 110 | about $9.60 |

Thirty-two is an ordinary working batch, not the most that memory would hold; for the long sessions, three is all that fits. The same machine at the same rental price produces output tokens at a cost that differs by a factor of twenty depending on the length of the contexts it serves. This is an upper bound on speed and a lower bound on cost; real systems reach a fraction of it, arithmetic limits bite at large batches, and prefill has a cost of its own.

But the shape is right, and it explains several things at once. It explains why output tokens are priced above input tokens. It explains why a cached token is cheap to reuse but not free to keep: the cache occupies memory that could hold another customer's request, so providers evict caches, which is the physical root of the session-continuity problem. And it explains what the dashboard's break-even chart is measuring. A model listed at $4.40 per million output tokens on a $2.20 accelerator needs about 140 tokens per second to pay for the hardware: easy with short contexts, not obviously possible with long ones.

## Precision is a grade

The model's size in that formula is not fixed. Weights are trained as 16-bit numbers and can be stored for serving at lower precision, a step called quantization. The public listings disclose which format each provider uses, in tags such as fp16 or bf16 for the full 16 bits, fp8 for eight, and fp4, mxfp4, or nvfp4 for four.

The four-bit formats are the important ones. NVIDIA's [NVFP4](https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/), supported in hardware from the Blackwell generation, stores each weight in four bits and adds a shared scale for every block of sixteen, about 4.5 bits per weight in all. NVIDIA reports roughly 3.5 times less memory than 16-bit and 1.8 times less than 8-bit, with accuracy within about one percent of the 8-bit model on its tests. MXFP4 is an open industry format on the same principle with coarser scales.

Return to the formula. Halving the model's size nearly doubles the steps per second and frees memory for more requests in the batch. A provider serving a model at four bits can produce the same tokens at close to half the hardware cost of one serving at eight. Whether they are the same tokens is the question. The accuracy cost is small on average and not zero, it varies by task, and the buyer cannot easily measure it.

So precision is a grade, in the sense {ch:commodity} uses for crude oil: the same named model at four bits and at eight bits is two products at two costs. The listings bear this out. Among the endpoints for GLM 5.2 on 10 November 2026, the builder served at eight bits; of the six cheapest quotes, four disclosed a four-bit format and two disclosed nothing. A reader comparing prices across providers is often comparing grades without knowing it, and the model-equality tests described in {ch:souq} exist because the tag is self-reported.

## Why old chips get cheaper

Because decode is limited by memory bandwidth, the bandwidth column of the first table is a rough index of how many tokens each generation can produce. It rose from 3.35 TB/s on the H100 in 2022 to 19.2 TB/s on Rubin in 2026: a factor of 5.7 in four years, or about 55% a year.

An accelerator already installed does not improve. Relative to the newest chip, its capacity to produce tokens falls by about 35% a year. If rental prices follow productive capacity, that is the rate at which the rental price of an old chip should be expected to decline.

Now compare a number from a completely different source. The prediction-market ladders described in {ch:token-prices} priced the H100's rental rate, in late 2026, to fall by about 34% a year. An engineering table and a thinly traded financial market give nearly the same answer. The agreement is closer than the roughness of either number deserves: bandwidth is not the only thing a new chip improves, newer chips cost and draw more, and the ladder is thin. But it is the kind of check this guide exists to make possible, and it bears directly on two earlier arguments. It is the obsolescence path that {ch:collateral} said lenders cannot put a number on. And it is the expected decline that {ch:commodity} separated from the credit premium in the tenor curve.

It also says something about where residual value comes from. An old accelerator is not worthless as long as it can produce tokens for less than their price, and with electricity a small share of the cost of an hour, as {ch:token-prices} showed, that remains true for a long time. What ends its life is usually not its own inefficiency but the scarcity of a place to plug it in. At a site that is short of power, a megawatt given to an old chip is a megawatt denied to a new one that would earn several times as much.

## Power, space, and uptime in round numbers

A few conversions cover most of what comes up.

| Quantity | Round number | Where it comes from |
| Power for a node of eight B200s | about 14 kW | Manufacturer's maximum |
| The same node with cooling, networking, and facility overhead | about 20 kW | The 128-node example in {ch:collateral}: 2.5 MW ÷ 128 |
| Current-generation accelerators per megawatt | about 400 | 1,024 ÷ 2.5 MW |
| H100-class accelerators per megawatt | about 600 | A 10 kW node of eight at a PUE of 1.3 |
| Hours in a year | 8,760 | The multiplier in every contract value |
| Downtime allowed by 95% uptime | 438 hours, about 18 days a year | 5% of 8,760 |
| Downtime allowed by 99.9% uptime | under 9 hours a year | 0.1% of 8,760 |

The last two rows deserve attention. Service-level agreements in this market are quoted in percentages that sound close together and are not. A contract at 95% uptime lets the provider be down for two and a half weeks a year without penalty. Whether the price per hour is for a delivered hour or a contracted hour is one more denominator to restore.

## A buyer's phrasebook

| Term | Meaning |
| Allocation | The share of a manufacturer's shipments a buyer is given. Set by relationship and order size as well as price. |
| OEM, ODM | A server seller under its own brand; a contract manufacturer that builds for others. |
| Build to order | Parts are bought only after the contract is signed, so the buyer cannot test first. |
| Colocation, or colo | Rented space, power, and cooling in someone else's data center. |
| RFS | Ready for service: the date the cluster is delivered, tested, and usable. Payment usually starts here. |
| SLA | Service-level agreement: the promised uptime and what happens when it is missed. |
| MSA | Master services agreement: the signed contract a bridge lender will advance against. |
| BOM | Bill of materials: the full hardware cost of the cluster, the base on which a lender's advance is calculated. |
| TCV | Total contract value: price × accelerators × hours × years. |
| Offtake | A commitment to take and pay for capacity. The customer is the offtaker. |
| Bare metal | Whole physical servers with no virtualization layer. |
| Reserved, on demand, spot | Committed for a term; rented by the hour with no commitment; rented at a market-clearing price and reclaimable at short notice. |
| Dedicated, serverless | A model served on capacity reserved for one customer; a model served from a shared pool and billed per token. |

## What to watch

For hardware, the observatory tracks the marketplace asking price of each accelerator generation side by side, which is the obsolescence path made visible; the monthly revenue of the Taiwanese firms that build the nodes; the numerical formats disclosed by providers of each open-weight model; and, as a gap, any public measurement of tokens per second per accelerator in commercial service, which every provider knows for its own fleet and none publishes. The nearest public substitute is the [MLPerf Inference](https://mlcommons.org/benchmarks/inference-datacenter/) results: throughput submitted by vendors, on systems they tuned, for a fixed list of models and loads. It is a ceiling measured under ideal conditions, and useful as one, in the same way the formula above is.
