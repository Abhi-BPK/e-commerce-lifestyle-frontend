// Manages the vendor's product list with optimistic CRUD.
// Optimistic update = update the UI immediately, then call the service.
// If the service rejects (simulated error), the old state is restored.

import { useState, useEffect, useCallback } from 'react'
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} from '../services/vendor.products.service'
import logger from '../../../logger/logger.service'

export function useProducts() {
  const [products, setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  // Initial fetch — also derives the distinct category list from the product data
  // so the ProductFormModal can show real categories instead of hardcoded ones.
  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data)
        // Extract unique non-empty category values from the product list
        setCategories([...new Set(data.map((p) => p.category).filter(Boolean))])
      })
      .catch((err) => { setError('Failed to load products'); logger.error('useProducts fetch', err) })
      .finally(() => setLoading(false))
  }, [])

  // Add a new product — optimistic: add immediately, remove on failure
  const handleAdd = useCallback(async (data) => {
    const tempId = `temp-${Date.now()}`
    const optimistic = { ...data, id: tempId, unitsSold: 0 }
    setProducts((prev) => [...prev, optimistic])
    try {
      const created = await addProduct(data)
      // Replace the temporary optimistic entry with the server's real entry
      setProducts((prev) => prev.map((p) => (p.id === tempId ? created : p)))
    } catch (err) {
      setProducts((prev) => prev.filter((p) => p.id !== tempId))
      logger.error('addProduct failed', err)
      throw err
    }
  }, [])

  // Edit an existing product — optimistic: apply immediately, roll back on failure
  const handleUpdate = useCallback(async (id, data) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
    try {
      await updateProduct(id, data)
    } catch (err) {
      // Refetch to restore correct state
      const fresh = await getProducts()
      setProducts(fresh)
      logger.error('updateProduct failed', err)
      throw err
    }
  }, [])

  // Delete — remove immediately, restore on failure
  const handleDelete = useCallback(async (id) => {
    const snapshot = [...products]
    setProducts((prev) => prev.filter((p) => p.id !== id))
    try {
      await deleteProduct(id)
    } catch (err) {
      setProducts(snapshot)
      logger.error('deleteProduct failed', err)
      throw err
    }
  }, [products])

  // Toggle active/inactive — flip immediately, restore on failure
  const handleToggleStatus = useCallback(async (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p,
      ),
    )
    try {
      await toggleProductStatus(id)
    } catch (err) {
      const fresh = await getProducts()
      setProducts(fresh)
      logger.error('toggleProductStatus failed', err)
      throw err
    }
  }, [])

  return {
    products,
    categories,
    loading,
    error,
    addProduct:     handleAdd,
    updateProduct:  handleUpdate,
    deleteProduct:  handleDelete,
    toggleStatus:   handleToggleStatus,
  }
}
