import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, LogOut, LayoutDashboard, Menu, X, Store } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setOpen(false)
  }

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} onClick={() => setOpen(false)}>
          <Store size={24} aria-hidden="true" />
          <span>ShopEase</span>
        </Link>

        <button
          className={styles.burger}
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`${styles.links} ${open ? styles.active : ''}`}>
          <Link to="/products" className={styles.link} onClick={() => setOpen(false)}>Products</Link>

          <Link to="/cart" className={styles.cartLink} onClick={() => setOpen(false)} aria-label={`Cart, ${count} items`}>
            <ShoppingCart size={20} aria-hidden="true" />
            {count > 0 && <span className={styles.badge} aria-hidden="true">{count}</span>}
            <span className={styles.cartLabel}>Cart</span>
          </Link>

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className={styles.link} onClick={() => setOpen(false)}>
                  <LayoutDashboard size={16} aria-hidden="true" /> Dashboard
                </Link>
              )}
              <Link to="/orders" className={styles.link} onClick={() => setOpen(false)}>
                <User size={16} aria-hidden="true" /> {user.name.split(' ')[0]}
              </Link>
              <button className={styles.logoutBtn} onClick={handleLogout} aria-label="Sign out">
                <LogOut size={16} aria-hidden="true" /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.link} onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className={styles.btnPrimary} onClick={() => setOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
