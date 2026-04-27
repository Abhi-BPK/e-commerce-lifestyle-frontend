// Reusable loading spinner.
// size prop: 'sm' | 'md' | 'lg'
// Use <Spinner.Page /> for full-viewport Suspense fallbacks.

import styles from './Spinner.module.css'

export function Spinner({ size = 'md' }) {
  return (
    <div
      className={`${styles.spinner} ${styles[size]}`}
      role="status"
      aria-label="Loading"
    />
  )
}

// Convenience wrapper that centers a large spinner in the full viewport —
// used as the fallback for React.lazy / Suspense route boundaries.
Spinner.Page = function SpinnerPage() {
  return (
    <div className={styles.page}>
      <Spinner size="lg" />
    </div>
  )
}
