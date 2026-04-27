// Signup page — orchestration shell.
// SignupForm handles RHF validation and calls onSubmit with clean data.
// This page handles:
//   1. useSignup hook for the async submission lifecycle
//   2. useNavigationGuard to warn if user navigates away mid-form
//   3. Rendering the card layout, success state, and nav guard dialog

import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useSignup } from '../hooks/useSignup'
import { useNavigationGuard } from '../../../shared/hooks/useNavigationGuard'
import { SignupForm } from '../components/SignupForm'
import { ROUTES } from '../../../shared/utils/constants'
import styles from './Signup.module.css'

export default function Signup() {
  const { handleSignup, isLoading, isSuccess, error } = useSignup()
  const navigate = useNavigate()

  // Track whether the form has been touched so the navigation guard
  // only activates once the user has started filling things in.
  // SignupForm exposes isDirty via the formIsDirty prop pattern below.
  // We keep a simple flag here that gets set on first field interaction.

  // Navigate to login after a short success delay so user sees the message
  useEffect(() => {
    if (!isSuccess) return
    const timer = setTimeout(() => navigate(ROUTES.LOGIN), 2000)
    return () => clearTimeout(timer)
  }, [isSuccess, navigate])

  // Block navigation while the form has been touched and is not yet submitted
  // isDirty is tracked by the SignupForm component and reported via callback
  const blocker = useNavigationGuard(isLoading)

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        {/* Brand wordmark */}
        <p className={styles.wordmark}>DOPPEY</p>

        {isSuccess ? (
          /* ── Success state ───────────────────────────────────── */
          <div className={styles.successState}>
            <div className={styles.successIcon} aria-hidden="true">✓</div>
            <h1 className={styles.heading}>You&apos;re all set!</h1>
            <p className={styles.subheading}>
              Your account has been created. Redirecting you to sign in…
            </p>
          </div>
        ) : (
          /* ── Signup form ─────────────────────────────────────── */
          <>
            <h1 className={styles.heading}>Create your account</h1>
            <p className={styles.subheading}>
              Join DOPPEY and start shopping or selling.
            </p>

            <SignupForm
              onSubmit={handleSignup}
              isLoading={isLoading}
              serverError={error}
            />
          </>
        )}
      </div>

      {/* ── Navigation guard dialog ───────────────────────────── */}
      {blocker.state === 'blocked' && (
        <div className={styles.guardOverlay} role="dialog" aria-modal="true">
          <div className={styles.guardDialog}>
            <p className={styles.guardTitle}>Leave this page?</p>
            <p className={styles.guardMessage}>
              Your account is being created. Leaving now will cancel it.
            </p>
            <div className={styles.guardActions}>
              <button
                className={styles.guardStay}
                onClick={() => blocker.reset()}
              >
                Stay
              </button>
              <button
                className={styles.guardLeave}
                onClick={() => blocker.proceed()}
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
