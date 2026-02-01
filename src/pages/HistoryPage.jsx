import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

function HistoryPage() {
  const [history, setHistory] = useState([])
  const [filter, setFilter] = useState('all')
  const [expandedIndex, setExpandedIndex] = useState(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    const savedHistory = JSON.parse(localStorage.getItem('triageHistory') || '[]')
    setHistory(savedHistory)
  }

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.setItem('triageHistory', '[]')
      setHistory([])
    }
  }

  const exportCsv = () => {
    if (history.length === 0) return

    const headers = [
      'timestamp',
      'message',
      'categories',
      'urgency',
      'recommendedAction',
      'routingDestination',
      'escalate',
      'needsReview',
      'confidence',
      'model',
      'latencyMs',
      'cached',
      'piiFindings',
      'reasoning'
    ]

    const rows = history.map(item => (
      headers.map(header => {
        const value = item[header]
        if (Array.isArray(value)) return `"${value.join('; ')}"`
        if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`
        return value ?? ''
      }).join(',')
    ))

    const csvContent = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'triage-history.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  )
  
  const filteredHistory = filter === 'all' 
    ? sortedHistory 
    : sortedHistory.filter(item => item.category === filter)

  const categories = [...new Set(history.map(item => item.category))]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analysis History</h1>
              <p className="text-gray-600">View and manage past message analyses</p>
            </div>
            {history.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={exportCsv}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-semibold"
                >
                  Export CSV
                </button>
                <button
                  onClick={clearHistory}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Filter Buttons */}
          {history.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({history.length})
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    filter === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category} ({history.filter(h => h.category === category).length})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* History List */}
        {filteredHistory.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <div className="text-xl text-gray-600 mb-2">No history yet</div>
            <p className="text-gray-500 mb-6">
              Analyzed messages will appear here
            </p>
            <a
              href="/analyze"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Analyze a Message
            </a>
          </div>
        )}

        <div className="space-y-4">
          {filteredHistory.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                    <div className="text-gray-800 font-medium mb-2">
                      "{item.message.substring(0, 100)}{item.message.length > 100 ? '...' : ''}"
                    </div>
                    <div className="flex items-center space-x-2">
                      {(item.categories || [item.category]).map((cat) => (
                        <span key={cat} className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                          {cat}
                        </span>
                      ))}
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        item.urgency === 'High' ? 'bg-red-200 text-red-900' :
                        item.urgency === 'Medium' ? 'bg-yellow-200 text-yellow-900' :
                        'bg-green-200 text-green-900'
                      }`}>
                        {item.urgency} Urgency
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        item.escalate ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.escalate ? 'Escalate' : 'Standard'}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        item.needsReview ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {item.needsReview ? 'Needs Review' : 'Auto OK'}
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-400 ml-4">
                    {expandedIndex === index ? '▲' : '▼'}
                  </div>
                </div>
              </div>

              {expandedIndex === index && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-gray-600 mb-1">Full Message</div>
                      <div className="text-sm text-gray-800 bg-white p-3 rounded border border-gray-200">
                        {item.message}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-600 mb-1">Recommended Action</div>
                      <div className="text-sm text-gray-800 bg-purple-50 p-3 rounded border border-purple-200">
                        {item.recommendedAction}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-600 mb-1">Routing Destination</div>
                      <div className="text-sm text-gray-800 bg-indigo-50 p-3 rounded border border-indigo-200">
                        {item.routingDestination || 'Support'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-600 mb-1">Escalation</div>
                      <div className={`text-sm p-3 rounded border ${
                        item.escalate ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'
                      }`}>
                        {item.escalate ? 'Escalate to specialist' : 'Standard handling'}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-semibold text-gray-600 mb-1">Confidence</div>
                        <div className="text-sm text-gray-800 bg-white p-3 rounded border border-gray-200">
                          {item.confidence != null ? `${Math.round(item.confidence * 100)}%` : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-600 mb-1">Model</div>
                        <div className="text-sm text-gray-800 bg-white p-3 rounded border border-gray-200">
                          {item.model || 'N/A'}
                        </div>
                      </div>
                    </div>
                    {item.piiFindings?.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-gray-600 mb-1">PII Findings</div>
                        <div className="text-sm text-yellow-800 bg-yellow-50 p-3 rounded border border-yellow-200">
                          {item.piiFindings.join(', ')}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-semibold text-gray-600 mb-1">AI Reasoning</div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <div className="prose prose-sm max-w-none text-gray-700">
                          <ReactMarkdown>
                            {item.reasoning}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                    {(item.latencyMs || item.cached) && (
                      <div className="text-xs text-gray-500">
                        {item.latencyMs ? `Latency: ${item.latencyMs}ms` : null}
                        {item.latencyMs && item.cached ? ' • ' : ''}
                        {item.cached ? 'Cache hit' : null}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HistoryPage
