const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
const PHONE_REGEX = /\+?\d[\d\s().-]{7,}\d/g
const CREDIT_CARD_REGEX = /\b(?:\d[ -]*?){13,19}\b/g

export function validateMessage(message) {
  const trimmed = message.trim()
  const errors = []

  if (trimmed.length < 10) {
    errors.push('Message must be at least 10 characters for reliable triage.')
  }

  return errors
}

export function detectPII(message) {
  const findings = []

  if (EMAIL_REGEX.test(message)) findings.push('Email address detected')
  if (PHONE_REGEX.test(message)) findings.push('Phone number detected')
  if (CREDIT_CARD_REGEX.test(message)) findings.push('Possible credit card number detected')

  return findings
}
