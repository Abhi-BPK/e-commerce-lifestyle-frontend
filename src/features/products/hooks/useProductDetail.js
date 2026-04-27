import { useEffect, useState } from 'react'
import { getProductById } from '../services/products.service'
import logger from '../../../logger/logger.service'

export function useProductDetail(id) {
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setIsLoading(true)

    getProductById(id)
      .then((data) => {
        if (!cancelled) setProduct(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err)
          logger.error('Failed to load product', err, { id })
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  return { product, isLoading, error }
}
