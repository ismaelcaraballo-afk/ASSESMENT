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
      content: 'You are a customer support triage assistant. Return concise reasoning and follow the JSON schema strictly.'
    },
    {
      role: 'user',
      content: `Return ONLY valid JSON with keys: \"primaryCategory\" (string), \"categories\" (array of 1-3 strings), \"confidence\" (0-1), \"reasoning\" (string).\n\nAllowed categories: ${ALLOWED_CATEGORIES.join(', ')}\n\nMessage: """${message}"""`
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

async function withRetries(fn, retries) {
  let attempt = 0
  while (attempt <= retries) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === retries) throw error
      await new Promise(resolve => setTimeout(resolve, 300 * (attempt + 1)))
      attempt += 1
    }
  }
}

app.listen(PORT, () => {
  console.log(`Triage API listening on ${PORT}`)
})
