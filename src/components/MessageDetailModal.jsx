import { useEffect, useRef } from 'react'
import { useFocusTrap, useRestoreFocus } from '../hooks/useAccessibility'

function MessageDetailModal({ isOpen, onClose, message }) {
  const focusTrapRef = useFocusTrap(isOpen)
  useRestoreFocus()

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !message) return null

  const urgencyColors = {
    High: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    Low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  }

  const sentimentEmoji = {
    positive: '😊',
    negative: '😟',
    neutral: '😐'
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={focusTrapRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 id="modal-title" className="sr-only">Message Analysis Details</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${urgencyColors[message.urgency] || urgencyColors.Low}`}>
              {message.urgency}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(message.timestamp).toLocaleString()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Original Message */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Original Message
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-gray-800 dark:text-gray-200">
              {message.message}
            </div>
          </div>

          {/* Classification Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">Category</div>
              <div className="text-lg font-bold text-blue-900 dark:text-blue-300">{message.category}</div>
              {message.categories?.length > 1 && (
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Also: {message.categories.slice(1).join(', ')}
                </div>
              )}
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1">Confidence</div>
              <div className="text-lg font-bold text-purple-900 dark:text-purple-300">
                {((message.confidence || 0.5) * 100).toFixed(0)}%
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">Route To</div>
              <div className="text-lg font-bold text-green-900 dark:text-green-300">
                {message.routingDestination || 'General Support'}
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold mb-1">Response SLA</div>
              <div className="text-lg font-bold text-orange-900 dark:text-orange-300">
                {message.expectedResponseTime || 'Standard'}
              </div>
            </div>
          </div>

          {/* Sentiment */}
          {message.sentiment && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Sentiment
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{sentimentEmoji[message.sentiment] || '😐'}</span>
                <span className="text-gray-800 dark:text-gray-200 capitalize">{message.sentiment}</span>
              </div>
            </div>
          )}

          {/* Recommended Action */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Recommended Action
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-gray-800 dark:text-gray-200">
              {message.recommendedAction || 'No specific action recommended'}
            </div>
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-2">
            {message.escalate && (
              <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full text-sm font-semibold">
                🚨 Escalate
              </span>
            )}
            {message.needsReview && (
              <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full text-sm font-semibold">
                👀 Needs Review
              </span>
            )}
            {message.piiFindings?.length > 0 && (
              <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-400 rounded-full text-sm font-semibold">
                🔒 PII Detected: {message.piiFindings.join(', ')}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default MessageDetailModal
