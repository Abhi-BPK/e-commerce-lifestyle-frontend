// SubcategoryCard — a full-bleed image card for each men's clothing subcategory.
// Clicking it navigates to the filtered product listing for that subcategory.
// Uses React Router's <Link> so the browser does NOT do a full page reload.

import { Link } from 'react-router-dom'
import styles from './SubcategoryCard.module.css'

/**
 * @param {Object} props
 * @param {string} props.slug        - URL slug, e.g. 'formal'
 * @param {string} props.label       - Display name, e.g. 'Formal'
 * @param {string} props.description - Short tagline shown on the card
 * @param {string} props.coverImage  - Unsplash URL for the background image
 */
export function SubcategoryCard({ slug, label, description, coverImage }) {
  return (
    // Link wraps the whole card — clicking anywhere on the card navigates
    <Link to={`/men-clothing/${slug}`} className={styles.card}>
      {/* Background cover image */}
      <img
        src={coverImage}
        alt={label}
        className={styles.image}
        // loading="lazy" defers off-screen images so the page loads faster
        loading="lazy"
      />

      {/* Dark gradient overlay at the bottom so white text is always readable */}
      <div className={styles.overlay} />

      {/* Text sits on top of the gradient */}
      <div className={styles.content}>
        <h2 className={styles.label}>{label}</h2>
        <p className={styles.description}>{description}</p>
        <span className={styles.cta}>Shop Now →</span>
      </div>
    </Link>
  )
}
