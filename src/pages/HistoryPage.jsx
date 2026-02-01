import { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { useToast } from '../context/ToastContext'
import MessageDetailModal from '../components/MessageDetailModal'

function HistoryPage() {
  const [history, setHistory] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [urgencyFilter, setUrgencyFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [expandedIndex, setExpandedIndex] = useState(null)
  const { success, info } = useToast()

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
      success('History cleared')
    }
  }

  const deleteItem = (index) => {
    const actualIndex = history.findIndex(h => h === filteredHistory[index])
    if (actualIndex === -1) return
    
    const deletedItem = history[actualIndex]
    const newHistory = [...history]
    newHistory.splice(actualIndex, 1)
    localStorage.setItem('triageHistory', JSON.stringify(newHistory))
    setHistory(newHistory)
    
    // Show toast with undo option
    info('Item deleted', {
      duration: 5000,
      onUndo: () => {
        // Restore the deleted item
        const restoredHistory = [...newHistory]
        restoredHistory.splice(actualIndex, 0, deletedItem)
        localStorage.setItem('triageHistory', JSON.stringify(restoredHistory))
        setHistory(restoredHistory)
        success('Item restored')
      }
    })
  }

  const exportCsv = () => {
    if (filteredHistory.length === 0) return

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

    const rows = filteredHistory.map(item => (
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
    link.setAttribute('download', `triage-history-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    success(`Exported ${filteredHistory.length} records`)
  }

  // Memoized filtering and sorting
  const filteredHistory = useMemo(() => {
    let result = [...history]
    
    // Sort by timestamp descending (newest first)
    result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    
    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(item => item.category === categoryFilter)
    }
    
    // Urgency filter
    if (urgencyFilter !== 'all') {
      result = result.filter(item => item.urgency === urgencyFilter)
    }
    
    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(item => 
        item.message?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        item.reasoning?.toLowerCase().includes(query) ||
        item.recommendedAction?.toLowerCase().includes(query)
      )
    }
    
    // Date range
    if (dateRange.start) {
      const startDate = new Date(dateRange.start)
      result = result.filter(item => new Date(item.timestamp) >= startDate)
    }
    if (dateRange.end) {
      const endDate = new Date(dateRange.end)
      endDate.setHours(23, 59, 59, 999)
      result = result.filter(item => new Date(item.timestamp) <= endDate)
    }
    
    return result
  }, [history, categoryFilter, urgencyFilter, searchQuery, dateRange])

  const categories = [...new Set(history.map(item => item.category).filter(Boolean))]
  const urgencies = ['High', 'Medium', 'Low']

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis History</h1>
              <p className="text-gray-600 dark:text-gray-400">View and manage past message analyses</p>
            </div>
            {history.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={exportCsv}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold transition-colors"
                >
                  📥 Export CSV
                </button>
                <button
                  onClick={clearHistory}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold transition-colors"
                >
                  🗑️ Clear All
                </button>
              </div>
            )}
          </div>

          {/* Search & Filters */}
          {history.length > 0 && (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search messages, categories, reasoning..."
                  className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filter Row */}
              <div className="flex flex-wrap gap-4">
                {/* Category Filter */}
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Urgency Filter */}
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Urgency</label>
                  <select
                    value={urgencyFilter}
                    onChange={(e) => setUrgencyFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Urgencies</option>
                    {urgencies.map(urg => (
                      <option key={urg} value={urg}>{urg}</option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">From</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">To</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Results count */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredHistory.length} of {history.length} records
                {(categoryFilter !== 'all' || urgencyFilter !== 'all' || searchQuery || dateRange.start || dateRange.end) && (
                  <button
                    onClick={() => {
                      setCategoryFilter('all')
                      setUrgencyFilter('all')
                      setSearchQuery('')
                      setDateRange({ start: '', end: '' })
                    }}
                    className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* History List */}
        {filteredHistory.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <div className="text-xl text-gray-600 dark:text-gray-400 mb-2">
              {history.length === 0 ? 'No history yet' : 'No matching records'}
            </div>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              {history.length === 0 
                ? 'Analyzed messages will appear here' 
                : 'Try adjusting your search or filters'}
            </p>
            {history.length === 0 && (
              <a
                href="/analyze"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
              >
                Analyze a Message
              </a>
            )}
          </div>
        )}

        <div className="space-y-4">
          {filteredHistory.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                    <div className="text-gray-800 dark:text-gray-200 font-medium mb-2">
                      "{item.message?.substring(0, 100)}{item.message?.length > 100 ? '...' : ''}"
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {(item.categories || [item.category]).map((cat) => (
                        <span key={cat} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-3 py-1 rounded-full font-semibold">
                          {cat}
                        </span>
                      ))}
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        item.urgency === 'High' ? 'bg-red-200 dark:bg-red-900/30 text-red-900 dark:text-red-400' :
                        item.urgency === 'Medium' ? 'bg-yellow-200 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-400' :
                        'bg-green-200 dark:bg-green-900/30 text-green-900 dark:text-green-400'
                      }`}>
                        {item.urgency}
                      </span>
                      {item.escalate && (
                        <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 px-3 py-1 rounded-full font-semibold">
                          🚨 Escalate
                        </span>
                      )}
                      {item.needsReview && (
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-3 py-1 rounded-full font-semibold">
                          👀 Review
                        </span>
                      )}
                      {item.piiFindings?.length > 0 && (
                        <span className="text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-400 px-3 py-1 rounded-full font-semibold">
                          🔒 PII
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedMessage(item)
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                      title="View details"
                    >
                      🔍
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (window.confirm('Delete this item?')) {
                          deleteItem(index)
                        }
                      }}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                      title="Delete"
                    >
                      🗑️
                    </button>
                    <span className="text-gray-400 dark:text-gray-500">
                      {expandedIndex === index ? '▲' : '▼'}
                    </span>
                  </div>
                </div>
              </div>

              {expandedIndex === index && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700/30">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Full Message</div>
                      <div className="text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
                        {item.message}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Recommended Action</div>
                      <div className="text-sm text-gray-800 dark:text-gray-200 bg-purple-50 dark:bg-purple-900/20 p-3 rounded border border-purple-200 dark:border-purple-800">
                        {item.recommendedAction}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Routing Destination</div>
                      <div className="text-sm text-gray-800 dark:text-gray-200 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded border border-indigo-200 dark:border-indigo-800">
                        {item.routingDestination || 'General Support'}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Confidence</div>
                        <div className="text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
                          {item.confidence != null ? `${Math.round(item.confidence * 100)}%` : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Model</div>
                        <div className="text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600 truncate">
                          {item.model || 'N/A'}
                        </div>
                      </div>
                      {item.latencyMs && (
                        <div>
                          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Latency</div>
                          <div className="text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
                            {item.latencyMs}ms
                          </div>
                        </div>
                      )}
                      {item.expectedResponseTime && (
                        <div>
                          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">SLA</div>
                          <div className="text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
                            {item.expectedResponseTime}
                          </div>
                        </div>
                      )}
                    </div>
                    {item.piiFindings?.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">PII Findings</div>
                        <div className="text-sm text-yellow-800 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 dark:border-yellow-800">
                          {item.piiFindings.join(', ')}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">AI Reasoning</div>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
                        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                          <ReactMarkdown>
                            {item.reasoning}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <MessageDetailModal
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        message={selectedMessage}
      />
    </div>
  )
}

export default HistoryPage
