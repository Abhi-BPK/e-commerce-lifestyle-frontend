// Tests for CartItem — verifies that cart-row details render and that the
// quantity/remove buttons call the right backend service functions with the
// right cart-row id (NOT the productId).
//
// We mock cart.service so the tests stay fast and don't need a real network.
// The mock captures call args so we can assert against them.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../test/testUtils'
import { CartItem } from './CartItem'

// ── Mock the cart service ────────────────────────────────────────────────
// Every call returns a resolved promise so useCart's async chain doesn't
// blow up; we just want to know that the right function was called with the
// right arguments.
vi.mock('../services/cart.service', () => ({
  getCart:    vi.fn(() => Promise.resolve([])),
  addItem:    vi.fn(() => Promise.resolve()),
  updateItem: vi.fn(() => Promise.resolve()),
  removeItem: vi.fn(() => Promise.resolve()),
  clearCart:  vi.fn(() => Promise.resolve()),
}))
import * as cartApi from '../services/cart.service'

// ── Fixture (flat CartItemDto shape) ─────────────────────────────────────
const mockItem = {
  id: 42,                // cart row PK — what the buttons must pass to PUT/DELETE
  productId: 'p1',
  name: 'Blue Sneakers',
  price: 89.99,
  image: 'https://picsum.photos/seed/p1/200/250',
  quantity: 2,
  addedAt: '2026-04-29T10:00:00Z',
}

function renderItem(item = mockItem) {
  return renderWithProviders(<CartItem item={item} />, {
    preloadedState: { cart: { items: [item] } },
  })
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ── Tests ─────────────────────────────────────────────────────────
describe('CartItem', () => {
  it('renders the product name', () => {
    renderItem()
    expect(screen.getByText('Blue Sneakers')).toBeInTheDocument()
  })

  it('renders the unit price with "each" suffix', () => {
    renderItem()
    expect(screen.getByText(/\$89\.99 each/i)).toBeInTheDocument()
  })

  it('renders the correct quantity', () => {
    renderItem()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders the line total (price × qty)', () => {
    // 89.99 × 2 = 179.98
    renderItem()
    expect(screen.getByText('$179.98')).toBeInTheDocument()
  })

  it('renders the product image with correct alt text', () => {
    renderItem()
    expect(screen.getByRole('img', { name: 'Blue Sneakers' })).toBeInTheDocument()
  })

  it('decrease button calls updateItem with the cart row id and qty-1', () => {
    renderItem()
    fireEvent.click(screen.getByRole('button', { name: /decrease quantity/i }))
    // qty was 2 → expect updateItem(42, 1)
    expect(cartApi.updateItem).toHaveBeenCalledWith(42, 1)
  })

  it('increase button calls updateItem with the cart row id and qty+1', () => {
    renderItem()
    fireEvent.click(screen.getByRole('button', { name: /increase quantity/i }))
    expect(cartApi.updateItem).toHaveBeenCalledWith(42, 3)
  })

  it('remove button calls removeItem with the cart row id', () => {
    renderItem()
    fireEvent.click(screen.getByRole('button', { name: /remove blue sneakers from cart/i }))
    expect(cartApi.removeItem).toHaveBeenCalledWith(42)
  })
})
