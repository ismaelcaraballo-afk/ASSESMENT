import { useState, useEffect, useCallback } from 'react'
import { useToast } from '../context/ToastContext'

// Pure function to compute dashboard data from history
function computeDashboardData(history) {
  const today = new Date().toDateString()
  const todayMessages = history.filter(item => 
    new Date(item.timestamp).toDateString() === today
  )

  const highUrgency = history.filter(h => h.urgency === 'High').length
  const needsReview = history.filter(h => h.needsReview).length
  const escalated = history.filter(h => h.escalate).length
  const piiDetected = history.filter(h => h.piiFindings?.length > 0).length
  const confidenceSum = history.reduce((sum, h) => sum + (h.confidence || 0), 0)
  
  const uniqueDays = new Set(history.map(h => new Date(h.timestamp).toDateString())).size
  const totalDays = uniqueDays > 0 ? uniqueDays : 1
  
  const stats = {
    total: history.length,
    today: todayMessages.length,
    highUrgencyPercent: history.length > 0 ? Math.round((highUrgency / history.length) * 100) : 0,
    avgPerDay: Math.round(history.length / totalDays),
    needsReviewPercent: history.length > 0 ? Math.round((needsReview / history.length) * 100) : 0,
    escalationRate: history.length > 0 ? Math.round((escalated / history.length) * 100) : 0,
    avgConfidence: history.length > 0 ? Math.round((confidenceSum / history.length) * 100) : 0,
    piiDetectedCount: piiDetected
  }

  const categories = {}
  history.forEach(item => {
    categories[item.category] = (categories[item.category] || 0) + 1
  })
  const categoryData = Object.entries(categories).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)

  const urgency = { High: 0, Medium: 0, Low: 0 }
  history.forEach(item => {
    urgency[item.urgency] = (urgency[item.urgency] || 0) + 1
  })

  const sentiments = {}
  history.forEach(item => {
    if (item.sentiment) {
      sentiments[item.sentiment] = (sentiments[item.sentiment] || 0) + 1
    }
  })

  const recentHighUrgency = history
    .filter(h => h.urgency === 'High')
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5)

  const trend = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toDateString()
    const dayMessages = history.filter(h => new Date(h.timestamp).toDateString() === dateStr)
    trend.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      count: dayMessages.length,
      high: dayMessages.filter(m => m.urgency === 'High').length
    })
  }

  return { stats, categoryData, urgencyData: urgency, sentimentData: sentiments, recentHighUrgency, weeklyTrend: trend }
}

function getInitialDashboardData() {
  const history = JSON.parse(localStorage.getItem('triageHistory') || '[]')
  return computeDashboardData(history)
}

function DashboardPage() {
  const initialData = getInitialDashboardData()
  const [stats, setStats] = useState(initialData.stats)
  const [categoryData, setCategoryData] = useState(initialData.categoryData)
  const [urgencyData, setUrgencyData] = useState(initialData.urgencyData)
  const [sentimentData, setSentimentData] = useState(initialData.sentimentData)
  const [recentHighUrgency, setRecentHighUrgency] = useState(initialData.recentHighUrgency)
  const [weeklyTrend, setWeeklyTrend] = useState(initialData.weeklyTrend)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const { info } = useToast()

  const loadDashboardData = useCallback(() => {
    const history = JSON.parse(localStorage.getItem('triageHistory') || '[]')
    const data = computeDashboardData(history)
    setStats(data.stats)
    setCategoryData(data.categoryData)
    setUrgencyData(data.urgencyData)
    setSentimentData(data.sentimentData)
    setRecentHighUrgency(data.recentHighUrgency)
    setWeeklyTrend(data.weeklyTrend)
  }, [])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      loadDashboardData()
    }, 30000) // 30 seconds
    return () => clearInterval(interval)
  }, [autoRefresh, loadDashboardData])

  const maxTrendCount = Math.max(...weeklyTrend.map(d => d.count), 1)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Overview of message triage analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                loadDashboardData()
                info('Dashboard refreshed')
              }}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold transition-colors"
            >
              🔄 Refresh
            </button>
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              Auto-refresh (30s)
            </label>
          </div>
        </div>

        {/* Stats Cards - Row 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Messages</div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Today</div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.today}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">High Urgency</div>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.highUrgencyPercent}%</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Per Day</div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.avgPerDay}</div>
          </div>
        </div>

        {/* Stats Cards - Row 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Needs Review</div>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.needsReviewPercent}%</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Escalation Rate</div>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.escalationRate}%</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Confidence</div>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.avgConfidence}%</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">PII Detected</div>
            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">{stats.piiDetectedCount}</div>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📈 Weekly Trend</h2>
          {stats.total === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">No data yet</div>
          ) : (
            <div className="flex items-end gap-2 h-40">
              {weeklyTrend.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col gap-1" style={{ height: '120px' }}>
                    <div 
                      className="w-full bg-blue-500 dark:bg-blue-600 rounded-t transition-all"
                      style={{ 
                        height: `${(day.count / maxTrendCount) * 100}%`,
                        minHeight: day.count > 0 ? '4px' : '0'
                      }}
                      title={`${day.count} messages`}
                    />
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">{day.date}</div>
                  <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">{day.count}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Category Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Category Distribution</h2>
            {categoryData.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">No data yet</div>
            ) : (
              <div className="space-y-3">
                {categoryData.map((cat) => {
                  const percentage = stats.total > 0 ? (cat.count / stats.total) * 100 : 0
                  return (
                    <div key={cat.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-300">{cat.name}</span>
                        <span className="text-gray-600 dark:text-gray-400">{cat.count} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 dark:bg-blue-600 h-2 rounded-full transition-all"
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Urgency Breakdown</h2>
            {stats.total === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">No data yet</div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                    <span className="text-gray-700 dark:text-gray-300">High</span>
                  </div>
                  <span className="text-2xl font-bold text-red-600 dark:text-red-400">{urgencyData.High}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                    <span className="text-gray-700 dark:text-gray-300">Medium</span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{urgencyData.Medium}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                    <span className="text-gray-700 dark:text-gray-300">Low</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">{urgencyData.Low}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sentiment Distribution */}
        {Object.keys(sentimentData).length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">😊 Sentiment Distribution</h2>
            <div className="flex flex-wrap gap-4">
              {Object.entries(sentimentData).map(([sentiment, count]) => {
                const emoji = sentiment === 'positive' ? '😊' : sentiment === 'negative' ? '😟' : sentiment === 'frustrated' ? '😤' : '😐'
                const colors = sentiment === 'positive' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                  : sentiment === 'negative' || sentiment === 'frustrated' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                return (
                  <div key={sentiment} className={`${colors} px-4 py-3 rounded-lg`}>
                    <span className="text-2xl mr-2">{emoji}</span>
                    <span className="font-semibold capitalize">{sentiment}</span>
                    <span className="ml-2 font-bold">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Recent High Urgency */}
        {recentHighUrgency.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🚨 Recent High Urgency</h2>
            <div className="space-y-3">
              {recentHighUrgency.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-l-4 border-red-500 pl-4 py-2 bg-red-50 dark:bg-red-900/10 rounded-r">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(item.timestamp).toLocaleString()}</div>
                    <div className="text-gray-800 dark:text-gray-200 truncate">{item.message?.substring(0, 80)}...</div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 py-1 rounded">{item.category}</span>
                    {item.escalate && <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 px-2 py-1 rounded">Escalated</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h2 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">💡 Insights</h2>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
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
            {stats.total > 0 && stats.highUrgencyPercent <= 30 && stats.needsReviewPercent <= 40 && stats.avgConfidence >= 60 && (
              <p>✅ System is performing well! All metrics are within healthy ranges.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
