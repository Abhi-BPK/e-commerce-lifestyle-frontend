// Add / Edit product modal rendered via React Portal into document.body.
// React Portal is used so the modal sits above all other content in the DOM,
// regardless of where this component is called in the component tree.
//
// React Hook Form handles all field-level validation.
// useNavigationGuard blocks page navigation while the form is dirty (unsaved changes).
// Closing with a dirty form shows a confirmation prompt.

import { createPortal } from 'react-dom'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigationGuard } from '../../../shared/hooks/useNavigationGuard'
import styles from './ProductFormModal.module.css'

const ALL_SIZES  = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const ALL_COLORS = ['White', 'Black', 'Blue', 'Navy', 'Grey', 'Beige', 'Pink', 'Red', 'Gold', 'Green']

// Multi-select toggle pill — used for Sizes and Colors
function PillToggle({ label, selected, onChange }) {
  const toggle = (v) =>
    onChange(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v])
  const items = label === 'Sizes' ? ALL_SIZES : ALL_COLORS
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>{label}</label>
      <div className={styles.pills}>
        {items.map((v) => (
          <button
            key={v}
            type="button"
            className={`${styles.pill} ${selected.includes(v) ? styles.pillSelected : ''}`}
            onClick={() => toggle(v)}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}

// categories — string[] passed from useProducts; shown as datalist suggestions.
// The vendor can pick an existing one OR type a brand-new category name.
export function ProductFormModal({ isOpen, onClose, product, onSave, categories = [] }) {
  const isEdit = !!product

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: '', category: '', gender: 'Men',
      price: '', stock: '', status: 'active',
      image: '', sizes: [], colors: [],
    },
  })

  // Pre-fill form when editing an existing product
  useEffect(() => {
    if (product) reset({ ...product, price: product.price, stock: product.stock })
    else reset({ name: '', category: 'Men', gender: 'Men', price: '', stock: '', status: 'active', image: '', sizes: [], colors: [] })
  }, [product, reset])

  // Block page navigation (e.g. clicking a sidebar link) while form has unsaved changes
  const blocker = useNavigationGuard(isDirty && isOpen)
  useEffect(() => {
    if (blocker.state === 'blocked') {
      if (window.confirm('You have unsaved changes. Leave anyway?')) blocker.proceed()
      else blocker.reset()
    }
  }, [blocker])

  function handleClose() {
    if (isDirty && !window.confirm('Discard unsaved changes?')) return
    onClose()
  }

  async function onSubmit(data) {
    // parseInt can return NaN if the field is empty or non-numeric.
    // NaN serialises to null in JSON, which the backend treats as 0,
    // wiping all variant stock. Math.max + fallback ensures a safe value.
    const stock = Math.max(0, parseInt(String(data.stock ?? 0), 10) || 0)
    await onSave({
      ...data,
      price: parseFloat(data.price),
      stock,
    })
    onClose()
  }

  // useWatch subscribes to field changes and is memoization-safe in React 19
  const sizes  = useWatch({ control, name: 'sizes',  defaultValue: [] })
  const colors = useWatch({ control, name: 'colors', defaultValue: [] })

  if (!isOpen) return null

  return createPortal(
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit product' : 'Add product'}>
        <div className={styles.header}>
          <h2 className={styles.title}>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <button className={styles.closeBtn} onClick={handleClose} type="button" aria-label="Close">✕</button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Product Name */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="pf-name">Product Name *</label>
            <input id="pf-name" className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              {...register('name', { required: 'Product name is required' })} />
            {errors.name && <p className={styles.errMsg}>{errors.name.message}</p>}
          </div>

          {/* Category + Gender row */}
          <div className={styles.row2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="pf-category">Category</label>
              {/*
                Using <input> + <datalist> (a native HTML combobox) instead of <select>.
                This lets the vendor pick an existing category from the suggestions OR
                type a completely new category name — both are valid.
              */}
              <input
                id="pf-category"
                list="pf-category-list"
                className={styles.input}
                placeholder="e.g. formal, party-wear…"
                {...register('category', { required: 'Category is required' })}
              />
              <datalist id="pf-category-list">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
              {errors.category && <p className={styles.errMsg}>{errors.category.message}</p>}
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="pf-gender">Gender</label>
              <select id="pf-gender" className={styles.input} {...register('gender')}>
                <option>Men</option><option>Women</option><option>Unisex</option>
              </select>
            </div>
          </div>

          {/* Price + Stock row */}
          <div className={styles.row2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="pf-price">Price ($) *</label>
              <input id="pf-price" type="number" min="0" step="0.01" className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
                {...register('price', { required: 'Price is required', min: { value: 0.01, message: 'Must be > 0' } })} />
              {errors.price && <p className={styles.errMsg}>{errors.price.message}</p>}
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="pf-stock">Stock Qty *</label>
              <input id="pf-stock" type="number" min="0" className={`${styles.input} ${errors.stock ? styles.inputError : ''}`}
                {...register('stock', { required: 'Stock is required', min: { value: 0, message: 'Cannot be negative' } })} />
              {errors.stock && <p className={styles.errMsg}>{errors.stock.message}</p>}
            </div>
          </div>

          {/* Sizes */}
          <PillToggle label="Sizes" selected={sizes} onChange={(v) => setValue('sizes', v, { shouldDirty: true })} />

          {/* Colors */}
          <PillToggle label="Colors" selected={colors} onChange={(v) => setValue('colors', v, { shouldDirty: true })} />

          {/* Image URL */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="pf-image">Image URL</label>
            <input id="pf-image" className={styles.input} placeholder="https://…" {...register('image')} />
          </div>

          {/* Status toggle */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Status</label>
            <div className={styles.toggleRow}>
              {['active', 'inactive'].map((s) => (
                <label key={s} className={styles.radioLabel}>
                  <input type="radio" value={s} {...register('status')} />
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={handleClose}>Cancel</button>
            <button type="submit" className={styles.saveBtn}>{isEdit ? 'Save Changes' : 'Add Product'}</button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
