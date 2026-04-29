// Vendor inventory service — real .NET Core API calls.
// The backend computes status (In Stock / Low Stock / Out of Stock) server-side
// based on the stock value, so the frontend just displays what it receives.
// Note: inventory IDs from the backend are integers.

import api from '../../../api/axios.instance'

// GET /api/vendor/inventory
export async function getInventory() {
  const response = await api.get('/vendor/inventory')
  return response.data
}

// PATCH /api/vendor/inventory/{id}
// Body: { stock: number }
export async function updateInventoryStock(id, newStock) {
  const response = await api.patch(`/vendor/inventory/${id}`, { stock: newStock })
  return response.data
}
