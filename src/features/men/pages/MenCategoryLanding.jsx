// MenCategoryLanding — the /men-clothing landing page.
// Shows a hero banner and a 3-column grid of subcategory cards.
// Clicking any card navigates to /men-clothing/:subcategory for filtered products.
//
// CHANGE: categories are now loaded dynamically from the backend via useMenCategories.
// This means new categories added by vendors show up here automatically —
// no code change or redeploy needed.

import { SubcategoryCard } from '../components/SubcategoryCard'
import { useMenCategories } from '../hooks/useMenCategories'
import { Spinner } from '../../../shared/components/Spinner'
import styles from './MenCategoryLanding.module.css'

export default function MenCategoryLanding() {
  // useMenCategories fetches all men's products, extracts unique subcategory slugs,
  // and merges them with known metadata (label, image). New slugs get auto-generated labels.
  const { categories, isLoading, error } = useMenCategories()

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

          {/* Loading state */}
          {isLoading && <Spinner.Page />}

          {/* Error state — categories will have fallen back to the static list */}
          {error && !isLoading && (
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Could not refresh categories — showing last known list.
            </p>
          )}

          {/*
            We map over the live categories array.
            Each entry has: slug, label, description, coverImage.
            The slug is used as the URL segment for /men-clothing/:subcategory.
          */}
          {!isLoading && (
            <div className={styles.grid}>
              {categories.map((cat) => (
                <SubcategoryCard
                  key={cat.slug}
                  slug={cat.slug}
                  label={cat.label}
                  description={cat.description}
                  coverImage={cat.coverImage}
                />
              ))}
            </div>
          )}

        </div>
      </section>

    </main>
  )
}
