// Product card — used in the grid on the listing page.
// Clicking the card goes to the detail page; the Add button dispatches to cart.

import { Link } from 'react-router-dom'
import { useCart } from '../../cart/hooks/useCart'
import { ROUTES } from '../../../shared/utils/constants'
import styles from './ProductCard.module.css'

function StarRating({ rating }) {
  const full = Math.floor(rating)
  const frac = rating - full
  return (
    <span className={styles.stars} aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return <span key={i} className={styles.starFull}>★</span>
        if (i === full && frac >= 0.5) return <span key={i} className={styles.starHalf}>★</span>
        return <span key={i} className={styles.starEmpty}>★</span>
      })}
      <span className={styles.ratingNum}>{rating}</span>
    </span>
  )
}

export function ProductCard({ product }) {
  const { addToCart } = useCart()

  function handleAdd(e) {
    // Prevent the card link from navigating when clicking the button
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
  }

  return (
    <Link
      to={ROUTES.PRODUCT_DETAIL(product.id)}
      className={styles.card}
      aria-label={product.name}
    >
      {/* Image */}
      <div className={styles.imageWrapper}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />
        {product.badge && (
          <span className={styles.badge}>{product.badge}</span>
        )}
        {!product.inStock && (
          <div className={styles.outOfStock}>Out of stock</div>
        )}
      </div>

      {/* Info */}
      <div className={styles.info}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.name}>{product.name}</h3>

        <StarRating rating={product.rating} />

        <div className={styles.priceRow}>
          <div className={styles.prices}>
            {product.originalPrice && (
              <span className={styles.originalPrice}>${product.originalPrice}</span>
            )}
            <span className={styles.price}>${product.price}</span>
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
