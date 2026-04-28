// usePlaceOrder — submits the checkout form to POST /api/orders.
//
// Flow:
//   1. Build the PlaceOrderRequest body from the current cart + the form's
//      shipping fields (CheckoutForm collects firstName, lastName, line1,
//      city, state, zip — we add country='India' so the backend's required
//      country field is satisfied without changing the UI).
//   2. POST to the backend; on success it returns the persisted OrderDto.
//   3. Clear the cart on the server (POST /orders does NOT auto-clear it)
//      and locally; useCart.clearCart handles both.
//   4. Navigate to /orders/{id} so the user lands on their new order.
//
// Cart items are now flat (`{ id, productId, name, price, image, quantity }`)
// because Redux mirrors the backend's CartItemDto shape — no `i.product.x`
// indirection any more.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { placeOrder } from '../services/orders.service'
import { useCart } from '../../cart/hooks/useCart'
import { ROUTES, TAX_RATE } from '../../../shared/utils/constants'
import logger from '../../../logger/logger.service'

export function usePlaceOrder() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()

  async function submitOrder(shippingData) {
    setIsLoading(true)
    setError(null)

    const tax = subtotal * TAX_RATE
    const orderData = {
      // Map the Redux cart rows into OrderItemDto shape — the backend stores
      // these as a snapshot so the order keeps the price/name/image even if
      // the product is later deleted or repriced.
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
      subtotal,
      shipping: 0,
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat((subtotal + tax).toFixed(2)),
      // CheckoutForm doesn't have a country field — every store user is
      // shipped within India for now, so we hard-code it. If you ever add an
      // international option, surface a country dropdown in CheckoutForm
      // and remove this default.
      shippingAddress: { ...shippingData, country: 'India' },
    }

    try {
      const order = await placeOrder(orderData)
      // clearCart() is async — it DELETEs /api/cart and blanks Redux. We
      // await so the user lands on the order page with an empty cart icon.
      await clearCart()
      logger.info('Order placed', { orderId: order.id, total: order.total })
      navigate(ROUTES.ORDER_DETAIL(order.id), { state: { order, isNew: true } })
    } catch (err) {
      // err is the normalized error from the response interceptor
      setError(err)
      logger.error('Failed to place order', err)
    } finally {
      setIsLoading(false)
    }
  }

  return { submitOrder, isLoading, error }
}
