// Signup form component — uses React Hook Form for client-side validation.
// The parent page (Signup.jsx) owns the submission lifecycle via useSignup.
//
// Role selector is a pill toggle (not a native <select>) to match the
// Apple-style "Shopper / Vendor" segmented control in the design.

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { ROUTES, ROLES } from '../../../shared/utils/constants'
import styles from './SignupForm.module.css'

export function SignupForm({ onSubmit, isLoading, serverError }) {
  const [role, setRole] = useState(ROLES.USER)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ mode: 'onTouched' })

  // getValues is used instead of watch to avoid React Compiler memoization issues
  // (react-hooks/incompatible-library warning with watch subscriptions)

  function submitWithRole(data) {
    onSubmit({ ...data, role })
  }

  return (
    <form
      onSubmit={handleSubmit(submitWithRole)}
      className={styles.form}
      noValidate
    >
      {/* First + Last name — side by side ─────────────────────── */}
      <div className={styles.nameRow}>
        <div className={styles.field}>
          <label htmlFor="firstName" className={styles.label}>
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="Alex"
            className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
            disabled={isLoading}
            {...register('firstName', { required: 'First name is required' })}
          />
          {errors.firstName && (
            <span className={styles.fieldError}>{errors.firstName.message}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="lastName" className={styles.label}>
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Carter"
            className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
            disabled={isLoading}
            {...register('lastName', { required: 'Last name is required' })}
          />
          {errors.lastName && (
            <span className={styles.fieldError}>{errors.lastName.message}</span>
          )}
        </div>
      </div>

      {/* Email ───────────────────────────────────────────────────── */}
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          disabled={isLoading}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
          })}
        />
        {errors.email && (
          <span className={styles.fieldError}>{errors.email.message}</span>
        )}
      </div>

      {/* Password ───────────────────────────────────────────────── */}
      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
          disabled={isLoading}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
          })}
        />
        {errors.password && (
          <span className={styles.fieldError}>{errors.password.message}</span>
        )}
      </div>

      {/* Confirm Password ───────────────────────────────────────── */}
      <div className={styles.field}>
        <label htmlFor="confirmPassword" className={styles.label}>
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter password"
          className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
          disabled={isLoading}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === getValues('password') || 'Passwords do not match',
          })}
        />
        {errors.confirmPassword && (
          <span className={styles.fieldError}>{errors.confirmPassword.message}</span>
        )}
      </div>

      {/* Role selector — pill toggle ─────────────────────────────── */}
      <div className={styles.field}>
        <span className={styles.label}>I am a</span>
        <div className={styles.roleToggle} role="group" aria-label="Account type">
          <button
            type="button"
            className={`${styles.rolePill} ${role === ROLES.USER ? styles.rolePillActive : ''}`}
            onClick={() => setRole(ROLES.USER)}
            aria-pressed={role === ROLES.USER}
          >
            Shopper
          </button>
          <button
            type="button"
            className={`${styles.rolePill} ${role === ROLES.VENDOR ? styles.rolePillActive : ''}`}
            onClick={() => setRole(ROLES.VENDOR)}
            aria-pressed={role === ROLES.VENDOR}
          >
            Vendor
          </button>
        </div>
      </div>

      {/* Server-side error ──────────────────────────────────────── */}
      {serverError && (
        <p className={styles.errorMessage} role="alert">
          {serverError.message}
        </p>
      )}

      {/* Submit ─────────────────────────────────────────────────── */}
      <button type="submit" className={styles.submitButton} disabled={isLoading}>
        {isLoading ? 'Creating account…' : 'Create Account'}
      </button>

      {/* Footer link ────────────────────────────────────────────── */}
      <p className={styles.footerText}>
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className={styles.footerLink}>
          Sign in
        </Link>
      </p>
    </form>
  )
}
