import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'

import { store } from './store/store'
import { router } from './router/index'
import { setupInterceptors } from './api/interceptors'
import logger from './logger/logger.service'
import './styles/global.css'

// Attach Axios request / response interceptors.
// Must run before any API call; the store reference enables auto-logout on 401.
setupInterceptors(store)

// ── Global safety net ─────────────────────────────────────────────
// Catches JS errors that escape React's ErrorBoundary (e.g. async callbacks,
// event handlers outside the render tree).

window.onerror = (message, source, lineno, colno, error) => {
  logger.error('Unhandled JS error', error ?? new Error(String(message)), {
    source,
    lineno,
    colno,
  })
}

window.onunhandledrejection = (event) => {
  logger.error(
    'Unhandled promise rejection',
    event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
  )
}

// ── App entry point ───────────────────────────────────────────────
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Redux Provider must wrap RouterProvider so connected components
        inside the router (ProtectedRoute, AuthContext, etc.) can access
        the store. */}
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
