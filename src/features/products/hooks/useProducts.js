// Fetches the product list and re-runs whenever filters change.
// Uses a cancelled flag to prevent setState on an unmounted component.

import { useEffect, useState } from 'react'
import { getProducts } from '../services/products.service'
import logger from '../../../logger/logger.service'

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Serialize filters so the effect re-runs only when the values actually change
  const filtersKey = JSON.stringify(filters)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    getProducts(filters)
      .then((data) => {
        if (!cancelled) setProducts(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err)
          logger.error('Failed to load products', err)
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey])

  return { products, isLoading, error }
}
