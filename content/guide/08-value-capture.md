---
slug: value-capture
title: 8. Why the best model might outbid everyone
heading: Who captures the surplus
label: Value capture
cluster: Money
summary: Marginal value versus average revenue, and which layer actually captures the surplus.
---

## 8.1 Willingness to pay is marginal value, not average revenue

A lab should buy another unit of compute when the expected incremental value exceeds the full incremental cost and risk. That value can come from:

- external inference revenue;
- internal productivity;
- a better future model;
- strategic denial of scarce capacity to competitors;
- learning, data, and ecosystem effects.

The concentration argument assumes frontier labs can monetize the next MW better than alternative users. If true, competitive bidding shifts capacity toward them until price rises, their marginal value falls, or someone else finds a higher-value use.

## 8.2 Why price need not equal the leader's full value

In a simple auction with fixed supply, price approaches the second-highest willingness to pay, not necessarily the winner's full value. The leader can retain surplus if its advantage is unique. Compute suppliers can capture more surplus when capacity is scarce, contracts expire, or they can credibly withhold supply.

Long-term contracts, vertical integration, custom chips, and multiple suppliers make the real bargaining game dynamic. Prices also cannot rise beyond the point where customers redesign workloads, delay projects, build alternatives, or demand destruction occurs.

## 8.3 Value creation versus value capture

An AI tool can create $1 million of value for a customer while charging $100,000. The customer captures $900,000 of surplus. The model provider pays the cloud, which pays hardware and facility suppliers. Each layer negotiates for a share.

A common history of value capture is plausible in direction:

- early in a boom, scarce chips and capacity suppliers may earn high margins while model providers subsidize usage;
- as models differentiate and pricing improves, labs capture more;
- as contracts reset and upstream bottlenecks persist, memory, packaging, power, and landlords can raise prices;
- competition and innovation can shift the surplus again.

No layer is guaranteed to capture value simply because it is technologically essential. Bargaining power depends on scarcity, substitutability, contracts, and competition. Chapter 9 gives the sharpest current example: in the open-weight token market the model builder, who paid for the training, is undercut on its own model by providers who did not, and the surplus migrates to the harness that owns the user and the provider that owns the hardware.

## 8.4 Economies of scale

Training has large fixed costs. Once a model is trained, the knowledge can be used across many sessions, so development cost is amortized over users. Scale can also improve purchasing, infrastructure utilization, data, research tooling, and distribution.

But there are diseconomies:

- coordination and organizational complexity;
- communication overhead across clusters;
- power and siting constraints;
- failure rates and repair burden;
- diminishing algorithmic returns;
- concentration and regulatory risk.

## 8.5 Training versus inference allocation

A common prediction is that labs will allocate a larger fraction to R&D even when inference becomes profitable. This can be rational if the expected present value of a better future model exceeds today's foregone serving profit.

The decision resembles an oil producer choosing whether to sell oil today or use resources to discover a much larger field - except compute is not stored oil, and research results are radically uncertain.

The key inequality is:

expected discounted increase in future value from R&D > current after-tax contribution from inference.

Public shareholders would not automatically forbid this. They might reward credible high-return investment or punish vague empire building. Governance, disclosure, competition, safety, and executive incentives determine the result.

## 8.6 Recursive self-improvement and takeoff

**Recursive self-improvement (RSI)** is the hypothesized loop in which an AI system materially improves the research and engineering process used to create its successor, which then improves the next successor faster. **Takeoff** describes the speed of capability growth. **AGI** and **ASI** are contested labels for broadly capable and superhuman systems.

These are not settled engineering milestones with standard measurement. Treat them as scenario switches. If internal AI research becomes extremely productive, the value of training compute could exceed external inference revenue. If not, ordinary market competition and diminishing returns may dominate.

## 8.7 Continual learning and deployment data

Continual learning means updating a system as new data and tasks arrive without catastrophically forgetting earlier capabilities. Wide deployment may produce feedback, interactions, evaluations, and edge cases. But data volume alone is not advantage; legal permission, privacy, quality, selection, labeling, training methods, and feedback loops matter.

Deployment can strengthen centralization if the largest model learns fastest. It can weaken centralization if open models, customer-owned data, interoperability, distillation, or efficient fine-tuning spread capability.

