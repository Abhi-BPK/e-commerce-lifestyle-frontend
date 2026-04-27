// Single row in the cart — shows image, name, price, quantity controls, remove.

import { useCart } from '../hooks/useCart'
import styles from './CartItem.module.css'

export function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()
  const { product, quantity } = item

  return (
    <div className={styles.item}>
      {/* Thumbnail */}
      <img
        src={product.image}
        alt={product.name}
        className={styles.image}
        loading="lazy"
      />

      {/* Details */}
      <div className={styles.details}>
        <span className={styles.category}>{product.category}</span>
        <p className={styles.name}>{product.name}</p>
        <p className={styles.unitPrice}>${product.price} each</p>
      </div>

      {/* Quantity controls */}
      <div className={styles.quantityControls}>
        <button
          className={styles.qtyBtn}
          onClick={() => updateQuantity(product.id, quantity - 1)}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className={styles.qty}>{quantity}</span>
        <button
          className={styles.qtyBtn}
          onClick={() => updateQuantity(product.id, quantity + 1)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Line total */}
      <p className={styles.lineTotal}>${(product.price * quantity).toFixed(2)}</p>

      {/* Remove */}
      <button
        className={styles.removeBtn}
        onClick={() => removeFromCart(product.id)}
        aria-label={`Remove ${product.name} from cart`}
      >
        ✕
      </button>
    </div>
  )
}
