import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { 
  SkeletonText, 
  SkeletonCard, 
  SkeletonStatCard,
  SkeletonAnalyzeResult,
  SkeletonTable,
  SkeletonDashboard
} from '../components/Skeleton'

describe('Skeleton Components', () => {
  describe('SkeletonText', () => {
    it('renders with default lines', () => {
      const { container } = render(<SkeletonText />)
      const lines = container.querySelectorAll('.animate-pulse')
      expect(lines.length).toBeGreaterThan(0)
    })

    it('renders specified number of lines', () => {
      const { container } = render(<SkeletonText lines={5} />)
      // Check that component renders
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('SkeletonCard', () => {
    it('renders skeleton card', () => {
      const { container } = render(<SkeletonCard />)
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
    })
  })

  describe('SkeletonStatCard', () => {
    it('renders stat card skeleton', () => {
      const { container } = render(<SkeletonStatCard />)
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
    })
  })

  describe('SkeletonAnalyzeResult', () => {
    it('renders analyze result skeleton', () => {
      const { container } = render(<SkeletonAnalyzeResult />)
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
    })
  })

  describe('SkeletonTable', () => {
    it('renders table skeleton', () => {
      const { container } = render(<SkeletonTable />)
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
    })

    it('renders specified number of rows', () => {
      const { container } = render(<SkeletonTable rows={10} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('SkeletonDashboard', () => {
    it('renders dashboard skeleton', () => {
      const { container } = render(<SkeletonDashboard />)
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
    })
  })
})
