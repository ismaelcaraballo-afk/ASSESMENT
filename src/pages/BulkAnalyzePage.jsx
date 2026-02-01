import { useState } from 'react'
import { calculateUrgencyWithDetails } from '../utils/urgencyScorer'
import { getRecommendedAction, getRoutingDestination, shouldEscalate } from '../utils/templates'
import { detectPII, validateMessage, extractSentiment } from '../utils/validation'
import { useToast } from '../context/ToastContext'
import { SkeletonTable } from '../components/Skeleton'

function BulkAnalyzePage() {
  const [bulkInput, setBulkInput] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { success, error: showError } = useToast()

  const handleBulkAnalyze = async () => {
    setError('')
    const lines = bulkInput.split('\n').map(l => l.trim()).filter(l => l.length > 0)
    
    if (lines.length === 0) {
      showError('Please enter at least one message (one per line)')
      return
    }

    if (lines.length > 50) {
      showError('Maximum 50 messages per batch')
      return
    }

    setIsLoading(true)
    setResults([])

    try {
      const response = await fetch('/api/triage/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: lines })
      })

      if (!response.ok) {
        throw new Error('Bulk triage failed')
      }

      const data = await response.json()
      
      // Enrich results with client-side processing
      const enrichedResults = data.results.map((result, index) => {
        const message = lines[index]
        const urgencyDetails = calculateUrgencyWithDetails(message)
        const pii = detectPII(message)
        const sentiment = extractSentiment(message)
        const category = result.primaryCategory || 'Unknown'
        const categories = result.categories || [category]
        
        return {
          ...result,
          message,
          category,
          categories,
          urgency: urgencyDetails.level,
          expectedResponseTime: urgencyDetails.expectedResponseTime,
          sentiment: sentiment.sentiment,
          recommendedAction: getRecommendedAction(categories, urgencyDetails.level),
          routingDestination: getRoutingDestination(categories),
          escalate: shouldEscalate(category, urgencyDetails.level, message),
          needsReview: (result.confidence ?? 0.5) < 0.6 || categories.length > 1 || pii.length > 0,
          piiFindings: pii
        }
      })

      setResults(enrichedResults)
      success(`Processed ${enrichedResults.length} messages`)

      // Save to history
      const history = JSON.parse(localStorage.getItem('triageHistory') || '[]')
      enrichedResults.forEach(r => {
        if (!r.error) {
          history.push({
            ...r,
            timestamp: new Date().toISOString()
          })
        }
      })
      localStorage.setItem('triageHistory', JSON.stringify(history))

    } catch (err) {
      showError('Failed to process messages. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getSummary = () => {
    if (results.length === 0) return null
    
    const high = results.filter(r => r.urgency === 'High').length
    const needsReview = results.filter(r => r.needsReview).length
    const escalate = results.filter(r => r.escalate).length
    
    return { total: results.length, high, needsReview, escalate }
  }

  const summary = getSummary()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Bulk Analyze</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Paste multiple customer messages (one per line) for batch processing.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Messages (one per line, max 50)
            </label>
            <textarea
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              placeholder="Our server is down&#10;Can I get a refund?&#10;Love your product!"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 h-48 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
              disabled={isLoading}
            />
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {bulkInput.split('\n').filter(l => l.trim()).length} messages
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleBulkAnalyze}
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              isLoading
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Processing...' : 'Analyze All'}
          </button>
        </div>

        {/* Loading Skeleton */}
        {isLoading && <SkeletonTable rows={5} />}

        {/* Summary */}
        {summary && !isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{summary.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Processed</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{summary.high}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">High Urgency</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{summary.needsReview}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Need Review</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{summary.escalate}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Escalate</div>
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && !isLoading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">#</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Message</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Category</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Urgency</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">SLA</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Route</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Flags</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {results.map((result, index) => (
                    <tr key={index} className={result.urgency === 'High' ? 'bg-red-50 dark:bg-red-900/10' : ''}>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{index + 1}</td>
                      <td className="px-4 py-3 text-gray-800 dark:text-gray-200 max-w-xs truncate" title={result.message}>
                        {result.message?.substring(0, 50)}...
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 py-1 rounded">
                          {result.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded font-semibold ${
                          result.urgency === 'High' ? 'bg-red-200 dark:bg-red-900/30 text-red-900 dark:text-red-400' :
                          result.urgency === 'Medium' ? 'bg-yellow-200 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-400' :
                          'bg-green-200 dark:bg-green-900/30 text-green-900 dark:text-green-400'
                        }`}>
                          {result.urgency}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{result.expectedResponseTime}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{result.routingDestination}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {result.escalate && <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 px-2 py-1 rounded">Escalate</span>}
                          {result.needsReview && <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-2 py-1 rounded">Review</span>}
                          {result.piiFindings?.length > 0 && <span className="text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-400 px-2 py-1 rounded">PII</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BulkAnalyzePage
