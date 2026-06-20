import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import api from '../../api'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'
import styles from './Admin.module.css'

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys', 'Other']
const EMPTY = { name: '', description: '', price: '', category: 'Electronics', stock: '', imageUrl: '' }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const fetchProducts = () => {
    setLoading(true)
    api.get('/products?limit=100')
      .then(({ data }) => setProducts(data.products))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  const openNew = () => { setForm(EMPTY); setEditing(null); setShowForm(true) }
  const openEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, stock: p.stock, imageUrl: p.imageUrl || '' })
    setEditing(p._id)
    setShowForm(true)
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/products/${editing}`, { ...form, price: Number(form.price), stock: Number(form.stock) })
        toast.success('Product updated')
      } else {
        await api.post('/products', { ...form, price: Number(form.price), stock: Number(form.stock) })
        toast.success('Product added')
      }
      setShowForm(false)
      fetchProducts()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    try {
      await api.delete(`/products/${id}`)
      toast.success('Product deleted')
      fetchProducts()
    } catch (err) {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Manage Products</h1>
        <button className={styles.addBtn} onClick={openNew}>
          <Plus size={18} aria-hidden="true" /> Add Product
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-label={editing ? 'Edit product' : 'Add product'}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>{editing ? 'Edit Product' : 'New Product'}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              {[
                { name: 'name', label: 'Product Name', type: 'text' },
                { name: 'price', label: 'Price (₹)', type: 'number', min: 0 },
                { name: 'stock', label: 'Stock', type: 'number', min: 0 },
                { name: 'imageUrl', label: 'Image URL (optional)', type: 'url' },
              ].map(({ name, label, ...rest }) => (
                <div key={name} className={styles.field}>
                  <label htmlFor={`p-${name}`} className={styles.label}>{label}</label>
                  <input id={`p-${name}`} name={name} value={form[name]} onChange={handleChange} className={styles.input} required={name !== 'imageUrl'} {...rest} />
                </div>
              ))}

              <div className={styles.field}>
                <label htmlFor="p-category" className={styles.label}>Category</label>
                <select id="p-category" name="category" value={form.category} onChange={handleChange} className={styles.input}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="p-description" className={styles.label}>Description</label>
                <textarea id="p-description" name="description" value={form.description} onChange={handleChange} className={styles.input} rows={3} required />
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  {saving ? 'Saving…' : editing ? 'Update' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? <Spinner /> : (
        <div className={styles.tableWrap} role="region" aria-label="Products table" tabIndex={0}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img src={p.imageUrl} alt={p.name} className={styles.productThumb}
                      onError={(e) => { e.target.src = 'https://placehold.co/48x48?text=?' }} />
                  </td>
                  <td className={styles.productName}>{p.name}</td>
                  <td>{p.category}</td>
                  <td>₹{p.price.toLocaleString()}</td>
                  <td>
                    <span className={p.stock === 0 ? styles.noStock : styles.inStock}>{p.stock}</span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button onClick={() => openEdit(p)} className={styles.editBtn} aria-label={`Edit ${p.name}`}>
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(p._id, p.name)} className={styles.deleteBtn} aria-label={`Delete ${p.name}`}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
