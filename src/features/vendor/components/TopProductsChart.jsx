// Horizontal bar chart showing the top 5 products by units sold.
// `layout="vertical"` in Recharts turns the bars horizontal — the Y axis
// then holds product names and the X axis holds the numeric values.

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
} from 'recharts'
import styles from './TopProductsChart.module.css'

export function TopProductsChart({ data }) {
  return (
    <div className={styles.wrap}>
      <h3 className={styles.title}>Top Selling Products</h3>
      <p className={styles.sub}>By units sold</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: '#999' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={90}
            tick={{ fontSize: 12, fill: '#555' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value) => [`${value} units`, 'Sold']}
            contentStyle={{ fontSize: 13, borderRadius: 8 }}
          />
          <Bar dataKey="units" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={i === 0 ? '#111111' : `rgba(17,17,17,${0.7 - i * 0.12})`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
