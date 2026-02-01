import { useState, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { categorizeMessage } from '../utils/llmHelper'
import { calculateUrgency, calculateUrgencyWithDetails } from '../utils/urgencyScorer'
import { getRecommendedAction, getRoutingDestination, shouldEscalate } from '../utils/templates'
import { detectPII, validateMessage, detectProfanity, extractSentiment } from '../utils/validation'
import { useToast } from '../context/ToastContext'
import { SkeletonAnalyzeResult } from '../components/Skeleton'
import ResponseTemplateModal from '../components/ResponseTemplateModal'

function AnalyzePage() {
  const [message, setMessage] = useState('')
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])
  const [validationWarnings, setValidationWarnings] = useState([])
  const [piiFindings, setPiiFindings] = useState([])
  const [profanityFindings, setProfanityFindings] = useState([])
  const [templateModalOpen, setTemplateModalOpen] = useState(false)
  const { success, error: showError, info } = useToast()

  useEffect(() => {
    // Check for example message from home page
    const exampleMessage = localStorage.getItem('exampleMessage')
    if (exampleMessage) {
      setMessage(exampleMessage)
      localStorage.removeItem('exampleMessage')
    }
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!message.trim()) {
      showError('Please enter a message to analyze')
      return
    }

    const { errors, warnings } = validateMessage(message)
    const pii = detectPII(message)
    const profanity = detectProfanity(message)
    const sentiment = extractSentiment(message)
    
    setValidationErrors(errors)
    setValidationWarnings(warnings || [])
    setPiiFindings(pii)
    setProfanityFindings(profanity)

    if (errors.length > 0) {
      return
    }

    if (pii.length > 0) {
      const proceed = window.confirm('PII detected. Proceed with analysis?')
      if (!proceed) return
    }

    if (profanity.length > 0) {
      const proceed = window.confirm('Potentially inappropriate language detected. Proceed with analysis?')
      if (!proceed) return
    }

    setIsLoading(true)
    setResults(null)
    
    try {
      // Run categorization (LLM call)
      const { category, categories, reasoning, confidence, model, latencyMs, cached } = await categorizeMessage(message)
      
      // Calculate urgency (rule-based)
      const urgencyDetails = calculateUrgencyWithDetails(message)
      const urgency = urgencyDetails.level
      const expectedResponseTime = urgencyDetails.expectedResponseTime
      
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
        expectedResponseTime,
        sentiment: sentiment.sentiment,
        recommendedAction,
        routingDestination,
        escalate,
        needsReview,
        confidence: confidence ?? 0.5,
        model: model || 'mock',
        latencyMs: latencyMs ?? null,
        cached: cached ?? false,
        piiFindings: pii,
        profanityFindings: profanity,
        reasoning,
        timestamp: new Date().toISOString()
      }

      setResults(analysisResult)
      success(`Analyzed as ${category} with ${urgency} urgency`)

      // Save to history
      const history = JSON.parse(localStorage.getItem('triageHistory') || '[]')
      history.push(analysisResult)
      localStorage.setItem('triageHistory', JSON.stringify(history))
    } catch (err) {
      console.error('Error analyzing message:', err)
      showError('Error analyzing message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [message, success, showError])

  const handleClear = useCallback(() => {
    setMessage('')
    setResults(null)
    setValidationErrors([])
    setValidationWarnings([])
    setPiiFindings([])
    setProfanityFindings([])
    info('Cleared')
  }, [info])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + Enter to analyze
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        if (!isLoading && message.trim()) {
          handleAnalyze()
        }
      }
      // Escape to clear
      if (e.key === 'Escape') {
        handleClear()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleAnalyze, handleClear, isLoading, message])

  const copyResults = () => {
    const text = `Category: ${(results.categories || [results.category]).join(', ')}\nUrgency: ${results.urgency}\nEscalation: ${results.escalate ? 'Yes' : 'No'}\nNeeds Review: ${results.needsReview ? 'Yes' : 'No'}\nConfidence: ${Math.round((results.confidence || 0) * 100)}%\nRouting: ${results.routingDestination}\nRecommendation: ${results.recommendedAction}\n\nReasoning: ${results.reasoning}`
    navigator.clipboard.writeText(text)
    success('Results copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analyze Customer Message</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Paste a customer support message below to automatically categorize and prioritize.
          </p>

          {/* Input Section */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Customer Message
            </label>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                setValidationErrors([])
                setValidationWarnings([])
                setPiiFindings([])
                setProfanityFindings([])
              }}
              placeholder="Paste customer message here..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 h-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
              disabled={isLoading}
            />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
              <span>{message.length} characters</span>
              <span className="text-xs">⌘/Ctrl + Enter to analyze • Esc to clear</span>
            </div>
            {validationErrors.length > 0 && (
              <div className="mt-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg p-3 text-sm">
                <ul className="list-disc list-inside">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            {piiFindings.length > 0 && (
              <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-400 rounded-lg p-3 text-sm">
                <div className="font-semibold mb-1">⚠️ PII detected</div>
                <ul className="list-disc list-inside">
                  {piiFindings.map((finding, index) => (
                    <li key={index}>{finding}</li>
                  ))}
                </ul>
              </div>
            )}
            {profanityFindings.length > 0 && (
              <div className="mt-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-400 rounded-lg p-3 text-sm">
                <div className="font-semibold mb-1">⚠️ Profanity detected</div>
                <p className="text-xs">This message may require special handling.</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                isLoading
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
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
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && <SkeletonAnalyzeResult />}

        {/* Results Section */}
        {results && !isLoading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analysis Results</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setTemplateModalOpen(true)}
                  className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 px-3 py-1 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 text-sm font-semibold transition-colors"
                >
                  📝 Response Templates
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Category</div>
                <div className="flex flex-wrap gap-2">
                  {(results.categories || [results.category]).map((cat) => (
                    <span key={cat} className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-4 py-2 rounded-lg font-semibold">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Urgency Level</div>
                <div className="flex items-center gap-3">
                  <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                    results.urgency === 'High' ? 'bg-red-200 dark:bg-red-900/30 text-red-900 dark:text-red-400' :
                    results.urgency === 'Medium' ? 'bg-yellow-200 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-400' :
                    'bg-green-200 dark:bg-green-900/30 text-green-900 dark:text-green-400'
                  }`}>
                    {results.urgency}
                  </div>
                  {results.expectedResponseTime && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      ⏱️ Target response: <span className="font-semibold">{results.expectedResponseTime}</span>
                    </div>
                  )}
                </div>
              </div>

              {results.sentiment && results.sentiment !== 'neutral' && (
                <div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Customer Sentiment</div>
                  <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                    results.sentiment === 'positive' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                    results.sentiment === 'frustrated' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
                    results.sentiment === 'urgent' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400' :
                    results.sentiment === 'negative' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}>
                    {results.sentiment === 'positive' ? '😊 Positive' :
                     results.sentiment === 'frustrated' ? '😤 Frustrated' :
                     results.sentiment === 'urgent' ? '⚡ Urgent' :
                     results.sentiment === 'negative' ? '😟 Negative' :
                     results.sentiment}
                  </div>
                </div>
              )}

              <div>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Recommended Action</div>
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <p className="text-gray-800 dark:text-gray-200">{results.recommendedAction}</p>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Routing Destination</div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
                  <p className="text-gray-800 dark:text-gray-200">{results.routingDestination}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Escalation</div>
                  <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                    results.escalate ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                  }`}>
                    {results.escalate ? '🚨 Escalate' : '✓ Standard'}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Needs Review</div>
                  <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                    results.needsReview ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                  }`}>
                    {results.needsReview ? '👀 Review' : '✓ Auto-OK'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Confidence</div>
                  <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-gray-800 dark:text-gray-200">
                    {Math.round((results.confidence || 0) * 100)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Model</div>
                  <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-gray-800 dark:text-gray-200 truncate">
                    {results.model}
                  </div>
                </div>
                {results.latencyMs && (
                  <div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Latency</div>
                    <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-gray-800 dark:text-gray-200">
                      {results.latencyMs}ms
                    </div>
                  </div>
                )}
                {results.cached && (
                  <div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Cache</div>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-green-800 dark:text-green-400">
                      ✓ Hit
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">AI Reasoning</div>
                <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                    <ReactMarkdown>
                      {results.reasoning}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button
                onClick={copyResults}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold transition-colors"
              >
                📋 Copy Results
              </button>
              <button
                onClick={() => setTemplateModalOpen(true)}
                className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 px-4 py-2 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 font-semibold transition-colors"
              >
                📝 Get Response Template
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Response Template Modal */}
      <ResponseTemplateModal
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        category={results?.category || 'General Inquiry'}
      />
    </div>
  )
}

export default AnalyzePage
