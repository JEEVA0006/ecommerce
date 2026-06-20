import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Package, ShoppingBag, IndianRupee } from 'lucide-react'
import api from '../../api'
import Spinner from '../../components/Spinner'
import styles from './Admin.module.css'

const STATUS_COLORS = {
  pending: 'badge-pending', processing: 'badge-processing',
  shipped: 'badge-shipped', delivered: 'badge-delivered', cancelled: 'badge-cancelled',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: <Users size={28} />, color: '#6366f1' },
    { label: 'Products', value: stats.totalProducts, icon: <Package size={28} />, color: '#f59e0b' },
    { label: 'Orders', value: stats.totalOrders, icon: <ShoppingBag size={28} />, color: '#10b981' },
    { label: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: <IndianRupee size={28} />, color: '#ef4444' },
  ]

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <div className={styles.headerLinks}>
          <Link to="/admin/products" className={styles.headerLink}>Manage Products</Link>
          <Link to="/admin/orders" className={styles.headerLink}>Manage Orders</Link>
        </div>
      </div>

      <div className={styles.statsGrid} role="list" aria-label="Dashboard statistics">
        {cards.map((c) => (
          <div key={c.label} className={styles.statCard} role="listitem">
            <div className={styles.statIcon} style={{ background: c.color + '1a', color: c.color }} aria-hidden="true">
              {c.icon}
            </div>
            <div>
              <p className={styles.statLabel}>{c.label}</p>
              <p className={styles.statValue}>{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      <section aria-labelledby="recent-orders-heading">
        <h2 id="recent-orders-heading" className={styles.sectionTitle}>Recent Orders</h2>
        <div className={styles.tableWrap} role="region" aria-label="Recent orders table" tabIndex={0}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <Link to={`/orders/${order._id}`} className={styles.idLink}>
                      #{order._id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td>{order.user?.name || '—'}</td>
                  <td>₹{order.totalAmount.toLocaleString()}</td>
                  <td><span className={`badge ${STATUS_COLORS[order.status]}`}>{order.status}</span></td>
                  <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.viewAll}>
          <Link to="/admin/orders" className={styles.viewAllLink}>View all orders →</Link>
        </div>
      </section>
    </div>
  )
}
