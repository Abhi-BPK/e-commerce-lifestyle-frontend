// Tests for LoginForm — checks rendering, error display, and submit state.
// LoginForm is a controlled component: it receives formAction, state, and
// isPending as props, making it easy to test in isolation.

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LoginForm } from './LoginForm'

// LoginForm renders a <Link> for the signup footer, so it needs a Router context.
function renderLoginForm(overrides = {}) {
  const defaults = {
    formAction: vi.fn(),
    state: null,
    isPending: false,
  }
  return render(
    <MemoryRouter>
      <LoginForm {...defaults} {...overrides} />
    </MemoryRouter>
  )
}

// ── Tests ─────────────────────────────────────────────────────────
describe('LoginForm', () => {
  it('renders email and password inputs', () => {
    renderLoginForm()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('renders a submit button with "Sign In" label', () => {
    renderLoginForm()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows error message when state.success is false and error.message is set', () => {
    // The component checks `state?.success === false` before showing the error
    renderLoginForm({ state: { success: false, error: { message: 'Invalid credentials' } } })
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
  })

  it('does not show error message when state.success is not false', () => {
    // A null state or state without success: false should not show an error
    renderLoginForm({ state: null })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows "Signing in" text and disables button while isPending is true', () => {
    renderLoginForm({ isPending: true })
    const button = screen.getByRole('button', { name: /signing in/i })
    expect(button).toBeDisabled()
  })

  it('accepts user input in the email field', () => {
    renderLoginForm()
    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: 'user@demo.com' } })
    expect(emailInput.value).toBe('user@demo.com')
  })

  it('accepts user input in the password field', () => {
    renderLoginForm()
    const passwordInput = screen.getByLabelText(/password/i)
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    expect(passwordInput.value).toBe('password123')
  })

  it('renders a link to the signup page', () => {
    renderLoginForm()
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
  })
})
