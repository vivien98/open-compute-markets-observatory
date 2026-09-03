---
slug: silicon
title: 4. The silicon supply chain, step by step
heading: The silicon supply chain, step by step
label: Silicon
cluster: The physical stack
summary: Design, EDA, masks, wafers, EUV, packaging, and the actor map from sand to rack.
---

## 4.1 Design requirements and architecture

A customer begins with a workload and product target: training, low-latency inference, networking, or a mixed system. Architects decide the compute units, memory hierarchy, interconnects, numerical formats, chiplet partitioning, and power envelope.

An **ASIC** is an application-specific integrated circuit. Nvidia's GPUs are programmable accelerators sold broadly. Google's TPU and Amazon's Trainium are custom accelerators designed around their platforms. A lab's "own chip" would mean a custom-design program, but manufacturing would still depend on foundries, memory firms, packaging, and equipment suppliers.

## 4.2 EDA software and intellectual property

Modern chips contain billions of transistors. Electronic design automation tools help engineers describe logic, verify correctness, place and route components, analyze timing and power, and prepare layouts for manufacturing. Reusable IP blocks may include CPU cores, memory interfaces, and high-speed links.

Design is constrained by the foundry's **process design kit (PDK)**: a detailed rulebook and set of models describing what the manufacturing process can reliably build. A design must be taped out into mask data before production.

## 4.3 Photomasks and reticles

A reticle contains a pattern for one layer of the chip. Lithography projects that pattern onto light-sensitive material on the wafer. Advanced chips require many masks, and defects in critical masks are extremely costly. EUV masks are reflective rather than transmissive because EUV light is absorbed by most materials.

## 4.4 Silicon wafers, dies, and yield

A **wafer** is a polished silicon disk, commonly 300 mm in advanced fabs. The fab builds many copies of a circuit across it. After fabrication, the wafer is tested and cut into individual **dies**.

**Yield** is the fraction of potential dies that work well enough to sell. Larger dies are more likely to intersect a defect, so giant AI accelerators are economically demanding. A rough intuition is:

good dies per wafer = gross die sites x yield.

Neither term is fixed. Edge losses, die geometry, redundant components, defect density, process maturity, and product binning all matter. "55,000 N3 wafers" is therefore not a universal recipe for 1 GW; it is an estimate tied to a particular accelerator generation, die configuration, performance assumption, power envelope, and yield.

## 4.5 What N3 and N5 mean

N3 and N5 are TSMC process-family labels. They are not literal measurements of every transistor feature. Newer nodes generally offer some combination of density, speed, and energy-efficiency gains, but the tradeoffs depend on design.

A system can use several nodes. The main compute die may use a leading node, while I/O dies, controllers, networking chips, or other components use older processes that are cheaper and better matched to analog or interface functions. This is why a single accelerator program can carry both N3 and N5 wafer requirements.

## 4.6 Fabrication: hundreds of repeated operations

Fabrication builds transistors and wires in layers. The simplified loop is:

Deposit or grow a thin material layer.

Coat the wafer with photoresist.

Expose a pattern using lithography.

Develop the resist.

Etch or implant material where the pattern allows.

Clean, measure, and inspect.

Repeat for many layers, then add metal interconnects.

The fab needs lithography, deposition, etch, ion implantation, cleaning, chemical-mechanical polishing, inspection, metrology, and process-control tools. It also needs ultra-pure water, specialty gases and chemicals, stable power, cleanrooms, waste handling, maintenance, recipes, and trained teams.

ASML explains that modern chips can have up to roughly 100 layers and that different layers use EUV or DUV systems in its [manufacturing primer](https://www.asml.com/en/technology/all-about-microchips/how-microchips-are-made). The point is not the exact layer count; it is that one wafer visits many tools repeatedly.

## 4.7 EUV lithography and the mirror bottleneck

Extreme ultraviolet lithography uses 13.5 nm light for the most intricate layers of advanced logic and memory. Air absorbs EUV, and ordinary lenses do not work, so the light travels through a vacuum and is guided by multilayer mirrors.

ASML describes how laser pulses vaporize tin droplets to create EUV light, which is then guided through a reflective optical column in its [EUV system overview](https://www.asml.com/en/products/euv-lithography-systems). ZEISS supplies the extraordinary optics; its [history of EUV optics](https://www.zeiss.com/semiconductor-manufacturing-technology/news-and-events/smt-press-releases/2025/euv-30-years.html) describes the precision and long development period.

Why can't $10 billion instantly make more mirrors? Money can fund expansion, but it does not immediately create:

- production equipment for the optics;
- experienced specialists and tacit process knowledge;
- qualified suppliers for thousands of components;
- measurement tools capable of verifying the surface;
- clean facilities and stable processes;
- completed ASML systems, installation teams, and customer qualification.

Capital can move the long-run capacity curve. It cannot abolish lead time.

## 4.8 Wafer starts, cycle time, throughput, and fab capacity

Fab capacity is often discussed as **wafer starts per month**. A wafer start enters the process; finished output arrives months later. Capacity depends on the slowest tool group, process recipe, product mix, rework, maintenance, and yield.

Adding one EUV scanner helps only if deposition, etch, inspection, masks, cleanroom space, utilities, and downstream packaging can keep pace. A fab also needs time to ramp: tools are installed, calibrated, matched, and qualified; recipes improve; yield rises. This is why a capital expenditure today can take years to become high-volume output.

## 4.9 Logic versus memory

The accelerator performs arithmetic, but it constantly reads and writes model weights, activations, and intermediate data. Standard DRAM packages are too far away and too bandwidth-limited for many high-end workloads. **High Bandwidth Memory (HBM)** stacks multiple DRAM dies and places them close to the accelerator through advanced packaging.

HBM capacity answers "how much fast data can sit near the chip?" HBM bandwidth answers "how quickly can it move?" Google's TPU specifications show both capacity and bandwidth because either can constrain performance. Micron's [HBM product page](https://www.micron.com/products/memory/hbm/hbm3e) provides an example of the category.

HBM needs DRAM wafer capacity, through-silicon vias, die stacking, testing, and packaging. It competes for some equipment and capital with conventional memory. That is why honest capacity accounting counts DRAM wafers separately from logic wafers, and why memory companies can at times capture more scarcity rent than the logic foundry.

## 4.10 Advanced packaging and CoWoS

The finished accelerator is not merely a logic die with memory glued beside it. Advanced packaging connects multiple dies with short, dense, energy-efficient links. TSMC's [CoWoS overview](https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm) describes a family of chip-on-wafer-on-substrate approaches.

Typical elements include:

- one or more compute dies or chiplets;
- HBM stacks;
- a silicon interposer or redistribution layer;
- an organic package substrate;
- power delivery and thermal interfaces;
- testing and known-good-die selection.

Packaging yield compounds with die yield. A failed component in an expensive multi-die package can waste several good components, so testing and assembly quality are essential.

## 4.11 Substrates, boards, systems, and racks

The package mounts to a board with power regulators and high-speed connections. Boards go into trays or servers. Servers go into racks. Racks require busbars or power distribution, liquid or air cooling, management controllers, and physical serviceability.

"Substrate" can mean different layers, but in this context it often refers to the package substrate connecting the silicon package to the printed circuit board. Substrate capacity is slow to expand because dimensional stability, fine wiring, materials, yield, and qualification are demanding.

## 4.12 Scale-up and scale-out networking

**Scale-up** links accelerators inside a tightly coupled domain with very high bandwidth and low latency. **Scale-out** links servers, racks, or pods across a larger cluster. Training requires frequent communication of parameters, gradients, or activations; a slow or unreliable network leaves accelerators waiting.

The network stack includes switches, network interface cards, copper links, optical transceivers, fiber, and software collectives. Optical modules convert electrical signals into light. At cluster scale, network design, cable installation, error rates, and repair logistics are major engineering systems, not accessories.

## 4.13 The complete actor map

| Layer | What it contributes | Illustrative actors |
| EDA and IP | Design, verification, layout, reusable cores and interfaces | Cadence, Synopsys, Arm |
| Chip design | Accelerator architecture and product | Nvidia, AMD, Google, AWS |
| Logic foundry | Leading-edge wafer fabrication | TSMC, Samsung; SMIC in China |
| Lithography | Patterns critical layers on wafers | ASML; ZEISS optics |
| Other fab tools | Deposition, etch, clean, inspect, measure | Applied Materials, Lam, TEL, KLA |
| Materials | Wafers, resist, gases, chemicals, masks | Specialized global suppliers |
| Memory | DRAM dies and stacked HBM | SK hynix, Samsung, Micron; CXMT |
| Packaging | Interposer, chiplets, HBM integration, test | TSMC CoWoS, OSATs |
| Substrates/boards | Package and board interconnection | Ibiden and other substrate/PCB firms |
| Servers/racks | Boards, power, cooling, mechanical integration | OEMs and ODMs |
| Networking | Switches, NICs, optics, fiber, software | Nvidia, Broadcom and ecosystem |
| Facility/power | Building, grid, generation, cooling and operation | Utilities, developers, infrastructure funds |

The table is illustrative, not exhaustive. Companies can span layers, and suppliers change by product generation.

## 4.14 The "$6 billion fab CapEx" thought experiment

A widely repeated thought experiment reasons that roughly $6 billion of incremental fab tooling, cleanroom, and shell could enable enough annual wafer output for 1 GW of compute, which might support $100 billion of annual end revenue.

If one investment produces hardware for 1 new GW every year and each cohort operates through the five-year window, the total is 5 + 4 + 3 + 2 + 1 = 15 GW-years. At $100 billion of revenue per GW-year, that is $1.5 trillion of gross end revenue.

The arithmetic is valid **conditional on the assumptions**. The economic interpretation needs eight caveats:

Revenue is not profit or free cash flow.

The $6 billion is only one portion of the stack, not the cost of a functioning 1 GW cluster.

The same downstream revenue cannot be attributed independently to every upstream layer without double counting.

Output depends on yield, utilization, product mix, and packaging.

The fab may serve several customers and products.

Each hardware cohort may become less competitive as newer chips arrive.

The revenue-per-GW assumption may fall if token prices, competition, or demand change.

Taxes, working capital, model R&D, electricity, staff, maintenance, and financing all sit between revenue and distributable cash.

The right conclusion is not "a fab turns $1 into $250." It is "if the downstream willingness to pay is truly this large, the social value of relieving the upstream bottleneck is enormous, but surplus will be divided across a complementary system."

## 4.15 A terminology correction: bullwhip effect

Commentators often use **bullwhip effect** for prices and value capture propagating through the supply chain. In operations management, the term more precisely means that small changes in end demand produce amplified order variability upstream because of forecasting, batching, lead times, and inventory behavior. Rising prices passed upstream are better called scarcity pricing, rent capture, or cost pass-through. The two can coexist: volatile AI demand forecasts can create a true bullwhip while scarce suppliers also raise prices.

