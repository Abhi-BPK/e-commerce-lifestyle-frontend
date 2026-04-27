// Summary card for an order in the order history list.

import { Link } from 'react-router-dom'
import { OrderStatus } from './OrderStatus'
import { ROUTES } from '../../../shared/utils/constants'
import styles from './OrderCard.module.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function OrderCard({ order }) {
  const previewItems = order.items.slice(0, 3)
  const remaining = order.items.length - previewItems.length

  return (
    <Link to={ROUTES.ORDER_DETAIL(order.id)} className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <p className={styles.orderId}>{order.id}</p>
          <p className={styles.date}>{formatDate(order.date)}</p>
        </div>
        <div className={styles.headerRight}>
          <OrderStatus status={order.status} />
          <p className={styles.total}>${order.total.toFixed(2)}</p>
        </div>
      </div>

      {/* Item thumbnails */}
      <div className={styles.thumbnails}>
        {previewItems.map((item) => (
          <img
            key={item.productId}
            src={item.image}
            alt={item.name}
            className={styles.thumb}
            loading="lazy"
          />
        ))}
        {remaining > 0 && (
          <div className={styles.remainingBadge}>+{remaining}</div>
        )}
      </div>

      {/* Summary line */}
      <p className={styles.summary}>
        {order.items.reduce((n, i) => n + i.quantity, 0)} item
        {order.items.reduce((n, i) => n + i.quantity, 0) !== 1 ? 's' : ''}
        {' · '}
        {order.items.map((i) => i.name).join(', ').slice(0, 60)}
        {order.items.join('').length > 60 ? '…' : ''}
      </p>

      <span className={styles.viewLink} aria-hidden="true">
        View order →
      </span>
    </Link>
  )
}
