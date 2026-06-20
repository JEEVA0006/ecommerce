import { useEffect, useState } from 'react'
import api from '../../api'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'
import styles from './Admin.module.css'

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded']
const STATUS_COLORS = {
  pending: 'badge-pending', processing: 'badge-processing',
  shipped: 'badge-shipped', delivered: 'badge-delivered', cancelled: 'badge-cancelled',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')

  const fetchOrders = () => {
    setLoading(true)
    const params = { limit: 100 }
    if (filterStatus) params.status = filterStatus
    api.get('/admin/orders', { params })
      .then(({ data }) => setOrders(data.orders))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [filterStatus])

  const updateOrder = async (id, field, value) => {
    try {
      const { data } = await api.put(`/admin/orders/${id}`, { [field]: value })
      setOrders((prev) => prev.map((o) => (o._id === id ? data : o)))
      toast.success('Order updated')
    } catch {
      toast.error('Failed to update order')
    }
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Manage Orders</h1>
        <div className={styles.filterRow}>
          <label htmlFor="status-filter" className="sr-only">Filter by status</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div className={styles.tableWrap} role="region" aria-label="Orders table" tabIndex={0}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Order Status</th>
                <th>Payment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className={styles.monoId}>#{order._id.slice(-8).toUpperCase()}</td>
                  <td>
                    <div>{order.user?.name || '—'}</div>
                    <div className={styles.subText}>{order.user?.email}</div>
                  </td>
                  <td>₹{order.totalAmount.toLocaleString()}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrder(order._id, 'status', e.target.value)}
                      className={`${styles.statusSelect} ${styles[order.status]}`}
                      aria-label={`Status for order ${order._id.slice(-8)}`}
                    >
                      {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => updateOrder(order._id, 'paymentStatus', e.target.value)}
                      className={styles.statusSelect}
                      aria-label={`Payment status for order ${order._id.slice(-8)}`}
                    >
                      {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
