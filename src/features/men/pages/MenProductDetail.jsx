// MenProductDetail — /men-clothing/:subcategory/:id
//
// Loads a single product by id from the backend and renders its detail page.
// "Add to Cart" and "Buy Now" both call useCart's addToCart, which now POSTs
// to /api/cart and refreshes Redux from the server response — so the cart
// badge in the Navbar updates automatically.
//
// Loading lifecycle:
//   - On mount we set isLoading=true, kick off the fetch, and show a Spinner.
//   - On success we store the product and render normally.
//   - On 404 (interceptor throws status:404) we show "Product not found".
//   - If the route param :id changes, the cancelled flag stops a stale
//     response from overwriting fresh state.

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../cart/hooks/useCart'
import { getMenProductById } from '../services/products.service'
import { Spinner } from '../../../shared/components/Spinner'
import { MEN_SUBCATEGORIES, ROUTES } from '../../../shared/utils/constants'
import logger from '../../../logger/logger.service'
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

  // ── Async fetch state ────────────────────────────────────────────────────
  const [product, setProduct]     = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState(null)

  // ── UI state — quantity + the brief "Added!" confirmation flash ──────────
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded]       = useState(false)

  // Linting note: the react-hooks/set-state-in-effect rule blocks
  // synchronous setState calls in the effect body, so the loading/error
  // resets happen inside the .then/.catch callbacks instead.
  useEffect(() => {
    let cancelled = false

    getMenProductById(id)
      .then((data) => {
        if (cancelled) return
        setProduct(data)
        setError(null)
        setIsLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        // err is normalized — { status, message, field, code }
        setError(err)
        setProduct(null)
        setIsLoading(false)
        logger.error('Failed to load product', err, { id })
      })

    return () => {
      cancelled = true
    }
  }, [id])

  // Find the label for this subcategory to show in the breadcrumb
  const categoryMeta  = MEN_SUBCATEGORIES.find((c) => c.slug === subcategory)
  const categoryLabel = categoryMeta?.label ?? subcategory

  // ── Loading state ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <Spinner.Page />
        </div>
      </main>
    )
  }

  // ── Product not found / fetch failed ─────────────────────────────────────
  if (error || !product) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <p className={styles.notFound}>
            {error?.status === 404 ? 'Product not found.' : 'Could not load product.'}
          </p>
          <Link to="/men-clothing" className={styles.backLink}>
            ← Back to Men&apos;s Clothing
          </Link>
        </div>
      </main>
    )
  }

  // ── Cart actions ─────────────────────────────────────────────────────────
  // addToCart is now async (it does an HTTP round-trip) — we don't await it
  // here because the visual "Added!" flash works regardless of the network
  // timing, and the Navbar badge updates as soon as Redux is refreshed.

  function handleAddToCart() {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  function handleBuyNow() {
    addToCart(product, quantity)
    navigate(ROUTES.CART)
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* ── Breadcrumb ─────────────────────────────────────────────── */}
        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          <Link to="/men-clothing" className={styles.breadcrumbLink}>
            Men&apos;s Clothing
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
