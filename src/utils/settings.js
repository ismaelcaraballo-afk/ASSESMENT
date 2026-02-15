const STORAGE_KEY = 'triageSettings'

export const CATEGORIES = [
  'Billing Issue',
  'Technical Problem',
  'Outage',
  'Account Access',
  'Feature Request',
  'General Inquiry',
  'Feedback/Praise',
  'Unknown'
]

export const DEFAULT_TEMPLATES = {
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
  "General Inquiry": {
    default: "Provide the most relevant FAQ or documentation link."
  },
  "Feature Request": {
    default: "Thank the user, capture the request, and share product roadmap expectations."
  },
  "Feedback/Praise": {
    default: "Thank the user and optionally ask for a testimonial or review."
  },
  "Unknown": {
    default: "Route for manual review."
  }
}

export const DEFAULT_ROUTING = {
  "Billing Issue": "Billing",
  "Technical Problem": "Support",
  "Outage": "On-call Engineering",
  "Account Access": "Security Support",
  "Feature Request": "Product",
  "General Inquiry": "Support",
  "Feedback/Praise": "Customer Success",
  "Unknown": "Support"
}

export function getSettings() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return {
      templates: DEFAULT_TEMPLATES,
      routing: DEFAULT_ROUTING
    }
  }
  try {
    const parsed = JSON.parse(stored)
    return {
      templates: { ...DEFAULT_TEMPLATES, ...parsed.templates },
      routing: { ...DEFAULT_ROUTING, ...parsed.routing }
    }
  } catch (_error) {
    return {
      templates: DEFAULT_TEMPLATES,
      routing: DEFAULT_ROUTING
    }
  }
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

export function resetSettings() {
  localStorage.removeItem(STORAGE_KEY)
}

export function getTemplate(category) {
  const { templates } = getSettings()
  return templates[category] || templates.Unknown
}

export function getRoutingTeam(category) {
  const { routing } = getSettings()
  return routing[category] || routing.Unknown || 'Support'
}
