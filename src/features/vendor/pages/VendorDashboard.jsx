// Layout wrapper for all vendor portal pages.
// Renders the left VendorSidebar + top VendorNavbar, then an <Outlet> where
// each child route (products, inventory, orders, analytics) renders its content.
// This component has NO page content itself — it is purely structural.

import { Outlet } from 'react-router-dom'
import { VendorSidebar } from '../components/VendorSidebar'
import { VendorNavbar }  from '../components/VendorNavbar'
import styles from './VendorDashboard.module.css'

export default function VendorDashboard() {
  return (
    <div className={styles.shell}>
      <VendorSidebar />

      <div className={styles.main}>
        <VendorNavbar />
        {/* Each /vendor/* child route renders here */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
