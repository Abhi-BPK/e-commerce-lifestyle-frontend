// Order detail page — reached from OrderHistory or after a successful checkout.
// The `isNew` location state flag is set by usePlaceOrder to show a success banner.

import { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { getOrderById } from '../services/orders.service'
import { OrderStatus } from '../components/OrderStatus'
import { Spinner } from '../../../shared/components/Spinner'
import { ROUTES } from '../../../shared/utils/constants'
import styles from './OrderDetail.module.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function OrderDetail() {
  const { id } = useParams()
  const { state: navState } = useLocation()
  const [order, setOrder] = useState(navState?.order ?? null)
  const [isLoading, setIsLoading] = useState(!navState?.order)

  // setState calls live inside the .then callback — keeping the effect body
  // free of synchronous setState satisfies react-hooks/set-state-in-effect.
  useEffect(() => {
    if (navState?.order) return
    let cancelled = false
    getOrderById(id)
      .then((data) => {
        if (!cancelled) {
          setOrder(data)
          setIsLoading(false)
        }
      })
      .catch(() => {
        // On error we still hide the spinner so the "Order not found"
        // fallback can render instead of a perpetual loading state.
        if (!cancelled) setIsLoading(false)
      })
    return () => { cancelled = true }
  }, [id, navState?.order])

  if (isLoading) return <Spinner.Page />

  if (!order) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <p>Order not found.</p>
          <Link to={ROUTES.ORDERS} className={styles.back}>← Back to orders</Link>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* Success banner (new order) */}
        {navState?.isNew && (
          <div className={styles.successBanner}>
            <span className={styles.successIcon}>✓</span>
            <div>
              <p className={styles.successTitle}>Order confirmed!</p>
              <p className={styles.successSub}>
                We&apos;ve received your order and will send you a confirmation email shortly.
              </p>
            </div>
          </div>
        )}

        {/* Back link */}
        <Link to={ROUTES.ORDERS} className={styles.back}>← Back to orders</Link>

        {/* Order header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.orderId}>{order.id}</h1>
            <p className={styles.date}>Placed on {formatDate(order.date)}</p>
          </div>
          <OrderStatus status={order.status} />
        </div>

        <div className={styles.layout}>

          {/* ── Items ─────────────────────────────────────────── */}
          <section>
            <h2 className={styles.sectionTitle}>Items</h2>
            <div className={styles.itemsList}>
              {order.items.map((item) => (
                <div key={item.productId} className={styles.item}>
                  <img src={item.image} alt={item.name} className={styles.itemImage} loading="lazy" />
                  <div className={styles.itemDetails}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemMeta}>Qty: {item.quantity} · ${item.price} each</p>
                  </div>
                  <p className={styles.itemTotal}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Summary + Address ─────────────────────────────── */}
          <aside>
            <section className={styles.summaryCard}>
              <h2 className={styles.sectionTitle}>Order summary</h2>
              <div className={styles.summaryRow}><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
              <div className={styles.summaryRow}><span>Shipping</span><span className={styles.free}>Free</span></div>
              <div className={styles.summaryRow}><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}><span>Total</span><span>${order.total.toFixed(2)}</span></div>
            </section>

            <section className={styles.addressCard}>
              <h2 className={styles.sectionTitle}>Shipping address</h2>
              {/* Backend's ShippingAddressDto stores firstName + lastName
                  separately rather than a combined `name`, so we join them
                  for display. country is shown when present. */}
              <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.line1}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
              {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
            </section>
          </aside>
        </div>
      </div>
    </main>
  )
}
