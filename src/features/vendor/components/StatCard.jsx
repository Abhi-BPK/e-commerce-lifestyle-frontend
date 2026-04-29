// Reusable stat summary card for the analytics overview.
// Props:
//   label   — metric name, e.g. "Total Revenue"
//   value   — formatted string, e.g. "$15,847"
//   icon    — emoji or SVG string shown on the right
//   color   — CSS color string used for the icon background tint

import styles from './StatCard.module.css'

export function StatCard({ label, value, icon, color }) {
  return (
    <div className={styles.card}>
      <div className={styles.text}>
        <p className={styles.value}>{value}</p>
        <p className={styles.label}>{label}</p>
      </div>
      <div className={styles.iconWrap} style={{ background: `${color}18` }}>
        <span className={styles.icon} style={{ color }} aria-hidden="true">
          {icon}
        </span>
      </div>
    </div>
  )
}
