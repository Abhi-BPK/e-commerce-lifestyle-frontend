// Presentational form component for login.
// Receives the action, state, and pending flag from the Login page via the
// useLogin hook. The parent handles all logic; this component is pure UI.
//
// Uses React 19's native <form action={formAction}> — no onSubmit handler needed.
// React drives the isPending state automatically while the async action runs.

import { Link } from 'react-router-dom'
import { ROUTES } from '../../../shared/utils/constants'
import styles from './LoginForm.module.css'

export function LoginForm({ formAction, state, isPending }) {
  const errorMessage = state?.success === false ? state.error?.message : null

  return (
    <form action={formAction} className={styles.form} noValidate>
      {/* Email ─────────────────────────────────────────────────── */}
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          className={styles.input}
          disabled={isPending}
        />
      </div>

      {/* Password ───────────────────────────────────────────────── */}
      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          className={styles.input}
          disabled={isPending}
        />
      </div>

      {/* Server-side error message ───────────────────────────────── */}
      {errorMessage && (
        <p className={styles.errorMessage} role="alert">
          {errorMessage}
        </p>
      )}

      {/* Submit ─────────────────────────────────────────────────── */}
      <button type="submit" className={styles.submitButton} disabled={isPending}>
        {isPending ? 'Signing in…' : 'Sign In'}
      </button>

      {/* Footer link ────────────────────────────────────────────── */}
      <p className={styles.footerText}>
        Don&apos;t have an account?{' '}
        <Link to={ROUTES.SIGNUP} className={styles.footerLink}>
          Sign up
        </Link>
      </p>
    </form>
  )
}
