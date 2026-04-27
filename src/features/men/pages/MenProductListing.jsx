// MenProductListing — /men-clothing/:subcategory
//
// Reads the :subcategory URL param, loads matching products via useMenProducts,
// and displays them in a responsive grid.
// Includes a breadcrumb (Men's Clothing → [Category]) and a sort dropdown.

import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useMenProducts } from '../hooks/useMenProducts'
import { MenProductCard } from '../components/MenProductCard'
import { Spinner } from '../../../shared/components/Spinner'
import { MEN_SUBCATEGORIES, SORT_OPTIONS } from '../../../shared/utils/constants'
import styles from './MenProductListing.module.css'

export default function MenProductListing() {
  // :subcategory comes from the URL, e.g. "formal" or "party-wear"
  const { subcategory } = useParams()

  // Sort state — starts with "newest", user can change it via dropdown
  const [sortBy, setSortBy] = useState('newest')

  // Fetch products filtered by the current subcategory slug
  const { products, isLoading, error } = useMenProducts({ subcategory, sortBy })

  // Find the human-readable label for this subcategory slug
  const categoryMeta = MEN_SUBCATEGORIES.find((c) => c.slug === subcategory)
  const categoryLabel = categoryMeta?.label ?? subcategory

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* ── Breadcrumb ───────────────────────────────────────────── */}
        {/*
          Breadcrumb helps users understand where they are (Men's → Formal)
          and provides a quick way to go back to the category landing page.
        */}
        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          <Link to="/men-clothing" className={styles.breadcrumbLink}>
            Men's Clothing
          </Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{categoryLabel}</span>
        </nav>

        {/* ── Page header + sort ────────────────────────────────────── */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>{categoryLabel}</h1>
            {/* Product count — shown only after loading completes */}
            {!isLoading && !error && (
              <p className={styles.count}>{products.length} products</p>
            )}
          </div>

          {/* Sort dropdown — uses the same SORT_OPTIONS from constants.js */}
          <select
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* ── Loading state ─────────────────────────────────────────── */}
        {isLoading && (
          <div className={styles.loading}>
            <Spinner size="lg" />
          </div>
        )}

        {/* ── Error state ───────────────────────────────────────────── */}
        {error && !isLoading && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}

        {/* ── Empty state ───────────────────────────────────────────── */}
        {!isLoading && !error && products.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No products found</p>
            <p className={styles.emptySub}>Check back soon for new arrivals.</p>
          </div>
        )}

        {/* ── Product grid ──────────────────────────────────────────── */}
        {/*
          Only render the grid once loading finishes and we have products.
          We map over the products array and render one MenProductCard per item.
        */}
        {!isLoading && !error && products.length > 0 && (
          <div className={styles.grid} role="list">
            {products.map((product) => (
              <div key={product.id} role="listitem">
                <MenProductCard product={product} />
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}
