import { CATEGORIES, getTemplate, getRoutingTeam } from './settings'

/**
 * Recommendation Templates - Maps categories to recommended actions
 */

/**
 * Get recommended action for a given category
 * 
 * @param {string} category - The message category
 * @param {string} urgency - The urgency level
 * @returns {string} - Recommended next step
 */
export function getRecommendedAction(category, urgency) {
  const selectedCategory = Array.isArray(category) ? (category[0] || 'Unknown') : category
  const template = getTemplate(selectedCategory)
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
  return CATEGORIES
}

export function getRoutingDestination(category) {
  const selectedCategory = Array.isArray(category) ? (category[0] || 'Unknown') : category
  return getRoutingTeam(selectedCategory)
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
