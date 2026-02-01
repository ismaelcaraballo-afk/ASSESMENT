import { useEffect, useState } from 'react'
import { CATEGORIES, DEFAULT_ROUTING, DEFAULT_TEMPLATES, getSettings, resetSettings, saveSettings } from '../utils/settings'
import { useToast } from '../context/ToastContext'
import { useTheme } from '../context/ThemeContext'

function SettingsPage() {
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES)
  const [routing, setRouting] = useState(DEFAULT_ROUTING)
  const { isDark, toggleTheme } = useTheme()
  const { success, info } = useToast()

  useEffect(() => {
    const settings = getSettings()
    setTemplates(settings.templates)
    setRouting(settings.routing)
  }, [])

  const handleTemplateChange = (category, field, value) => {
    setTemplates(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }))
  }

  const handleRoutingChange = (category, value) => {
    setRouting(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const handleSave = () => {
    saveSettings({ templates, routing })
    success('Settings saved!')
  }

  const handleReset = () => {
    if (window.confirm('Reset all settings to defaults?')) {
      resetSettings()
      setTemplates(DEFAULT_TEMPLATES)
      setRouting(DEFAULT_ROUTING)
      info('Settings reset to defaults')
    }
  }

  const clearHistory = () => {
    if (window.confirm('Clear all analysis history? This cannot be undone.')) {
      localStorage.setItem('triageHistory', '[]')
      success('History cleared')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Customize triage behavior and preferences.</p>
        </div>

        {/* Appearance Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🎨 Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">Dark Mode</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Toggle between light and dark themes</div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                isDark ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                isDark ? 'translate-x-7' : 'translate-x-1'
              }`}>
                <span className="flex items-center justify-center h-full text-sm">
                  {isDark ? '🌙' : '☀️'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🗃️ Data Management</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-800 dark:text-gray-200">Clear History</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Delete all analyzed message history</div>
              </div>
              <button
                onClick={clearHistory}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition-colors"
              >
                Clear History
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-800 dark:text-gray-200">Export Data</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Download all data as JSON</div>
              </div>
              <button
                onClick={() => {
                  const data = {
                    history: JSON.parse(localStorage.getItem('triageHistory') || '[]'),
                    settings: getSettings(),
                    exportedAt: new Date().toISOString()
                  }
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const link = document.createElement('a')
                  link.href = url
                  link.download = `relay-ai-export-${new Date().toISOString().split('T')[0]}.json`
                  link.click()
                  URL.revokeObjectURL(url)
                  success('Data exported!')
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
              >
                Export JSON
              </button>
            </div>
          </div>
        </div>

        {/* Triage Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">⚙️ Triage Settings</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
              >
                Save Settings
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold transition-colors"
              >
                Reset Defaults
              </button>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Customize recommendations and routing per category.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {CATEGORIES.map(category => (
              <div key={category} className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                <h3 className="text-md font-bold text-gray-900 dark:text-white mb-4">{category}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Default Recommendation</label>
                    <textarea
                      value={templates[category]?.default || ''}
                      onChange={(event) => handleTemplateChange(category, 'default', event.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                  </div>

                  {'high' in (templates[category] || {}) && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">High Urgency Recommendation</label>
                      <textarea
                        value={templates[category]?.high || ''}
                        onChange={(event) => handleTemplateChange(category, 'high', event.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Routing Destination</label>
                    <input
                      value={routing[category] || ''}
                      onChange={(event) => handleRoutingChange(category, event.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">⌨️ Keyboard Shortcuts</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Analyze message</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">⌘/Ctrl + Enter</kbd>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Clear form</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Escape</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
