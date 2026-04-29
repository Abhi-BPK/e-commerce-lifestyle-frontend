// Order management page — /vendor/orders
// Thin page: passes hook state and actions down to OrderTable.
// The table owns its own accordion expand state; the page owns filter + update.

import { useOrders }    from '../hooks/useOrders'
import { OrderTable }   from '../components/OrderTable'
import { Spinner }      from '../../../shared/components/Spinner'
import styles from './OrderManagement.module.css'

export default function OrderManagement() {
  const { filteredOrders, loading, error, activeFilter, setFilter, updateStatus } = useOrders()

  if (loading) return <Spinner.Page />
  if (error)   return <p className={styles.error}>{error}</p>

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Orders</h1>
      <OrderTable
        orders={filteredOrders}
        activeFilter={activeFilter}
        onFilterChange={setFilter}
        onUpdateStatus={updateStatus}
      />
    </div>
  )
}
