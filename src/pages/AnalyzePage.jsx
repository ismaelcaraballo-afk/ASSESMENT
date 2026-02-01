import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { categorizeMessage } from '../utils/llmHelper'
import { calculateUrgency } from '../utils/urgencyScorer'
import { getRecommendedAction, getRoutingDestination, shouldEscalate } from '../utils/templates'
import { detectPII, validateMessage } from '../utils/validation'

function AnalyzePage() {
  const [message, setMessage] = useState('')
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])
  const [piiFindings, setPiiFindings] = useState([])

  useEffect(() => {
    // Check for example message from home page
    const exampleMessage = localStorage.getItem('exampleMessage')
    if (exampleMessage) {
      setMessage(exampleMessage)
      localStorage.removeItem('exampleMessage')
    }
  }, [])

  const handleAnalyze = async () => {
    const errors = validateMessage(message)
    const pii = detectPII(message)
    setValidationErrors(errors)
    setPiiFindings(pii)

    if (errors.length > 0) {
      return
    }

    if (pii.length > 0) {
      const proceed = window.confirm('PII detected. Proceed with analysis?')
      if (!proceed) return
    }

    setIsLoading(true)
    setResults(null)
    
    try {
      // Run categorization (LLM call)
      const { category, categories, reasoning, confidence, model, latencyMs, cached } = await categorizeMessage(message)
      
      // Calculate urgency (rule-based)
      const urgency = calculateUrgency(message)
      
      // Get recommended action (template-based)
      const recommendedAction = getRecommendedAction(categories || category, urgency)
      const routingDestination = getRoutingDestination(categories || category)
      const escalate = shouldEscalate(category, urgency, message)
      const needsReview = (confidence ?? 0.5) < 0.6 || (categories?.length || 1) > 1 || pii.length > 0
      
      const analysisResult = {
        message,
        category,
        categories: categories || [category],
        urgency,
        recommendedAction,
        routingDestination,
        escalate,
        needsReview,
        confidence: confidence ?? 0.5,
        model: model || 'mock',
        latencyMs: latencyMs ?? null,
        cached: cached ?? false,
        piiFindings: pii,
        reasoning,
        timestamp: new Date().toISOString()
      }

      setResults(analysisResult)

      // Save to history
      const history = JSON.parse(localStorage.getItem('triageHistory') || '[]')
      history.push(analysisResult)
      localStorage.setItem('triageHistory', JSON.stringify(history))
    } catch (error) {
      console.error('Error analyzing message:', error)
      alert('Error analyzing message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setMessage('')
    setResults(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analyze Customer Message</h1>
          <p className="text-gray-600 mb-6">
            Paste a customer support message below to automatically categorize and prioritize.
          </p>

          {/* Input Section */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Customer Message
            </label>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                setValidationErrors([])
                setPiiFindings([])
              }}
              placeholder="Paste customer message here..."
              className="w-full border border-gray-300 rounded-lg p-3 h-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
            <div className="text-sm text-gray-500 mt-1">
              {message.length} characters
            </div>
            {validationErrors.length > 0 && (
              <div className="mt-3 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                <ul className="list-disc list-inside">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            {piiFindings.length > 0 && (
              <div className="mt-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-3 text-sm">
                <div className="font-semibold mb-1">PII detected</div>
                <ul className="list-disc list-inside">
                  {piiFindings.map((finding, index) => (
                    <li key={index}>{finding}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className={`flex-1 py-3 rounded-lg font-semibold ${
                isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Analyze Message'
              )}
            </button>
            <button
              onClick={handleClear}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Analysis Results</h2>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">Category</div>
                <div className="flex flex-wrap gap-2">
                  {(results.categories || [results.category]).map((cat) => (
                    <span key={cat} className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">Urgency Level</div>
                <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                  results.urgency === 'High' ? 'bg-red-200 text-red-900' :
                  results.urgency === 'Medium' ? 'bg-yellow-200 text-yellow-900' :
                  'bg-green-200 text-green-900'
                }`}>
                  {results.urgency}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">Recommended Action</div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-gray-800">{results.recommendedAction}</p>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">Routing Destination</div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <p className="text-gray-800">{results.routingDestination}</p>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">Escalation</div>
                <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                  results.escalate ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {results.escalate ? 'Escalate to specialist' : 'Standard handling'}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">Needs Review</div>
                <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                  results.needsReview ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {results.needsReview ? 'Manual review recommended' : 'Auto-triage OK'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-semibold text-gray-600 mb-1">Confidence</div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800">
                    {Math.round((results.confidence || 0) * 100)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600 mb-1">Model</div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800">
                    {results.model}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">AI Reasoning</div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <ReactMarkdown>
                      {results.reasoning}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>

              {(results.latencyMs || results.cached) && (
                <div className="text-xs text-gray-500">
                  {results.latencyMs ? `Latency: ${results.latencyMs}ms` : null}
                  {results.latencyMs && results.cached ? ' • ' : ''}
                  {results.cached ? 'Cache hit' : null}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  const text = `Category: ${(results.categories || [results.category]).join(', ')}\nUrgency: ${results.urgency}\nEscalation: ${results.escalate ? 'Yes' : 'No'}\nNeeds Review: ${results.needsReview ? 'Yes' : 'No'}\nConfidence: ${Math.round((results.confidence || 0) * 100)}%\nRouting: ${results.routingDestination}\nRecommendation: ${results.recommendedAction}\n\nReasoning: ${results.reasoning}`
                  navigator.clipboard.writeText(text)
                  alert('Results copied to clipboard!')
                }}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-semibold"
              >
                📋 Copy Results
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyzePage
