// useMenProducts — fetches Men's-Clothing products from the backend
// and applies client-side sorting.
//
// Why client-side sort?
//   The backend filters by subcategory (the `?subcategory=...` query param)
//   but doesn't expose a sort option. Sorting is cheap on the page-sized
//   slices we get back, and keeping it local means changing the dropdown
//   doesn't trigger a network round-trip.
//
// Lifecycle:
//   1. Component mounts → effect runs → fetch starts → isLoading=true.
//   2. Fetch resolves → setProducts(sorted) → isLoading=false.
//   3. If subcategory changes mid-flight, the `cancelled` flag stops us
//      from writing the stale response into state.

import { useState, useEffect } from 'react'
import { getMenProducts } from '../services/products.service'
import logger from '../../../logger/logger.service'

// Sorts the products array based on the selected sort option.
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
      // Backend returns newest-first by default — leave the order alone.
      return copy
  }
}

/**
 * useMenProducts — fetches and sorts the men's product catalog.
 *
 * @param {Object} params
 * @param {string|null} params.subcategory  slug like 'formal', 'casual', etc.
 *                                          Pass null/undefined for everything.
 * @param {string} params.sortBy            one of the SORT_OPTIONS values.
 * @returns {{ products: Array, isLoading: boolean, error: Object|null }}
 */
export function useMenProducts({ subcategory = null, sortBy = 'newest' } = {}) {
  // Raw list from the backend (unsorted) — we sort separately so a sortBy
  // change doesn't refetch.
  const [rawProducts, setRawProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch whenever the subcategory changes (NOT on sortBy change).
  //
  // Note on linting: the react-hooks/set-state-in-effect rule blocks
  // calling setState synchronously in the effect body. So we don't toggle
  // isLoading=true here — every setState call lives inside the .then/.catch
  // callbacks. Initial state is already isLoading=true; on subsequent
  // subcategory changes the previous list stays visible for the brief
  // moment until the new fetch resolves.
  useEffect(() => {
    let cancelled = false

    getMenProducts(subcategory)
      .then((data) => {
        if (cancelled) return
        setRawProducts(data)
        setError(null)
        setIsLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        // err is the normalized error from the response interceptor
        setError(err)
        setRawProducts([])
        setIsLoading(false)
        logger.error('Failed to load men products', err, { subcategory })
      })

    return () => {
      cancelled = true
    }
  }, [subcategory])

  // Sorting happens AFTER fetch — local-only, no network.
  const products = sortProducts(rawProducts, sortBy)

  return { products, isLoading, error }
}
