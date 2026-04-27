// Mock orders service — swap with real Axios calls when backend is ready.

import { MOCK_ORDERS } from '../data/mockOrders'

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

export async function getOrders() {
  await delay(500)
  return [...MOCK_ORDERS]
}

export async function getOrderById(id) {
  await delay(300)
  return MOCK_ORDERS.find((o) => o.id === id) ?? null
}

// Called after checkout; in production this posts to /api/orders
export async function placeOrder(orderData) {
  await delay(800)
  const newOrder = {
    id: `ORD-${Date.now()}`,
    date: new Date().toISOString(),
    status: 'processing',
    ...orderData,
  }
  return newOrder
}
