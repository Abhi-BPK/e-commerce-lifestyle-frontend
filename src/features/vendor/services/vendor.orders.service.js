// Vendor orders service — real .NET Core API calls.
// Each row represents one OrderItem (not a whole Order), so `id` here is the
// OrderItem ID — an integer from the backend.
// Valid status values: Pending, Processing, Shipped, Delivered, Cancelled

import api from '../../../api/axios.instance'

export const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

// GET /api/vendor/orders
export async function getOrders() {
  const response = await api.get('/vendor/orders')
  return response.data
}

// PATCH /api/vendor/orders/{id}/status
// Body: { status: string }
export async function updateOrderStatus(id, status) {
  const response = await api.patch(`/vendor/orders/${id}/status`, { status })
  return response.data
}
