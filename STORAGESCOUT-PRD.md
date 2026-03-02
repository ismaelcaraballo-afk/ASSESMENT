# StorageScout PRD — Product Requirements Document
## Real-Time Carbon Intelligence for Battery Storage Decision-Making

---

## The Insight

The U.S. installed 26 GW of battery storage by 2024 — a 490% increase in three years — yet California alone threw away 3.4 million MWh of clean energy that same year because storage couldn't capture it. Battery costs fell 93% since 2010. The IRA committed $369 billion. 2,300 GW of projects are approved and funded but stuck in a 5-year permitting queue. The data is clear: the technology works, the money is there, but nobody can see the full picture fast enough to act on it.

---

## The Problem

The data needed to make smart battery storage decisions is buried across dozens of government sources — EIA for capacity, NREL for costs, CAISO for curtailment, EPA eGRID for emissions, BloombergNEF for investment. No single tool connects storage deployment to energy waste to carbon impact in real time. Grid operators, state planners, investors, and policymakers are making billion-dollar decisions with fragmented, stale data. Meanwhile, the grid's carbon intensity changes every 5 minutes — and nobody building or buying storage can see that signal.

---

## The Solution

**StorageScout** — an interactive, real-time data dashboard that answers three questions:

1. **Where are we?** — How much storage is built, how much energy is wasted, how fast are we growing?
2. **What's happening right now?** — How clean or dirty is the grid at this moment? Where is carbon intensity highest?
3. **What happens if we go faster?** — If we double deployment, what's the impact on emissions and curtailment?

StorageScout is a single-page web application. No login. No backend. No paywall. Open it, pick a state, see the story.

**Live at:** https://ismaelcaraballo-afk.github.io/storagescout/

---

## Core Features

### Feature 1: Interactive Storage Dashboard (Built — Live Now)
What the user sees: 6 interactive charts showing U.S. battery storage capacity growth, the emissions gap, top states, cost comparison, and a state-by-state explorer with dropdown.

Data sources: EIA, NREL, CAISO, IRENA, BloombergNEF.

Why it matters: This is the foundation — the "where are we" view. Every chart maps to a piece of the core insight. The capacity chart shows the 490% growth. The Gap chart shows storage growing while emissions barely move. The state explorer shows California's 3.4M MWh of wasted energy. The cost chart proves batteries are cheaper than fossil fuels.

### Feature 2: What-If Simulator (Built — Live Now)
What the user sees: A slider that lets you control the speed of battery deployment (1x to 2x). As you drag it, the emissions projection updates in real time.

Why it matters: This is the core feature — the one thing that makes StorageScout a tool instead of a report. Static data tells you what IS. The simulator lets you see what COULD BE. A planner can drag the slider and say "if we approve these projects, here's the impact." An investor can see the market opportunity. A policymaker can see the cost of inaction. The user controls the output — that's what makes it a product.

### Feature 3: Live Carbon Intensity Tracker (New — Building This Week)
What the user sees: A new section showing the real-time carbon intensity of the U.S. power grid. A dial or gauge showing if the grid is clean or dirty RIGHT NOW. For California (CAISO), a detailed marginal emissions readout in lbs CO2/MWh updated every 5 minutes. A "best time to use energy" indicator showing when the grid is cleanest today.

Data sources: WattTime API (free tier — real-time marginal emissions for CAISO, index for all regions), Electricity Maps API (free tier — carbon intensity level for all zones).

Why it matters: This connects StorageScout's historical analysis to the present moment. The existing dashboard shows you the problem over time. The live tracker shows you the problem happening RIGHT NOW. When the grid is dirty (high carbon intensity), that's the exact moment stored clean energy should be discharging. When it's clean (low intensity), that's when batteries should charge. This feature makes the storage argument visceral — you're watching carbon emissions fluctuate in real time, and the answer (more storage) is sitting right next to it on the same screen.

Connection to the simulator: "Right now the grid is emitting X lbs CO2/MWh. If storage deployment was 2x, it would be Y." The live data feeds directly into the What-If projection.

---

## Connection to Insight

Every feature traces back to the original data insight:

| Insight | Feature | How It Connects |
|---------|---------|----------------|
| 26 GW installed, 490% growth | Capacity bar chart | You see the acceleration year over year |
| 3.4M MWh wasted in California | State explorer + curtailment data | Pick California from the dropdown, see the waste |
| 93% cost decline | Cost comparison chart | Solar $43, Wind $34, Battery $65, Gas $77, Coal $68 |
| 2,300 GW stuck in queue (88:1 ratio) | Stats bar + Gap chart | The gap between what's built and what's waiting |
| Storage grows 2,067% but emissions drop only 10% | The Gap dual-axis chart | Two lines diverging — that IS the problem |
| "What if we deploy faster?" | What-If Simulator | Drag the slider, watch emissions drop |
| Grid carbon changes every 5 minutes | Live Carbon Tracker (new) | Real-time proof that the problem is happening NOW |

The through-line: **Our data uncovered a visibility problem, so we built a visibility tool.** The insight said the data exists but nobody's connecting it. StorageScout connects it. The live carbon tracker extends that from "what happened" to "what's happening right now."

---

## User Personas

| Persona | What They Use StorageScout For |
|---------|-------------------------------|
| **State energy planner** | "Show me my state's storage vs. curtailment. What happens if I approve 3 more projects?" |
| **Clean energy investor** | "Where's the biggest gap between renewable generation and storage? That's where the money goes." |
| **Policy advocate** | "The grid is dirty right now. Here's what 2x storage would do. Here's the bill that's blocking it." |
| **Pursuit student (us)** | "Here's a real product built on real data that solves a real problem." |

---

## Technical Architecture

```
StorageScout (single HTML page, ~35KB)
├── Chart.js — all interactive charts
├── Vanilla JavaScript — state explorer, simulator, API calls
├── CSS — dark theme, responsive
├── WattTime API — real-time marginal emissions (CAISO free, index all regions)
├── Electricity Maps API — carbon intensity level (free for all zones)
└── Static data — EIA, NREL, CAISO, IRENA (embedded in JS, updated manually)
```

No backend. No database. No login. No dependencies beyond Chart.js.
Hosted free on GitHub Pages.

---

## Scope — What We're Building This Week

| Task | Status | Owner |
|------|--------|-------|
| Existing dashboard (6 charts + state explorer + simulator) | Done | Ismael |
| Sign up for WattTime free API key | To Do | Kevin |
| Sign up for Electricity Maps free API key | To Do | Kevin |
| Build Live Carbon Intensity section (gauge + CAISO detail) | To Do | Ismael + Kevin |
| Connect live data to What-If simulator | To Do | Ismael |
| Update presentation script for new feature | To Do | Juan |
| Test and deploy to GitHub Pages | To Do | All |

---

## What We're NOT Building (Out of Scope)

- Carbon dispatch optimization (tells operators when to charge/discharge) — Phase 2
- Carbon ROI verification (certify avoided emissions for trading) — Phase 3
- User accounts, login, saved preferences — unnecessary for MVP
- Backend/database — all client-side
- Mobile app — responsive web is sufficient

---

## Success Metrics

For a class project, success means:
1. The live carbon tracker updates in real time on the deployed site
2. The audience can see the grid's current carbon intensity during the presentation
3. The What-If simulator connects to live data ("right now it's X, with 2x storage it would be Y")
4. Greg understands it without us explaining it twice
