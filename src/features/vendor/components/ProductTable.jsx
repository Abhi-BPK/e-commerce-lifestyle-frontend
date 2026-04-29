// Product list table for the vendor dashboard.
// Displays all products with image, key fields, and action buttons.
// Actions: Edit (opens modal with pre-filled form), Delete, Toggle active/inactive.

import styles from './ProductTable.module.css'

function StatusPill({ status }) {
  return (
    <span className={`${styles.pill} ${status === 'active' ? styles.pillActive : styles.pillInactive}`}>
      {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  )
}

export function ProductTable({ products, onEdit, onDelete, onToggleStatus, onAdd }) {
  return (
    <div className={styles.wrap}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <h2 className={styles.heading}>Products</h2>
        <button className={styles.addBtn} onClick={onAdd} type="button">
          + Add Product
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Gender</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <img src={p.image} alt={p.name} className={styles.thumb} loading="lazy" />
                </td>
                <td className={styles.nameCell}>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.gender}</td>
                <td className={styles.price}>${p.price.toFixed(2)}</td>
                <td className={p.stock === 0 ? styles.outOfStock : p.stock < 5 ? styles.lowStock : ''}>
                  {p.stock}
                </td>
                <td><StatusPill status={p.status} /></td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.actionEdit}   onClick={() => onEdit(p)}          type="button">Edit</button>
                    <button className={styles.actionToggle} onClick={() => onToggleStatus(p.id)} type="button">
                      {p.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className={styles.actionDelete} onClick={() => onDelete(p.id)}     type="button">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
