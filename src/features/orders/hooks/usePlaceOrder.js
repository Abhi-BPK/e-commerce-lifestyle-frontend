import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { placeOrder } from '../services/orders.service'
import { useCart } from '../../cart/hooks/useCart'
import { ROUTES } from '../../../shared/utils/constants'
import logger from '../../../logger/logger.service'

export function usePlaceOrder() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()

  async function submitOrder(shippingData) {
    setIsLoading(true)
    setError(null)

    const tax = subtotal * 0.1
    const orderData = {
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image,
      })),
      subtotal,
      shipping: 0,
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat((subtotal + tax).toFixed(2)),
      shippingAddress: shippingData,
    }

    try {
      const order = await placeOrder(orderData)
      clearCart()
      logger.info('Order placed', { orderId: order.id, total: order.total })
      navigate(ROUTES.ORDER_DETAIL(order.id), { state: { order, isNew: true } })
    } catch (err) {
      setError(err)
      logger.error('Failed to place order', err)
    } finally {
      setIsLoading(false)
    }
  }

  return { submitOrder, isLoading, error }
}
