// Re-exports usePlaceOrder with the checkout form logic.
// Kept as a separate hook so the checkout page doesn't import from orders directly.

export { usePlaceOrder as useCheckout } from '../../orders/hooks/usePlaceOrder'
