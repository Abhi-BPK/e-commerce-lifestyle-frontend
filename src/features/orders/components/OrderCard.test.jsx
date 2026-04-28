// Tests for OrderCard — checks that order summary info and thumbnail images
// render correctly, and that the card links to the correct order detail page.

import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../test/testUtils'
import { OrderCard } from './OrderCard'

// ── Fixtures ──────────────────────────────────────────────────────
const mockOrder = {
  id: 'ORD-2025-001',
  date: '2025-03-15T10:30:00Z',
  status: 'delivered',
  total: 159.98,
  subtotal: 139.98,
  tax: 14.00,
  items: [
    {
      productId: 'p1',
      name: 'Blue Sneakers',
      price: 69.99,
      quantity: 2,
      image: 'https://picsum.photos/seed/p1/200/250',
    },
    {
      productId: 'p2',
      name: 'White T-Shirt',
      price: 19.99,
      quantity: 1,
      image: 'https://picsum.photos/seed/p2/200/250',
    },
  ],
  // Matches the backend ShippingAddressDto (firstName + lastName + country)
  shippingAddress: {
    firstName: 'Jane',
    lastName: 'Doe',
    line1: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'India',
  },
}

function renderCard(order = mockOrder) {
  return renderWithProviders(<OrderCard order={order} />)
}

// ── Tests ─────────────────────────────────────────────────────────
describe('OrderCard', () => {
  it('renders the order ID', () => {
    renderCard()
    expect(screen.getByText('ORD-2025-001')).toBeInTheDocument()
  })

  it('renders the order total', () => {
    renderCard()
    expect(screen.getByText('$159.98')).toBeInTheDocument()
  })

  it('renders the order status badge', () => {
    renderCard()
    expect(screen.getByText(/delivered/i)).toBeInTheDocument()
  })

  it('renders the item count in the summary line', () => {
    // quantity sums: 2 + 1 = 3 → "3 items"
    renderCard()
    expect(screen.getByText(/3 items/i)).toBeInTheDocument()
  })

  it('renders thumbnail images for items', () => {
    renderCard()
    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThan(0)
  })

  it('links to the correct order detail page', () => {
    renderCard()
    // The entire card is a Link — find it by its href
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/orders/ORD-2025-001')
  })

  it('renders the formatted date using short month (e.g. "Mar")', () => {
    renderCard()
    // OrderCard's formatDate uses { month: 'short' } → "Mar 15, 2025"
    expect(screen.getByText(/mar/i)).toBeInTheDocument()
  })
})
