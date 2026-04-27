// Top navigation bar — rendered on all protected routes via ProtectedLayout.
// Sticky with a frosted-glass effect (Apple style).

import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'
import { useCart } from '../../features/cart/hooks/useCart'
import { ROUTES } from '../utils/constants'
import styles from './Navbar.module.css'

function CartBadge({ count }) {
  if (!count) return null
  return <span className={styles.badge}>{count > 9 ? '9+' : count}</span>
}

function UserAvatar({ user }) {
  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '?'
  return <div className={styles.avatar}>{initials}</div>
}

export function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()

  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        {/* Brand */}
        <Link to="/men-clothing" className={styles.wordmark} aria-label="DOPPEY home">
          DOPPEY
        </Link>

        {/* Main nav links */}
        <nav className={styles.nav} aria-label="Main navigation">
          <NavLink
            to="/men-clothing"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            Men's Clothing
          </NavLink>
          <NavLink
            to={ROUTES.ORDERS}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            Orders
          </NavLink>
        </nav>

        {/* Right actions */}
        <div className={styles.actions}>
          {/* Cart */}
          <Link
            to={ROUTES.CART}
            className={styles.cartButton}
            aria-label={`Cart, ${count} item${count !== 1 ? 's' : ''}`}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <CartBadge count={count} />
          </Link>

          {/* User menu */}
          <div className={styles.userMenu}>
            <button
              className={styles.avatarButton}
              onClick={() => navigate(ROUTES.DASHBOARD)}
              aria-label={`Account for ${user?.firstName ?? 'user'}`}
            >
              <UserAvatar user={user} />
            </button>
            <div className={styles.dropdown}>
              <p className={styles.dropdownName}>{user?.firstName} {user?.lastName}</p>
              <p className={styles.dropdownEmail}>{user?.email}</p>
              <hr className={styles.dropdownDivider} />
              <button className={styles.dropdownLogout} onClick={logout}>
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
