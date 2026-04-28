// Tests for cartSlice — pure reducer tests for the simplified slice that now
// just mirrors the backend cart. The slice has only two actions:
//   - setCart(items)  : replace the cart with a server snapshot
//   - clearCart()     : blank Redux locally (used on logout / after order)
//
// Mutation actions (add/update/remove) live in cart.service + useCart now,
// not the slice — so they're not tested here.

import { describe, it, expect } from 'vitest'
import cartReducer, {
  setCart,
  clearCart,
  selectCartItems,
  selectCartCount,
  selectCartSubtotal,
  selectCartIsEmpty,
} from './cartSlice'

// ── Fixtures (flat CartItemDto shape from the backend) ───────────────────
const itemA = {
  id: 1,
  productId: 'p1',
  name: 'Widget',
  price: 25.0,
  image: '/img/a.jpg',
  quantity: 2,
  addedAt: '2026-04-29T10:00:00Z',
}
const itemB = {
  id: 2,
  productId: 'p2',
  name: 'Gadget',
  price: 10.0,
  image: '/img/b.jpg',
  quantity: 3,
  addedAt: '2026-04-29T10:01:00Z',
}

function rootState(cartState) {
  return { cart: cartState }
}

// ── Reducer ──────────────────────────────────────────────────────────────
describe('cartSlice reducer', () => {
  it('starts with an empty items array', () => {
    const state = cartReducer(undefined, { type: '@@INIT' })
    expect(state.items).toEqual([])
  })

  it('setCart replaces the items list', () => {
    let state = cartReducer(undefined, setCart([itemA]))
    expect(state.items).toEqual([itemA])
    // A second setCart fully replaces — it does not append.
    state = cartReducer(state, setCart([itemB]))
    expect(state.items).toEqual([itemB])
  })

  it('clearCart empties the items list', () => {
    let state = cartReducer(undefined, setCart([itemA, itemB]))
    state = cartReducer(state, clearCart())
    expect(state.items).toEqual([])
  })
})

// ── Selectors ────────────────────────────────────────────────────────────
describe('cartSlice selectors', () => {
  it('selectCartItems returns the items array', () => {
    expect(selectCartItems(rootState({ items: [itemA] }))).toEqual([itemA])
  })

  it('selectCartCount sums quantities across items', () => {
    expect(selectCartCount(rootState({ items: [itemA, itemB] }))).toBe(5)
  })

  it('selectCartSubtotal multiplies price × quantity per item', () => {
    // 25.00 * 2 + 10.00 * 3 = 80
    expect(selectCartSubtotal(rootState({ items: [itemA, itemB] }))).toBeCloseTo(80)
  })

  it('selectCartIsEmpty is true with no items', () => {
    expect(selectCartIsEmpty(rootState({ items: [] }))).toBe(true)
  })

  it('selectCartIsEmpty is false with items', () => {
    expect(selectCartIsEmpty(rootState({ items: [itemA] }))).toBe(false)
  })
})
