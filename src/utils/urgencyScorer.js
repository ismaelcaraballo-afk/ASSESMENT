/**
 * Urgency Scorer - Rule-based urgency calculation with sentiment analysis
 */

const CRITICAL_KEYWORDS = [
  { pattern: /\boutage\b/i, weight: 50 },
  { pattern: /\bserver\s*down\b/i, weight: 60 },
  { pattern: /\bproduction\b.*\b(down|issue|problem|error)\b/i, weight: 55 },
  { pattern: /\bdatabase\b.*\b(down|error|lost|fail)\b/i, weight: 50 },
  { pattern: /\bconnection\s*lost\b/i, weight: 45 },
  { pattern: /\b(cannot|can't|unable\s*to)\s*access\b/i, weight: 40 },
  { pattern: /\blocked\s*out\b/i, weight: 40 },
  { pattern: /\bsecurity\s*(breach|incident|issue)\b/i, weight: 70 },
  { pattern: /\bbreach\b/i, weight: 65 },
  { pattern: /\bdata\s*(leak|loss|breach)\b/i, weight: 70 },
]

const URGENT_KEYWORDS = [
  { pattern: /\bdown\b/i, weight: 35 },
  { pattern: /\bcrash(ed|ing)?\b/i, weight: 30 },
  { pattern: /\btimeout\b/i, weight: 25 },
  { pattern: /\berror\b/i, weight: 20 },
  { pattern: /\bbug\b/i, weight: 15 },
  { pattern: /\bnot\s*working\b/i, weight: 25 },
  { pattern: /\bbroken\b/i, weight: 25 },
  { pattern: /\bfail(ed|ing|ure)?\b/i, weight: 20 },
  { pattern: /\bpayment\s*failed\b/i, weight: 35 },
  { pattern: /\bcharged\s*(twice|multiple)\b/i, weight: 30 },
  { pattern: /\brefund\b/i, weight: 15 },
  { pattern: /\burgent\b/i, weight: 30 },
  { pattern: /\basap\b/i, weight: 25 },
  { pattern: /\bimmediately\b/i, weight: 25 },
  { pattern: /\bcritical\b/i, weight: 35 },
  { pattern: /\bemergency\b/i, weight: 40 },
]

const POSITIVE_PATTERNS = [
  /\bthank(s|\s*you)?\b/i,
  /\bappreciate\b/i,
  /\blove\b/i,
  /\bgreat\b/i,
  /\bexcellent\b/i,
  /\bwonderful\b/i,
  /\bhappy\b/i,
  /\bawesome\b/i,
  /\bamazing\b/i,
  /\bfantastic\b/i,
]

const LOW_PRIORITY_PATTERNS = [
  /\bfeature\s*request\b/i,
  /\bwould\s*(like|love)\s*to\s*see\b/i,
  /\bcould\s*you\s*add\b/i,
  /\bsuggestion\b/i,
  /\benhancement\b/i,
  /\bjust\s*(wondering|curious|asking)\b/i,
  /\bno\s*(rush|hurry)\b/i,
  /\bwhen\s*you\s*(get|have)\s*(a\s*)?chance\b/i,
]

const NEGATION_PATTERNS = [
  /\b(no|not|isn't|aren't|wasn't|weren't|don't|doesn't|didn't|won't|wouldn't|can't|couldn't|shouldn't)\s+\w+\s+(problem|issue|error|bug)\b/i,
  /\bno\s+problem\b/i,
  /\ball\s+(good|fine|set)\b/i,
]

export function calculateUrgency(message) {
  const text = message.toLowerCase()
  let score = 0
  let signals = { critical: 0, urgent: 0, positive: 0, lowPriority: 0 }

  // Check for negation patterns first
  const hasNegation = NEGATION_PATTERNS.some(p => p.test(text))

  // Critical keywords (highest weight)
  CRITICAL_KEYWORDS.forEach(({ pattern, weight }) => {
    if (pattern.test(text)) {
      score += weight
      signals.critical++
    }
  })

  // Urgent keywords
  URGENT_KEYWORDS.forEach(({ pattern, weight }) => {
    if (pattern.test(text)) {
      score += weight
      signals.urgent++
    }
  })

  // Positive sentiment reduces urgency
  POSITIVE_PATTERNS.forEach(pattern => {
    if (pattern.test(text)) {
      score -= 15
      signals.positive++
    }
  })

  // Low priority indicators
  LOW_PRIORITY_PATTERNS.forEach(pattern => {
    if (pattern.test(text)) {
      score -= 20
      signals.lowPriority++
    }
  })

  // Questions without urgent keywords are lower priority
  if (text.includes('?') && signals.critical === 0 && signals.urgent === 0) {
    score -= 10
  }

  // ALL CAPS suggests frustration (but only if message is substantial)
  if (message === message.toUpperCase() && message.length > 20 && /[A-Z]/.test(message)) {
    score += 15
  }

  // Multiple exclamation marks suggest urgency
  const exclamationCount = (message.match(/!/g) || []).length
  if (exclamationCount >= 3) score += 10
  if (exclamationCount >= 5) score += 10

  // Negation reduces score if we detected issues
  if (hasNegation && signals.urgent > 0) {
    score -= 20
  }

  // Mixed signals decay (positive + urgent = probably not that urgent)
  if (signals.positive > 0 && signals.urgent > 0 && signals.critical === 0) {
    score = Math.floor(score * 0.7)
  }

  // Calculate severity level
  const severity = getSeverityLevel(score)

  return severity.level
}

export function calculateUrgencyWithDetails(message) {
  const text = message.toLowerCase()
  let score = 0
  const matchedKeywords = []

  CRITICAL_KEYWORDS.forEach(({ pattern, weight }) => {
    const match = text.match(pattern)
    if (match) {
      score += weight
      matchedKeywords.push({ keyword: match[0], weight, type: 'critical' })
    }
  })

  URGENT_KEYWORDS.forEach(({ pattern, weight }) => {
    const match = text.match(pattern)
    if (match) {
      score += weight
      matchedKeywords.push({ keyword: match[0], weight, type: 'urgent' })
    }
  })

  POSITIVE_PATTERNS.forEach(pattern => {
    const match = text.match(pattern)
    if (match) {
      score -= 15
      matchedKeywords.push({ keyword: match[0], weight: -15, type: 'positive' })
    }
  })

  LOW_PRIORITY_PATTERNS.forEach(pattern => {
    const match = text.match(pattern)
    if (match) {
      score -= 20
      matchedKeywords.push({ keyword: match[0], weight: -20, type: 'low-priority' })
    }
  })

  const severity = getSeverityLevel(score)

  return {
    level: severity.level,
    score,
    matchedKeywords,
    expectedResponseTime: severity.sla
  }
}

function getSeverityLevel(score) {
  if (score >= 60) return { level: 'High', sla: '15 minutes' }
  if (score >= 40) return { level: 'High', sla: '30 minutes' }
  if (score >= 20) return { level: 'Medium', sla: '2 hours' }
  if (score > 0) return { level: 'Medium', sla: '4 hours' }
  if (score > -20) return { level: 'Low', sla: '24 hours' }
  return { level: 'Low', sla: '48 hours' }
}
