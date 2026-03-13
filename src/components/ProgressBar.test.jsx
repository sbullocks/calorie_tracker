import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgressBar from './ProgressBar'

describe('ProgressBar', () => {
  it('renders without crashing', () => {
    const { container } = render(<ProgressBar value={500} max={2000} />)
    expect(container.firstChild).toBeTruthy()
  })

  it('caps the fill width at 100% when value exceeds max', () => {
    const { container } = render(<ProgressBar value={3000} max={2000} />)
    const fill = container.querySelector('.progress-fill')
    expect(fill.style.width).toBe('100%')
  })

  it('sets width to 50% when value is half of max', () => {
    const { container } = render(<ProgressBar value={1000} max={2000} />)
    const fill = container.querySelector('.progress-fill')
    expect(fill.style.width).toBe('50%')
  })

  it('sets width to 0% when value is 0', () => {
    const { container } = render(<ProgressBar value={0} max={2000} />)
    const fill = container.querySelector('.progress-fill')
    expect(fill.style.width).toBe('0%')
  })

  it('applies a custom color when provided', () => {
    const { container } = render(<ProgressBar value={500} max={2000} color="var(--red)" />)
    const fill = container.querySelector('.progress-fill')
    expect(fill.style.background).toBe('var(--red)')
  })

  it('handles max of 0 without dividing by zero', () => {
    const { container } = render(<ProgressBar value={0} max={0} />)
    const fill = container.querySelector('.progress-fill')
    expect(fill).toBeTruthy()
  })
})
