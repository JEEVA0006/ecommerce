import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import api from '../api'
import Spinner from '../components/Spinner'
import styles from './OrdersPage.module.css'

const STATUS_COLORS = {
  pending: 'badge-pending',
  processing: 'badge-processing',
  shipped: 'badge-shipped',
  delivered: 'badge-delivered',
  cancelled: 'badge-cancelled',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/my')
      .then(({ data }) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 className={styles.title}>My Orders</h1>

      {orders.length === 0 ? (
        <div className={styles.empty}>
          <Package size={56} color="var(--border)" aria-hidden="true" />
          <h2>No orders yet</h2>
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className={styles.shopBtn}>Start Shopping</Link>
        </div>
      ) : (
        <div className={styles.list} role="list">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className={styles.orderCard}
              role="listitem"
            >
              <div className={styles.orderMeta}>
                <span className={styles.orderId}>Order #{order._id.slice(-8).toUpperCase()}</span>
                <span className={`badge ${STATUS_COLORS[order.status]}`}>{order.status}</span>
              </div>
              <div className={styles.orderInfo}>
                <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                <span className={styles.dot}>·</span>
                <span>₹{order.totalAmount.toLocaleString()}</span>
                <span className={styles.dot}>·</span>
                <span className={styles.date}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className={styles.thumbs}>
                {order.items.slice(0, 3).map((item) => (
                  <img
                    key={item._id}
                    src={item.product?.imageUrl}
                    alt={item.product?.name}
                    className={styles.thumb}
                    onError={(e) => { e.target.src = 'https://placehold.co/48x48?text=?' }}
                  />
                ))}
                {order.items.length > 3 && (
                  <span className={styles.more}>+{order.items.length - 3}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
