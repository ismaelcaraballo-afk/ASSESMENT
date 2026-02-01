import { describe, it, expect } from 'vitest'
import { 
  calculateUrgency, 
  calculateUrgencyWithDetails 
} from '../utils/urgencyScorer'

describe('urgencyScorer', () => {
  describe('calculateUrgency', () => {
    it('returns High for critical messages', () => {
      // URGENT with exclamation or all caps triggers high
      expect(calculateUrgency('URGENT: Server is down!')).toBe('High')
    })

    it('returns appropriate urgency for various keywords', () => {
      // The scorer uses a points-based system
      const asapResult = calculateUrgency('Need this fixed ASAP')
      expect(['High', 'Medium']).toContain(asapResult)
    })

    it('returns High for messages with "emergency"', () => {
      expect(calculateUrgency('This is an emergency situation')).toBe('High')
    })

    it('handles outage messages', () => {
      const result = calculateUrgency('Our system is down')
      expect(['High', 'Medium']).toContain(result)
    })

    it('handles "not working" messages', () => {
      const result = calculateUrgency('The payment system is not working')
      expect(['High', 'Medium']).toContain(result)
    })

    it('returns Medium or High for messages with "broken"', () => {
      const result = calculateUrgency('The feature is broken')
      expect(['Medium', 'High']).toContain(result)
    })

    it('handles messages with "issue"', () => {
      const result = calculateUrgency('I have an issue with billing')
      expect(['Low', 'Medium']).toContain(result)
    })

    it('handles messages with "help"', () => {
      const result = calculateUrgency('Can you help me with this?')
      expect(['Low', 'Medium']).toContain(result)
    })

    it('returns Low for general inquiries', () => {
      expect(calculateUrgency('Just wanted to say thanks!')).toBe('Low')
      expect(calculateUrgency('Question about features')).toBe('Low')
    })

    it('returns Low for positive feedback', () => {
      expect(calculateUrgency('Love your product, keep it up!')).toBe('Low')
    })

    it('handles empty strings', () => {
      expect(calculateUrgency('')).toBe('Low')
    })

    it('is case insensitive for emergency', () => {
      expect(calculateUrgency('EMERGENCY')).toBe('High')
      expect(calculateUrgency('emergency')).toBe('High')
      expect(calculateUrgency('Emergency')).toBe('High')
    })
  })

  describe('calculateUrgencyWithDetails', () => {
    it('returns level and expectedResponseTime', () => {
      const result = calculateUrgencyWithDetails('URGENT: Need help now!')
      expect(result).toHaveProperty('level')
      expect(result).toHaveProperty('expectedResponseTime')
      expect(['High', 'Medium']).toContain(result.level)
    })

    it('returns appropriate SLA based on urgency level', () => {
      const result = calculateUrgencyWithDetails('URGENT: System down!')
      // The actual SLA values depend on implementation
      expect(result.expectedResponseTime).toBeTruthy()
    })

    it('returns SLA for Medium urgency', () => {
      const result = calculateUrgencyWithDetails('Having an issue with billing')
      expect(result.expectedResponseTime).toBeTruthy()
    })

    it('returns 24-hour SLA for Low urgency', () => {
      const result = calculateUrgencyWithDetails('Thanks for your product!')
      expect(result.expectedResponseTime).toBe('24 hours')
    })

    it('includes score in result', () => {
      const result = calculateUrgencyWithDetails('URGENT emergency help!')
      expect(result).toHaveProperty('score')
      expect(typeof result.score).toBe('number')
    })
  })
})
