// Shipping + payment form for checkout.
// Uses React Hook Form for validation; calls onSubmit with the shipping data
// when the form is valid. Payment fields are UI-only (mock) for now.

import { useForm } from 'react-hook-form'
import styles from './CheckoutForm.module.css'

export function CheckoutForm({ onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onTouched' })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>

      {/* ── Shipping section ────────────────────────────────────── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Shipping address</h2>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="firstName" className={styles.label}>First name</label>
            <input
              id="firstName"
              className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
              placeholder="Alex"
              disabled={isLoading}
              {...register('firstName', { required: 'Required' })}
            />
            {errors.firstName && <span className={styles.error}>{errors.firstName.message}</span>}
          </div>
          <div className={styles.field}>
            <label htmlFor="lastName" className={styles.label}>Last name</label>
            <input
              id="lastName"
              className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
              placeholder="Carter"
              disabled={isLoading}
              {...register('lastName', { required: 'Required' })}
            />
            {errors.lastName && <span className={styles.error}>{errors.lastName.message}</span>}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="line1" className={styles.label}>Address</label>
          <input
            id="line1"
            className={`${styles.input} ${errors.line1 ? styles.inputError : ''}`}
            placeholder="123 Main Street"
            disabled={isLoading}
            {...register('line1', { required: 'Address is required' })}
          />
          {errors.line1 && <span className={styles.error}>{errors.line1.message}</span>}
        </div>

        <div className={styles.threeCol}>
          <div className={styles.field}>
            <label htmlFor="city" className={styles.label}>City</label>
            <input
              id="city"
              className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
              placeholder="New York"
              disabled={isLoading}
              {...register('city', { required: 'Required' })}
            />
            {errors.city && <span className={styles.error}>{errors.city.message}</span>}
          </div>
          <div className={styles.field}>
            <label htmlFor="state" className={styles.label}>State</label>
            <input
              id="state"
              className={`${styles.input} ${errors.state ? styles.inputError : ''}`}
              placeholder="NY"
              maxLength={2}
              disabled={isLoading}
              {...register('state', { required: 'Required' })}
            />
            {errors.state && <span className={styles.error}>{errors.state.message}</span>}
          </div>
          <div className={styles.field}>
            <label htmlFor="zip" className={styles.label}>ZIP</label>
            <input
              id="zip"
              className={`${styles.input} ${errors.zip ? styles.inputError : ''}`}
              placeholder="10001"
              disabled={isLoading}
              {...register('zip', {
                required: 'Required',
                pattern: { value: /^\d{5}(-\d{4})?$/, message: 'Invalid ZIP' },
              })}
            />
            {errors.zip && <span className={styles.error}>{errors.zip.message}</span>}
          </div>
        </div>
      </section>

      {/* ── Payment section (mock UI) ────────────────────────── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Payment</h2>
        <p className={styles.paymentNote}>
          This is a demo — no real payment is processed.
        </p>

        <div className={styles.field}>
          <label htmlFor="cardNumber" className={styles.label}>Card number</label>
          <input
            id="cardNumber"
            className={styles.input}
            placeholder="4242 4242 4242 4242"
            disabled={isLoading}
            readOnly
          />
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="expiry" className={styles.label}>Expiry</label>
            <input id="expiry" className={styles.input} placeholder="MM / YY" disabled={isLoading} readOnly />
          </div>
          <div className={styles.field}>
            <label htmlFor="cvv" className={styles.label}>CVV</label>
            <input id="cvv" className={styles.input} placeholder="•••" disabled={isLoading} readOnly />
          </div>
        </div>
      </section>

      {/* ── Submit ──────────────────────────────────────────── */}
      <button type="submit" className={styles.submitButton} disabled={isLoading}>
        {isLoading ? 'Placing order…' : 'Place Order'}
      </button>
    </form>
  )
}
