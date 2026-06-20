import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react'
import api from '../api'
import { useCart } from '../context/CartContext'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'
import styles from './ProductDetail.module.css'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleAdd = () => {
    addToCart(product, qty)
    toast.success(`${product.name} added to cart`)
  }

  if (loading) return <Spinner />
  if (!product) return null

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <button className={styles.back} onClick={() => navigate(-1)} aria-label="Go back">
        <ArrowLeft size={18} aria-hidden="true" /> Back
      </button>

      <div className={styles.layout}>
        <div className={styles.imgWrap}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles.img}
            onError={(e) => { e.target.src = 'https://placehold.co/600x450?text=No+Image' }}
          />
        </div>

        <div className={styles.info}>
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.price}>₹{product.price.toLocaleString()}</p>
          <p className={styles.desc}>{product.description}</p>

          <div className={styles.stockRow}>
            <Package size={16} aria-hidden="true" />
            {product.stock > 0
              ? <span className={styles.inStock}>{product.stock} in stock</span>
              : <span className={styles.outStock}>Out of stock</span>
            }
          </div>

          {product.stock > 0 && (
            <div className={styles.qtyRow}>
              <label htmlFor="qty" className={styles.qtyLabel}>Quantity:</label>
              <div className={styles.qtyControl}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                <input
                  id="qty"
                  type="number"
                  min={1}
                  max={product.stock}
                  value={qty}
                  onChange={(e) => setQty(Math.min(product.stock, Math.max(1, Number(e.target.value))))}
                  aria-label="Quantity"
                />
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} aria-label="Increase quantity">+</button>
              </div>
            </div>
          )}

          <button
            className={styles.addBtn}
            onClick={handleAdd}
            disabled={product.stock === 0}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={18} aria-hidden="true" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
