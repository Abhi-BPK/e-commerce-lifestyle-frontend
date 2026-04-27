import { useOrderHistory } from '../hooks/useOrderHistory'
import { OrderCard } from '../components/OrderCard'
import { Spinner } from '../../../shared/components/Spinner'
import styles from './OrderHistory.module.css'

export default function OrderHistory() {
  const { orders, isLoading, error } = useOrderHistory()

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Your Orders</h1>

        {isLoading && <Spinner.Page />}

        {error && (
          <p className={styles.errorText}>
            Could not load your orders. Please refresh the page.
          </p>
        )}

        {!isLoading && !error && orders.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyIcon}>📦</p>
            <p className={styles.emptyTitle}>No orders yet</p>
            <p className={styles.emptySub}>
              Your completed orders will appear here.
            </p>
          </div>
        )}

        {!isLoading && !error && orders.length > 0 && (
          <div className={styles.list}>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
