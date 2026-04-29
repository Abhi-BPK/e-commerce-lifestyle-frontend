// Order table with filter tabs and expandable accordion rows.
// Clicking a row expands it to show full order details + a status-update dropdown.
// Status update dispatches an optimistic change back to the parent via onUpdateStatus.

import { useState } from 'react'
import { OrderStatusBadge } from './OrderStatusBadge'
import { ORDER_STATUSES } from '../services/vendor.orders.service'
import { ALL_FILTER } from '../hooks/useOrders'
import styles from './OrderTable.module.css'

const FILTERS = [ALL_FILTER, ...ORDER_STATUSES]

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Expanded row shown when the user clicks a table row
function OrderDetailRow({ order, onUpdateStatus }) {
  const [saving, setSaving] = useState(false)

  async function handleChange(e) {
    setSaving(true)
    try { await onUpdateStatus(order.id, e.target.value) }
    finally { setSaving(false) }
  }

  return (
    <tr className={styles.detailRow}>
      <td colSpan={9}>
        <div className={styles.detailContent}>
          <div className={styles.detailGrid}>
            <div><span className={styles.detailLabel}>Buyer</span><p>{order.buyerName}</p></div>
            <div><span className={styles.detailLabel}>Ship to</span><p>{order.address}</p></div>
            <div><span className={styles.detailLabel}>Product</span><p>{order.product}</p></div>
            <div><span className={styles.detailLabel}>Size / Color</span><p>{order.size} / {order.color}</p></div>
          </div>
          <div className={styles.detailActions}>
            <label className={styles.detailLabel}>Update Status</label>
            <select
              className={styles.statusSelect}
              value={order.status}
              onChange={handleChange}
              disabled={saving}
            >
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {saving && <span className={styles.saving}>Saving…</span>}
          </div>
        </div>
      </td>
    </tr>
  )
}

export function OrderTable({ orders, activeFilter, onFilterChange, onUpdateStatus }) {
  const [expanded, setExpanded] = useState(null)

  function toggleRow(id) {
    setExpanded((prev) => (prev === id ? null : id))
  }

  return (
    <div className={styles.wrap}>
      {/* Filter tabs */}
      <div className={styles.tabs}>
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`${styles.tab} ${activeFilter === f ? styles.tabActive : ''}`}
            onClick={() => onFilterChange(f)}
            type="button"
          >
            {f}
          </button>
        ))}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Buyer</th>
              <th>Product</th>
              <th>Size</th>
              <th>Color</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <>
                <tr
                  key={order.id}
                  className={`${styles.row} ${expanded === order.id ? styles.rowExpanded : ''}`}
                  onClick={() => toggleRow(order.id)}
                >
                  <td className={styles.orderId}>{order.id}</td>
                  <td>{order.buyerName}</td>
                  <td className={styles.productName}>{order.product}</td>
                  <td>{order.size}</td>
                  <td>{order.color}</td>
                  <td>{order.quantity}</td>
                  <td className={styles.total}>${order.total.toFixed(2)}</td>
                  <td><OrderStatusBadge status={order.status} /></td>
                  <td className={styles.date}>{formatDate(order.date)}</td>
                </tr>
                {expanded === order.id && (
                  <OrderDetailRow
                    key={`detail-${order.id}`}
                    order={order}
                    onUpdateStatus={onUpdateStatus}
                  />
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
