const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
const PHONE_REGEX = /\+?\d[\d\s().-]{7,}\d/g
const CREDIT_CARD_REGEX = /\b(?:\d[ -]*?){13,19}\b/g
const SSN_REGEX = /\b\d{3}[- ]?\d{2}[- ]?\d{4}\b/g
const IP_ADDRESS_REGEX = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g

const SPAM_PATTERNS = [
  /\b(click\s*here|act\s*now|limited\s*time|free\s*money|winner)\b/i,
  /\b(buy\s*now|order\s*today|special\s*offer|exclusive\s*deal)\b/i,
  /(.{0,5})\1{5,}/i, // Repeated characters
]

const PROFANITY_PATTERNS = [
  // Common profanity patterns (keeping it family-friendly but effective)
  /\b(damn|hell|crap)\b/i, // Mild
  /\b[fs][u\*@#][ck\*@#]{1,2}(ing|ed|er|s)?\b/i, // F-word variants
  /\b[s$][h#][i!1][t+]+(ty|s|ing)?\b/i, // S-word variants
  /\b(ass|arse)(hole)?s?\b/i,
  /\b(idiot|stupid|dumb|moron)s?\b/i, // Insults
]

export function validateMessage(message) {
  const trimmed = message.trim()
  const errors = []
  const warnings = []

  if (trimmed.length < 10) {
    errors.push('Message must be at least 10 characters for reliable triage.')
  }

  if (trimmed.length > 5000) {
    errors.push('Message exceeds 5000 character limit.')
  }

  // Check for spam patterns
  const hasSpam = SPAM_PATTERNS.some(p => p.test(trimmed))
  if (hasSpam) {
    warnings.push('Message may contain spam-like content.')
  }

  // Check for mostly non-alphanumeric
  const alphanumericRatio = (trimmed.match(/[a-zA-Z0-9]/g) || []).length / trimmed.length
  if (alphanumericRatio < 0.5 && trimmed.length > 20) {
    warnings.push('Message contains mostly special characters.')
  }

  return { errors, warnings }
}

export function detectPII(message) {
  const findings = []

  // Reset regex lastIndex
  EMAIL_REGEX.lastIndex = 0
  PHONE_REGEX.lastIndex = 0
  CREDIT_CARD_REGEX.lastIndex = 0
  SSN_REGEX.lastIndex = 0
  IP_ADDRESS_REGEX.lastIndex = 0

  if (EMAIL_REGEX.test(message)) findings.push('Email address detected')
  if (PHONE_REGEX.test(message)) findings.push('Phone number detected')
  if (CREDIT_CARD_REGEX.test(message)) findings.push('Possible credit card number detected')
  if (SSN_REGEX.test(message)) findings.push('Possible SSN detected')
  if (IP_ADDRESS_REGEX.test(message)) findings.push('IP address detected')

  return findings
}

export function detectProfanity(message) {
  const findings = []
  
  PROFANITY_PATTERNS.forEach(pattern => {
    if (pattern.test(message)) {
      findings.push('Potentially inappropriate language detected')
    }
  })

  return [...new Set(findings)] // Dedupe
}

export function extractSentiment(message) {
  const text = message.toLowerCase()
  
  const positiveWords = ['thank', 'thanks', 'appreciate', 'love', 'great', 'excellent', 'wonderful', 'happy', 'awesome', 'amazing', 'fantastic', 'perfect', 'pleased']
  const negativeWords = ['frustrated', 'angry', 'upset', 'disappointed', 'terrible', 'horrible', 'awful', 'worst', 'hate', 'furious', 'unacceptable', 'ridiculous']
  const urgentWords = ['urgent', 'asap', 'immediately', 'emergency', 'critical', 'now', 'right away']

  let positiveCount = 0
  let negativeCount = 0
  let urgentCount = 0

  positiveWords.forEach(w => { if (text.includes(w)) positiveCount++ })
  negativeWords.forEach(w => { if (text.includes(w)) negativeCount++ })
  urgentWords.forEach(w => { if (text.includes(w)) urgentCount++ })

  let sentiment = 'neutral'
  if (positiveCount > negativeCount && positiveCount > 0) sentiment = 'positive'
  if (negativeCount > positiveCount && negativeCount > 0) sentiment = 'negative'
  if (urgentCount > 0) sentiment = negativeCount > 0 ? 'frustrated' : 'urgent'

  return {
    sentiment,
    positiveCount,
    negativeCount,
    urgentCount
  }
}

export function redactPII(message) {
  let redacted = message
  
  redacted = redacted.replace(EMAIL_REGEX, '[EMAIL REDACTED]')
  redacted = redacted.replace(PHONE_REGEX, '[PHONE REDACTED]')
  redacted = redacted.replace(CREDIT_CARD_REGEX, '[CARD REDACTED]')
  redacted = redacted.replace(SSN_REGEX, '[SSN REDACTED]')
  
  return redacted
}
