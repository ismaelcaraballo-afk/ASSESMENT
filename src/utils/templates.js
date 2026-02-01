/**
 * Recommendation Templates - Maps categories to recommended actions
 */

const actionTemplates = {
  "Billing Issue": {
    default: "Verify billing status and guide the user to update payment details or view invoices.",
    high: "Acknowledge impact, confirm billing status, and escalate to billing support immediately."
  },
  "Technical Problem": {
    default: "Collect repro steps, check status page, and suggest basic troubleshooting.",
    high: "Acknowledge impact and escalate to on-call engineering with repro details."
  },
  "Outage": {
    default: "Confirm outage, share status page, and set expectations for updates.",
    high: "Escalate to on-call immediately and broadcast incident status."
  },
  "Account Access": {
    default: "Verify identity and guide through password reset or SSO troubleshooting.",
    high: "Escalate to security support for urgent access restoration."
  },
  "General Inquiry": "Provide the most relevant FAQ or documentation link.",
  "Feature Request": "Thank the user, capture the request, and share product roadmap expectations.",
  "Feedback/Praise": "Thank the user and optionally ask for a testimonial or review.",
  "Unknown": "Route for manual review."
}

/**
 * Get recommended action for a given category
 * 
 * @param {string} category - The message category
 * @param {string} urgency - The urgency level
 * @returns {string} - Recommended next step
 */
export function getRecommendedAction(category, urgency) {
  const template = actionTemplates[category]
  if (!template) return "No recommendation available."
  if (typeof template === 'string') return template
  if (urgency === 'High' && template.high) return template.high
  return template.default
}

/**
 * Get all available categories
 * 
 * @returns {string[]} - List of categories
 */
export function getAvailableCategories() {
  return Object.keys(actionTemplates)
}

/**
 * Determines if message should be escalated
 * 
 * @param {string} category - The message category
 * @param {string} urgency - The urgency level
 * @param {string} message - The original message
 * @returns {boolean} - Whether to escalate
 */
export function shouldEscalate(category, urgency, message) {
  const text = message.toLowerCase()
  const criticalIndicators = [
    'outage',
    'down',
    'breach',
    'security',
    'cannot access',
    "can't access",
    'locked out',
    'payment failed',
    'database',
    'production'
  ]

  if (urgency === 'High') return true
  if (category === 'Outage' || category === 'Account Access') return true
  return criticalIndicators.some(indicator => text.includes(indicator))
}
