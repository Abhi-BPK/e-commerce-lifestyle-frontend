// MenProductDetail — /men-clothing/:subcategory/:id
//
// Looks up the product by id from the local menProducts array.
// Layout mirrors the existing ProductDetail page:
//   Left column — large product image
//   Right column — name, rating, price, description, quantity picker, CTA buttons
//
// "Add to Cart" and "Buy Now" both dispatch to the same Redux cartSlice
// that the rest of the app uses — so the cart badge in the Navbar updates instantly.

import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../cart/hooks/useCart'
import { menProducts } from '../data/menProducts'
import { MEN_SUBCATEGORIES, ROUTES } from '../../../shared/utils/constants'
import styles from './MenProductDetail.module.css'

// Renders a row of 5 stars (gold = filled, grey = empty)
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

export default function MenProductDetail() {
  // React Router gives us the subcategory and product id from the URL
  const { subcategory, id } = useParams()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  // UI state — quantity selector and the brief "Added!" confirmation flash
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded]       = useState(false)

  // Find the product in our mock data array (no async needed for local data)
  const product = menProducts.find((p) => p.id === id)

  // Find the label for this subcategory to show in the breadcrumb
  const categoryMeta  = MEN_SUBCATEGORIES.find((c) => c.slug === subcategory)
  const categoryLabel = categoryMeta?.label ?? subcategory

  // ── Product not found ────────────────────────────────────────────────────
  if (!product) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <p className={styles.notFound}>Product not found.</p>
          <Link to="/men-clothing" className={styles.backLink}>
            ← Back to Men's Clothing
          </Link>
        </div>
      </main>
    )
  }

  // ── Cart actions ─────────────────────────────────────────────────────────

  function handleAddToCart() {
    addToCart(product, quantity)
    setAdded(true)
    // Reset button text after 1.8 s so the user can add again
    setTimeout(() => setAdded(false), 1800)
  }

  function handleBuyNow() {
    addToCart(product, quantity)
    navigate(ROUTES.CART) // Go straight to the cart page
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* ── Breadcrumb ─────────────────────────────────────────────── */}
        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          <Link to="/men-clothing" className={styles.breadcrumbLink}>
            Men's Clothing
          </Link>
          <span className={styles.breadcrumbSep}>›</span>
          <Link to={`/men-clothing/${subcategory}`} className={styles.breadcrumbLink}>
            {categoryLabel}
          </Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </nav>

        {/* ── 2-column layout ────────────────────────────────────────── */}
        <div className={styles.layout}>

          {/* Left: product image */}
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

          {/* Right: product info */}
          <div className={styles.infoCol}>

            {/* Category label */}
            <span className={styles.category}>
              {categoryLabel}
            </span>

            <h1 className={styles.name}>{product.name}</h1>

            {/* Rating row: stars + numeric score + review count */}
            <div className={styles.ratingRow}>
              <Stars rating={product.rating} />
              <span className={styles.ratingValue}>{product.rating}</span>
              <span className={styles.ratingCount}>
                ({product.reviewCount.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price — shows strikethrough original price + savings if discounted */}
            <div className={styles.priceRow}>
              {product.originalPrice && (
                <span className={styles.originalPrice}>
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className={styles.price}>
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className={styles.savings}>
                  Save ₹{(product.originalPrice - product.price).toLocaleString()}
                </span>
              )}
            </div>

            {/* Product description */}
            <p className={styles.description}>{product.description}</p>

            <hr className={styles.divider} />

            {/* Quantity selector: − [n] + */}
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

            {/* CTA buttons — hidden for out-of-stock items */}
            {product.inStock ? (
              <div className={styles.actions}>
                {/*
                  addButtonSuccess class turns the button green momentarily
                  to give the user visual feedback that the item was added.
                */}
                <button
                  className={`${styles.addButton} ${added ? styles.addButtonSuccess : ''}`}
                  onClick={handleAddToCart}
                >
                  {added ? '✓ Added to Cart' : 'Add to Cart'}
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
