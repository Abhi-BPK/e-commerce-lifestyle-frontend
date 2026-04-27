import { ProductCard } from './ProductCard'
import { Spinner } from '../../../shared/components/Spinner'
import styles from './ProductGrid.module.css'

export function ProductGrid({ products, isLoading, error }) {
  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <Spinner size="lg" />
        <p>Loading products…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <p>Failed to load products. Please try again.</p>
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>No products found</p>
        <p className={styles.emptySubtitle}>Try adjusting your search or filter.</p>
      </div>
    )
  }

  return (
    <div className={styles.grid} role="list">
      {products.map((product) => (
        <div key={product.id} role="listitem">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}
