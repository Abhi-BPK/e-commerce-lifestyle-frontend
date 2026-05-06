// OidcButtons — renders "Continue with Google" and "Continue with GitHub" buttons.
//
// How it works:
//   Clicking either button initiates a full-page redirect to the provider's
//   OAuth authorization page. The redirect is built by initiateGoogleLogin() /
//   initiateGithubLogin() in oidcRedirect.js, which also writes the PKCE verifier
//   and CSRF state to sessionStorage before the page unloads.
//
//   This component needs no props — it reads the client IDs from environment
//   variables via the redirect utilities and is fully self-contained.
//
// Why track `pending` state?
//   initiateGoogleLogin() is async (SHA-256 for PKCE takes a moment), and
//   between clicking and the redirect firing, the button should show "Redirecting…".
//   More importantly, BOTH buttons are disabled while one is in-flight — without
//   this, a fast double-click could write two sets of CSRF/PKCE values to
//   sessionStorage, causing the callback to fail a state check.

import { useState } from 'react'
import { initiateGoogleLogin, initiateGithubLogin } from '../utils/oidcRedirect'
import logger from '../../../logger/logger.service'
import styles from './OidcButtons.module.css'

export function OidcButtons() {
  // null means idle; 'google' or 'github' means that provider's redirect is in progress
  const [pending, setPending] = useState(null)

  // ── Google handler ─────────────────────────────────────────────────────────
  // async because initiateGoogleLogin awaits SHA-256 for PKCE
  async function handleGoogle() {
    if (pending) return // guard against double-clicks while already redirecting
    setPending('google')
    logger.info('OIDC login initiated', { provider: 'google' })
    try {
      await initiateGoogleLogin()
      // After this resolves, the page is already navigating away.
      // Nothing after this line runs in the normal case.
    } catch (err) {
      // Only reaches here if something unexpected failed (e.g. crypto.subtle unavailable).
      logger.warn('Failed to initiate Google login', err)
      setPending(null)
    }
  }

  // ── GitHub handler ─────────────────────────────────────────────────────────
  // synchronous — no PKCE, redirect fires immediately
  function handleGithub() {
    if (pending) return
    setPending('github')
    logger.info('OIDC login initiated', { provider: 'github' })
    try {
      initiateGithubLogin() // redirect fires immediately — nothing runs after this
    } catch (err) {
      logger.warn('Failed to initiate GitHub login', err)
      setPending(null)
    }
  }

  return (
    <div className={styles.container}>
      {/* Divider between the email/password form above and the social buttons below */}
      <div className={styles.divider} aria-hidden="true">
        <span className={styles.dividerText}>or</span>
      </div>

      {/* Google sign-in button */}
      <button
        type="button"
        className={styles.socialButton}
        onClick={handleGoogle}
        disabled={!!pending}
        aria-busy={pending === 'google'}
      >
        <GoogleIcon className={styles.icon} />
        <span>{pending === 'google' ? 'Redirecting…' : 'Continue with Google'}</span>
      </button>

      {/* GitHub sign-in button */}
      <button
        type="button"
        className={styles.socialButton}
        onClick={handleGithub}
        disabled={!!pending}
        aria-busy={pending === 'github'}
      >
        <GitHubIcon className={styles.icon} />
        <span>{pending === 'github' ? 'Redirecting…' : 'Continue with GitHub'}</span>
      </button>
    </div>
  )
}

// ── Icon components ────────────────────────────────────────────────────────────
// Inline SVG — no external image requests, no CORS issues, renders instantly.
// aria-hidden and focusable="false" keep them invisible to screen readers
// (the button's text label is what gets announced instead).

function GoogleIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

function GitHubIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.071 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"
        fill="currentColor"
      />
    </svg>
  )
}
