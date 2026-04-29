// Loads vendor orders, manages active filter tab, and handles status updates.
// Status update is optimistic — flips the badge instantly, rolls back on error.

import { useState, useEffect, useCallback, useMemo } from 'react'
import { getOrders, updateOrderStatus } from '../services/vendor.orders.service'
import logger from '../../../logger/logger.service'

export const ALL_FILTER = 'All'

export function useOrders() {
  const [orders, setOrders]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [activeFilter, setFilter]     = useState(ALL_FILTER)

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch((err) => { setError('Failed to load orders'); logger.error('useOrders fetch', err) })
      .finally(() => setLoading(false))
  }, [])

  // Filtered list derived from the active tab — no extra state needed
  const filteredOrders = useMemo(
    () => (activeFilter === ALL_FILTER ? orders : orders.filter((o) => o.status === activeFilter)),
    [orders, activeFilter],
  )

  // Optimistic status update: flip immediately, restore on failure
  const handleUpdateStatus = useCallback(async (id, status) => {
    const prev = orders.find((o) => o.id === id)
    setOrders((list) => list.map((o) => (o.id === id ? { ...o, status } : o)))
    try {
      await updateOrderStatus(id, status)
    } catch (err) {
      setOrders((list) => list.map((o) => (o.id === id ? prev : o)))
      logger.error('updateOrderStatus failed', err)
      throw err
    }
  }, [orders])

  return {
    orders,
    filteredOrders,
    loading,
    error,
    activeFilter,
    setFilter,
    updateStatus: handleUpdateStatus,
  }
}
