import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin } from 'lucide-react'
import api from '../api'
import Spinner from '../components/Spinner'
import styles from './OrderDetail.module.css'

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered']
const STATUS_COLORS = {
  pending: 'badge-pending', processing: 'badge-processing',
  shipped: 'badge-shipped', delivered: 'badge-delivered', cancelled: 'badge-cancelled',
}

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(() => navigate('/orders'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading) return <Spinner />
  if (!order) return null

  const stepIdx = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <button className={styles.back} onClick={() => navigate('/orders')}>
        <ArrowLeft size={18} aria-hidden="true" /> Back to Orders
      </button>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className={styles.date}>{new Date(order.createdAt).toLocaleString('en-IN')}</p>
        </div>
        <div className={styles.badges}>
          <span className={`badge ${STATUS_COLORS[order.status]}`}>{order.status}</span>
          <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-paid' : 'badge-unpaid'}`}>
            {order.paymentStatus}
          </span>
        </div>
      </div>

      {order.status !== 'cancelled' && (
        <div className={styles.tracker} aria-label="Order progress">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className={styles.step}>
              <div className={`${styles.dot} ${i <= stepIdx ? styles.done : ''}`} aria-hidden="true" />
              <span className={`${styles.stepLabel} ${i <= stepIdx ? styles.activeLabel : ''}`}>{step}</span>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`${styles.line} ${i < stepIdx ? styles.doneLine : ''}`} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      )}

      <div className={styles.grid}>
        <section className={styles.card} aria-labelledby="items-heading">
          <h2 id="items-heading" className={styles.cardTitle}>Items Ordered</h2>
          {order.items.map((item) => (
            <div key={item._id} className={styles.item}>
              <img
                src={item.product?.imageUrl}
                alt={item.product?.name}
                className={styles.thumb}
                onError={(e) => { e.target.src = 'https://placehold.co/64x64?text=?' }}
              />
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.product?.name}</span>
                <span className={styles.itemQty}>Qty: {item.quantity}</span>
              </div>
              <span className={styles.itemTotal}>₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className={styles.orderTotal}>
            <span>Total</span>
            <strong>₹{order.totalAmount.toLocaleString()}</strong>
          </div>
        </section>

        <section className={styles.card} aria-labelledby="shipping-heading">
          <h2 id="shipping-heading" className={styles.cardTitle}>
            <MapPin size={16} aria-hidden="true" /> Shipping Address
          </h2>
          <address className={styles.address} style={{ fontStyle: 'normal' }}>
            <strong>{order.shippingAddress.name}</strong><br />
            {order.shippingAddress.address}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}<br />
            📞 {order.shippingAddress.phone}
          </address>
        </section>
      </div>
    </div>
  )
}
