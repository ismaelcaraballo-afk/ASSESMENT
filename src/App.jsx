import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import AnalyzePage from './pages/AnalyzePage'
import BulkAnalyzePage from './pages/BulkAnalyzePage'
import HistoryPage from './pages/HistoryPage'
import DashboardPage from './pages/DashboardPage'
import SettingsPage from './pages/SettingsPage'
import { useTheme } from './context/ThemeContext'
import SkipLink from './components/SkipLink'

function App() {
  const { isDark } = useTheme()
  
  return (
    <Router>
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <SkipLink />
        <Navigation />
        <main id="main-content" tabIndex={-1} className="outline-none">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/bulk" element={<BulkAnalyzePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
