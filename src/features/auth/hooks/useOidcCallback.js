// useOidcCallback — handles the OAuth provider redirect back to our app.
//
// How it fits in the overall flow:
//   1. User clicked "Continue with Google/GitHub" on the Login page
//   2. Browser was redirected to the provider's login page
//   3. User authenticated with the provider
//   4. Provider redirected back to /auth/callback/google (or /github)
//      with ?code=...&state=... in the URL
//   5. THIS hook runs — it validates the state, exchanges the code with our
//      backend, updates Redux, and navigates to the dashboard
//
// Why a hook and not inline logic in OidcCallback.jsx?
//   Same reason useLogin.js exists — keeps the page component a thin UI shell
//   and puts all the logic in a testable, focused hook.
//
// @param {string} provider — 'google' | 'github' (from the URL path via useParams)
// @returns {{ status: 'loading' | 'error' | 'success', errorMessage: string | null }}

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { setCredentials } from '../../../store/slices/authSlice'
import { setCart } from '../../../store/slices/cartSlice'
import { getCart } from '../../cart/services/cart.service'
import { loginWithGoogle, loginWithGithub } from '../services/auth.service'
import { consumeOidcSessionData } from '../utils/oidcRedirect'
import { ROUTES, VENDOR_ROUTES, ROLES } from '../../../shared/utils/constants'
import logger from '../../../logger/logger.service'

export function useOidcCallback(provider) {
  const dispatch       = useDispatch()
  const navigate       = useNavigate()
  const [searchParams] = useSearchParams()

  // status drives what OidcCallback.jsx renders:
  //   'loading' → spinner (initial state, while the async exchange is in flight)
  //   'error'   → error message + back link
  //   'success' → null (navigate() already fired, component will unmount)
  const [status,       setStatus]       = useState('loading')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    // This effect intentionally runs exactly once on mount.
    // The empty dependency array [] is correct here — provider, searchParams,
    // dispatch, and navigate are all stable references on this route.
    //
    // React 19 StrictMode mounts effects twice in development.
    // The second invocation is handled safely: consumeOidcSessionData() deletes
    // the sessionStorage keys on the first run, so the second run reads
    // savedState = null, fails the state check, and exits before hitting the API.
    async function exchangeCode() {
      // ── Step 1: Read the URL params that the provider sent back ────────────
      const code          = searchParams.get('code')
      const returnedState = searchParams.get('state')
      // Providers send ?error=access_denied if the user cancels or denies access
      const providerError = searchParams.get('error')

      if (providerError) {
        const name = provider === 'google' ? 'Google' : 'GitHub'
        logger.warn('OIDC provider returned error', { provider, providerError })
        setErrorMessage(`${name} sign-in was cancelled or denied.`)
        setStatus('error')
        return
      }

      if (!code || !returnedState) {
        logger.warn('OIDC callback missing required URL params', { provider })
        setErrorMessage('Invalid sign-in callback — missing required parameters.')
        setStatus('error')
        return
      }

      // ── Step 2: Consume sessionStorage values (one-time read + delete) ─────
      // consumeOidcSessionData reads both keys and immediately deletes them.
      // This means a second call (StrictMode, back button) gets null values.
      const { savedState, codeVerifier } = consumeOidcSessionData()

      // ── Step 3: CSRF state check ────────────────────────────────────────────
      // If savedState is null it means consumeOidcSessionData() found nothing in
      // sessionStorage — the keys were already deleted by a concurrent invocation.
      // This is React 19 StrictMode behaviour in development: effects run twice.
      // The first run already consumed the data and its backend call is in flight.
      // Returning here (staying in 'loading') lets that navigation complete cleanly.
      if (!savedState) return

      // If both values are present but don't match, this redirect was NOT initiated
      // by our app — abort immediately and do NOT exchange the code.
      if (returnedState !== savedState) {
        logger.warn('OIDC state mismatch — possible CSRF attack or stale redirect', { provider })
        setErrorMessage('Security check failed. Please try signing in again.')
        setStatus('error')
        return
      }

      // ── Step 4: Exchange the authorization code with our backend ────────────
      // Our backend calls Google/GitHub server-to-server and returns { token, user }.
      // The redirectUri must match exactly what was used in the authorization URL.
      try {
        const redirectUri = `${window.location.origin}/auth/callback/${provider}`

        let result
        if (provider === 'google') {
          // codeVerifier is the PKCE verifier we generated before the redirect.
          // The backend forwards it to Google so Google can confirm it's us.
          result = await loginWithGoogle({ code, redirectUri, codeVerifier })
        } else {
          result = await loginWithGithub({ code, redirectUri })
        }

        // ── Step 5: Persist session and update Redux ────────────────────────
        // Write to localStorage BEFORE dispatching to Redux, because the Axios
        // request interceptor reads the token from localStorage (not Redux).
        // This matters for the cart hydration call that follows immediately.
        const { token, user } = result
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        dispatch(setCredentials({ token, user }))
        logger.info('OIDC login successful', { provider, email: user.email, role: user.role })

        // ── Step 6: Hydrate cart (fire-and-forget, mirrors useLogin.js) ──────
        // Start navigation immediately — cart hydration runs in the background.
        // If it fails, the Navbar cart badge just shows 0 until the next refresh.
        getCart()
          .then((items) => dispatch(setCart(items)))
          .catch((err) => logger.warn('Cart hydration after OIDC login failed', err))

        // ── Step 7: Navigate to the appropriate dashboard ───────────────────
        // replace: true removes the callback URL from browser history.
        // Without it, pressing Back from /dashboard lands on the callback URL
        // again — which would show an error (code already used, state gone).
        const isVendor = user.role?.toLowerCase() === ROLES.VENDOR
        navigate(isVendor ? VENDOR_ROUTES.DASHBOARD : ROUTES.DASHBOARD, { replace: true })

        setStatus('success')
      } catch (err) {
        // err is the normalized error shape from the Axios response interceptor:
        // { status, message, field, code }
        logger.warn('OIDC backend exchange failed', { provider, error: err })
        setErrorMessage(err?.message ?? 'Sign-in failed. Please try again.')
        setStatus('error')
      }
    }

    exchangeCode()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { status, errorMessage }
}
