import { useEffect, useState } from 'react'
import { CATEGORIES, DEFAULT_ROUTING, DEFAULT_TEMPLATES, getSettings, resetSettings, saveSettings } from '../utils/settings'

function SettingsPage() {
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES)
  const [routing, setRouting] = useState(DEFAULT_ROUTING)
  const [saved, setSaved] = useState(false)

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
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    resetSettings()
    setTemplates(DEFAULT_TEMPLATES)
    setRouting(DEFAULT_ROUTING)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Triage Settings</h1>
          <p className="text-gray-600">Customize recommendations and routing per category.</p>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Save Settings
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-semibold"
            >
              Reset Defaults
            </button>
            {saved && <span className="text-green-600 text-sm font-semibold">Saved</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {CATEGORIES.map(category => (
            <div key={category} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">{category}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Default Recommendation</label>
                  <textarea
                    value={templates[category]?.default || ''}
                    onChange={(event) => handleTemplateChange(category, 'default', event.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {'high' in (templates[category] || {}) && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">High Urgency Recommendation</label>
                    <textarea
                      value={templates[category]?.high || ''}
                      onChange={(event) => handleTemplateChange(category, 'high', event.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Routing Destination</label>
                  <input
                    value={routing[category] || ''}
                    onChange={(event) => handleRoutingChange(category, event.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
