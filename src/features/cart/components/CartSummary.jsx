// Sticky order summary card shown on the right side of the Cart page.

import { Link } from 'react-router-dom'
import { TAX_RATE, ROUTES } from '../../../shared/utils/constants'
import styles from './CartSummary.module.css'

export function CartSummary({ subtotal, isEmpty }) {
  const shipping = 0
  const tax = subtotal * TAX_RATE
  const total = subtotal + shipping + tax

  return (
    <aside className={styles.card}>
      <h2 className={styles.heading}>Order Summary</h2>

      <div className={styles.rows}>
        <div className={styles.row}>
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className={styles.row}>
          <span>Shipping</span>
          <span className={styles.free}>Free</span>
        </div>
        <div className={styles.row}>
          <span>Estimated tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
      </div>

      <div className={styles.totalRow}>
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <Link
        to={isEmpty ? '#' : ROUTES.CHECKOUT}
        className={`${styles.checkoutButton} ${isEmpty ? styles.checkoutDisabled : ''}`}
        aria-disabled={isEmpty}
      >
        Proceed to Checkout
      </Link>

      <p className={styles.note}>
        Free shipping on all orders · Secure checkout
      </p>
    </aside>
  )
}
