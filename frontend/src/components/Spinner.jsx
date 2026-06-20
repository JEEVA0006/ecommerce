import styles from './Spinner.module.css'

export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className={styles.wrap} role="status" aria-label={label}>
      <div className={styles.ring} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  )
}
