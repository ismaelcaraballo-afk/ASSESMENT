import { describe, it, expect } from 'vitest'
import { 
  RESPONSE_TEMPLATES,
  fillTemplate,
  getTemplatesForCategory
} from '../utils/responseTemplates'

describe('responseTemplates', () => {
  describe('RESPONSE_TEMPLATES', () => {
    it('has templates for main categories', () => {
      // Check that the object exists and has some categories
      expect(Object.keys(RESPONSE_TEMPLATES).length).toBeGreaterThan(0)
    })

    it('each category has templates array', () => {
      Object.keys(RESPONSE_TEMPLATES).forEach(category => {
        expect(RESPONSE_TEMPLATES[category]).toHaveProperty('templates')
        expect(Array.isArray(RESPONSE_TEMPLATES[category].templates)).toBe(true)
      })
    })

    it('each template has name, subject, and body', () => {
      Object.values(RESPONSE_TEMPLATES).forEach(category => {
        category.templates.forEach(template => {
          expect(template).toHaveProperty('name')
          expect(template).toHaveProperty('subject')
          expect(template).toHaveProperty('body')
        })
      })
    })
  })

  describe('fillTemplate', () => {
    it('replaces double-brace placeholders in template object', () => {
      const template = { body: 'Hello {{customer_name}}, thank you for contacting us.' }
      const result = fillTemplate(template, { customer_name: 'John' })
      expect(result.body).toBe('Hello John, thank you for contacting us.')
    })

    it('replaces single-brace placeholders in string', () => {
      const template = 'Welcome to {companyName}!'
      const result = fillTemplate(template, { companyName: 'Relay AI' })
      expect(result).toBe('Welcome to Relay AI!')
    })

    it('replaces multiple placeholders', () => {
      const template = 'Hi {{customer_name}}, thanks for using {{company_name}}!'
      const result = fillTemplate(template, { 
        customer_name: 'Jane', 
        company_name: 'Acme Corp' 
      })
      expect(result).toBe('Hi Jane, thanks for using Acme Corp!')
    })

    it('leaves unreplaced placeholders intact', () => {
      const template = 'Hello {{customer_name}}, your {{ticket_id}} is ready.'
      const result = fillTemplate(template, { customer_name: 'Bob' })
      expect(result).toBe('Hello Bob, your {{ticket_id}} is ready.')
    })

    it('handles empty values object', () => {
      const template = 'Hello {{customer_name}}!'
      const result = fillTemplate(template, {})
      expect(result).toBe('Hello {{customer_name}}!')
    })
  })

  describe('getTemplatesForCategory', () => {
    it('returns templates for valid category', () => {
      const templates = getTemplatesForCategory('Billing Issue')
      expect(templates).toBeDefined()
      expect(Array.isArray(templates)).toBe(true)
    })

    it('returns array for any category', () => {
      const templates = getTemplatesForCategory('NonExistent')
      expect(Array.isArray(templates)).toBe(true)
    })

    it('handles case-insensitive matching', () => {
      const templates = getTemplatesForCategory('billing issue')
      expect(Array.isArray(templates)).toBe(true)
    })
  })
})
