// Tests for CartItem — verifies that item details render and that quantity
// controls dispatch the correct Redux actions.

import { describe, it, expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../test/testUtils'
import { CartItem } from './CartItem'

// ── Fixtures ──────────────────────────────────────────────────────
const mockItem = {
  id: 'p1',
  product: {
    id: 'p1',
    name: 'Blue Sneakers',
    price: 89.99,
    image: 'https://picsum.photos/seed/p1/200/250',
    category: 'Footwear',
  },
  quantity: 2,
}

function renderItem(item = mockItem) {
  return renderWithProviders(<CartItem item={item} />, {
    preloadedState: { cart: { items: [item] } },
  })
}

// ── Tests ─────────────────────────────────────────────────────────
describe('CartItem', () => {
  it('renders the product name', () => {
    renderItem()
    expect(screen.getByText('Blue Sneakers')).toBeInTheDocument()
  })

  it('renders the unit price with "each" suffix', () => {
    // Component renders "$89.99 each" in the unit price paragraph
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

  it('decrease button decrements quantity in the store', () => {
    const { store } = renderItem()
    const decreaseBtn = screen.getByRole('button', { name: /decrease quantity/i })
    fireEvent.click(decreaseBtn)
    const items = store.getState().cart.items
    // Qty was 2 → should become 1
    expect(items[0]?.quantity).toBe(1)
  })

  it('increase button increments quantity in the store', () => {
    const { store } = renderItem()
    const increaseBtn = screen.getByRole('button', { name: /increase quantity/i })
    fireEvent.click(increaseBtn)
    const items = store.getState().cart.items
    expect(items[0]?.quantity).toBe(3)
  })

  it('remove button removes the item from the store', () => {
    const { store } = renderItem()
    const removeBtn = screen.getByRole('button', { name: /remove blue sneakers from cart/i })
    fireEvent.click(removeBtn)
    expect(store.getState().cart.items).toHaveLength(0)
  })
})
