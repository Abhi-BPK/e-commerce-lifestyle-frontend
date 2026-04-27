// Tests for ProductCard — checks that product info renders correctly and
// the "Add to Cart" button dispatches the addToCart Redux action.
// Uses renderWithProviders from testUtils so Redux store is available.

import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { renderWithProviders } from '../../../test/testUtils'
import { ProductCard } from './ProductCard'

// ── Fixtures ──────────────────────────────────────────────────────
const mockProduct = {
  id: 'p1',
  name: 'Premium Widget',
  slug: 'premium-widget',
  price: 49.99,
  originalPrice: 79.99,
  rating: 4.5,
  reviewCount: 128,
  badge: 'Sale',
  image: 'https://picsum.photos/seed/p1/400/500',
  inStock: true,
  category: 'Electronics',
}

function renderCard(product = mockProduct) {
  // ProductCard renders a Link so it needs a Router context
  return renderWithProviders(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>
  )
}

// ── Tests ─────────────────────────────────────────────────────────
describe('ProductCard', () => {
  it('renders the product name', () => {
    renderCard()
    expect(screen.getByText('Premium Widget')).toBeInTheDocument()
  })

  it('renders the sale price', () => {
    renderCard()
    expect(screen.getByText('$49.99')).toBeInTheDocument()
  })

  it('renders the original price when provided', () => {
    renderCard()
    expect(screen.getByText('$79.99')).toBeInTheDocument()
  })

  it('renders the badge text', () => {
    renderCard()
    expect(screen.getByText('Sale')).toBeInTheDocument()
  })

  it('renders the product image with correct alt text', () => {
    renderCard()
    const img = screen.getByRole('img', { name: 'Premium Widget' })
    expect(img).toBeInTheDocument()
  })

  it('does not show badge when none is provided', () => {
    renderCard({ ...mockProduct, badge: null })
    expect(screen.queryByText('Sale')).not.toBeInTheDocument()
  })

  it('renders "Add to Cart" button for in-stock products', () => {
    renderCard()
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument()
  })

  it('renders "Out of Stock" text for out-of-stock products', () => {
    renderCard({ ...mockProduct, inStock: false })
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument()
  })

  it('dispatches addToCart when the add button is clicked', () => {
    const { store } = renderCard()
    const button = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(button)
    const cartItems = store.getState().cart.items
    expect(cartItems).toHaveLength(1)
    expect(cartItems[0].product.id).toBe('p1')
  })
})
