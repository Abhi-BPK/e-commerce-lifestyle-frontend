// Product management page — /vendor/products
// Thin orchestration layer: owns modal open/close state and the product
// being edited, then delegates all rendering to ProductTable and ProductFormModal.

import { useState } from 'react'
import { useProducts }        from '../hooks/useProducts'
import { ProductTable }       from '../components/ProductTable'
import { ProductFormModal }   from '../components/ProductFormModal'
import { Spinner }            from '../../../shared/components/Spinner'
import styles from './ProductManagement.module.css'

export default function ProductManagement() {
  const { products, categories, loading, error, addProduct, updateProduct, deleteProduct, toggleStatus } = useProducts()

  // null = modal closed; undefined = add mode; object = edit mode
  const [editTarget, setEditTarget] = useState(null)
  const isOpen = editTarget !== null

  function openAdd()         { setEditTarget(undefined) }
  function openEdit(product) { setEditTarget(product)   }
  function closeModal()      { setEditTarget(null)      }

  async function handleSave(data) {
    if (editTarget?.id) await updateProduct(editTarget.id, data)
    else                await addProduct(data)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return
    await deleteProduct(id)
  }

  if (loading) return <Spinner.Page />
  if (error)   return <p className={styles.error}>{error}</p>

  return (
    <div className={styles.page}>
      <ProductTable
        products={products}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        onToggleStatus={toggleStatus}
      />

      {/* Modal is rendered via React Portal — outside this DOM subtree */}
      {/* categories comes from useProducts — real values from the products table */}
      <ProductFormModal
        isOpen={isOpen}
        onClose={closeModal}
        product={editTarget}
        onSave={handleSave}
        categories={categories}
      />
    </div>
  )
}
