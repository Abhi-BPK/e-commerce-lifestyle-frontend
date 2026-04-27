// Product detail page — 2-column layout: large image left, info right.
// Quantity selector + Add to Cart button dispatches to the Redux cart slice.

import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProductDetail } from '../hooks/useProductDetail'
import { useCart } from '../../cart/hooks/useCart'
import { Spinner } from '../../../shared/components/Spinner'
import { ROUTES } from '../../../shared/utils/constants'
import styles from './ProductDetail.module.css'

function Stars({ rating }) {
  return (
    <span className={styles.stars}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < Math.round(rating) ? styles.starFull : styles.starEmpty}
        >
          ★
        </span>
      ))}
    </span>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const { product, isLoading, error } = useProductDetail(id)
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  if (isLoading) return <Spinner.Page />

  if (error || !product) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <p className={styles.notFound}>Product not found.</p>
          <Link to={ROUTES.PRODUCTS} className={styles.backLink}>
            ← Back to products
          </Link>
        </div>
      </main>
    )
  }

  function handleAddToCart() {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  function handleBuyNow() {
    addToCart(product, quantity)
    navigate(ROUTES.CART)
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* Back link */}
        <Link to={ROUTES.PRODUCTS} className={styles.backLink}>
          ← Products
        </Link>

        <div className={styles.layout}>
          {/* ── Image column ─────────────────────────────────── */}
          <div className={styles.imageCol}>
            <div className={styles.imageWrapper}>
              <img
                src={product.image}
                alt={product.name}
                className={styles.image}
              />
              {product.badge && (
                <span className={styles.badge}>{product.badge}</span>
              )}
            </div>
          </div>

          {/* ── Info column ──────────────────────────────────── */}
          <div className={styles.infoCol}>
            <span className={styles.category}>{product.category}</span>
            <h1 className={styles.name}>{product.name}</h1>

            {/* Rating */}
            <div className={styles.ratingRow}>
              <Stars rating={product.rating} />
              <span className={styles.ratingValue}>{product.rating}</span>
              <span className={styles.ratingCount}>
                ({product.reviewCount.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price */}
            <div className={styles.priceRow}>
              {product.originalPrice && (
                <span className={styles.originalPrice}>
                  ${product.originalPrice}
                </span>
              )}
              <span className={styles.price}>${product.price}</span>
              {product.originalPrice && (
                <span className={styles.savings}>
                  Save ${product.originalPrice - product.price}
                </span>
              )}
            </div>

            {/* Description */}
            <p className={styles.description}>{product.description}</p>

            {/* Divider */}
            <hr className={styles.divider} />

            {/* Quantity */}
            <div className={styles.qtySection}>
              <label className={styles.qtyLabel}>Quantity</label>
              <div className={styles.qtyControls}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className={styles.qty}>{quantity}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            {product.inStock ? (
              <div className={styles.actions}>
                <button
                  className={`${styles.addButton} ${added ? styles.addButtonSuccess : ''}`}
                  onClick={handleAddToCart}
                >
                  {added ? '✓ Added to cart' : 'Add to Cart'}
                </button>
                <button className={styles.buyButton} onClick={handleBuyNow}>
                  Buy Now
                </button>
              </div>
            ) : (
              <div className={styles.outOfStock}>
                Currently out of stock — check back soon.
              </div>
            )}

            {/* Trust badges */}
            <div className={styles.badges}>
              <span className={styles.trustBadge}>🚚 Free shipping</span>
              <span className={styles.trustBadge}>↩ 30-day returns</span>
              <span className={styles.trustBadge}>🔒 Secure checkout</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
