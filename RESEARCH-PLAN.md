# Week 5-6: Financial Literacy & The US Consumer Credit Crisis
## Team: Juan, Ismael, Kevin

---

## The Story (Setup-Conflict-Resolution)

### SETUP: The American Dream Runs on Credit
- US household debt: **$18.8 trillion** (Q4 2025)
- Credit card debt alone: **$1.28 trillion** — highest ever recorded since tracking began in 1999
- Average household carrying **$11,019** in credit card balances
- 47% of Americans with credit card debt expect it to **increase** in 2026

### CONFLICT: Americans Don't Understand the System They Depend On
- Only **48%** of US adults are considered financially literate
- That rate hasn't moved in **8 years** — stuck at ~50%
- Financial illiteracy costs Americans **$243 billion annually** (~$1,015 per adult per year)
- The people who need financial knowledge most have the least access to it

### RESOLUTION: What Would Change If People Understood Credit?
- Data-backed policy recommendations
- Fintech solutions that educate instead of exploit
- The gap between predatory lending and financial literacy as an industry opportunity

---

## Key Data Points (By Category)

### 1. The Debt Picture
| Metric | Value | Source |
|--------|-------|--------|
| Total US household debt | $18.8 trillion | NY Fed Q4 2025 |
| Total credit card debt | $1.28 trillion | NY Fed Q4 2025 |
| Avg household CC balance | $11,019 | LendingTree Q3 2025 |
| Avg balance (unpaid only) | $7,886 | NerdWallet 2025 |
| Americans paying CC interest | $120 billion/year | CFPB |
| Overdraft/NSF fees collected | $17 billion/year | CFPB |

### 2. Financial Literacy Gaps
| Demographic | Literacy Rate | Gap |
|-------------|--------------|-----|
| Overall US adults | 48% | Baseline |
| Gen Z (18-29) | 38% | -10 pts |
| Millennials (29-44) | 46% | -2 pts |
| Gen X (45-60) | 51% | +3 pts |
| Boomers (61+) | 55% | +7 pts |
| Men | 53% | +5 pts |
| Women | 43% | -5 pts |
| White Americans | 53% | +5 pts |
| Asian Americans | 53% | +5 pts |
| Hispanic Americans | 43% | -5 pts |
| Black Americans | 38% | -10 pts |
| Income $100K+ | 58% | +10 pts |
| Income <$25K | 25% | -23 pts |
| College degree | 63% | +15 pts |
| No HS diploma | 30% | -18 pts |

### 3. Credit Score Disparities
| Community Type | Median Score (Ages 25-29) |
|---------------|--------------------------|
| Majority-White | 687 |
| Majority-Hispanic | 644 |
| Majority-Black | 582 |

- Black/Hispanic/Native communities: **1.5x** the rate of subprime scores vs white communities
- Black Americans unbanked rate: **14%** (highest of any demographic)
- 40% of Black Americans have **no personal credit cards** (vs 21% white, 26% Hispanic)

### 4. Predatory Lending (The Exploitation Layer)
| Metric | Value |
|--------|-------|
| Payday loan fees drained annually | $2.4 billion |
| Loans issued in one year | 20 million (~$8.6 billion) |
| Americans using payday loans/year | 12 million |
| Payday revenue from repeat borrowers | 75% |
| Loans rolled into new loans before payoff | 80%+ |
| BNPL growth rate | 20% annually |
| Top payday state: Texas fees | $1.3 billion/year |

### 5. The Cost of Not Knowing
| Year | Avg cost per adult | National total |
|------|-------------------|----------------|
| 2020 | $1,634 | ~$400B+ |
| 2021 | $1,389 | ~$340B+ |
| 2022 | $1,819 | ~$450B+ |
| 2023 | $1,506 | ~$370B+ |
| 2024 | $1,015 | $243 billion |

---

## Data Sources (Public Datasets for SQL/Python Work)

### Primary Sources
1. **Federal Reserve Bank of NY** — Household Debt & Credit Report (quarterly, downloadable)
   - https://www.newyorkfed.org/microeconomics/hhdc
2. **FRED (St. Louis Fed)** — Credit card delinquency rates, interest rates, consumer credit
   - https://fred.stlouisfed.org/series/DRCCLACBS
3. **CFPB Complaint Database** — 4M+ consumer complaints about financial products
   - https://www.consumerfinance.gov/data-research/consumer-complaints/
4. **Census Bureau / American Community Survey** — Income, education, demographics by geography
5. **FINRA Foundation** — National Financial Capability Study (survey data by state/demographic)

### Supporting Sources
- LendingTree, NerdWallet, WalletHub, Bankrate (aggregated consumer data)
- Center for Responsible Lending (payday loan research)
- National Financial Educators Council (financial literacy cost surveys)
- Urban Institute (credit score trajectory research)

---

## Division of Labor (Suggested)

| Person | Research Focus | Deliverable |
|--------|---------------|-------------|
| **Ismael** | Credit score disparities + predatory lending data | Visualizations showing demographic gaps + predatory lending cycle |
| **Juan** | Debt statistics + delinquency trends | Visualizations showing debt growth over time + delinquency by income |
| **Kevin** | Financial literacy rates + cost of illiteracy | Visualizations showing literacy gaps + dollar cost correlation |
| **All three** | Data storytelling + Setup-Conflict-Resolution narrative | Final presentation |

---

## Timeline (Aligned with Cycle 3 Schedule)

| Day | Activity | What to Prepare |
|-----|----------|----------------|
| **Saturday** | Industry discovery + landscape mapping | Come with this research doc. Map the credit/fintech landscape on paper. |
| **Sunday** | SQL + Python basics, whiteboard challenge | Write queries against CFPB complaint data or FRED data |
| **Monday** | Data analysis + cross-group validation | Have 3-5 key insights with supporting data |
| **Tuesday** | Data visualization (sketch then build) | Paper sketches of charts first, then build in Python/tool |
| **Wednesday** | Data storytelling presentation | Setup-Conflict-Resolution narrative with visualizations |

---

## Sources

- [NY Fed Household Debt Report](https://www.newyorkfed.org/microeconomics/hhdc)
- [FRED Credit Card Delinquency](https://fred.stlouisfed.org/series/DRCCLACBS)
- [LendingTree 2026 Credit Card Debt Statistics](https://www.lendingtree.com/credit-cards/study/credit-card-debt-statistics/)
- [NerdWallet 2025 Household Debt Study](https://www.nerdwallet.com/credit-cards/studies/household-debt-study)
- [WalletHub Financial Literacy Statistics](https://wallethub.com/edu/b/financial-literacy-statistics/25534)
- [Moneyzine Financial Literacy Demographics](https://moneyzine.com/personal-finance/financial-literacy-statistics/)
- [NFEC Financial Illiteracy Costs](https://www.financialeducatorscouncil.org/financial-illiteracy-costs/)
- [Urban Institute Credit Trajectories by Race](https://www.urban.org/urban-wire/young-adults-credit-trajectories-vary-widely-race-and-ethnicity)
- [Center for Responsible Lending Payday Report](https://www.responsiblelending.org/research-publication/down-drain-payday-lenders-take-24-billion-fees-borrowers-year)
- [Bankrate Credit Cards by Race](https://www.bankrate.com/credit-cards/news/credit-cards-and-race-statistics/)
- [CNBC NY Fed Credit Card Debt](https://www.cnbc.com/2026/02/10/new-york-fed-credit-card-debt-tops-1point28-trillion.html)
- [BadCredit.org Credit Score by Race](https://www.badcredit.org/studies/average-credit-score-race/)
