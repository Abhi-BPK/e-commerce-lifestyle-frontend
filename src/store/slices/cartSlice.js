// Cart slice — owns the CLIENT-SIDE mirror of the user's server cart.
//
// Before backend integration this slice held its own truth (added/removed
// items locally). Now the server is the single source of truth, and this
// slice just caches the latest snapshot we got from the API.
//
// Pattern:
//   1. Component calls useCart's addToCart / updateQuantity / removeFromCart.
//   2. The hook hits the backend (cart.service).
//   3. The hook calls cart.service.getCart() to grab the canonical list.
//   4. The hook dispatches setCart(items) here so every subscriber re-renders
//      with the new server-confirmed state.
//
// We keep clearCart as a *local-only* reducer because we sometimes want to
// blank Redux without hitting the network — for example after logout.
//
// Item shape (matches backend CartItemDto exactly, camelCase):
//   { id, productId, name, price, image, quantity, addedAt }

import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    // Replace the cart with a server response. Used after every mutation
    // (add / update / remove) and on app-startup hydration.
    setCart(state, action) {
      state.items = action.payload
    },

    // Local-only blank — no API call. Useful on logout.
    clearCart(state) {
      state.items = []
    },
  },
})

export const { setCart, clearCart } = cartSlice.actions

// ── Selectors ────────────────────────────────────────────────────────────
// Derived values stay as selectors so they recompute when items change.
export const selectCartItems = (state) => state.cart.items

export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0)

// Subtotal reads `item.price` directly — items are flat rows from the server
// (no nested `product` object).
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

export const selectCartIsEmpty = (state) => state.cart.items.length === 0

export default cartSlice.reducer
