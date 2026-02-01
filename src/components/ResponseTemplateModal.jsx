import { useState } from 'react'
import { getTemplatesForCategory, fillTemplate } from '../utils/responseTemplates'
import { useToast } from '../context/ToastContext'

function ResponseTemplateModal({ isOpen, onClose, category, customerName = '' }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [customValues, setCustomValues] = useState({
    customer_name: customerName || 'Customer',
    agent_name: 'Support Agent',
    company_name: 'Relay AI'
  })
  const { success } = useToast()

  if (!isOpen) return null

  const templates = getTemplatesForCategory(category)

  const handleCopy = () => {
    const filled = fillTemplate(selectedTemplate, customValues)
    navigator.clipboard.writeText(filled.body)
    success('Template copied to clipboard!')
  }

  const extractPlaceholders = (text) => {
    const matches = text.match(/\{\{([^}]+)\}\}/g) || []
    return [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))]
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Response Templates</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Category: <span className="font-semibold">{category}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Template list */}
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4 space-y-2">
              {templates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTemplate(template)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedTemplate === template
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-transparent'
                  }`}
                >
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">
                    {template.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {template.subject}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Template preview & edit */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedTemplate ? (
              <>
                {/* Placeholders */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Customize Placeholders
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {extractPlaceholders(selectedTemplate.body).slice(0, 6).map(placeholder => (
                      <div key={placeholder}>
                        <label className="text-xs text-gray-500 dark:text-gray-400">
                          {placeholder.replace(/_/g, ' ')}
                        </label>
                        <input
                          type="text"
                          value={customValues[placeholder] || ''}
                          onChange={(e) => setCustomValues({
                            ...customValues,
                            [placeholder]: e.target.value
                          })}
                          placeholder={`{{${placeholder}}}`}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Preview
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {selectedTemplate.subject}
                    </div>
                    <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
                      {fillTemplate(selectedTemplate, customValues).body}
                    </pre>
                  </div>
                </div>

                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
                >
                  <span>📋</span>
                  Copy to Clipboard
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                Select a template from the left
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResponseTemplateModal
