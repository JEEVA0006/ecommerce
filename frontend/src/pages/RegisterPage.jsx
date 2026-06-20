import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import styles from './AuthPage.module.css'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      toast.success('Account created! Welcome to ShopEase.')
      navigate('/')
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        (err.message === 'Network Error' ? 'Cannot connect to server. Is the backend running?' : 'Registration failed')
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <UserPlus size={32} color="var(--primary)" aria-hidden="true" />
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.sub}>Join ShopEase today</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {[
            { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', autoComplete: 'name' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
            { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••', autoComplete: 'new-password' },
            { name: 'confirm', label: 'Confirm Password', type: 'password', placeholder: '••••••••', autoComplete: 'new-password' },
          ].map(({ name, label, ...rest }) => (
            <div key={name} className={styles.field}>
              <label htmlFor={name} className={styles.label}>{label}</label>
              <input
                id={name}
                name={name}
                value={form[name]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                className={styles.input}
                required
                {...rest}
              />
            </div>
          ))}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className={styles.switch}>
          Already have an account?{' '}
          <Link to="/login" className={styles.switchLink}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
