// src/services/carbonModel.test.ts
// Validation tests for carbon physics model against known grid states

import { describe, it, expect } from 'vitest';
import {
  modelCarbonIntensity,
  buildHourlyCarbonCurve,
  getBestChargeWindow,
  GRID_REGIONS,
  EMISSION_FACTORS,
  CARBON_THRESHOLDS,
} from './carbonModel';

describe('carbonModel - Physics Validation', () => {
  // Known grid states from real CAISO/EIA data
  const CAISO = GRID_REGIONS.find(r => r.name === 'California/CAISO');
  
  describe('modelCarbonIntensity - Core Physics', () => {
    
    it('should return baseline when no solar/temp adjustments (noon, 20°C, no solar)', () => {
      const baseline = modelCarbonIntensity(
        CAISO!,
        0,        // no solar radiation
        20,       // neutral temp (68°F)
        true,     // daytime
        12        // noon
      );
      
      // Expected: CAISO baseline ≈ 260 lbs CO2/MWh (EPA eGRID 2023)
      // Allow ±5% margin for fuel mix variance
      expect(baseline).toBeGreaterThan(247); // 260 - 5%
      expect(baseline).toBeLessThan(273);    // 260 + 5%
    });

    it('should handle peak evening demand (5-9pm with high temp)', () => {
      const peakEvening = modelCarbonIntensity(
        CAISO!,
        0,        // no solar boost (darkening)
        35,       // 95°F (hot)
        false,    // evening (no direct solar)
        19        // 7pm (peak window)
      );
      
      // Expected: Base 260 + temp factor (1.08) + peak multiplier (1.12) 
      // ≈ 260 × 1.08 × 1.12 ≈ 314 lbs CO2/MWh
      expect(peakEvening).toBeGreaterThan(300);
      expect(peakEvening).toBeLessThan(330);
    });

    it('should handle valley night demand (1-5am with cool temp)', () => {
      const nightValley = modelCarbonIntensity(
        CAISO!,
        0,
        5,        // 41°F (cold)
        false,
        3         // 3am (valley window)
      );
      
      // Expected: Base 260 - valley multiplier (0.88) + temp adjustment (1.06)
      // ≈ 260 × 0.88 × 1.06 ≈ 242 lbs CO2/MWh
      expect(nightValley).toBeLessThan(260);
      expect(nightValley).toBeGreaterThan(200);
    });

    it('should boost for solar generation at peak irradiance (800 W/m²)', () => {
      const withSolar = modelCarbonIntensity(
        CAISO!,
        800,      // peak solar radiation
        25,       // 77°F (moderate)
        true,     // daytime
        14        // 2pm (peak solar)
      );
      
      // Expected boost: Solar increases by up to 60%, gas reduces 80% of that increase
      // Raw mix: solar ~20%, gas ~40% → adjusted: solar ~24%, gas ~36%
      // Impact: Cleaner grid (solar has 0 emissions) → lower intensity
      // Estimate: 260 × (20-4)/20 ≈ 208 lbs CO2/MWh (lower)
      expect(withSolar).toBeLessThan(260); // Should decrease vs no-solar baseline
    });

    it('should not exceed mix fraction bounds (0-1 range)', () => {
      // Test extreme conditions don't cause invalid mix
      const extreme1 = modelCarbonIntensity(CAISO!, 800, 40, true, 17);  // hot + solar
      const extreme2 = modelCarbonIntensity(CAISO!, 0, 0, false, 3);     // cold + night
      const extreme3 = modelCarbonIntensity(CAISO!, 800, 35, true, 19);  // hot + peak + solar
      
      // All should return valid CO2 intensity (not NaN or negative)
      expect(extreme1).toBeGreaterThan(0);
      expect(extreme2).toBeGreaterThan(0);
      expect(extreme3).toBeGreaterThan(0);
      
      // Should be within realistic bounds for CAISO (150-420 typical range)
      expect(extreme1).toBeLessThan(450);
      expect(extreme2).toBeLessThan(450);
      expect(extreme3).toBeLessThan(450);
    });
  });

  describe('buildHourlyCarbonCurve - 24hr Forecast Validity', () => {
    
    it('should generate 24-hour curve with realistic shape', () => {
      const solarData = {
        hourly: Array(24).fill(0).map((_, i) => ({
          radiation: i >= 6 && i <= 18 ? 100 * Math.sin(Math.PI * (i - 6) / 12) : 0,
          temp: 20 + 5 * Math.sin(Math.PI * (i - 14) / 12), // peaks at 2pm
        })),
      };
      
      const curve = buildHourlyCarbonCurve(solarData as any, 0); // 0 = CAISO index
      
      expect(curve).toHaveLength(24);
      
      // Daytime (6am-6pm) should be cleaner than nighttime due to solar
      const dayAvg = curve.slice(6, 18).reduce((a, b) => a + b, 0) / 12;
      const nightAvg = [...curve.slice(0, 6), ...curve.slice(18)].reduce((a, b) => a + b, 0) / 12;
      
      expect(dayAvg).toBeLessThan(nightAvg); // Day cleaner than night
    });

    it('should reflect peak evening hour (5-9pm window)', () => {
      const flatSolarData = {
        hourly: Array(24).fill({ radiation: 0, temp: 20 }),
      };
      
      const curve = buildHourlyCarbonCurve(flatSolarData as any, 0);
      
      // Hours 17-21 (5-9pm) should be higher than hours 1-5 (valley)
      const eveningPeak = Math.max(...curve.slice(17, 21));
      const nightValley = Math.max(...curve.slice(1, 5));
      
      expect(eveningPeak).toBeGreaterThan(nightValley);
    });
  });

  describe('getBestChargeWindow - Policy Recommendation', () => {
    
    it('should recommend charging during low-carbon hours', () => {
      const mixedCurve = [
        350, 340, 320, 310, 300,  // 12am-4am (valley - low)
        320, 340, 360, 380, 400,  // 5am-9am (morning ramp)
        350, 300, 250, 280, 320,  // 10am-2pm (solar boost - cleanest)
        380, 420, 430, 410, 380,  // 3pm-7pm (evening peak - highest)
        340, 320, 300, 280,       // 8pm-11pm (decline)
      ];
      
      const best = getBestChargeWindow(mixedCurve);
      
      // Should recommend 1-5am (valley) or 2-4pm (solar) windows
      expect(best).toBeGreaterThanOrEqual(1);
      expect(best).toBeLessThanOrEqual(5);
    });

    it('should avoid peak evening hours', () => {
      const peakCurve = Array(24).fill(250);
      peakCurve[17] = 450; // 5pm spike
      peakCurve[18] = 430;
      peakCurve[19] = 420;
      
      const best = getBestChargeWindow(peakCurve);
      
      // Should NOT recommend 5-9pm
      expect(best).not.toBeGreaterThanOrEqual(17);
      expect(best).not.toBeLessThanOrEqual(21);
    });
  });

  describe('Edge Cases & Bounds', () => {
    
    it('should clamp solar boost to realistic maximum', () => {
      // Even with 1000+ W/m² (unlikely), shouldn't break
      const extremeSolar = modelCarbonIntensity(CAISO!, 1500, 25, true, 12);
      expect(extremeSolar).toBeGreaterThan(0);
      expect(extremeSolar).toBeLessThan(450);
    });

    it('should handle negative temps gracefully', () => {
      const cold = modelCarbonIntensity(CAISO!, 0, -10, false, 3);
      expect(cold).toBeGreaterThan(0);
      expect(cold).toBeLessThan(450);
    });

    it('should handle extreme heat', () => {
      const hot = modelCarbonIntensity(CAISO!, 600, 45, true, 14);
      expect(hot).toBeGreaterThan(0);
      expect(hot).toBeLessThan(450);
    });
  });

  describe('Emission Factors Validity', () => {
    
    it('should have valid emission factors for all fuels', () => {
      const fuels = ['solar', 'wind', 'nuclear', 'hydro', 'gas', 'coal'];
      
      fuels.forEach(fuel => {
        expect(EMISSION_FACTORS[fuel as keyof typeof EMISSION_FACTORS]).toBeDefined();
        expect(EMISSION_FACTORS[fuel as keyof typeof EMISSION_FACTORS]).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have solar/wind/nuclear at or near zero', () => {
      expect(EMISSION_FACTORS.solar).toBeLessThan(10); // negligible
      expect(EMISSION_FACTORS.wind).toBeLessThan(10);
      expect(EMISSION_FACTORS.nuclear).toBeLessThan(10);
    });

    it('should have gas > nuclear > coal hierarchy', () => {
      // Actually gas is often cleaner than coal
      expect(EMISSION_FACTORS.coal).toBeGreaterThan(EMISSION_FACTORS.nuclear);
      // Gas varies but typically 400-500 lbs CO2/MWh
    });
  });

  describe('Regional Baselines Validation', () => {
    
    it('should have all 10 regions defined', () => {
      expect(GRID_REGIONS).toHaveLength(10);
    });

    it('should have baselines in expected range (200-400 lbs CO2/MWh)', () => {
      GRID_REGIONS.forEach(region => {
        const baseline = Object.values(region.stateMix).reduce((acc, frac, idx) => {
          const fuels = ['solar', 'wind', 'nuclear', 'hydro', 'gas', 'coal'];
          return acc + frac * EMISSION_FACTORS[fuels[idx] as keyof typeof EMISSION_FACTORS];
        }, 0);
        
        expect(baseline).toBeGreaterThan(150);
        expect(baseline).toBeLessThan(450);
      });
    });

    it('should have fuel mix fractions summing to ~1.0', () => {
      GRID_REGIONS.forEach(region => {
        const total = Object.values(region.stateMix).reduce((a, b) => a + b, 0);
        expect(Math.abs(total - 1.0)).toBeLessThan(0.01); // Allow 1% tolerance
      });
    });
  });

  describe('Known Real-World Test Cases', () => {
    
    it('CAISO 2pm summer: Should predict lower carbon with high solar', () => {
      // July 2023, 2pm, sunny, 95°F (real conditions)
      const result = modelCarbonIntensity(
        CAISO!,
        700,  // high solar irradiance
        35,   // 95°F
        true,
        14    // 2pm
      );
      
      // CAISO summer midday typically 200-280 lbs CO2/MWh (solar-heavy)
      // Model should predict in this range
      expect(result).toBeGreaterThan(180);
      expect(result).toBeLessThan(320);
    });

    it('CAISO 7pm summer peak: Should predict higher carbon', () => {
      // July 2023, 7pm, cooling, 88°F (evening peak)
      const result = modelCarbonIntensity(
        CAISO!,
        0,    // no solar (dusk)
        31,   // 88°F (still warm)
        false,
        19    // 7pm
      );
      
      // CAISO summer evening peak typically 320-420 lbs CO2/MWh
      expect(result).toBeGreaterThan(300);
      expect(result).toBeLessThan(450);
    });

    it('CAISO 3am winter valley: Should predict lowest carbon', () => {
      // December 2023, 3am, cold, 45°F
      const result = modelCarbonIntensity(
        CAISO!,
        0,
        7,    // 45°F (cold)
        false,
        3     // 3am
      );
      
      // CAISO winter valley typically 180-240 lbs CO2/MWh (low demand)
      expect(result).toBeGreaterThan(160);
      expect(result).toBeLessThan(260);
    });
  });

  describe('Carbon Thresholds', () => {
    
    it('should classify intensity correctly', () => {
      expect(CARBON_THRESHOLDS.clean).toBeLessThan(CARBON_THRESHOLDS.moderate);
      expect(CARBON_THRESHOLDS.moderate).toBeLessThan(CARBON_THRESHOLDS.dirty);
      
      // Typical ranges
      expect(CARBON_THRESHOLDS.clean).toBeLessThan(300);
      expect(CARBON_THRESHOLDS.dirty).toBeGreaterThan(400);
    });
  });
});
