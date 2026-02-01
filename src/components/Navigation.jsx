import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

function Navigation() {
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const isActive = (path) => {
    return location.pathname === path
  }

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/analyze', label: 'Analyze' },
    { path: '/bulk', label: 'Bulk' },
    { path: '/history', label: 'History' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/settings', label: 'Settings' },
  ]

  return (
    <nav className="bg-blue-600 dark:bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80">
            <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center text-2xl">
              📧
            </div>
            <div>
              <div className="font-bold text-lg">Relay AI</div>
              <div className="text-xs text-blue-200 dark:text-gray-400">Customer Triage</div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 rounded transition-colors ${
                  isActive(path) 
                    ? 'bg-blue-700 dark:bg-gray-700 font-semibold' 
                    : 'hover:bg-blue-500 dark:hover:bg-gray-700'
                }`}
              >
                {label}
              </Link>
            ))}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-full hover:bg-blue-500 dark:hover:bg-gray-700 transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-blue-500 dark:hover:bg-gray-700"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded hover:bg-blue-500 dark:hover:bg-gray-700"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded transition-colors ${
                  isActive(path) 
                    ? 'bg-blue-700 dark:bg-gray-700 font-semibold' 
                    : 'hover:bg-blue-500 dark:hover:bg-gray-700'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
