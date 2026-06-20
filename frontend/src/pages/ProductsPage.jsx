import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import api from '../api'
import ProductCard from '../components/ProductCard'
import Spinner from '../components/Spinner'
import styles from './ProductsPage.module.css'

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys', 'Other']

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const page = Number(searchParams.get('page') || 1)

  const fetchProducts = useCallback(() => {
    setLoading(true)
    const params = { page, limit: 12 }
    if (search) params.search = search
    if (category) params.category = category

    api.get('/products', { params })
      .then(({ data }) => {
        setProducts(data.products)
        setTotal(data.total)
        setPages(data.pages)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [search, category, page])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val); else p.delete(key)
    p.delete('page')
    setSearchParams(p)
  }

  const setPage = (p) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', p)
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 className={styles.title}>All Products</h1>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} aria-hidden="true" />
          <input
            type="search"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setParam('search', e.target.value)}
            className={styles.searchInput}
            aria-label="Search products"
          />
        </div>

        <div className={styles.catFilter} role="group" aria-label="Filter by category">
          <SlidersHorizontal size={16} aria-hidden="true" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.catBtn} ${(cat === 'All' ? !category : category === cat) ? styles.active : ''}`}
              onClick={() => setParam('category', cat === 'All' ? '' : cat)}
              aria-pressed={cat === 'All' ? !category : category === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {!loading && (
        <p className={styles.count} aria-live="polite">
          {total} product{total !== 1 ? 's' : ''} found
        </p>
      )}

      {loading ? <Spinner /> : products.length === 0 ? (
        <div className={styles.empty}>
          <p>No products match your search.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      {pages > 1 && (
        <nav className={styles.pagination} aria-label="Pagination">
          <button
            className={styles.pageBtn}
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            aria-label="Previous page"
          >← Prev</button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`${styles.pageBtn} ${p === page ? styles.pageActive : ''}`}
              onClick={() => setPage(p)}
              aria-current={p === page ? 'page' : undefined}
            >{p}</button>
          ))}
          <button
            className={styles.pageBtn}
            disabled={page >= pages}
            onClick={() => setPage(page + 1)}
            aria-label="Next page"
          >Next →</button>
        </nav>
      )}
    </div>
  )
}
