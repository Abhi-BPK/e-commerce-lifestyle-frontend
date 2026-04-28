import { useEffect, useState } from 'react'
import { getOrders } from '../services/orders.service'
import logger from '../../../logger/logger.service'

export function useOrderHistory() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // setState calls live inside the .then/.catch/.finally callbacks (not in
  // the effect body) to satisfy the react-hooks/set-state-in-effect rule.
  // Initial state is already isLoading=true so the first paint shows a
  // loading state without us having to set it again here.
  useEffect(() => {
    let cancelled = false

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
