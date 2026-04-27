// Status badge for an order — maps status string to a colour-coded pill.

import styles from './OrderStatus.module.css'

const STATUS_CONFIG = {
  processing: { label: 'Processing', className: 'processing' },
  shipped:    { label: 'Shipped',    className: 'shipped'    },
  delivered:  { label: 'Delivered', className: 'delivered'  },
  cancelled:  { label: 'Cancelled', className: 'cancelled'  },
}

export function OrderStatus({ status }) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: 'processing' }
  return (
    <span className={`${styles.badge} ${styles[config.className]}`}>
      {config.label}
    </span>
  )
}
