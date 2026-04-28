// useCart — every cart mutation in the UI goes through this hook.
//
// What changed when we wired up the backend:
//   - Before: dispatched a Redux action and we were done (client-only state).
//   - Now:    every mutation is an async backend call followed by a re-fetch
//             so Redux stays in lock-step with the server.
//
// Why re-fetch instead of just trusting the server's response?
//   The cart is tiny (handful of items), the round-trip is cheap, and it
//   guarantees the local state always mirrors what's actually in the DB
//   (including server-assigned PKs we'll need for PUT/DELETE).
//
// Errors:
//   The Axios response interceptor normalizes errors into `{ status, message,
//   field, code }` and rejects with that shape. We surface them through a
//   simple `error` state so callers can decide whether to show a toast.

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setCart,
  clearCart as clearCartLocal,
  selectCartItems,
  selectCartCount,
  selectCartSubtotal,
  selectCartIsEmpty,
} from '../../../store/slices/cartSlice'
import * as cartApi from '../services/cart.service'
import logger from '../../../logger/logger.service'

export function useCart() {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const count = useSelector(selectCartCount)
  const subtotal = useSelector(selectCartSubtotal)
  const isEmpty = useSelector(selectCartIsEmpty)

  // Last error from a mutation. Components can ignore it or surface it.
  const [error, setError] = useState(null)

  // ── Helper: pull the latest cart from the server and write it to Redux.
  // Used right after any mutation, and on app-start / login to seed Redux.
  async function refresh() {
    const fresh = await cartApi.getCart()
    dispatch(setCart(fresh))
    return fresh
  }

  // Add a product to the cart (backend upserts — duplicates increment qty).
  async function addToCart(product, quantity = 1) {
    setError(null)
    try {
      await cartApi.addItem({ productId: product.id, quantity })
      await refresh()
      logger.info('Item added to cart', { productId: product.id, quantity })
    } catch (err) {
      setError(err)
      logger.error('Add to cart failed', err)
    }
  }

  // Remove one cart row (cartItemId is the server PK = item.id).
  async function removeFromCart(cartItemId) {
    setError(null)
    try {
      await cartApi.removeItem(cartItemId)
      await refresh()
      logger.info('Item removed from cart', { cartItemId })
    } catch (err) {
      setError(err)
      logger.error('Remove from cart failed', err)
    }
  }

  // Update a row's quantity. quantity <= 0 is treated as "remove".
  async function updateQuantity(cartItemId, quantity) {
    setError(null)
    try {
      if (quantity <= 0) {
        await cartApi.removeItem(cartItemId)
      } else {
        await cartApi.updateItem(cartItemId, quantity)
      }
      await refresh()
    } catch (err) {
      setError(err)
      logger.error('Update quantity failed', err)
    }
  }

  // Clear the user's whole cart on the server, then mirror locally.
  async function clearCart() {
    setError(null)
    try {
      await cartApi.clearCart()
      dispatch(clearCartLocal())
      logger.info('Cart cleared')
    } catch (err) {
      setError(err)
      logger.error('Clear cart failed', err)
    }
  }

  // Pull the server cart into Redux. Used by main.jsx on app start and by
  // useLogin right after a successful sign-in. Doesn't throw — a stale token
  // will be caught by the 401 interceptor which logs the user out.
  async function hydrateCart() {
    try {
      await refresh()
    } catch (err) {
      logger.warn('Cart hydrate failed (likely no session yet)', err)
    }
  }

  return {
    items,
    count,
    subtotal,
    isEmpty,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    hydrateCart,
  }
}
