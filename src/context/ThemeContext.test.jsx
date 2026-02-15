import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../context/ThemeContext'

// Test component that uses the hook
function TestComponent() {
  const { isDark, toggleTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme-state">{isDark ? 'dark' : 'light'}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  )
}

describe('ThemeContext', () => {
  it('provides theme state to children', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    expect(screen.getByTestId('theme-state')).toBeInTheDocument()
  })

  it('defaults to light theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    expect(screen.getByTestId('theme-state').textContent).toBe('light')
  })

  it('toggles theme on button click', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    const button = screen.getByText('Toggle')
    fireEvent.click(button)
    expect(screen.getByTestId('theme-state').textContent).toBe('dark')
  })

  it('toggles back to light', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    const button = screen.getByText('Toggle')
    fireEvent.click(button) // light -> dark
    fireEvent.click(button) // dark -> light
    expect(screen.getByTestId('theme-state').textContent).toBe('light')
  })
})
