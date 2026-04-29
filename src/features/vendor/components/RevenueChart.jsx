// Line chart showing revenue per day for the last 30 days.
// Uses Recharts ResponsiveContainer so it fills its parent width automatically.
// ResponsiveContainer is needed because Recharts charts have fixed pixel sizes by default.

import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from 'recharts'
import styles from './RevenueChart.module.css'

// Custom tooltip so numbers are formatted as currency
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipDate}>{label}</p>
      <p className={styles.tooltipValue}>${payload[0].value.toLocaleString()}</p>
    </div>
  )
}

export function RevenueChart({ data }) {
  return (
    <div className={styles.wrap}>
      <h3 className={styles.title}>Revenue Over Time</h3>
      <p className={styles.sub}>Last 30 days</p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#999' }}
            interval={4}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#999' }}
            tickFormatter={(v) => `$${v}`}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#111111"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#111' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
