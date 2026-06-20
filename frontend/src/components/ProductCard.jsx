import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  const handleAdd = (e) => {
    e.preventDefault()
    if (product.stock === 0) return
    addToCart(product, 1)
    toast.success(`${product.name} added to cart`)
  }

  return (
    <article className={styles.card}>
      <Link to={`/products/${product._id}`} className={styles.imgWrap} aria-label={product.name}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className={styles.img}
          loading="lazy"
          onError={(e) => { e.target.src = 'https://placehold.co/400x280?text=No+Image' }}
        />
        {product.stock === 0 && (
          <span className={styles.outOfStock} aria-label="Out of stock">Out of Stock</span>
        )}
      </Link>

      <div className={styles.body}>
        <span className={styles.category}>{product.category}</span>
        <Link to={`/products/${product._id}`}>
          <h2 className={styles.name}>{product.name}</h2>
        </Link>
        <p className={styles.desc}>{product.description}</p>

        <div className={styles.footer}>
          <span className={styles.price}>₹{product.price.toLocaleString()}</span>
          <button
            className={styles.addBtn}
            onClick={handleAdd}
            disabled={product.stock === 0}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={16} aria-hidden="true" />
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  )
}
