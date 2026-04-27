// Product listing page — the home screen after login.
// Manages category filter + sort state locally; URL state would be added
// in Phase 3 when deep-linking and bookmarking are required.

import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { ProductGrid } from '../components/ProductGrid'
import { ProductFilters } from '../components/ProductFilters'
import styles from './ProductListing.module.css'

export default function ProductListing() {
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  const { products, isLoading, error } = useProducts({
    category: category === 'All' ? undefined : category,
    sortBy,
  })

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* ── Hero ────────────────────────────────────────────── */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Shop the Collection</h1>
          <p className={styles.heroSub}>
            Curated products for the modern lifestyle
          </p>
        </section>

        {/* ── Filters ─────────────────────────────────────────── */}
        <ProductFilters
          category={category}
          sortBy={sortBy}
          onCategoryChange={setCategory}
          onSortChange={setSortBy}
          total={products.length}
        />

        {/* ── Grid ────────────────────────────────────────────── */}
        <ProductGrid
          products={products}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </main>
  )
}
