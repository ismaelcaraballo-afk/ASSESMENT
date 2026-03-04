# Carbon Physics Model Validation Analysis

## Multi-LLM Review Summary (GPT-4o + Claude 2)

### Overall Assessment: ⭐⭐ (2/5 stars) — Needs Validation

The models identified critical physics gaps that block production deployment. While the model structure is sound, assumptions lack real-world validation.

---

## Critical Findings

### 1. **Solar Dispatch Adjustment (CONCERN: HIGH)**

**Current Implementation:**
```typescript
const solarBoost = isDay ? Math.min(solarRadiation / 800, 1.0) : 0;
const solarIncrease = mix.solar * solarBoost * 0.6; // up to 60% boost
```

**LLM Assessment:**
- **GPT-4o:** "60% boost when solar hits 800 W/m² is unsupported. CAISO data shows 40-50% actual solar displacement in summer peaks."
- **Claude 2:** "Model assumes linear displacement matching. Reality: grid curtails solar before market price goes negative. Non-linear behavior unaccounted."

**Required Validation:**
- [ ] Cross-reference CAISO 2023 hourly solar displacement data from OASIS portal
- [ ] Validate against CEC (California Energy Commission) supply curve data
- [ ] Check if 800 W/m² = 100% utility-scale solar curtailment (likely too optimistic)

**Risk:** Overestimating solar impact → Battery charge recommendations too aggressive

---

### 2. **Peak Evening Demand Multiplier (CONCERN: HIGH)**

**Current Implementation:**
```typescript
const isPeakEvening = hourOfDay >= 17 && hourOfDay <= 21;
const peakMultiplier = isPeakEvening ? 1.12 : isNightValley ? 0.88 : 1.0;
```

**LLM Assessment:**
- **GPT-4o:** "Fixed +12% for 5-9pm is oversimplified. CAISO peak swings 8-18% based on season, temperature, daylight savings."
- **Claude 2:** "Winter vs summer peak timing differs by ~1 hour. Model doesn't account for season-dependent dispatch profiles."

**Required Validation:**
- [ ] Pull CAISO hourly demand profiles by season (summer vs winter vs shoulder)
- [ ] Validate peak window: Is 5-9pm correct year-round? (Likely shifts 4-8pm in winter)
- [ ] Validation range: Confirm ±12% vs EIA actual peak variance (3-25% depending on weather)

**Risk:** Wrong charging window recommendations in winter/shoulder seasons

---

### 3. **Temperature Factor (CONCERN: MEDIUM-HIGH)**

**Current Implementation:**
```typescript
const tempFactor = tempC > 32 ? 1.08 : tempC < 0 ? 1.06 : 1.0;
```

**LLM Assessment:**
- **GPT-4o:** "Linear 6-8% bump is reasonable starting point, but actual CAISO data shows 10-15% AC load increase above 32°C (humidity effect missing)."
- **Claude 2:** "Threshold at exactly 32°C (90°F) is too precise. Real demand ramps starting ~28°C (82°F). Missing wet-bulb temperature (humidity × temp)."

**Required Validation:**
- [ ] EIA CAISO load sensitivity: Confirm 8% increase per °F above 32°C vs actual coefficients
- [ ] Add humidity adjustment (wet-bulb proxy): tempC adjusted by 0.04 × relativeHumidity_pct
- [ ] Test with August 2023 heatwave data (CA ISO recorded 15% demand spikes)

**Risk:** Underestimating carbon during heat waves

---

### 4. **Gas Offset Ratio (CONCERN: MEDIUM)**

**Current Implementation:**
```typescript
const adjustedGas = Math.max(0, mix.gas - solarIncrease * 0.8);
```

**LLM Assessment:**
- **GPT-4o:** "80% gas reduction when solar increases is plausible, but assumes all displaced generation is gas. Reality: coal/hydro displace first at CAISO."
- **Claude 2:** "CAISO priority order: 1) Hydro (if available), 2) Wind, 3) Solar, 4) Nuclear. Gas reduces last. Your 0.8 multiplier may be too aggressive for coal-heavy grids."

**Required Validation:**
- [ ] Check CAISO vs regional differences (Western Interconnect has more hydro than ERCOT)
- [ ] Verify CAISO's actual merit order (should displace wind/hydro, not gas directly)
- [ ] For other regions: Validate gas displacement ratio 0.6-0.8 zone by zone

**Risk:** Applies CAISO assumptions to all 10 regions incorrectly

---

### 5. **Emission Factors (CONCERN: MEDIUM)**

**Current Implementation:**
```typescript
const intensity = Object.entries(adjMix).reduce(
  (acc, [fuel, frac]) => acc + frac * EMISSION_FACTORS[fuel],
  0
);
```

**Issues Flagged:**
- **GPT-4o:** "EPA eGRID 2023 used? Is CAISO's 260 lbs CO₂/MWh baseline correct? (2023 actual was ~240 with record solar)?"
- **Claude 2:** "Weighted average is correct, but ensure mix fractions sum to 1.0 after adjustments. Your tempFactor × peakMultiplier may exceed bounds."

**Required Validation:**
- [ ] Confirm EPA eGRID 2023 CAISO baseline: Currently using 260? (Verify against published table)
- [ ] Validate mix fractions remain [0, 1] after all adjustments
- [ ] Check 2024 YTD actual CAISO carbon from WEIS portal vs model predictions

**Risk:** Baseline mismatch → All predictions off by constant factor

---

## Validation Roadmap

### Phase 1: Data Gathering (1-2 weeks)
1. Download CAISO OASIS hourly data (2023): demand, supply by fuel type, solar output
2. Get EIA Bulk Electric System data + NERC classifications for all 10 regions
3. Collect weather data: hourly temperature, irradiance, humidity from NOAA/NCEI

### Phase 2: Backtesting (1 week)
1. Run model predictions for July 2023 heatwave (known peak demand)
2. Compare predicted carbon intensity vs CAISO actual (from emissions portal)
3. Calculate MAE (Mean Absolute Error) — target: < 50 lbs CO₂/MWh

### Phase 3: Refinement (1-2 weeks)
1. Adjust multipliers based on backtest residuals
2. Add season-dependent logic (summer vs winter peak windows)
3. Implement region-specific emission factors + dispatch order

### Phase 4: Continuous Validation (Ongoing)
1. Weekly accuracy reports: Model vs actual
2. Seasonal rebalancing in Q1, Q3 transitions
3. Alert when error exceeds ±10% (requires human review)

---

## Quick Wins (Do First)

### ✅ Immediate Fixes (1-2 days)
1. **Add unit tests** with known grid states (e.g., 2pm CAISO summer peak)
2. **Add bounds checking** to prevent mix fractions exceeding 1.0
3. **Add logging** to inspect annual/daily patterns

### ✅ MVP Validation (1 week)
1. **Compare vs public data:** CAISO reports ~240 avg CO₂/MWh in 2023 (vs your 260 baseline)
2. **Run July 2023 sample:** Peak demand day — does model predict high carbon? (Should spike to 400+)
3. **Cross-check regions:** Is GRID_REGIONS baseline reasonable per EPA eGRID?

---

## Production Gate Criteria

**MUST COMPLETE before launching to users:**

- ✅ Model backtested against 12 months of real CAISO data (MAE < 50 lbs CO₂/MWh)
- ✅ Season-dependent peak windows implemented (different summer vs winter)
- ✅ All 10 regions' baseline emissions validated against EPA/NERC data
- ✅ Bounds checks prevent mix fractions from exceeding [0, 1]
- ✅ Error logging + monitoring (Sentry + daily accuracy reports)

---

## Recommendation

**Status: 🚫 NOT PRODUCTION READY**

**Next Action:** Assign 1 person to backtesting against CAISO 2023 data (1 week sprint). Model is architecturally sound but requires real-world validation before deployment.

**Suggested Path:**
1. Keep carbonModel.ts as-is (structure is good)
2. Add `validateAgainstRealData()` test suite
3. Update constants post-validation
4. Deploy to staging with warnings until accuracy > 90%

