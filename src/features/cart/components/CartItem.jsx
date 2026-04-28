// Single row in the cart — shows image, name, price, quantity controls, remove.
//
// Cart items come from the backend's CartItemDto and are FLAT
// ({ id, productId, name, price, image, quantity, addedAt }) — there is no
// nested `product` object. The PUT /cart/{id} and DELETE /cart/{id} endpoints
// take the server-side cart-row id, so the quantity buttons and the remove
// button must pass `item.id` (NOT `item.productId`).

import { useCart } from '../hooks/useCart'
import styles from './CartItem.module.css'

export function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()
  const { id, name, price, image, quantity } = item

  return (
    <div className={styles.item}>
      {/* Thumbnail */}
      <img
        src={image}
        alt={name}
        className={styles.image}
        loading="lazy"
      />

      {/* Details */}
      <div className={styles.details}>
        <p className={styles.name}>{name}</p>
        <p className={styles.unitPrice}>${price} each</p>
      </div>

      {/* Quantity controls — the cart row id (server PK) is what the backend
          expects for both update and delete. */}
      <div className={styles.quantityControls}>
        <button
          className={styles.qtyBtn}
          onClick={() => updateQuantity(id, quantity - 1)}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className={styles.qty}>{quantity}</span>
        <button
          className={styles.qtyBtn}
          onClick={() => updateQuantity(id, quantity + 1)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Line total */}
      <p className={styles.lineTotal}>${(price * quantity).toFixed(2)}</p>

      {/* Remove */}
      <button
        className={styles.removeBtn}
        onClick={() => removeFromCart(id)}
        aria-label={`Remove ${name} from cart`}
      >
        ✕
      </button>
    </div>
  )
}
