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

  it('renders the Men\'s Clothing nav link', () => {
    // Navbar.jsx line 43 renders the catalog link as "Men's Clothing"
    // (the only product category currently exposed to shoppers).
    renderNavbar()
    expect(screen.getByRole('link', { name: /men's clothing/i })).toBeInTheDocument()
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
    // Cart items use the flat backend CartItemDto shape that the slice now
    // mirrors — selectCartCount reduces over `quantity` so 3 + 2 = 5.
    const cartItems = [
      { id: 1, productId: 'p1', name: 'A', price: 10, image: '', quantity: 3 },
      { id: 2, productId: 'p2', name: 'B', price: 20, image: '', quantity: 2 },
    ]
    renderNavbar({ cartItems })
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows user initials in the avatar button', () => {
    renderNavbar()
    // Jane Doe → initials "JD"
    expect(screen.getByText('JD')).toBeInTheDocument()
  })
})
