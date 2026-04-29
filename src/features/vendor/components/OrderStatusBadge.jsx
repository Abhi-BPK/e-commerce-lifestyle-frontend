// Colour-coded status pill for vendor order tables.
// Each status maps to a distinct colour so vendors can scan status at a glance.

import styles from './OrderStatusBadge.module.css'

// Maps each status string to its CSS Module class name
const STATUS_CLASS = {
  Pending:    'pending',
  Processing: 'processing',
  Shipped:    'shipped',
  Delivered:  'delivered',
  Cancelled:  'cancelled',
}

export function OrderStatusBadge({ status }) {
  const cls = STATUS_CLASS[status] ?? 'pending'
  return (
    <span className={`${styles.badge} ${styles[cls]}`}>
      {status}
    </span>
  )
}
