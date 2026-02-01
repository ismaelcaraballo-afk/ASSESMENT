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

// Language detection patterns for common languages
const LANGUAGE_PATTERNS = {
  spanish: {
    regex: /\b(hola|gracias|por\s*favor|ayuda|problema|cuenta|pago|necesito|tengo|quiero|cuando|porque|donde|como|urgente|importante)\b/gi,
    threshold: 2
  },
  french: {
    regex: /\b(bonjour|merci|s'il\s*vous\s*pla[iî]t|aide|probl[eè]me|compte|paiement|besoin|j'ai|je\s*veux|quand|pourquoi|o[uù]|comment|urgent)\b/gi,
    threshold: 2
  },
  german: {
    regex: /\b(hallo|danke|bitte|hilfe|problem|konto|zahlung|brauche|ich\s*habe|ich\s*will|wann|warum|wo|wie|dringend|wichtig)\b/gi,
    threshold: 2
  },
  portuguese: {
    regex: /\b(ol[aá]|obrigad[oa]|por\s*favor|ajuda|problema|conta|pagamento|preciso|tenho|quero|quando|porque|onde|como|urgente)\b/gi,
    threshold: 2
  },
  italian: {
    regex: /\b(ciao|grazie|per\s*favore|aiuto|problema|conto|pagamento|bisogno|ho|voglio|quando|perch[eé]|dove|come|urgente)\b/gi,
    threshold: 2
  },
  chinese: {
    regex: /[\u4e00-\u9fff]/g,
    threshold: 3
  },
  japanese: {
    regex: /[\u3040-\u309f\u30a0-\u30ff]/g,
    threshold: 3
  },
  korean: {
    regex: /[\uac00-\ud7af]/g,
    threshold: 3
  },
  arabic: {
    regex: /[\u0600-\u06ff]/g,
    threshold: 3
  },
  russian: {
    regex: /[\u0400-\u04ff]/g,
    threshold: 3
  }
}

export function detectLanguage(message) {
  const text = message.toLowerCase()
  const detectedLanguages = []
  
  // Check ASCII ratio (English typically has high ASCII ratio)
  const asciiChars = (text.match(/[\x00-\x7F]/g) || []).length
  const totalChars = text.length
  const asciiRatio = totalChars > 0 ? asciiChars / totalChars : 1
  
  // Check each language pattern
  for (const [language, config] of Object.entries(LANGUAGE_PATTERNS)) {
    config.regex.lastIndex = 0 // Reset regex
    const matches = text.match(config.regex) || []
    
    if (matches.length >= config.threshold) {
      detectedLanguages.push({
        language,
        confidence: Math.min(matches.length / (config.threshold * 2), 1),
        matchCount: matches.length
      })
    }
  }
  
  // Sort by confidence
  detectedLanguages.sort((a, b) => b.confidence - a.confidence)
  
  // Determine primary language
  let primaryLanguage = 'english'
  let isNonEnglish = false
  
  if (detectedLanguages.length > 0) {
    primaryLanguage = detectedLanguages[0].language
    isNonEnglish = true
  } else if (asciiRatio < 0.7) {
    // High non-ASCII but no specific language detected
    primaryLanguage = 'unknown-non-english'
    isNonEnglish = true
  }
  
  return {
    primaryLanguage,
    isNonEnglish,
    detectedLanguages,
    asciiRatio,
    needsTranslation: isNonEnglish
  }
}

export function getLanguageDisplayName(code) {
  const names = {
    english: 'English',
    spanish: 'Spanish',
    french: 'French',
    german: 'German',
    portuguese: 'Portuguese',
    italian: 'Italian',
    chinese: 'Chinese',
    japanese: 'Japanese',
    korean: 'Korean',
    arabic: 'Arabic',
    russian: 'Russian',
    'unknown-non-english': 'Non-English'
  }
  return names[code] || code
}
