# Data Visualization Guide - data-to-viz.com
## For Ismael and Kevin - Group 7

---

## What is data-to-viz.com?

A decision tree for choosing visualizations. You pick your
data type, it tells you the chart. Greg uses it as a rubric.
If your charts follow this sites logic, you are solid.

Site: https://data-to-viz.com

---

## The 6 Data Categories

| Category | What It Means | Chart Types |
|----------|--------------|-------------|
| Numeric | Continuous numbers | Histogram, density, boxplot, violin |
| Categoric | Groups/labels | Bar chart, treemap, lollipop |
| Num + Cat | Numbers split by group | Grouped bar, heatmap, ridgeline |
| Time Series | Data over time | Line, area, streamgraph |
| Maps | Geospatial data | Choropleth, bubble map, hex map |
| Network | Connections/flows | Sankey, chord diagram, arc diagram |

---

## Mapping Our Storage Data to Charts

| Data Point | Category | Best Chart | Why |
|-----------|----------|-----------|-----|
| Battery cost 2010-2024 | Time Series | Line chart | Shows the 93% drop as a trend |
| Top 5 states by capacity | Categoric | Horizontal bar | Ranking story, biggest on top |
| 26 GW vs 187 GW (have vs need) | Num + Cat | Grouped bar | Side-by-side comparison |
| Queue breakdown by type | Categoric | Stacked bar or treemap | Part-of-whole story |
| Storage growth 2020-2025 | Time Series | Area chart | Shows acceleration |
| Cost vs capacity by state | Numeric | Scatter plot | Reveals correlation |
| Investment flow | Network | Sankey diagram | Shows where money goes |
| Funding gap waterfall | Num + Cat | Waterfall chart | What we have, what we need, the gap |

---

## The 5 Analysis Patterns (From Monday Night)

These map directly to chart types:

### 1. Trends Over Time (Ismael studied this)
Question: How did battery costs change?
Chart: Line chart
Data: ,571/kWh (2010) to 92/kWh (2024)
Insight: 93% drop, steepest decline 2020-2024

### 2. Comparisons
Question: How does installed capacity compare to what we need?
Chart: Grouped bar or bullet chart
Data: 26 GW installed vs 187 GW needed by 2030
Insight: We are at 14% of where we need to be

### 3. Distribution
Question: How is battery storage spread across states?
Chart: Choropleth map or histogram
Data: CA 12.5 GW, TX 8 GW, everyone else under 2 GW
Insight: 78% concentrated in 2 states

### 4. Correlations
Question: Do states with more investment have more storage?
Chart: Scatter plot with trend line
Data: State-level investment vs installed GW
Insight: Strong positive correlation, but outliers exist

### 5. Segmentation
Question: What happens when you break the queue by project type?
Chart: Stacked bar or treemap
Data: 890 GW storage, 956 GW solar, 271 GW wind in queue
Insight: Storage is the fastest growing segment in the queue

---

## Caveats from data-to-viz.com (Greg Checks These)

Critical rules:

1. ORDER YOUR DATA - Sort bars by value, not alphabetically
2. NO PIE CHARTS - Human eyes are bad at reading angles
3. NO 3D - Distorts values, looks amateur
4. NO DUAL AXES - data-to-viz calls this "a way to manipulate"
5. START Y-AXIS AT ZERO - Cutting it exaggerates differences
6. NO SPAGHETTI - Max 3-4 lines per line chart
7. NO RAINBOW COLORS - Use sequential or diverging palettes
8. ANNOTATE THE INSIGHT - Put the key number on the chart
9. NORMALIZE FOR MAPS - Raw numbers on maps just show population
10. REMOVE CLUTTER - Every element should earn its place

---

## Presentation Formula

For each chart on Saturday:

"This visualization shows [WHAT THE DATA IS]."
"The key insight is [THE ONE THING TO NOTICE]."
"This matters for our pitch because [BUSINESS IMPACT]."
"The data comes from [SOURCE] — here is the link."

Greg said: "make sure you can back up the math."
Every chart needs a source citation.

---

## Recommended Tools

| Tool | Best For | Difficulty |
|------|---------|-----------|
| matplotlib (Python) | Full control, reproducible | Medium |
| Google Sheets | Quick charts, collaborative | Easy |
| Tableau Public | Interactive, polished | Medium |
| Observable | Notebook-style, shareable | Medium |
| Gamma | AI-generated slides with charts | Easy |

For Saturday: use whatever gets it done fastest.
Polish matters less than having real data with real sources.

---

## Saturday Pitch - Chart Lineup

Recommended 5 charts for the presentation:

1. SETUP: Line chart - Battery cost collapse 2010-2024
   (Source: IRENA)

2. SETUP: Horizontal bar - Top states by storage capacity
   (Source: EIA)

3. CONFLICT: Grouped bar - 26 GW installed vs 187 GW needed
   (Source: EIA + IRENA)

4. CONFLICT: Annotated stat - 2,600 GW stuck in queue
   (Source: Berkeley Lab)

5. RESOLUTION: Waterfall or funnel - Phase 1 optimize existing
   then Phase 2 tackle the queue

Each chart = one slide. Each slide = one story.
Annotate the insight directly on the chart.

---

Compiled by RRC for Ismael and Kevin -- Pursuit Cycle 3, February 2026