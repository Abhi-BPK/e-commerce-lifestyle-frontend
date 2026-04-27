// Tests for Navbar — checks that brand, nav links, cart badge, and user
// initials render correctly based on auth and cart state.
// renderWithProviders already wraps with Provider + MemoryRouter + AuthProvider,
// so Navbar's useAuth() and Redux hooks all work without extra setup.

import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../test/testUtils'
import { Navbar } from './Navbar'

// ── Fixtures ──────────────────────────────────────────────────────
const mockUser = {
  id: '1',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@test.com',
  role: 'user',
}

function renderNavbar({ user = mockUser, cartItems = [] } = {}) {
  const token = user ? 'mock.token' : null
  return renderWithProviders(<Navbar />, {
    preloadedState: {
      auth: { token, user },
      cart: { items: cartItems },
    },
  })
}

// ── Tests ─────────────────────────────────────────────────────────
describe('Navbar', () => {
  it('renders the DOPPEY brand wordmark', () => {
    renderNavbar()
    expect(screen.getByText('DOPPEY')).toBeInTheDocument()
  })

  it('renders the Products nav link', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: /^products$/i })).toBeInTheDocument()
  })

  it('renders the Orders nav link', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: /^orders$/i })).toBeInTheDocument()
  })

  it('renders the cart button with aria-label', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: /cart/i })).toBeInTheDocument()
  })

  it('shows no badge when the cart is empty', () => {
    renderNavbar({ cartItems: [] })
    // Badge only renders when count > 0 — should not show "0"
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('shows the correct total cart count badge', () => {
    const cartItems = [
      { id: 'p1', product: { id: 'p1', price: 10 }, quantity: 3 },
      { id: 'p2', product: { id: 'p2', price: 20 }, quantity: 2 },
    ]
    renderNavbar({ cartItems })
    // Total count: 3 + 2 = 5
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows user initials in the avatar button', () => {
    renderNavbar()
    // Jane Doe → initials "JD"
    expect(screen.getByText('JD')).toBeInTheDocument()
  })
})
