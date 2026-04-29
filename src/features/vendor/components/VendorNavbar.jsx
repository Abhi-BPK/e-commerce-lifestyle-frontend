// Top bar for the vendor portal.
// Shows the "Vendor Portal" label on the left, vendor name + logout on the right.
// Intentionally separate from the store Navbar — vendors get a distinct UI shell.

import { useAuth } from '../../auth/AuthContext'
import styles from './VendorNavbar.module.css'

export function VendorNavbar() {
  const { user, logout } = useAuth()

  return (
    <header className={styles.bar} role="banner">
      <span className={styles.label}>Vendor Portal</span>

      <div className={styles.right}>
        <span className={styles.vendorName}>
          {user?.firstName} {user?.lastName}
        </span>
        <button className={styles.logoutBtn} onClick={logout} type="button">
          Sign out
        </button>
      </div>
    </header>
  )
}
