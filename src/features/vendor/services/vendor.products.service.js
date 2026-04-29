// Vendor products service — real .NET Core API calls.
// Base URL is handled by the Axios instance (VITE_API_URL=/api, proxied to localhost:5000).
// No try/catch here — the Axios response interceptor in interceptors.js
// normalises every error into { status, message, field, code } and rejects with it.
// The hooks catch that shape and surface it to the UI.

import api from '../../../api/axios.instance'

// GET /api/vendor/products
export async function getProducts() {
  const response = await api.get('/vendor/products')
  return response.data
}

// POST /api/vendor/products
export async function addProduct(data) {
  const response = await api.post('/vendor/products', data)
  return response.data
}

// PUT /api/vendor/products/{id}
export async function updateProduct(id, data) {
  const response = await api.put(`/vendor/products/${id}`, data)
  return response.data
}

// DELETE /api/vendor/products/{id}
export async function deleteProduct(id) {
  await api.delete(`/vendor/products/${id}`)
}

// PATCH /api/vendor/products/{id}/status  — backend toggles the value server-side
export async function toggleProductStatus(id) {
  const response = await api.patch(`/vendor/products/${id}/status`)
  return response.data
}
