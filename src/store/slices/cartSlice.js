// Cart slice — owns CLIENT cart state with optimistic updates.
// All mutations happen immediately in Redux (optimistic); when the real
// backend is connected, the onError rollback pattern from useAddToCart
// (see caching rules) will be layered on top.

import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // [{ id, product, quantity }]
  },
  reducers: {
    addToCart(state, action) {
      const { product, quantity = 1 } = action.payload
      const existing = state.items.find((i) => i.id === product.id)
      if (existing) {
        existing.quantity += quantity
      } else {
        state.items.push({ id: product.id, product, quantity })
      }
    },

    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload)
    },

    updateQuantity(state, action) {
      const { productId, quantity } = action.payload
      if (quantity <= 0) {
        state.items = state.items.filter((i) => i.id !== productId)
        return
      }
      const item = state.items.find((i) => i.id === productId)
      if (item) item.quantity = quantity
    },

    clearCart(state) {
      state.items = []
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions

// Selectors — derived values, never stored directly
export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
export const selectCartIsEmpty = (state) => state.cart.items.length === 0

export default cartSlice.reducer
