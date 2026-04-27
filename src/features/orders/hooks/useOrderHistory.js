import { useEffect, useState } from 'react'
import { getOrders } from '../services/orders.service'
import logger from '../../../logger/logger.service'

export function useOrderHistory() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    getOrders()
      .then((data) => {
        if (!cancelled) setOrders(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err)
          logger.error('Failed to load orders', err)
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { orders, isLoading, error }
}
