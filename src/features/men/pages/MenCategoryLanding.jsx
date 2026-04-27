// MenCategoryLanding — the /men-clothing landing page.
// Shows a hero banner and a 3-column grid of subcategory cards.
// Clicking any card navigates to /men-clothing/:subcategory for filtered products.

import { SubcategoryCard } from '../components/SubcategoryCard'
import { MEN_SUBCATEGORIES } from '../../../shared/utils/constants'
import styles from './MenCategoryLanding.module.css'

export default function MenCategoryLanding() {
  return (
    <main className={styles.page}>

      {/* ── Hero section ─────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          {/* Small overline label above the main heading */}
          <span className={styles.heroEyebrow}>Exclusively for Him</span>
          <h1 className={styles.heroTitle}>Men's Clothing</h1>
          <p className={styles.heroSubtitle}>
            From boardroom power suits to festival-ready streetwear — discover your style.
          </p>
        </div>
      </section>

      {/* ── Subcategory grid ──────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.container}>

          {/* Section heading */}
          <h2 className={styles.sectionTitle}>Shop by Category</h2>
          <p className={styles.sectionSubtitle}>
            Pick a vibe and explore curated collections.
          </p>

          {/*
            MEN_SUBCATEGORIES is the array we added to constants.js.
            We map over it to render one SubcategoryCard per category.
            The key must be unique — we use the slug for that.
          */}
          <div className={styles.grid}>
            {MEN_SUBCATEGORIES.map((cat) => (
              <SubcategoryCard
                key={cat.slug}
                slug={cat.slug}
                label={cat.label}
                description={cat.description}
                coverImage={cat.coverImage}
              />
            ))}
          </div>

        </div>
      </section>

    </main>
  )
}
