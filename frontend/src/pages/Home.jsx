import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react'
import api from '../api'
import ProductCard from '../components/ProductCard'
import Spinner from '../components/Spinner'
import styles from './Home.module.css'

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys']

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products?limit=4')
      .then(({ data }) => setFeatured(data.products))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <section className={styles.hero} aria-label="Hero banner">
        <div className={`container ${styles.heroContent}`}>
          <h1 className={styles.heroTitle}>Shop Everything,<br /><span>Anytime.</span></h1>
          <p className={styles.heroSub}>
            Discover thousands of products across Electronics, Fashion, Books and more.
          </p>
          <Link to="/products" className={styles.heroBtn}>
            Browse Products <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="cat-heading">
        <h2 id="cat-heading" className={styles.sectionTitle}>Shop by Category</h2>
        <div className={styles.catGrid}>
          {CATEGORIES.map((cat) => (
            <Link key={cat} to={`/products?category=${cat}`} className={styles.catCard}>
              {cat}
            </Link>
          ))}
        </div>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="feat-heading">
        <div className={styles.sectionHeader}>
          <h2 id="feat-heading" className={styles.sectionTitle}>Featured Products</h2>
          <Link to="/products" className={styles.viewAll}>View all <ArrowRight size={14} /></Link>
        </div>
        {loading ? <Spinner /> : (
          <div className={styles.grid}>
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      <section className={styles.trust} aria-label="Why shop with us">
        <div className={`container ${styles.trustGrid}`}>
          <div className={styles.trustItem}>
            <Truck size={32} color="var(--primary)" aria-hidden="true" />
            <h3>Free Shipping</h3>
            <p>On all orders above ₹999</p>
          </div>
          <div className={styles.trustItem}>
            <ShieldCheck size={32} color="var(--primary)" aria-hidden="true" />
            <h3>Secure Payments</h3>
            <p>Your data is always protected</p>
          </div>
          <div className={styles.trustItem}>
            <RefreshCw size={32} color="var(--primary)" aria-hidden="true" />
            <h3>Easy Returns</h3>
            <p>30-day hassle-free return policy</p>
          </div>
        </div>
      </section>
    </div>
  )
}
