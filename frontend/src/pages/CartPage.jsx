import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react'
import { useCart } from '../context/CartContext'
import styles from './CartPage.module.css'

export default function CartPage() {
  const { cart, removeFromCart, updateQty, total, clearCart } = useCart()
  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <div className={styles.empty}>
        <ShoppingBag size={64} color="var(--border)" aria-hidden="true" />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/products" className={styles.shopBtn}>Start Shopping</Link>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 className={styles.title}>Shopping Cart</h1>

      <div className={styles.layout}>
        <div className={styles.items} role="list" aria-label="Cart items">
          {cart.map((item) => (
            <div key={item._id} className={styles.item} role="listitem">
              <img
                src={item.imageUrl}
                alt={item.name}
                className={styles.thumb}
                onError={(e) => { e.target.src = 'https://placehold.co/80x80?text=?' }}
              />
              <div className={styles.itemInfo}>
                <Link to={`/products/${item._id}`} className={styles.itemName}>{item.name}</Link>
                <p className={styles.itemPrice}>₹{item.price.toLocaleString()} each</p>
                <div className={styles.qtyRow}>
                  <button
                    onClick={() => updateQty(item._id, item.quantity - 1)}
                    aria-label={`Decrease quantity of ${item.name}`}
                    className={styles.qtyBtn}
                  ><Minus size={14} /></button>
                  <span aria-label={`Quantity: ${item.quantity}`}>{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item._id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    aria-label={`Increase quantity of ${item.name}`}
                    className={styles.qtyBtn}
                  ><Plus size={14} /></button>
                </div>
              </div>
              <div className={styles.itemRight}>
                <span className={styles.lineTotal}>₹{(item.price * item.quantity).toLocaleString()}</span>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className={styles.removeBtn}
                  aria-label={`Remove ${item.name} from cart`}
                ><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>

        <aside className={styles.summary} aria-label="Order summary">
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span className={styles.free}>{total >= 999 ? 'Free' : '₹99'}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.grandTotal}`}>
            <span>Total</span>
            <span>₹{(total >= 999 ? total : total + 99).toLocaleString()}</span>
          </div>
          <button className={styles.checkoutBtn} onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
          <button className={styles.clearBtn} onClick={clearCart}>Clear Cart</button>
        </aside>
      </div>
    </div>
  )
}
