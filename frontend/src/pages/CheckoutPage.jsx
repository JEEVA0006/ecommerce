import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api'
import { useCart } from '../context/CartContext'
import styles from './CheckoutPage.module.css'

const INIT = { name: '', address: '', city: '', state: '', pincode: '', phone: '' }

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState(INIT)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    for (const [key, val] of Object.entries(form)) {
      if (!val.trim()) { toast.error(`${key} is required`); return false }
    }
    if (!/^\d{6}$/.test(form.pincode)) { toast.error('Pincode must be 6 digits'); return false }
    if (!/^\d{10}$/.test(form.phone)) { toast.error('Phone must be 10 digits'); return false }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    if (cart.length === 0) { toast.error('Cart is empty'); return }

    setSubmitting(true)
    try {
      const items = cart.map(({ _id, quantity }) => ({ product: _id, quantity }))
      const { data } = await api.post('/orders', { items, shippingAddress: form })
      clearCart()
      toast.success('Order placed successfully!')
      navigate(`/orders/${data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 className={styles.title}>Checkout</h1>

      <div className={styles.layout}>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <h2 className={styles.sectionTitle}>Shipping Address</h2>

          {[
            { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
            { name: 'address', label: 'Street Address', type: 'text', placeholder: '123 Main St, Apt 4B' },
            { name: 'city', label: 'City', type: 'text', placeholder: 'Mumbai' },
            { name: 'state', label: 'State', type: 'text', placeholder: 'Maharashtra' },
            { name: 'pincode', label: 'Pincode', type: 'text', placeholder: '400001', maxLength: 6 },
            { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '9876543210', maxLength: 10 },
          ].map(({ name, label, ...rest }) => (
            <div key={name} className={styles.field}>
              <label htmlFor={name} className={styles.label}>{label}</label>
              <input
                id={name}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className={styles.input}
                required
                {...rest}
              />
            </div>
          ))}

          <button className={styles.submitBtn} type="submit" disabled={submitting}>
            {submitting ? 'Placing Order…' : `Place Order — ₹${(total >= 999 ? total : total + 99).toLocaleString()}`}
          </button>
        </form>

        <aside className={styles.summary} aria-label="Order summary">
          <h2 className={styles.sectionTitle}>Order Summary</h2>
          <div className={styles.items}>
            {cart.map((item) => (
              <div key={item._id} className={styles.itemRow}>
                <span className={styles.itemName}>{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className={styles.divider} />
          <div className={styles.totalRow}>
            <span>Shipping</span>
            <span>{total >= 999 ? 'Free' : '₹99'}</span>
          </div>
          <div className={`${styles.totalRow} ${styles.grand}`}>
            <span>Total</span>
            <strong>₹{(total >= 999 ? total : total + 99).toLocaleString()}</strong>
          </div>
        </aside>
      </div>
    </div>
  )
}
