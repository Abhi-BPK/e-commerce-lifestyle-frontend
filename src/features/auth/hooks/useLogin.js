// Encapsulates all login logic so Login.jsx stays a thin UI shell.
// Uses React 19's useActionState — the action drives the form lifecycle
// (pending / error / success) and a useEffect handles side effects on success.

import { useActionState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/auth.service'
import { setCredentials } from '../../../store/slices/authSlice'
import { setCart } from '../../../store/slices/cartSlice'
import { getCart } from '../../cart/services/cart.service'
import { ROUTES, VENDOR_ROUTES, ROLES } from '../../../shared/utils/constants'
import logger from '../../../logger/logger.service'

export function useLogin() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // loginAction is called by React when the form is submitted.
  // It receives the previous state and the native FormData from the <form>.
  // It must return the new state — never throws, always returns.
  async function loginAction(prevState, formData) {
    const email = formData.get('email')?.trim()
    const password = formData.get('password')

    logger.info('Login attempt', { email })

    try {
      const result = await login({ email, password })
      // Return success shape — useEffect below handles navigation
      return { success: true, data: result }
    } catch (err) {
      // err is already a normalized error object (see auth.service.js)
      logger.warn('Login failed', { email, error: err })
      return { success: false, error: err }
    }
  }

  const [state, formAction, isPending] = useActionState(loginAction, null)

  // Side effects that can't live inside the action (navigation, Redux dispatch,
  // localStorage write) — run after React has committed the new state
  useEffect(() => {
    if (!state?.success) return

    const { token, user } = state.data
    // Persist to localStorage so a hard refresh keeps the session alive
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    // Update Redux client state
    dispatch(setCredentials({ token, user }))
    logger.info('Login successful', { email: user.email, role: user.role })

    // Pull the user's persistent cart from the backend so the Navbar badge
    // and the /cart page reflect what's already saved server-side. We start
    // navigation immediately — the cart hydration runs in the background.
    // If it fails (network blip / stale token) we just log; the 401 handler
    // would have logged the user out anyway.
    getCart()
      .then((items) => dispatch(setCart(items)))
      .catch((err) => logger.warn('Cart hydration on login failed', err))

    // Case-insensitive comparison so "Vendor", "vendor", "VENDOR" all work
    const isVendor = user.role?.toLowerCase() === ROLES.VENDOR
    navigate(isVendor ? VENDOR_ROUTES.DASHBOARD : ROUTES.DASHBOARD)
  }, [state, dispatch, navigate])

  return { state, formAction, isPending }
}
