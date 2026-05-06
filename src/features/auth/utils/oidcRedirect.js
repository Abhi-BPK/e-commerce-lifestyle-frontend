// oidcRedirect — builds OAuth authorization URLs and manages the sessionStorage
// handshake values needed for a secure OAuth flow.
//
// Two pieces of state are stored in sessionStorage before the redirect:
//
//   oidc_state    — a random CSRF token included in the auth URL.
//                   The provider echoes it back on redirect so we can confirm
//                   the redirect was initiated by our own app (not a CSRF attack).
//
//   oidc_verifier — Google only. The PKCE code_verifier (see pkce.js).
//                   Stored here so we can send it to the backend when the
//                   callback page exchanges the code.
//
// Why sessionStorage and not localStorage?
//   sessionStorage is automatically cleared when the tab closes, limiting the
//   window in which these short-lived values could be misused. The OIDC flow
//   completes within a single redirect, so cross-tab or cross-session persistence
//   is unnecessary.
//
// Why are all sessionStorage key names defined as exported constants?
//   So any future file that needs to check for these keys uses the same string,
//   preventing silent bugs from typos.

import { generateCodeVerifier, generateCodeChallenge } from './pkce'

// ── SessionStorage key constants ──────────────────────────────────────────────
export const OIDC_STATE_KEY    = 'oidc_state'
export const OIDC_VERIFIER_KEY = 'oidc_verifier'

/**
 * generateState (internal)
 * Creates a random 32-character URL-safe string used as the OAuth "state"
 * parameter. This is our CSRF token for the OAuth flow.
 */
function generateState() {
  const array = new Uint8Array(24) // 24 bytes → 32 base64url characters
  crypto.getRandomValues(array)
  const binary = Array.from(array, (b) => String.fromCharCode(b)).join('')
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

/**
 * initiateGoogleLogin
 * Async because generating the PKCE code challenge requires SHA-256
 * (crypto.subtle.digest is Promise-based — see pkce.js).
 *
 * Steps:
 *   1. Generate PKCE verifier + challenge
 *   2. Generate random state
 *   3. Write verifier + state to sessionStorage (survives the browser redirect)
 *   4. Redirect the browser to Google's authorization endpoint
 *
 * The redirect_uri is computed from window.location.origin so this works in
 * both dev (http://localhost:5173) and production without a rebuild.
 */
export async function initiateGoogleLogin() {
  const clientId    = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const redirectUri = `${window.location.origin}/auth/callback/google`

  const state     = generateState()
  const verifier  = generateCodeVerifier()
  const challenge = await generateCodeChallenge(verifier)

  // Write to sessionStorage BEFORE the redirect — the page is about to unload.
  // Both values will be read and deleted by consumeOidcSessionData() in the callback.
  sessionStorage.setItem(OIDC_STATE_KEY,    state)
  sessionStorage.setItem(OIDC_VERIFIER_KEY, verifier)

  const params = new URLSearchParams({
    client_id:             clientId,
    redirect_uri:          redirectUri,
    response_type:         'code',
    scope:                 'openid email profile',
    code_challenge:        challenge,
    code_challenge_method: 'S256',
    state,
  })

  // Full-page redirect — sessionStorage is preserved within the same browser tab
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

/**
 * initiateGithubLogin
 * Synchronous — GitHub's OAuth App flow does not support PKCE, so there is no
 * async work to do. We only need a random state token for CSRF protection.
 */
export function initiateGithubLogin() {
  const clientId    = import.meta.env.VITE_GITHUB_CLIENT_ID
  const redirectUri = `${window.location.origin}/auth/callback/github`

  const state = generateState()
  sessionStorage.setItem(OIDC_STATE_KEY, state)

  // Explicitly remove any leftover verifier from a prior abandoned Google flow.
  // Without this, the callback hook would find a stale verifier and send it to
  // the backend unnecessarily.
  sessionStorage.removeItem(OIDC_VERIFIER_KEY)

  const params = new URLSearchParams({
    client_id:    clientId,
    redirect_uri: redirectUri,
    scope:        'user:email',
    state,
  })

  window.location.href = `https://github.com/login/oauth/authorize?${params}`
}

/**
 * consumeOidcSessionData
 * Reads and immediately deletes both sessionStorage keys.
 * "Consume" = one-time use. Once called, both keys are gone.
 *
 * This is called at the start of the callback hook before any network request.
 * Deleting the keys immediately means:
 *   - No replay attacks (a second call returns null values)
 *   - React 19 StrictMode's double-invocation of useEffect is handled cleanly
 *     (second run fails the state check and aborts)
 *
 * @returns {{ savedState: string | null, codeVerifier: string | null }}
 */
export function consumeOidcSessionData() {
  const savedState   = sessionStorage.getItem(OIDC_STATE_KEY)
  const codeVerifier = sessionStorage.getItem(OIDC_VERIFIER_KEY)

  sessionStorage.removeItem(OIDC_STATE_KEY)
  sessionStorage.removeItem(OIDC_VERIFIER_KEY)

  return { savedState, codeVerifier }
}
