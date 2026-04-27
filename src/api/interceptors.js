import api from './axios.instance'
import { normalizeError } from './errorNormalizer'
import logger from '../logger/logger.service'
import { logout } from '../store/slices/authSlice'

// Call once at app startup (in main.jsx) after the Redux store is ready.

export function setupInterceptors(store) {
  // ── Request ──────────────────────────────────────────────────────────────
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Stamp so the response interceptor can compute call duration
    config.metadata = { startTime: Date.now() }
    logger.debug('API request', { method: config.method?.toUpperCase(), url: config.url })
    return config
  })

  // ── Response ─────────────────────────────────────────────────────────────
  api.interceptors.response.use(
    (response) => {
      const duration = Date.now() - (response.config.metadata?.startTime ?? Date.now())
      logger.info('API call succeeded', {
        url: response.config.url,
        status: response.status,
        duration,
      })
      return response
    },
    (error) => {
      const duration = Date.now() - (error.config?.metadata?.startTime ?? Date.now())
      const normalized = normalizeError(error)

      logger.error('API call failed', error, {
        url: error.config?.url,
        duration,
        ...normalized,
      })

      // Auto-logout on 401 so stale tokens are cleared app-wide
      if (normalized.status === 401 && store) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        store.dispatch(logout())
      }

      return Promise.reject(normalized)
    },
  )
}
