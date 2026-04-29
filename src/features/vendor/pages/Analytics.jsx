// Vendor analytics page — /vendor/analytics (and the default /vendor/dashboard view).
// Shows four stat cards at the top, then three charts below.
// All data comes from useAnalytics which calls the mock analytics service.

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useAnalytics } from '../hooks/useAnalytics'
import { StatCard }        from '../components/StatCard'
import { RevenueChart }    from '../components/RevenueChart'
import { TopProductsChart } from '../components/TopProductsChart'
import { Spinner }         from '../../../shared/components/Spinner'
import styles from './Analytics.module.css'

function fmt(n) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function Analytics() {
  const { analytics, loading, error } = useAnalytics()

  if (loading) return <Spinner.Page />
  if (error)   return <p className={styles.error}>{error}</p>

  const { totalRevenue, totalOrders, pendingOrders, lowStockCount,
          revenueData, topProducts, orderStatusDist } = analytics

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Dashboard Overview</h1>

      {/* Stat cards row */}
      <div className={styles.statsGrid}>
        <StatCard label="Total Revenue"   value={`$${fmt(totalRevenue)}`} icon="💰" color="#34c759" />
        <StatCard label="Total Orders"    value={totalOrders.toString()}   icon="📦" color="#3b82f6" />
        <StatCard label="Pending Orders"  value={pendingOrders.toString()} icon="⏳" color="#f59e0b" />
        <StatCard label="Low Stock Items" value={lowStockCount.toString()} icon="⚠" color="#ff3b30" />
      </div>

      {/* Charts row */}
      <div className={styles.chartsRow}>
        <div className={styles.chartLarge}>
          <RevenueChart data={revenueData} />
        </div>
        <div className={styles.chartSmall}>
          <TopProductsChart data={topProducts} />
        </div>
      </div>

      {/* Orders by status donut chart */}
      <div className={styles.donutWrap}>
        <h3 className={styles.chartTitle}>Orders by Status</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={orderStatusDist}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
            >
              {orderStatusDist.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => [`${v} orders`]} contentStyle={{ fontSize: 13, borderRadius: 8 }} />
            <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 13 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
