// Protected dashboard — scaffold only for Phase 1.
// Full product / order / cart UI will be built in subsequent phases.

import { useAuth } from '../../auth/AuthContext'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <p className={styles.wordmark}>DOPPEY</p>
        <h1 className={styles.heading}>
          Welcome back, {user?.firstName ?? 'there'} 👋
        </h1>
        <p className={styles.subheading}>
          Your dashboard is on its way. Products, orders, and cart are coming in
          the next phase.
        </p>

        <div className={styles.meta}>
          <span className={styles.badge}>{user?.role === 'vendor' ? 'Vendor' : 'Shopper'}</span>
          <span className={styles.email}>{user?.email}</span>
        </div>

        <button className={styles.logoutButton} onClick={logout}>
          Sign out
        </button>
      </div>
    </main>
  )
}
