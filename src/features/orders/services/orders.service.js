// orders.service — talks to the per-user Orders endpoints.
//
// All three endpoints require a JWT (the request interceptor adds the
// Authorization header automatically). Backend wraps GET responses in
// `{ orders: [...] }` and `{ order: {...} }` envelopes — we unwrap them
// here so callers receive a plain array / object.
//
// Errors bubble out as the normalized shape from the response interceptor.

import api from '../../../api/axios.instance'

// GET /api/orders → { orders: OrderDto[] }
export async function getOrders() {
  const response = await api.get('/orders')
  return response.data.orders
}

// GET /api/orders/{id} → { order: OrderDto }
export async function getOrderById(id) {
  const response = await api.get(`/orders/${encodeURIComponent(id)}`)
  return response.data.order
}

// POST /api/orders → OrderDto
//
// Body shape (PlaceOrderRequest):
//   { items: OrderItemDto[], subtotal, shipping, tax, total, shippingAddress }
// The backend persists the order and the items snapshot, but does NOT clear
// the cart — the caller (usePlaceOrder) handles that explicitly.
export async function placeOrder(orderData) {
  const response = await api.post('/orders', orderData)
  return response.data
}
