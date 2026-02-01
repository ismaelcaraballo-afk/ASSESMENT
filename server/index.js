import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Groq from 'groq-sdk'

dotenv.config({ path: '.env.local' })

dotenv.config()

const PORT = process.env.PORT || 3001
const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY

const groq = apiKey ? new Groq({ apiKey }) : null

const ALLOWED_CATEGORIES = [
  'Billing Issue',
  'Technical Problem',
  'Outage',
  'Account Access',
  'Feature Request',
  'General Inquiry',
  'Feedback/Praise',
  'Unknown'
]

const cache = new Map()
const CACHE_TTL_MS = 10 * 60 * 1000

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/triage', async (req, res) => {
  const { message } = req.body || {}

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required.' })
  }

  const normalized = message.trim().toLowerCase()
  const cached = cache.get(normalized)
  const now = Date.now()

  if (cached && cached.expiresAt > now) {
    return res.json({ ...cached.data, cached: true })
  }

  const start = Date.now()

  try {
    const data = groq ? await withRetries(() => callGroq(message), 2) : mockCategorize(message)
    const latencyMs = Date.now() - start
    const response = { ...data, latencyMs, cached: false }

    cache.set(normalized, { data: response, expiresAt: Date.now() + CACHE_TTL_MS })

    return res.json(response)
  } catch (error) {
    const fallback = mockCategorize(message)
    const latencyMs = Date.now() - start
    return res.json({ ...fallback, latencyMs, cached: false })
  }
})

function buildPrompt(message) {
  return [
    {
      role: 'system',
      content: `You are a customer support triage assistant for a SaaS platform. Classify incoming messages accurately.

Rules:
1. Return ONLY valid JSON - no markdown, no explanation outside JSON
2. Choose 1-3 categories that apply (most specific first)
3. Confidence should reflect how certain you are (0.0-1.0)
4. Keep reasoning to 1-2 sentences

Allowed categories: ${ALLOWED_CATEGORIES.join(', ')}

Examples:
Message: "Database connection lost"
Output: {"primaryCategory": "Outage", "categories": ["Outage"], "confidence": 0.95, "reasoning": "Database connectivity loss indicates a service outage requiring immediate attention."}

Message: "Could you add dark mode?"
Output: {"primaryCategory": "Feature Request", "categories": ["Feature Request"], "confidence": 0.9, "reasoning": "User is requesting a new UI feature."}

Message: "My payment failed and I can't access my account"
Output: {"primaryCategory": "Billing Issue", "categories": ["Billing Issue", "Account Access"], "confidence": 0.85, "reasoning": "Payment failure with access impact - may need billing and account support."}`
    },
    {
      role: 'user',
      content: `Message: """${message}"""
Output:`
    }
  ]
}

async function callGroq(message) {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: buildPrompt(message),
    temperature: 0.2
  })

  const content = response.choices?.[0]?.message?.content?.trim() || ''
  const parsed = parseJsonFromText(content)

  if (!parsed) {
    throw new Error('Invalid JSON from model')
  }

  const normalizedPrimary = ALLOWED_CATEGORIES.includes(parsed.primaryCategory)
    ? parsed.primaryCategory
    : 'Unknown'

  const categories = Array.isArray(parsed.categories) && parsed.categories.length > 0
    ? parsed.categories.filter(cat => ALLOWED_CATEGORIES.includes(cat))
    : [normalizedPrimary]

  return {
    primaryCategory: normalizedPrimary,
    categories: categories.length > 0 ? categories : [normalizedPrimary],
    confidence: Number.isFinite(parsed.confidence) ? parsed.confidence : 0.5,
    reasoning: parsed.reasoning || 'No reasoning provided.',
    model: 'llama-3.3-70b-versatile'
  }
}

function parseJsonFromText(text) {
  try {
    return JSON.parse(text)
  } catch (error) {
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return null
    try {
      return JSON.parse(match[0])
    } catch (innerError) {
      return null
    }
  }
}

function mockCategorize(message) {
  const lower = message.toLowerCase()
  if (lower.includes('outage') || lower.includes('server down') || lower.includes('production') || lower.includes('database')) {
    return {
      primaryCategory: 'Outage',
      categories: ['Outage'],
      confidence: 0.7,
      reasoning: 'Message indicates downtime or outage impacting availability.',
      model: 'mock'
    }
  }
  if (lower.includes('password') || lower.includes('login') || lower.includes('locked out')) {
    return {
      primaryCategory: 'Account Access',
      categories: ['Account Access'],
      confidence: 0.65,
      reasoning: 'Message mentions login or access issues.',
      model: 'mock'
    }
  }
  if (lower.includes('billing') || lower.includes('payment') || lower.includes('invoice') || lower.includes('refund')) {
    return {
      primaryCategory: 'Billing Issue',
      categories: ['Billing Issue'],
      confidence: 0.6,
      reasoning: 'Billing or payment keywords detected.',
      model: 'mock'
    }
  }
  if (lower.includes('feature') || lower.includes('could you add') || lower.includes('would like to see')) {
    return {
      primaryCategory: 'Feature Request',
      categories: ['Feature Request'],
      confidence: 0.55,
      reasoning: 'Feature request language detected.',
      model: 'mock'
    }
  }
  if (lower.includes('thank') || lower.includes('appreciate')) {
    return {
      primaryCategory: 'Feedback/Praise',
      categories: ['Feedback/Praise'],
      confidence: 0.6,
      reasoning: 'Positive feedback detected.',
      model: 'mock'
    }
  }
  if (lower.includes('error') || lower.includes('bug') || lower.includes('not working')) {
    return {
      primaryCategory: 'Technical Problem',
      categories: ['Technical Problem'],
      confidence: 0.6,
      reasoning: 'Technical issue keywords detected.',
      model: 'mock'
    }
  }

  return {
    primaryCategory: 'General Inquiry',
    categories: ['General Inquiry'],
    confidence: 0.45,
    reasoning: 'Defaulted to general inquiry due to limited signals.',
    model: 'mock'
  }
}

async function withRetries(fn, retries, baseDelayMs = 300) {
  let lastError
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt < retries) {
        const delay = baseDelayMs * Math.pow(2, attempt) // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  throw lastError
}

// Bulk triage endpoint
app.post('/api/triage/bulk', async (req, res) => {
  const { messages } = req.body || {}

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required.' })
  }

  if (messages.length > 50) {
    return res.status(400).json({ error: 'Maximum 50 messages per batch.' })
  }

  const results = await Promise.all(
    messages.map(async (message, index) => {
      if (!message || typeof message !== 'string') {
        return { index, error: 'Invalid message' }
      }

      const normalized = message.trim().toLowerCase()
      const cached = cache.get(normalized)
      const now = Date.now()

      if (cached && cached.expiresAt > now) {
        return { index, ...cached.data, cached: true }
      }

      const start = Date.now()
      try {
        const data = groq ? await withRetries(() => callGroq(message), 1) : mockCategorize(message)
        const latencyMs = Date.now() - start
        const response = { index, ...data, latencyMs, cached: false }
        cache.set(normalized, { data: response, expiresAt: Date.now() + CACHE_TTL_MS })
        return response
      } catch (error) {
        const fallback = mockCategorize(message)
        return { index, ...fallback, latencyMs: Date.now() - start, cached: false }
      }
    })
  )

  return res.json({ results })
})

app.listen(PORT, () => {
  console.log(`Triage API listening on ${PORT}`)
})
