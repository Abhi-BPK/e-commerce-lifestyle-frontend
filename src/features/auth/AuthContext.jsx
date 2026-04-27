/* eslint-disable react-refresh/only-export-components */
// Context files must export both the Provider component and the companion hook
// (per state-management rules). The fast-refresh rule is suppressed intentionally. and exposes a convenient
// API to the component tree: { user, isAuthenticated, logout }.
// It must be rendered inside both <Provider> (Redux) and <RouterProvider>
// because it uses useNavigate — see router/index.jsx for placement.

import { createContext, useCallback, useContext, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout as logoutAction, selectCurrentUser, selectIsAuthenticated } from '../../store/slices/authSlice'
import { ROUTES } from '../../shared/utils/constants'
import logger from '../../logger/logger.service'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const logout = useCallback(() => {
    // Clear localStorage then Redux — order matters so the interceptor
    // doesn't fire a logout loop on any in-flight requests
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch(logoutAction())
    logger.info('User logged out', { email: user?.email })
    navigate(ROUTES.LOGIN)
  }, [dispatch, navigate, user?.email])

  const value = useMemo(
    () => ({ user, isAuthenticated, logout }),
    [user, isAuthenticated, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Always use this hook instead of importing AuthContext directly
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
