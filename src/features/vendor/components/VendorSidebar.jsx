// Persistent left sidebar for the vendor portal.
// Uses NavLink so the active route gets the black-border indicator style.
// The sidebar collapses to a hamburger on small screens (toggle state).

import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { VENDOR_ROUTES } from '../../../shared/utils/constants'
import styles from './VendorSidebar.module.css'

// Nav sections and their links
const NAV_ITEMS = [
  {
    section: 'Overview',
    links: [
      { to: VENDOR_ROUTES.ANALYTICS, label: 'Dashboard', icon: '▦' },
    ],
  },
  {
    section: 'Catalogue',
    links: [
      { to: VENDOR_ROUTES.PRODUCTS,  label: 'Products',  icon: '☰' },
      { to: VENDOR_ROUTES.INVENTORY, label: 'Inventory', icon: '◫' },
    ],
  },
  {
    section: 'Sales',
    links: [
      { to: VENDOR_ROUTES.ORDERS, label: 'Orders', icon: '◑' },
    ],
  },
]

function NavItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
      }
    >
      <span className={styles.navIcon} aria-hidden="true">{icon}</span>
      {label}
    </NavLink>
  )
}

export function VendorSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile hamburger toggle */}
      <button
        className={styles.hamburger}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        type="button"
      >
        {open ? '✕' : '☰'}
      </button>

      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
        {/* Brand wordmark */}
        <div className={styles.brand}>DOPPEY</div>

        <nav aria-label="Vendor navigation">
          {NAV_ITEMS.map(({ section, links }) => (
            <div key={section} className={styles.section}>
              <p className={styles.sectionLabel}>{section}</p>
              {links.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Backdrop for mobile — tap outside to close */}
      {open && (
        <div
          className={styles.backdrop}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
