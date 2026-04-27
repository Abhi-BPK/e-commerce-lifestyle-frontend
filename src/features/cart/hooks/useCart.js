// Convenience hook that surfaces the cart state and action dispatchers.
// Components import this rather than calling useSelector/useDispatch directly.

import { useDispatch, useSelector } from 'react-redux'
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectCartCount,
  selectCartSubtotal,
  selectCartIsEmpty,
} from '../../../store/slices/cartSlice'
import logger from '../../../logger/logger.service'

export function useCart() {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const count = useSelector(selectCartCount)
  const subtotal = useSelector(selectCartSubtotal)
  const isEmpty = useSelector(selectCartIsEmpty)

  function handleAddToCart(product, quantity = 1) {
    dispatch(addToCart({ product, quantity }))
    logger.info('Item added to cart', { productId: product.id, quantity })
  }

  function handleRemoveFromCart(productId) {
    dispatch(removeFromCart(productId))
    logger.info('Item removed from cart', { productId })
  }

  function handleUpdateQuantity(productId, quantity) {
    dispatch(updateQuantity({ productId, quantity }))
  }

  function handleClearCart() {
    dispatch(clearCart())
  }

  return {
    items,
    count,
    subtotal,
    isEmpty,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
  }
}
