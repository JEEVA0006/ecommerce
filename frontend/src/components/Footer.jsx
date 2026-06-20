import { Store } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Store size={20} aria-hidden="true" />
          <span>ShopEase</span>
        </div>
        <p className={styles.copy}>© {new Date().getFullYear()} ShopEase. All rights reserved.</p>
        <p className={styles.copy}>Built with Node.js, MongoDB &amp; React.</p>
      </div>
    </footer>
  )
}
