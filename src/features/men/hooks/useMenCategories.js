// useMenCategories — builds the live subcategory list for the Men's Clothing landing page.
//
// HOW IT WORKS:
//   1. Calls getMenProducts() with no subcategory filter → gets every men's product.
//   2. Extracts the distinct `subcategory` values (slugs like "formal", "casual").
//   3. For each slug, looks up the known metadata (label, description, cover image)
//      from the static MEN_SUBCATEGORIES array.
//   4. If the slug is brand new (added by a vendor), it derives sensible defaults
//      instead of showing nothing.
//   5. Falls back to the full static list on network error so the page still renders.
//
// WHY NOT just use the static list?
//   Vendors can add products with new category names. Those new categories need to
//   show up on the landing page without a code deploy. This hook makes that automatic.

import { useState, useEffect } from 'react'
import { getMenProducts } from '../services/products.service'
import { MEN_SUBCATEGORIES } from '../data/menCategories'
import logger from '../../../logger/logger.service'

// Build a slug → metadata map for O(1) lookup
const KNOWN_CATEGORIES = Object.fromEntries(MEN_SUBCATEGORIES.map((c) => [c.slug, c]))

// Fallback cover image for vendor-created categories not in the static list
const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop'

export function useMenCategories() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading]   = useState(true)
  const [error, setError]           = useState(null)

  useEffect(() => {
    let cancelled = false

    // Fetch all men's products (no subcategory filter) to get the full category set
    getMenProducts()
      .then((products) => {
        if (cancelled) return

        // Step 1 — collect unique non-empty subcategory slugs
        const slugs = [...new Set(products.map((p) => p.subcategory).filter(Boolean))]

        // Step 2 — map each slug to its metadata, or build defaults for new ones
        const merged = slugs.map(
          (slug) =>
            KNOWN_CATEGORIES[slug] ?? {
              id: slug,
              slug,
              // Convert "summer-wear" → "Summer Wear"
              label: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
              description: 'Explore our collection',
              coverImage: PLACEHOLDER_IMAGE,
            },
        )

        setCategories(merged)
        setIsLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        logger.error('useMenCategories fetch failed', err)
        // Fall back to static data so the landing page never shows a blank grid
        setCategories(MEN_SUBCATEGORIES)
        setError(err)
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { categories, isLoading, error }
}
