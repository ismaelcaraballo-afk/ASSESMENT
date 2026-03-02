# Energy Storage: The Complete Data Playbook
## Group 7: Ismael, Juan, Kevin | Pursuit Cycle 3 | Saturday Pitch

---

## HOW TO USE THIS DOCUMENT
This is your data arsenal for Saturday. Every number has a source. The document follows
Greg's required structure: Setup-Conflict-Resolution. Chart recommendations reference
data-to-viz.com categories. When Greg says 'back up the math' -- point to the source column.

Format: **Bold claim** -> supporting data -> source you can cite

---

# PART 1: SETUP -- 'The Battery Revolution Is Real'

## 1.1 The 93% Cost Collapse

**The single most important number in this entire presentation: battery costs fell 93% in 14 years.**

| Year | Cost per kWh (installed) | Drop from 2010 | What Was Happening |
|------|--------------------------|----------------|--------------------|
| 2010 | $2,571 | -- | Early utility pilots, tiny scale |
| 2012 | ~$1,800 | -30% | First grid-scale projects |
| 2015 | ~$800 | -69% | Tesla Powerwall launches, public awareness |
| 2018 | ~$500 | -81% | Utility-scale procurement takes off |
| 2020 | ~$400 | -84% | COVID slows installs but costs keep falling |
| 2022 | ~$350 | -86% | Supply chain crunch (lithium prices spike) |
| 2023 | $310 | -88% | Lithium prices crash, LFP takes over |
| 2024 | $192 | -93% | Record low, LFP dominates at 85% market share |

Source: IRENA, Renewable Power Generation Costs 2024

**Why it matters:** At $192/kWh, battery storage is now economically viable without subsidies
in many markets. In 2010 it was a science experiment. In 2024 it is a commodity.

**Year-over-year acceleration:** 2024 saw a 38% drop for 2-hour systems and 32% drop for
4-hour systems compared to 2023. The decline is ACCELERATING, not slowing.

**Chart recommendation (data-to-viz.com):** Line chart (Numeric -> Evolution) showing cost
curve from 2010-2024. This is your opening visual.

---

## 1.2 The Chemistry Shift: LFP Took Over

The cost collapse has a name: **Lithium Iron Phosphate (LFP).**

| Year | LFP Market Share (utility-scale) | NMC Market Share |
|------|----------------------------------|-----------------|
| 2020 | ~30% | ~65% |
| 2021 | 48% | ~48% |
| 2022 | ~60% | ~35% |
| 2023 | ~75% | ~22% |
| 2024 | 85% | ~13% |

Source: IRENA, BloombergNEF

**What is LFP?** Lithium Iron Phosphate -- a battery chemistry that trades a little energy
density for massive advantages:
- **Cheaper**: No cobalt or nickel (expensive, ethically problematic minerals)
- **Safer**: Much lower fire risk than NMC (Nickel Manganese Cobalt)
- **Longer lasting**: 3,000-7,000 cycles vs 1,500-3,000 for NMC
- **More stable**: Operates safely in wider temperature ranges

**Current LFP cell prices:**
- Average cell: ~$60/kWh (BloombergNEF 2025)
- BYD cells (cheapest major manufacturer): $44/kWh
- Full stationary storage pack (cells + housing + BMS): ~$70/kWh
- Total installed system (pack + inverter + site + labor): $192/kWh

Source: BloombergNEF Battery Price Survey 2025

---

## 1.3 US Deployment Is Explosive

| Year | Cumulative US Battery Storage | New Added That Year | Growth Rate |
|------|------------------------------|---------------------|-------------|
| 2020 | 1.5 GW | ~0.5 GW | -- |
| 2021 | 4.6 GW | 3.1 GW | +207% |
| 2022 | 8.8 GW | 4.2 GW | +91% |
| 2023 | 15.5 GW | 6.7 GW | +76% |
| 2024 | 26 GW | 10.4 GW | +66% |
| 2025 | 45+ GW (projected) | 19.6 GW | +73% |
| 2026 | 65 GW (projected) | ~20 GW | +44% |

Source: EIA, 'U.S. battery capacity increased 66% in 2024'

**For perspective:** The US went from 1.5 GW to 26 GW in four years. That is a 17x increase.
Battery + solar together account for 81% of ALL new US generating capacity in 2025.

**Chart recommendation (data-to-viz.com):** Stacked area chart (Numeric -> Evolution)
showing cumulative growth, or grouped bar chart showing annual additions.

---

## 1.4 The State-Level Leaders

### California: The Storage King

| Metric | California |
|--------|-----------|
| Battery storage capacity (Jan 2025) | 12.5 GW |
| Share of US total | ~48% |
| CAISO battery fleet (early 2025) | 13+ GW |
| Growth since 2020 | 500 MW -> 13,000 MW (26x) |
| Key driver | Duck curve -- 3.4M MWh of solar wasted in 2024 |

Source: EIA, CAISO

### Texas: The Fastest Grower

| Metric | Texas (ERCOT) |
|--------|--------------|
| Battery capacity start of 2025 | 7.8 GW |
| Battery capacity end of 2025 | 13.9 GW |
| New capacity added in 2025 alone | 6 GW (60 new sites) |
| Growth since 2020 | 200 MW -> 13,900 MW (70x in 5 years) |
| Q3 2025 single quarter | 2,054 MW -- largest quarterly deployment ever |
| Projected by 2029 | 40-55 GW |

Source: Modo Energy ERCOT Annual Buildout Report 2025

**CA + TX = ~78% of all US battery storage.** No other state is close.

### Other Notable States
| State | Capacity (est.) | Notes |
|-------|----------------|-------|
| Arizona | ~1.5 GW | Solar + storage mandate |
| Nevada | ~1.0 GW | High solar irradiance |
| Florida | ~0.8 GW | Growing hurricane resilience market |

**Chart recommendation (data-to-viz.com):** Choropleth map (Maps -> Choropleth) showing
state-level capacity, or horizontal bar chart (Ranking) for top 10.

---

## 1.5 Technical Performance Specs

For when Greg asks 'how well do these actually work?'

| Spec | Lithium-Ion (LFP) | What It Means |
|------|-------------------|--------------|
| Round-trip efficiency | 90-95% | Store 100 kWh, get 90-95 back |
| Cycle life | 3,000-7,000 cycles | At 1 cycle/day = 8-19 years |
| Calendar life | 10-15 years | Warranty period |
| Degradation rate | 3-7% per year | Capacity fades over time |
| Depth of discharge | 80-100% | Can use most of stored energy |
| Response time | Milliseconds | Faster than any fossil fuel plant |
| Typical duration | 2-4 hours | Current standard grid batteries |
| Operating temp range | -20C to 55C | Works in most US climates |

Source: NREL Cost Projections 2025, IRENA

---

# PART 2: CONFLICT -- 'The System Cannot Keep Up'

## 2.1 The Interconnection Queue Crisis

**The single biggest bottleneck in US clean energy: 2,300 GW is waiting to plug in.**

| Metric | Number | Context |
|--------|--------|---------|
| Total capacity in queue | 2,300 GW (gen + storage) | 2x entire US installed capacity |
| Storage capacity in queue | 890 GW | 34x what is actually installed |
| Active projects in queue | ~10,300 | Each one stuck in paperwork |
| Median wait time (2018-2024) | 4+ years | Doubled from 2000-2007 levels |
| Projects that reached operation (2000-2019) | 13% | Only 13 out of 100 make it |
| Projects that withdrew (2000-2019) | 77% | Gave up waiting |
| Still active / waiting | 10% | In limbo |

Source: Lawrence Berkeley National Lab, 'Queued Up: 2025 Edition'

**What this means in plain English:** For every 100 battery or solar projects that apply to
connect to the grid, only 13 ever actually get built. 77 give up. The bottleneck is not
technology -- it is bureaucracy, transmission capacity, and grid operator processing.

**Why storage specifically is stuck:**
- 890 GW of storage in the queue (down 13% from prior year -- projects are withdrawing)
- 956 GW of solar (down 12%)
- 271 GW of wind (down 26%)
- 95% of everything in the queue is renewable or storage

**Chart recommendation (data-to-viz.com):** Treemap or pie chart (Part of a Whole) showing
queue composition, or timeline (Evolution) showing median wait time doubling.

---

## 2.2 The Duck Curve: Wasting Energy We Already Made

**California threw away 3.4 million MWh of clean energy in 2024 because the grid could not absorb it.**

| Year | Energy Curtailed (CAISO) | Change from Prior Year |
|------|--------------------------|----------------------|
| 2022 | ~1.5M MWh | -- |
| 2023 | 2.6M MWh | +73% |
| 2024 | 3.4M MWh | +29% |
| 2025 (Jan-Apr only) | 738,000+ MWh | On pace to exceed 2024 |

Source: EIA, 'Solar and wind power curtailments are increasing in California'

**93% of all curtailed energy in CAISO in 2024 was solar.** The sun generates massive midday
surplus. Without enough storage, it is literally wasted.

**The duck curve in numbers:**
- Midday net load valley has dropped 13.6 GW from 2018 to 2025
- This creates a 6 GW swing -- like turning off 6 nuclear power plants at noon and turning
  them back on at sunset
- CAISO batteries went from 500 MW (2020) to 13+ GW (2025) specifically to address this

**Why this is your pitch material:** 'We are MAKING the energy. We just cannot SAVE it fast
enough.' That is the conflict.

**Chart recommendation (data-to-viz.com):** Area chart (Evolution) showing the duck curve
shape. The visual is instantly compelling -- Greg will love it.

---

## 2.3 The Duration Problem: 4 Hours Is Not Enough

| Storage Duration | Technology | Status | Cost | Use Case |
|-----------------|-----------|--------|------|----------|
| 0-4 hours | Lithium-ion (LFP) | Mature, deployed at scale | $192/kWh installed | Peak shaving, frequency regulation |
| 4-8 hours | Lithium-ion (larger) | Deployable but expensive | $250-350/kWh | Extended peak, duck curve |
| 8-24 hours | Iron-sodium, zinc, flow | Emerging, pilot stage | $150-300/kWh (projected) | Multi-day reliability |
| 24-100 hours | Iron-air, CAES | Early commercial | <$20/kWh target | Seasonal, week-long events |
| 100+ hours | Iron-air (Form Energy) | First commercial factory open | Target <$20/kWh | Multi-day grid backup |

**The problem:** 95%+ of installed storage is 4-hour lithium-ion. But the grid needs 8-24 hour
duration for reliability during extended weather events (heat waves, cold snaps, cloudy weeks).

**The emerging solutions:**

**Form Energy (Iron-Air):**
- First commercial factory: Weirton, West Virginia (operational)
- Technology: Literally rust -- iron plates breathe oxygen to store/release energy
- Duration: 100+ hours (vs 4 hours for lithium-ion)
- Target cost: <$20/kWh (vs $192/kWh for lithium-ion)
- Major deal: Google signed for 300 MW / 30 GWh system in Pine Island, Minnesota
- California project: 5 MW / 500 MWh at a PG&E substation in Mendocino County
- Earthshot Prize 2025 Finalist
- First grid-connected iron-air battery: Ore Energy in Netherlands (Aug 2025)

Source: Form Energy, California Energy Commission, Google/Xcel Energy

**Chart recommendation (data-to-viz.com):** Grouped bar chart (Comparison) showing duration
vs cost for each technology.

---

## 2.4 The Funding and Policy Crisis

### IRA Tax Credits: The Clock Is Ticking

| Policy Element | Detail |
|---------------|--------|
| ITC for storage (construction start before Jun 16, 2025) | 30% base credit |
| ITC (construction start Jun 16 - Dec 31, 2025) | 45% credit |
| ITC (construction during 2026) | 50% credit |
| Low-income community bonus | +10 percentage points |
| Affordable housing bonus | +20 percentage points |
| Domestic content requirement (2025) | 45% US-manufactured |
| Domestic content requirement (2026) | 50% US-manufactured |
| Domestic content requirement (2027+) | 55% US-manufactured |
| FEOC restrictions (post-2026) | Cannot use foreign entity of concern components |

Source: IRS Section 48E, One Big Beautiful Bill Act (July 2025)

**The catch:** The One Big Beautiful Bill Act (OBBBA), signed July 4, 2025, imposes significant
phase-outs and restrictions on IRA clean energy credits. Projects that do not start construction
by end of 2025 face much tougher rules.

### The Deloitte Numbers

| Metric | Number |
|--------|--------|
| Total investment needed (2025-2030) | $1.4 TRILLION |
| Equivalent to previous spending | 12 YEARS worth |
| Battery storage at risk of losing credits | 83% |
| Debt financing drop (2024) | -30% to $11.4B |

Source: Deloitte 2025 Renewable Energy Outlook

### The Domestic Manufacturing Challenge

| Metric | Number |
|--------|--------|
| US cell value sourced domestically | <30% |
| Cell assigned cost percentage (new rule) | 52% (up from 38%) |
| Clean manufacturing investment since IRA | $2.5B/quarter -> $14B/quarter |
| New manufacturing facilities announced since IRA | 380 |

Source: Clean Investment Monitor, IRS Domestic Content Guidance Jan 2025

**What this means:** A standalone battery storage facility using foreign cells CANNOT qualify
for the domestic content bonus. This effectively requires US-made cells -- but China makes
98% of all LFP cells. The supply chain does not exist yet domestically at scale.

---

## 2.5 China Dominates the Supply Chain

| Metric | China Share |
|--------|------------|
| Global battery manufacturing (all types) | 80%+ |
| Global EV battery installations | 68.9% |
| LFP cathode material production | 98%+ |
| LFP battery cell production | 94-98% |
| Global clean energy investment (2025) | $800B (vs ~$300B US) |

Source: IEA, Carbon Credits, BloombergNEF

**Key players:**
- **CATL** -- world largest battery manufacturer, ~37% global market share
- **BYD** -- #2 globally, vertically integrated (makes cells, packs, cars, buses)
- Both are Chinese companies with no major US manufacturing (yet)

**The strategic risk:** US clean energy transition depends on Chinese supply chains. IRA
domestic content rules are trying to change this, but it takes years to build factories.
380 facilities announced but most not yet operational.

**Chart recommendation (data-to-viz.com):** Pie chart or treemap (Part of a Whole) showing
China vs rest of world in battery manufacturing.

---

## 2.6 Safety Concerns (Acknowledge, Do Not Hide)

Greg will respect you more for addressing this honestly.

| Metric | Number |
|--------|--------|
| BESS fire rate (2024) | 0.3% of projects |
| Failure rate improvement (2018-2024) | 98% reduction |
| Grid storage deployment growth (2018-2024) | 3,000%+ |
| Fire frequency trend | Not increasing despite 20x more batteries |

**Notable 2024-2025 incidents:**
- **Moss Landing, CA (Jan 2025):** Fire at Phase 1 (300 MW / 1,200 MWh) of world largest
  BESS. 1,200 residents evacuated for 24 hours. NMC chemistry -- older generation.
- **Gateway, San Diego (May 2024):** BESS fire with flare-ups for 7 days. NMC chemistry.

**Key context:** Nearly half of incidents occur in first 6 months (manufacturing/installation
defects). Most involve older NMC chemistry, not newer LFP. The industry-wide shift to LFP
significantly reduces fire risk.

Source: EPRI BESS Failure Incident Database, CESA

---

## 2.7 Revenue Model Reality Check

For the 'what should we build' part of the pitch:

| Revenue Stream | What It Is | 2023 ERCOT | 2025 ERCOT | Trend |
|---------------|-----------|------------|------------|-------|
| Ancillary services | Grid stability payments | 85% of revenue | ~40% | Crashing (saturated) |
| Energy arbitrage | Buy cheap, sell expensive | 15% of revenue | ~60% | Growing (now primary) |
| Capacity market | Get paid to exist (be available) | Varies | Varies | Stable |
| Avg annual revenue/kWh | -- | $149/kWh | $17/kWh | -89% |
| Avg revenue/kW-year | -- | $192/kW | $43/kW | -78% |

Source: Modo Energy, pv magazine

**What this means for our pitch:** Battery owners are making MUCH less money than expected.
Revenue has fallen 89% in two years in Texas. This creates an opportunity for optimization
software -- the winners will be the operators who squeeze the most revenue out of every
charge/discharge cycle.

**The key insight for Greg:** 'The hardware is cheap. The margins are thin. The value is in
the SOFTWARE that operates these batteries smartly.'

---

# PART 3: RESOLUTION -- 'What Should We Build?'

## 3.1 The Mega-Projects Proving It Works

| Project | Location | Capacity | Technology | Status |
|---------|----------|----------|-----------|--------|
| Moss Landing | Monterey, CA | 750 MW / 3 GWh | Li-ion (NMC) | Phase 1 fire Jan 2025, Phases 2-3 operational |
| Edwards & Sanborn | Kern County, CA | 875 MW / 3.5 GWh | Li-ion | World largest operating BESS |
| Google Iron-Air | Pine Island, MN | 300 MW / 30 GWh | Iron-air (Form Energy) | Under development |
| Crimson Storage | Riverside, CA | 350 MW / 1,400 MWh | Li-ion (LFP) | Operational |
| Manatee Energy Storage | Parrish, FL | 409 MW / 900 MWh | Li-ion | FPL flagship |

Source: Energy-Storage.News, Vistra, NextEra

---

## 3.2 The Gap Analysis: What We Have vs What We Need

| Metric | Where We Are (2025) | Need by 2030 | Gap |
|--------|--------------------|--------------|----|
| Installed battery storage | ~45 GW | 187 GW | 142 GW short |
| Queue clearance rate | ~42 GW/year | 200+ GW/year | 5x faster |
| Standard duration | 4 hours | 8-24 hours | 4-6x longer |
| Long-duration storage | <1 GW | 50+ GW | Nearly zero today |
| Domestic cell manufacturing | <30% of demand | 55%+ (2027 req) | 25+ pct points |
| Grid transmission investment | Current levels | $1.4T by 2030 | Trillions needed |
| Storage jobs | ~90,000 | 200,000+ | 110,000 new jobs |

---

## 3.3 The Jobs Story (For the Pursuit Angle)

**Clean energy jobs grew 3x faster than the rest of the US economy in 2024.**

| Metric | Number |
|--------|--------|
| Total clean energy jobs (2024) | 3.5 million |
| New clean energy jobs added (2024) | ~100,000 |
| Clean energy job growth rate | 2.8% (vs 0.8% overall economy) |
| Clean storage jobs specifically | 89,592 |
| Battery storage jobs (of storage total) | 75,702 (84%) |
| Storage job growth since 2018 | +17% |
| Construction jobs in clean energy | 1.6 million (45% of total) |
| Solar construction jobs | 181,700 |
| Wind construction jobs | 43,800 |
| Median wage (transmission/distribution/storage) | $59,840 |
| BLS #1 fastest growing job | Wind turbine technician (+60%) |
| BLS #2 fastest growing job | Solar installer (+48%) |

Source: DOE 2025 US Energy & Employment Report (USEER), E2 Clean Jobs America, BLS

**The Pursuit angle:** These are accessible careers. Construction and installation make up 45%
of the workforce -- no 4-year degree required. Median wage is nearly $60K. The two fastest
growing jobs in America are BOTH in renewable energy.

**Chart recommendation (data-to-viz.com):** Horizontal bar chart (Ranking) for BLS job
growth, or stacked bar (Part of a Whole) for job type breakdown.

---

## 3.4 The Market Opportunity

| Market Segment | 2024 Size | 2030 Projected | CAGR |
|---------------|-----------|----------------|------|
| Global BESS market | $37.56B | $105.96B | ~19% |
| US BESS market | $10.03B | $19.87B | ~12% |
| Grid services (frequency, backup) | $18.7B | -- | -- |
| Battery optimization software | $4.2B | -- | Growing fast |
| Long-duration energy storage | ~$1B | $12B | ~50% |
| Virtual power plants | $5.6B | -- | -- |

Source: Grand View Research, BloombergNEF

---

## 3.5 The Two-Phase Pitch for Greg

### Phase 1: 'Optimize what is already plugged in' (Build in 2-3 months)

**Problem:** 45 GW of batteries are connected but operators are earning 89% less revenue
than 2 years ago. The hardware works -- the optimization does not.

**Solution:** Battery optimization platform that:
- Monitors real-time electricity prices across markets (ERCOT, CAISO, PJM)
- Predicts peak pricing windows using weather + demand data
- Automatically schedules charge/discharge cycles for maximum revenue
- Dashboard showing savings vs baseline

**Market:** $4.2B battery optimization software market, growing as more batteries come online

**Revenue model:** SaaS fee per MW managed, or % of revenue improvement

### Phase 2: 'Help projects get through the queue' (Build in 6-12 months)

**Problem:** 10,300 projects (2,300 GW) are stuck. Only 13% ever make it. The process is
opaque, fragmented across 50+ grid operators.

**Solution:** Interconnection tracking and compliance platform that:
- Tracks project status across all US grid operators
- Automates regulatory filings and compliance documents
- Provides estimated timelines based on historical data
- Flags at-risk projects before they withdraw

**Market:** $18.7B grid services market + consulting

**The pitch line for Greg:** 'The battery revolution already happened -- costs dropped 93%.
But 77% of projects die waiting in line. Phase 1 makes existing batteries earn more. Phase 2
gets the next 2,300 GW connected.'

---

# PART 4: DATA STORYTELLING ELEMENTS

## 4.1 Setup-Conflict-Resolution Script (2 Minutes)

**SETUP (30 seconds):**
'Battery costs fell 93% in 14 years -- from $2,571 per kilowatt-hour to $192. The US went
from 1.5 gigawatts of storage in 2020 to 26 gigawatts in 2024 -- a 17x increase. In 2025,
battery plus solar make up 81% of all new power capacity in America. The technology
revolution already happened.'

**CONFLICT (60 seconds):**
'But here is the problem. 2,300 gigawatts of clean energy projects are stuck in a queue
waiting to connect to the grid -- that is twice the entire current US power capacity. Only
13% of projects ever make it through. 77% give up. Median wait time: over 4 years.
Meanwhile, California threw away 3.4 million megawatt-hours of clean solar energy last year
because the grid could not store it. The tech works. The system does not.'

**RESOLUTION (30 seconds):**
'This creates two clear opportunities. One: optimize the 45 gigawatts already connected --
operators saw revenue drop 89% in two years, and the ones with smart software will survive.
Two: build the tools to get the 2,300 gigawatts unstuck. The battery optimization market
alone is $4.2 billion. And we are talking about an industry where the two fastest growing
jobs in America -- wind tech and solar installer -- do not require a degree.'

## 4.2 Recommended 5-Chart Lineup for Saturday

| # | Chart | Type (data-to-viz.com) | Data | Speaker |
|---|-------|----------------------|------|---------|
| 1 | Battery cost decline 2010-2024 | Line chart (Numeric -> Evolution) | IRENA cost data | Ismael (Setup) |
| 2 | US deployment growth with CA/TX | Stacked area (Numeric -> Evolution) | EIA capacity data | Kevin (Setup) |
| 3 | Queue backlog: installed vs waiting | Side-by-side bar (Comparison) | Berkeley Lab | Juan (Conflict) |
| 4 | Duck curve / curtailment trend | Area chart (Numeric -> Evolution) | CAISO data | Kevin (Conflict) |
| 5 | Revenue decline + opportunity | Dual-axis chart (Correlation) | Modo Energy | Ismael (Resolution) |

## 4.3 Killer Stats for Slides (Pick 10)

1. **93%** -- battery cost decline since 2010 (IRENA)
2. **2,300 GW** -- stuck in the interconnection queue (Berkeley Lab)
3. **13%** -- projects that actually make it through the queue (Berkeley Lab)
4. **77%** -- projects that withdrew / gave up (Berkeley Lab)
5. **3.4 million MWh** -- clean energy wasted in California in 2024 (EIA/CAISO)
6. **70x** -- Texas battery growth in 5 years: 200 MW -> 13,900 MW (Modo Energy)
7. **89%** -- revenue decline for ERCOT battery operators 2023-2025 (Modo Energy)
8. **98%** -- China share of LFP cathode material production (IEA)
9. **$1.4 trillion** -- investment needed by 2030 (Deloitte)
10. **3.5 million** -- clean energy jobs, growing 3x faster than economy (DOE)
11. **$192/kWh** -- current installed cost, was $2,571 in 2010 (IRENA)
12. **<$20/kWh** -- target cost for iron-air (100+ hour) storage (Form Energy)

---

# PART 5: COMPLETE SOURCE TABLE

Every claim in this document with its source, for when Greg says 'back up the math.'

| # | Claim | Number | Source | Year |
|---|-------|--------|--------|------|
| 1 | Battery cost per kWh | $192 (down 93%) | IRENA Renewable Power Costs 2024 | 2024 |
| 2 | US installed battery capacity | 26 GW | EIA | 2024 |
| 3 | 2025 expected additions | 19.6 GW | EIA | 2025 |
| 4 | 2026 projected total | 64.9 GW | EIA | 2026 |
| 5 | Queue total capacity | 2,300 GW | Berkeley Lab Queued Up 2025 | 2024 |
| 6 | Queue storage | 890 GW | Berkeley Lab | 2024 |
| 7 | Active projects in queue | ~10,300 | Berkeley Lab | 2024 |
| 8 | Median wait time | 4+ years | Berkeley Lab | 2018-2024 |
| 9 | Completion rate | 13% | Berkeley Lab | 2024 |
| 10 | Withdrawal rate | 77% | Berkeley Lab | 2024 |
| 11 | CA battery capacity | 12.5 GW | EIA / CAISO | Jan 2025 |
| 12 | TX battery capacity (end 2025) | 13.9 GW | Modo Energy | 2025 |
| 13 | TX growth from 2020 | 200 MW -> 13,900 MW | Modo Energy | 2020-2025 |
| 14 | CAISO curtailment 2024 | 3.4 million MWh | EIA | 2024 |
| 15 | Solar share of curtailment | 93% | EIA | 2024 |
| 16 | LFP market share (utility) | 85% | IRENA / BloombergNEF | 2024 |
| 17 | LFP cell cost | ~$60/kWh (BYD $44) | BloombergNEF | 2025 |
| 18 | China battery mfg share | 80%+ | IEA | 2025 |
| 19 | China LFP cathode production | 98%+ | IEA | 2025 |
| 20 | BESS fire rate | 0.3% | EPRI | 2024 |
| 21 | Fire rate improvement | 98% decline | EPRI | 2024 |
| 22 | Round-trip efficiency (LFP) | 90-95% | NREL / IRENA | 2025 |
| 23 | Cycle life (LFP) | 3,000-7,000 | NREL | 2025 |
| 24 | Investment needed 2025-2030 | $1.4 trillion | Deloitte | 2025 |
| 25 | Tax credit risk | 83% of planned | Deloitte | 2025 |
| 26 | ERCOT revenue decline | $149 -> $17/kWh | Modo Energy | 2023-2025 |
| 27 | Clean energy jobs | 3.5 million | DOE USEER 2025 | 2024 |
| 28 | Job growth rate | 2.8% vs 0.8% | DOE / E2 | 2024 |
| 29 | Battery storage jobs | 75,702 | DOE USEER | 2023 |
| 30 | BLS #1 fastest growing | Wind tech +60% | BLS | 2025 |
| 31 | BLS #2 fastest growing | Solar installer +48% | BLS | 2025 |
| 32 | Median wage (T&D + storage) | $59,840 | DOE USEER | 2024 |
| 33 | Global BESS market 2024 | $37.56B | Grand View Research | 2024 |
| 34 | Global BESS market 2030 | $105.96B | Grand View Research | 2030 |
| 35 | ITC credit (pre-Jun 2025) | 30% | IRS Section 48E | 2025 |
| 36 | ITC credit (Jun-Dec 2025) | 45% | OBBBA | 2025 |
| 37 | ITC credit (2026) | 50% | OBBBA | 2026 |
| 38 | Domestic content req 2025 | 45% US-made | IRS | 2025 |
| 39 | Form Energy iron-air cost | <$20/kWh target | Form Energy | 2025 |
| 40 | Google iron-air deal | 300 MW / 30 GWh | Google / Xcel | 2026 |
| 41 | Edwards & Sanborn | 875 MW / 3.5 GWh | Energy-Storage.News | 2024 |
| 42 | Moss Landing | 750 MW / 3 GWh | Vistra | 2025 |
| 43 | NREL 2035 projection (mid) | $247/kWh | NREL | 2035 |
| 44 | NREL 2050 projection (mid) | $184/kWh | NREL | 2050 |
| 45 | Clean storage jobs | 89,592 | DOE USEER | 2023 |

---

Compiled by RRC for Group 7 -- Pursuit Cycle 3, February 2026
Last updated: February 25, 2026