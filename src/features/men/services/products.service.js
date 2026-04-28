// products.service — talks to the Men's Clothing endpoints on the backend.
//
// Why this lives in features/men/services and not a generic /services folder:
// each feature in this app owns its own service file (auth, cart, orders, men).
// That keeps related code close together and the feature easy to delete or
// move later. The shared Axios instance is what ties them all to the same
// base URL and the same auth/error handling.
//
// Notes for a beginner:
//  - We DON'T wrap calls in try/catch here. The Axios response interceptor
//    in src/api/interceptors.js already converts every error into the same
//    `{ status, message, field, code }` shape. The hook (useMenProducts /
//    MenProductDetail) handles that shape and decides what to show the user.
//  - Backend wraps the /men endpoints in `{ products: [...] }` and
//    `{ product: {...} }` envelopes — we unwrap them here so callers get a
//    plain array / plain object.

import api from '../../../api/axios.instance'

// GET /api/products/men?subcategory=casual
// Returns: ProductDto[]  (an empty array if no products in that subcategory)
export async function getMenProducts(subcategory) {
  // Axios serializes the params object into ?subcategory=... for us.
  // If subcategory is null/undefined we omit the param entirely.
  const params = subcategory ? { subcategory } : undefined

  const response = await api.get('/products/men', { params })
  return response.data.products
}

// GET /api/products/men/{id}
// Returns: ProductDto  (or null is never returned — the backend 404s if missing,
// which the interceptor turns into a thrown normalized error)
export async function getMenProductById(id) {
  const response = await api.get(`/products/men/${encodeURIComponent(id)}`)
  return response.data.product
}
