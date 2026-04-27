// Checkout page — 2-column layout: form (left) + order summary (right).
// Redirects to cart if the cart is empty so users can't access an empty checkout.

import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCheckout } from '../hooks/useCheckout'
import { useCart } from '../../cart/hooks/useCart'
import { CheckoutForm } from '../components/CheckoutForm'
import { TAX_RATE, ROUTES } from '../../../shared/utils/constants'
import styles from './Checkout.module.css'

export default function Checkout() {
  const { items, subtotal, isEmpty } = useCart()
  const { submitOrder, isLoading, error } = useCheckout()
  const navigate = useNavigate()

  // Guard: cart must have items
  useEffect(() => {
    if (isEmpty) navigate(ROUTES.CART, { replace: true })
  }, [isEmpty, navigate])

  if (isEmpty) return null

  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link to={ROUTES.CART} className={styles.back}>← Back to cart</Link>
        <h1 className={styles.heading}>Checkout</h1>

        <div className={styles.layout}>
          {/* ── Form ────────────────────────────────────────── */}
          <div>
            {error && (
              <div className={styles.errorBanner}>
                {error.message ?? 'Something went wrong. Please try again.'}
              </div>
            )}
            <CheckoutForm onSubmit={submitOrder} isLoading={isLoading} />
          </div>

          {/* ── Order summary ────────────────────────────────── */}
          <aside className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.itemsList}>
              {items.map((item) => (
                <div key={item.id} className={styles.item}>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className={styles.thumb}
                    loading="lazy"
                  />
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.product.name}</p>
                    <p className={styles.itemQty}>Qty: {item.quantity}</p>
                  </div>
                  <p className={styles.itemPrice}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className={styles.divider} />

            <div className={styles.row}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className={styles.row}><span>Shipping</span><span className={styles.free}>Free</span></div>
            <div className={styles.row}><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>

            <div className={styles.divider} />

            <div className={`${styles.row} ${styles.totalRow}`}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
