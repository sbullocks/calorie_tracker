import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Onboarding from './Onboarding'

describe('Onboarding', () => {
  it('renders the app title', () => {
    render(<Onboarding onDone={vi.fn()} />)
    expect(screen.getByText('Calorie Buddy')).toBeInTheDocument()
  })

  it('renders name and goal inputs', () => {
    render(<Onboarding onDone={vi.fn()} />)
    expect(screen.getByPlaceholderText(/e.g. Alex/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/e.g. 1800/i)).toBeInTheDocument()
  })

  it('submit button is disabled when name is empty', () => {
    render(<Onboarding onDone={vi.fn()} />)
    const button = screen.getByRole('button', { name: /get started/i })
    expect(button).toBeDisabled()
  })

  it('submit button is enabled when name and valid goal are entered', () => {
    render(<Onboarding onDone={vi.fn()} />)
    fireEvent.change(screen.getByPlaceholderText(/e.g. Alex/i), { target: { value: 'Alex' } })
    const button = screen.getByRole('button', { name: /get started/i })
    expect(button).not.toBeDisabled()
  })

  it('calls onDone with name and parsed goal on submit', () => {
    const onDone = vi.fn()
    render(<Onboarding onDone={onDone} />)
    fireEvent.change(screen.getByPlaceholderText(/e.g. Alex/i), { target: { value: 'Alex' } })
    fireEvent.change(screen.getByPlaceholderText(/e.g. 1800/i), { target: { value: '1600' } })
    fireEvent.click(screen.getByRole('button', { name: /get started/i }))
    expect(onDone).toHaveBeenCalledWith({ name: 'Alex', goal: 1600 })
  })

  it('does not call onDone when goal is below 500', () => {
    const onDone = vi.fn()
    render(<Onboarding onDone={onDone} />)
    fireEvent.change(screen.getByPlaceholderText(/e.g. Alex/i), { target: { value: 'Alex' } })
    fireEvent.change(screen.getByPlaceholderText(/e.g. 1800/i), { target: { value: '100' } })
    fireEvent.click(screen.getByRole('button', { name: /get started/i }))
    expect(onDone).not.toHaveBeenCalled()
  })

  it('trims whitespace from the name before calling onDone', () => {
    const onDone = vi.fn()
    render(<Onboarding onDone={onDone} />)
    fireEvent.change(screen.getByPlaceholderText(/e.g. Alex/i), { target: { value: '  Alex  ' } })
    fireEvent.click(screen.getByRole('button', { name: /get started/i }))
    expect(onDone).toHaveBeenCalledWith(expect.objectContaining({ name: 'Alex' }))
  })
})
