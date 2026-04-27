// Category pill filter + sort dropdown for the product listing page.
// Controlled component — parent owns the filter state.

import { CATEGORIES, SORT_OPTIONS } from '../../../shared/utils/constants'
import styles from './ProductFilters.module.css'

export function ProductFilters({ category, sortBy, onCategoryChange, onSortChange, total }) {
  return (
    <div className={styles.bar}>
      {/* Category pills */}
      <div className={styles.pills} role="group" aria-label="Filter by category">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`${styles.pill} ${category === cat ? styles.pillActive : ''}`}
            onClick={() => onCategoryChange(cat)}
            aria-pressed={category === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sort + count */}
      <div className={styles.right}>
        <span className={styles.count}>{total} item{total !== 1 ? 's' : ''}</span>
        <label htmlFor="sort-select" className={styles.sortLabel}>
          Sort
        </label>
        <select
          id="sort-select"
          className={styles.sortSelect}
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
