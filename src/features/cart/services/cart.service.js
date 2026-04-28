// cart.service — talks to the per-user Cart endpoints on the backend.
//
// All five endpoints require a JWT (set automatically by the request
// interceptor in src/api/interceptors.js once the user is logged in).
// The user is always logged in when these run — the cart page lives behind
// ProtectedLayout, which redirects to /login if there's no token.
//
// Backend response shapes (CartItemDto):
//   {
//     id:         number,   // server-assigned cart row PK (use this for PUT/DELETE)
//     productId:  string,
//     name:       string,
//     price:      number,
//     image:      string,
//     quantity:   number,
//     addedAt:    string (ISO timestamp),
//   }
//
// Important detail — the backend's POST /api/cart is an UPSERT. If the user
// already has that productId in their cart, it adds to the existing quantity
// instead of creating a duplicate row. So the frontend doesn't need to check
// "does this product already exist?" before calling addItem.

import api from '../../../api/axios.instance'

// GET /api/cart  →  { items: CartItemDto[] }
// We unwrap and just return the items array.
export async function getCart() {
  const response = await api.get('/cart')
  return response.data.items
}

// POST /api/cart  → CartItemDto (the upserted row)
//
// We don't use the returned row directly — the calling hook re-fetches the
// full cart afterwards so Redux state always matches the server. Re-fetching
// is fine here because carts are tiny (a handful of items).
export async function addItem({ productId, quantity = 1 }) {
  const response = await api.post('/cart', { productId, quantity })
  return response.data
}

// PUT /api/cart/{id}  → CartItemDto
// `id` is the cart-row PK (item.id), NOT the productId.
export async function updateItem(id, quantity) {
  const response = await api.put(`/cart/${id}`, { quantity })
  return response.data
}

// DELETE /api/cart/{id}  → 204 No Content
// `id` is the cart-row PK (item.id).
export async function removeItem(id) {
  await api.delete(`/cart/${id}`)
}

// DELETE /api/cart  → 204 No Content (clears the user's whole cart)
export async function clearCart() {
  await api.delete('/cart')
}
