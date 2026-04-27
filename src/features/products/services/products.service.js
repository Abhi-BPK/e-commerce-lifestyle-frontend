// Mock product service — replace each function body with a real Axios call
// when the .NET Core API is ready. The interface stays the same.

import { MOCK_PRODUCTS } from '../data/mockProducts'

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

// Returns all products, optionally filtered + sorted
export async function getProducts({ category, search, sortBy } = {}) {
  await delay(400)

  let result = [...MOCK_PRODUCTS]

  if (category && category !== 'All') {
    result = result.filter((p) => p.category === category)
  }

  if (search) {
    const q = search.toLowerCase()
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
    )
  }

  if (sortBy === 'price_asc') result.sort((a, b) => a.price - b.price)
  else if (sortBy === 'price_desc') result.sort((a, b) => b.price - a.price)
  else if (sortBy === 'popular') result.sort((a, b) => b.reviewCount - a.reviewCount)

  return result
}

// Returns a single product by id, or null if not found
export async function getProductById(id) {
  await delay(300)
  return MOCK_PRODUCTS.find((p) => p.id === Number(id)) ?? null
}
