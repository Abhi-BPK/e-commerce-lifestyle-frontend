// Tests for cartSlice — covers all cart operations and selectors.
// Pure reducer tests: no React or store setup needed.

import { describe, it, expect } from 'vitest'
import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectCartCount,
  selectCartSubtotal,
  selectCartIsEmpty,
} from './cartSlice'

// ── Fixtures ──────────────────────────────────────────────────────
const productA = { id: 'p1', name: 'Widget', price: 25.00, image: '/img/a.jpg' }
const productB = { id: 'p2', name: 'Gadget', price: 10.00, image: '/img/b.jpg' }

// Builds a root state shape that matches the selectors' expectations
function rootState(cartState) {
  return { cart: cartState }
}

// ── Tests ─────────────────────────────────────────────────────────
describe('cartSlice reducer', () => {
  it('starts with an empty items array', () => {
    const state = cartReducer(undefined, { type: '@@INIT' })
    expect(state.items).toEqual([])
  })

  it('addToCart adds a new product with quantity 1', () => {
    const state = cartReducer(undefined, addToCart({ product: productA }))
    expect(state.items).toHaveLength(1)
    expect(state.items[0].product).toEqual(productA)
    expect(state.items[0].quantity).toBe(1)
  })

  it('addToCart increments quantity for an existing product', () => {
    let state = cartReducer(undefined, addToCart({ product: productA }))
    state = cartReducer(state, addToCart({ product: productA }))
    expect(state.items).toHaveLength(1)
    expect(state.items[0].quantity).toBe(2)
  })

  it('addToCart respects a custom quantity payload', () => {
    const state = cartReducer(undefined, addToCart({ product: productA, quantity: 3 }))
    expect(state.items[0].quantity).toBe(3)
  })

  it('removeFromCart removes the specified item', () => {
    let state = cartReducer(undefined, addToCart({ product: productA }))
    state = cartReducer(state, addToCart({ product: productB }))
    // removeFromCart takes a plain productId (not an object)
    state = cartReducer(state, removeFromCart(productA.id))
    expect(state.items).toHaveLength(1)
    expect(state.items[0].product.id).toBe(productB.id)
  })

  it('updateQuantity changes the quantity for the given product', () => {
    let state = cartReducer(undefined, addToCart({ product: productA }))
    state = cartReducer(state, updateQuantity({ productId: productA.id, quantity: 5 }))
    expect(state.items[0].quantity).toBe(5)
  })

  it('updateQuantity removes the item when quantity reaches 0', () => {
    let state = cartReducer(undefined, addToCart({ product: productA }))
    state = cartReducer(state, updateQuantity({ productId: productA.id, quantity: 0 }))
    expect(state.items).toHaveLength(0)
  })

  it('clearCart empties all items', () => {
    let state = cartReducer(undefined, addToCart({ product: productA }))
    state = cartReducer(state, addToCart({ product: productB }))
    state = cartReducer(state, clearCart())
    expect(state.items).toHaveLength(0)
  })
})

describe('cartSlice selectors', () => {
  it('selectCartItems returns the items array', () => {
    const state = { items: [{ id: 'p1', product: productA, quantity: 2 }] }
    expect(selectCartItems(rootState(state))).toHaveLength(1)
  })

  it('selectCartCount sums all quantities', () => {
    const state = {
      items: [
        { id: 'p1', product: productA, quantity: 2 },
        { id: 'p2', product: productB, quantity: 3 },
      ],
    }
    expect(selectCartCount(rootState(state))).toBe(5)
  })

  it('selectCartSubtotal calculates price × quantity for each item', () => {
    // productA: 25.00 × 2 = 50.00 | productB: 10.00 × 3 = 30.00 → 80.00
    const state = {
      items: [
        { id: 'p1', product: productA, quantity: 2 },
        { id: 'p2', product: productB, quantity: 3 },
      ],
    }
    expect(selectCartSubtotal(rootState(state))).toBeCloseTo(80.00)
  })

  it('selectCartIsEmpty returns true for an empty cart', () => {
    expect(selectCartIsEmpty(rootState({ items: [] }))).toBe(true)
  })

  it('selectCartIsEmpty returns false when there are items', () => {
    const state = { items: [{ id: 'p1', product: productA, quantity: 1 }] }
    expect(selectCartIsEmpty(rootState(state))).toBe(false)
  })
})
