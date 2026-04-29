// Inventory management page — /vendor/inventory
// Owns the "show low stock only" filter toggle and delegates rendering
// to InventoryTable which handles inline stock editing.

import { useState } from 'react'
import { useInventory }     from '../hooks/useInventory'
import { InventoryTable }   from '../components/InventoryTable'
import { Spinner }          from '../../../shared/components/Spinner'
import styles from './InventoryManagement.module.css'

export default function InventoryManagement() {
  const { inventory, loading, error, lowStockCount, updateStock } = useInventory()
  const [showLowOnly, setShowLowOnly] = useState(false)

  if (loading) return <Spinner.Page />
  if (error)   return <p className={styles.error}>{error}</p>

  const displayed = showLowOnly ? inventory.filter((i) => i.stock < 5) : inventory

  return (
    <div className={styles.page}>
      <InventoryTable
        inventory={displayed}
        onUpdateStock={updateStock}
        showLowOnly={showLowOnly}
        onToggleLowOnly={() => setShowLowOnly((v) => !v)}
        lowStockCount={lowStockCount}
      />
    </div>
  )
}
