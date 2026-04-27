// Custom hook to fetch and filter men's clothing products.
// Mirrors the pattern in useProducts.js — simulates an async data load
// with a short artificial delay, then filters and sorts locally.
// In a real app, you'd replace the mock data import with an Axios call.

import { useState, useEffect } from 'react'
import { menProducts } from '../data/menProducts'

// Sort the products array based on the selected sort option.
// Returns a new sorted array without mutating the original.
function sortProducts(products, sortBy) {
  const copy = [...products]
  switch (sortBy) {
    case 'price_asc':
      return copy.sort((a, b) => a.price - b.price)
    case 'price_desc':
      return copy.sort((a, b) => b.price - a.price)
    case 'popular':
      return copy.sort((a, b) => b.reviewCount - a.reviewCount)
    case 'newest':
    default:
      // menProducts array order already represents "newest first"
      return copy
  }
}

/**
 * useMenProducts — filters and sorts the men's product catalog.
 *
 * @param {Object} params
 * @param {string} params.subcategory - slug like 'formal', 'casual', etc.
 *                                      Pass null / undefined to get all products.
 * @param {string} params.sortBy      - one of the SORT_OPTIONS values
 * @returns {{ products: Array, isLoading: boolean, error: string|null }}
 */
export function useMenProducts({ subcategory = null, sortBy = 'newest' } = {}) {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false // prevents state update if component unmounts mid-fetch

    // Simulate network delay (same 400ms pattern as the existing products service).
    // All setState calls are inside the callback — not synchronously in the effect body —
    // to satisfy the react-hooks/set-state-in-effect lint rule.
    const timer = setTimeout(() => {
      if (cancelled) return

      // Filter by subcategory slug when one is provided
      const filtered = subcategory
        ? menProducts.filter((p) => p.subcategory === subcategory)
        : menProducts

      setProducts(sortProducts(filtered, sortBy))
      setError(null)
      setIsLoading(false)
    }, 400)

    // Cleanup: cancel the timer if subcategory or sortBy changes before it fires
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [subcategory, sortBy]) // re-run whenever filter or sort changes

  return { products, isLoading, error }
}
