// Inventory table with inline stock editing.
// Clicking a quantity cell switches it to a number input.
// Low stock rows (stock < 5) are visually highlighted.

import { useState } from 'react'
import styles from './InventoryTable.module.css'

// Inline editable stock cell — shows an input when editing, a value otherwise
function StockCell({ item, onSave }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal]         = useState(item.stock)

  function handleKeyDown(e) {
    if (e.key === 'Enter')  commitEdit()
    if (e.key === 'Escape') { setVal(item.stock); setEditing(false) }
  }

  function commitEdit() {
    const n = parseInt(val, 10)
    if (!Number.isNaN(n) && n >= 0 && n !== item.stock) onSave(item.id, n)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        className={styles.stockInput}
        type="number"
        min="0"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={commitEdit}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    )
  }

  return (
    <button
      className={`${styles.stockBtn} ${item.stock < 5 ? styles.stockLow : ''}`}
      onClick={() => { setVal(item.stock); setEditing(true) }}
      title="Click to edit"
      type="button"
    >
      {item.stock}
    </button>
  )
}

export function InventoryTable({ inventory, onUpdateStock, showLowOnly, onToggleLowOnly, lowStockCount }) {
  return (
    <div className={styles.wrap}>
      {/* Summary banner */}
      {lowStockCount > 0 && (
        <div className={styles.banner}>
          ⚠ {lowStockCount} variant{lowStockCount !== 1 ? 's' : ''} running low on stock
        </div>
      )}

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <h2 className={styles.heading}>Inventory</h2>
        <button
          className={`${styles.filterBtn} ${showLowOnly ? styles.filterBtnActive : ''}`}
          onClick={onToggleLowOnly}
          type="button"
        >
          {showLowOnly ? '✕ Show All' : '⚠ Low Stock Only'}
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Size</th>
              <th>Color</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className={item.stock < 5 ? styles.rowLow : ''}>
                <td className={styles.productName}>{item.productName}</td>
                <td>{item.size}</td>
                <td>{item.color}</td>
                <td><StockCell item={item} onSave={onUpdateStock} /></td>
                <td>
                  <span className={`${styles.statusPill} ${styles[`status_${item.status.replace(/\s/g, '_')}`]}`}>
                    {item.stock < 5 && item.stock > 0 && <span className={styles.warnDot} />}
                    {item.status}
                  </span>
                </td>
                <td className={styles.date}>{item.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
