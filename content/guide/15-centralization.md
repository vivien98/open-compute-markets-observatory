---
slug: centralization
title: 15. Centralization: the final argument
heading: Centralization: the final argument
label: Centralization
cluster: Argument
summary: Forces pushing both ways, and why ownership, control, and service must be separated.
---

## 15.1 The centralizing forces

The centralization argument rests on several mutually reinforcing mechanisms:

**Training scale:** fixed research and training cost is amortized across many uses.

**Scarce compute:** the best monetizer can outbid rivals.

**Research feedback:** better models may accelerate the next model's development.

**Deployment data:** the largest product may obtain more feedback.

**Capital access:** large balance sheets and credible contracts finance capacity.

**Vertical integration:** custom chips, data centers, and internal models reduce dependency and protect margin.

**Talent and ecosystem:** strong labs attract researchers, developers, customers, and suppliers.

## 15.2 The decentralizing forces

The counterforces get less attention than they deserve:

- algorithmic efficiency can reduce compute required for a capability;
- model distillation and open weights can spread capability (Chapter 9 shows a market in which dozens of providers serve the same open model, and the model builder's pricing power is the thing being competed away);
- inference can occur at the edge or in customer-controlled clouds;
- customers may multi-source to avoid dependency;
- antitrust, interoperability, and procurement policy can reduce lock-in;
- suppliers may prefer a diversified customer base;
- data and domain expertise may remain distributed;
- diminishing returns can limit training scale advantages;
- security and reliability concerns can favor geographic and organizational redundancy;
- sovereigns may build national capacity.

The intellectual question is not "centralized or decentralized?" It is which layers concentrate. Model training could concentrate while applications, inference, ownership, data, or governance remain plural. The souq of Chapter 9 is the live example: training is concentrated in a handful of builders, inference is fragmented across dozens of providers, and value concentrates at the two ends, in harnesses and in hardware.

## 15.3 Ownership, control, and service must be separated

A data center can be owned by an infrastructure fund, operated by a specialist, filled with chips purchased by a cloud, reserved by a lab, and used by a customer through an API. Who "controls" the compute?

Possible definitions include:

- legal ownership of the assets;
- dispatch authority over workloads;
- contractual right to capacity;
- control of model weights;
- control of customer access and prices;
- economic receipt of the model revenue;
- political jurisdiction.

Some analysts count Amazon capacity serving Anthropic models as Anthropic compute. That is a defensible demand-side definition, but it is not asset ownership.

## 15.4 Effective AI labor

A popular intuition pump converts model capability and throughput into an "effective population" of AI workers. This is an intuition pump, not a measured labor statistic. A million concurrent model instances do not equal a million humans unless they can perform comparable tasks with similar autonomy, reliability, coordination, context, and accountability.

A better framework measures task-adjusted output:

effective labor equivalents = total useful task output / output of a reference worker.

The numerator depends on quality, error correction, supervision, uptime, and complementarities with humans. If capability improves while inference cost falls, effective labor can grow faster than raw compute.

## 15.5 Governance choices

If a few private firms control strategically important models and capacity, policy options include competition enforcement, compute access rules, interoperability, public or academic compute, safety regulation, procurement, taxation, disclosure, nationalization, or international agreements. Each changes incentives and creates its own concentration of power.

Nobody has solved governance. The honest contribution of the centralization argument is to insist that decentralization proposals must take scale economies seriously.

