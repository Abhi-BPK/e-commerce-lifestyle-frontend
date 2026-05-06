// OidcCallback — the page rendered at /auth/callback/google and /auth/callback/github.
//
// What this page does:
//   After the user authenticates with Google or GitHub, the provider redirects
//   them back to this URL with a short-lived authorization code in the query string.
//   This page's only job is to:
//     1. Figure out which provider we're handling (from the URL path)
//     2. Hand off to useOidcCallback, which does the actual code exchange
//     3. Show a loading spinner, an error message, or nothing (on success)
//
// Why does it render nothing on success?
//   useOidcCallback calls navigate() as soon as the token arrives, which causes
//   React Router to unmount this component and mount the dashboard instead.
//   There is no visible flash because the navigation is synchronous from React's
//   perspective — the user goes straight to /dashboard.
//
// Why useParams() instead of a prop?
//   The router registers two separate paths (/auth/callback/google and /github)
//   both pointing to this single component. useParams() reads the last segment
//   of whichever path matched, giving us 'google' or 'github' without needing
//   two separate wrapper components.

import { useParams, Link } from 'react-router-dom'
import { useOidcCallback } from '../hooks/useOidcCallback'
import { Spinner } from '../../../shared/components/Spinner'
import { ROUTES } from '../../../shared/utils/constants'
import styles from './OidcCallback.module.css'

export default function OidcCallback() {
  // provider is 'google' or 'github' — determined by which route matched
  const { provider } = useParams()
  const { status, errorMessage } = useOidcCallback(provider)

  // ── Loading state ─────────────────────────────────────────────────────────
  // Shown while the code is being exchanged with the backend (usually < 2s)
  if (status === 'loading') {
    const providerName = provider === 'google' ? 'Google' : 'GitHub'
    return (
      <main className={styles.page}>
        <Spinner size="lg" />
        <p className={styles.message}>Completing sign-in with {providerName}…</p>
      </main>
    )
  }

  // ── Error state ───────────────────────────────────────────────────────────
  // Shown when the provider returns an error, state validation fails,
  // or the backend exchange fails
  if (status === 'error') {
    return (
      <main className={styles.page}>
        <p className={styles.errorTitle}>Sign-in failed</p>
        <p className={styles.errorMessage}>{errorMessage}</p>
        <Link to={ROUTES.LOGIN} className={styles.retryLink}>
          Back to sign in
        </Link>
      </main>
    )
  }

  // ── Success state ─────────────────────────────────────────────────────────
  // navigate() in useOidcCallback already fired — this component is being
  // unmounted. Render nothing to avoid any flash of content.
  return null
}
