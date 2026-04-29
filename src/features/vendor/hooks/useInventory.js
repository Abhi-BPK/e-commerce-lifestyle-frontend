// Loads the inventory variant list and exposes a stock-update action.
// Optimistic: updates the row in UI immediately before the service resolves.

import { useState, useEffect, useCallback } from 'react'
import { getInventory, updateInventoryStock } from '../services/vendor.inventory.service'
import logger from '../../../logger/logger.service'

export function useInventory() {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    getInventory()
      .then(setInventory)
      .catch((err) => { setError('Failed to load inventory'); logger.error('useInventory fetch', err) })
      .finally(() => setLoading(false))
  }, [])

  // Inline-edit stock: optimistic update, roll back if service fails
  const handleUpdateStock = useCallback(async (id, newStock) => {
    const prev = inventory.find((item) => item.id === id)

    // Optimistic — compute new status client-side to match service logic
    const status = newStock === 0 ? 'Out of Stock' : newStock < 5 ? 'Low Stock' : 'In Stock'
    setInventory((list) =>
      list.map((item) => (item.id === id ? { ...item, stock: newStock, status } : item)),
    )

    try {
      const updated = await updateInventoryStock(id, newStock)
      // Sync with server's authoritative copy (timestamps, etc.)
      setInventory((list) => list.map((item) => (item.id === id ? updated : item)))
    } catch (err) {
      // Roll back to previous value
      setInventory((list) => list.map((item) => (item.id === id ? prev : item)))
      logger.error('updateInventoryStock failed', err)
      throw err
    }
  }, [inventory])

  const lowStockCount = inventory.filter((item) => item.stock < 5).length

  return { inventory, loading, error, lowStockCount, updateStock: handleUpdateStock }
}
