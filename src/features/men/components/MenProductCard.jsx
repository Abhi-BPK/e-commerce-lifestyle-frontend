// MenProductCard — same visual design as ProductCard but links to the
// men's clothing detail route: /men-clothing/:subcategory/:id
// We can't reuse ProductCard directly because it hardcodes ROUTES.PRODUCT_DETAIL.

import { Link } from 'react-router-dom'
import { useCart } from '../../cart/hooks/useCart'
import styles from './MenProductCard.module.css'

// Renders 5 gold/grey stars based on a decimal rating, e.g. 4.3
function StarRating({ rating }) {
  const full = Math.floor(rating)
  const hasFrac = rating - full >= 0.5
  return (
    <span className={styles.stars} aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return <span key={i} className={styles.starFull}>★</span>
        if (i === full && hasFrac) return <span key={i} className={styles.starHalf}>★</span>
        return <span key={i} className={styles.starEmpty}>★</span>
      })}
      <span className={styles.ratingNum}>{rating}</span>
    </span>
  )
}

/**
 * @param {Object} props
 * @param {Object} props.product - a men's product object from menProducts.js
 */
export function MenProductCard({ product }) {
  const { addToCart } = useCart()

  // Add to cart without navigating (e.preventDefault stops the Link from firing)
  function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
  }

  // Detail page URL: /men-clothing/formal/fm-001 (for example)
  const detailPath = `/men-clothing/${product.subcategory}/${product.id}`

  return (
    <Link to={detailPath} className={styles.card} aria-label={product.name}>

      {/* ── Product image ────────────────────────────────────────── */}
      <div className={styles.imageWrapper}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />
        {/* Promo badge (e.g. "Sale", "New", "Hot") */}
        {product.badge && (
          <span className={styles.badge}>{product.badge}</span>
        )}
        {/* Out-of-stock overlay */}
        {!product.inStock && (
          <div className={styles.outOfStock}>Out of stock</div>
        )}
      </div>

      {/* ── Product info ─────────────────────────────────────────── */}
      <div className={styles.info}>
        {/* Subcategory shown in muted uppercase (replaces "category" label) */}
        <span className={styles.category}>
          {product.subcategory.replace(/-/g, ' ')}
        </span>
        <h3 className={styles.name}>{product.name}</h3>

        <StarRating rating={product.rating} />

        <div className={styles.priceRow}>
          <div className={styles.prices}>
            {product.originalPrice && (
              <span className={styles.originalPrice}>₹{product.originalPrice}</span>
            )}
            <span className={styles.price}>₹{product.price}</span>
          </div>

          <button
            className={styles.addButton}
            onClick={handleAdd}
            disabled={!product.inStock}
            aria-label={`Add ${product.name} to cart`}
          >
            {product.inStock ? 'Add' : 'Sold out'}
          </button>
        </div>
      </div>

    </Link>
  )
}
