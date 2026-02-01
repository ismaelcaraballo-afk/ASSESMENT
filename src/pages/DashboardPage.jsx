import { useState, useEffect } from 'react'

function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    highUrgencyPercent: 0,
    avgPerDay: 0,
    needsReviewPercent: 0,
    escalationRate: 0,
    avgConfidence: 0,
    piiDetectedCount: 0
  })
  const [categoryData, setCategoryData] = useState([])
  const [urgencyData, setUrgencyData] = useState({ High: 0, Medium: 0, Low: 0 })
  const [sentimentData, setSentimentData] = useState({})
  const [recentHighUrgency, setRecentHighUrgency] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = () => {
    const history = JSON.parse(localStorage.getItem('triageHistory') || '[]')
    const today = new Date().toDateString()
    const todayMessages = history.filter(item => 
      new Date(item.timestamp).toDateString() === today
    )

    // Calculate stats
    const highUrgency = history.filter(h => h.urgency === 'High').length
    const needsReview = history.filter(h => h.needsReview).length
    const escalated = history.filter(h => h.escalate).length
    const piiDetected = history.filter(h => h.piiFindings?.length > 0).length
    const confidenceSum = history.reduce((sum, h) => sum + (h.confidence || 0), 0)
    
    // Calculate unique days
    const uniqueDays = new Set(history.map(h => new Date(h.timestamp).toDateString())).size
    const totalDays = uniqueDays > 0 ? uniqueDays : 1
    
    setStats({
      total: history.length,
      today: todayMessages.length,
      highUrgencyPercent: history.length > 0 ? Math.round((highUrgency / history.length) * 100) : 0,
      avgPerDay: Math.round(history.length / totalDays),
      needsReviewPercent: history.length > 0 ? Math.round((needsReview / history.length) * 100) : 0,
      escalationRate: history.length > 0 ? Math.round((escalated / history.length) * 100) : 0,
      avgConfidence: history.length > 0 ? Math.round((confidenceSum / history.length) * 100) : 0,
      piiDetectedCount: piiDetected
    })

    // Category distribution
    const categories = {}
    history.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + 1
    })
    setCategoryData(Object.entries(categories).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count))

    // Urgency breakdown
    const urgency = { High: 0, Medium: 0, Low: 0 }
    history.forEach(item => {
      urgency[item.urgency] = (urgency[item.urgency] || 0) + 1
    })
    setUrgencyData(urgency)

    // Sentiment breakdown
    const sentiments = {}
    history.forEach(item => {
      if (item.sentiment) {
        sentiments[item.sentiment] = (sentiments[item.sentiment] || 0) + 1
      }
    })
    setSentimentData(sentiments)

    // Recent high urgency messages
    setRecentHighUrgency(
      history
        .filter(h => h.urgency === 'High')
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5)
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of message triage analytics</p>
        </div>

        {/* Stats Cards - Row 1 */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Messages</div>
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Today</div>
            <div className="text-3xl font-bold text-green-600">{stats.today}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">High Urgency</div>
            <div className="text-3xl font-bold text-red-600">{stats.highUrgencyPercent}%</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Avg Per Day</div>
            <div className="text-3xl font-bold text-purple-600">{stats.avgPerDay}</div>
          </div>
        </div>

        {/* Stats Cards - Row 2 */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Needs Review</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.needsReviewPercent}%</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Escalation Rate</div>
            <div className="text-3xl font-bold text-orange-600">{stats.escalationRate}%</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Avg Confidence</div>
            <div className="text-3xl font-bold text-indigo-600">{stats.avgConfidence}%</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">PII Detected</div>
            <div className="text-3xl font-bold text-pink-600">{stats.piiDetectedCount}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Category Distribution</h2>
            {categoryData.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No data yet</div>
            ) : (
              <div className="space-y-3">
                {categoryData.map((cat) => {
                  const percentage = stats.total > 0 ? (cat.count / stats.total) * 100 : 0
                  return (
                    <div key={cat.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{cat.name}</span>
                        <span className="text-gray-600">{cat.count} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Urgency Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Urgency Breakdown</h2>
            {stats.total === 0 ? (
              <div className="text-center text-gray-500 py-8">No data yet</div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                    <span className="text-gray-700">High</span>
                  </div>
                  <span className="text-2xl font-bold text-red-600">{urgencyData.High}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                    <span className="text-gray-700">Medium</span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">{urgencyData.Medium}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                    <span className="text-gray-700">Low</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{urgencyData.Low}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent High Urgency */}
        {recentHighUrgency.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🚨 Recent High Urgency</h2>
            <div className="space-y-3">
              {recentHighUrgency.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-l-4 border-red-500 pl-4 py-2">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">{new Date(item.timestamp).toLocaleString()}</div>
                    <div className="text-gray-800 truncate">{item.message.substring(0, 80)}...</div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.category}</span>
                    {item.escalate && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Escalated</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-blue-900 mb-2">💡 Insights</h2>
          <div className="space-y-2 text-sm text-blue-800">
            {stats.highUrgencyPercent > 30 && (
              <p>⚠️ High urgency messages represent {stats.highUrgencyPercent}% of total volume - consider additional support resources</p>
            )}
            {stats.needsReviewPercent > 40 && (
              <p>🔍 {stats.needsReviewPercent}% of messages need manual review - consider improving categorization rules</p>
            )}
            {stats.avgConfidence < 60 && stats.total > 0 && (
              <p>📉 Average confidence is {stats.avgConfidence}% - LLM responses may need prompt tuning</p>
            )}
            {stats.piiDetectedCount > 0 && (
              <p>🔒 PII detected in {stats.piiDetectedCount} message(s) - ensure proper data handling</p>
            )}
            {stats.escalationRate > 25 && (
              <p>📞 Escalation rate is {stats.escalationRate}% - review escalation criteria or add more specialists</p>
            )}
            {stats.today > 10 && (
              <p>📈 High activity today with {stats.today} messages analyzed</p>
            )}
            {stats.total === 0 && (
              <p>👋 Start by analyzing some messages to see insights here</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
