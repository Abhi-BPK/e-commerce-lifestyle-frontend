// Cart page — two-column layout: item list (left) + order summary (right).

import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { CartItem } from '../components/CartItem'
import { CartSummary } from '../components/CartSummary'
import styles from './Cart.module.css'

export default function Cart() {
  const { items, subtotal, isEmpty } = useCart()

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.heading}>
          Your Cart
          {!isEmpty && (
            <span className={styles.itemCount}>{items.reduce((n, i) => n + i.quantity, 0)} item{items.reduce((n, i) => n + i.quantity, 0) !== 1 ? 's' : ''}</span>
          )}
        </h1>

        {isEmpty ? (
          /* ── Empty state ────────────────────────────────── */
          <div className={styles.empty}>
            <p className={styles.emptyIcon}>🛍</p>
            <p className={styles.emptyTitle}>Your cart is empty</p>
            <p className={styles.emptySub}>
              Add some products and they&apos;ll appear here.
            </p>
            <Link to="/men-clothing" className={styles.shopButton}>
              Continue shopping
            </Link>
          </div>
        ) : (
          /* ── 2-column layout ────────────────────────────── */
          <div className={styles.layout}>
            <div className={styles.itemsList}>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
              <Link to="/men-clothing" className={styles.continueLink}>
                ← Continue shopping
              </Link>
            </div>

            <CartSummary subtotal={subtotal} isEmpty={isEmpty} />
          </div>
        )}
      </div>
    </main>
  )
}
