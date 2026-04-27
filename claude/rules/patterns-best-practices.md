# React Patterns & Best Practices

## Component Patterns

### Compound Components
- Use when a parent and its children share implicit state (e.g., Tabs, Accordion, Select)
- Share state via Context, not prop drilling

### Render Props
- Use sparingly — prefer custom hooks for logic reuse
- Only use when you need the parent to control what gets rendered

### Higher-Order Components (HOC)
- Avoid unless wrapping third-party components
- Prefer custom hooks for logic sharing between components

### Controlled vs Uncontrolled
- Default to controlled components (value + onChange)
- Use uncontrolled (useRef + defaultValue) only for performance-critical large forms

## Performance Patterns

- `React.memo`: wrap components that receive stable props but re-render often
- `useMemo`: memoize expensive calculations — not every value
- `useCallback`: memoize functions passed to memoized children
- `useTransition`: wrap non-urgent state updates (search filtering, tab switching)
- `useDeferredValue`: defer rendering of slow parts of UI while keeping input responsive
- Lazy load routes and heavy components with `React.lazy` + `<Suspense>`
- Use `<Suspense>` boundaries at meaningful levels — not every component

## Code Splitting
- Every page in `src/pages/` must be lazy loaded via `React.lazy`
- Heavy third-party components (charts, editors, maps) must also be lazy loaded

## Error Handling
- Add an `ErrorBoundary` component wrapping each major section/route
- Log errors to console in development, to a monitoring service in production
- Always show a user-friendly fallback UI on error — never a blank screen

## Side Effects Best Practices
- Data fetching → custom hook using `useEffect` or React 19 `use()`
- Subscriptions → set up in `useEffect`, always clean up in return function
- Timers → set up in `useEffect`, clear in return function
- Never perform side effects directly in the component body (outside useEffect)

## Folder Colocation
- Keep test file next to its component: `Button.jsx` + `Button.test.jsx`
- Keep CSS Module next to its component: `Button.jsx` + `Button.module.css`
- Only move to a shared folder if used in 3+ places

## Key Rules for Lists
- Always provide a stable, unique `key` prop when rendering lists
- Never use array index as key unless the list is static and never reordered

## Accessibility
- All interactive elements must be keyboard accessible
- Images must have meaningful `alt` attributes
- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<section>`)
- Form inputs must have associated `<label>` elements

## General Best Practices
- Keep components focused on one responsibility
- Derive state from props/existing state rather than duplicating it in a new useState
- Avoid deeply nested JSX — extract sub-components
- Prefer composition over inheritance always
- Never use `any` or suppress linting rules without a documented reason

## Logging & Observability

The application must surface problems in production. All logging goes through a single logger service so the underlying provider can be swapped without touching call sites.

### Logger Interface
- Create `src/services/logger.service.js` — the only file that knows about the real provider (console, Sentry, Datadog)
- Export four methods: `debug`, `info`, `warn`, `error`
- Every log call must pass a structured object, not a raw string, so logs are machine-parseable

```js
// src/services/logger.service.js
// Swap the provider here without changing any call site

const isDev = import.meta.env.DEV

const logger = {
  debug: (message, context = {}) => {
    if (isDev) console.debug({ level: 'debug', message, ...context })
  },
  info: (message, context = {}) => {
    console.info({ level: 'info', message, ...context })
    // production: analytics.track(message, context)
  },
  warn: (message, context = {}) => {
    console.warn({ level: 'warn', message, ...context })
    // production: Sentry.captureMessage(message, 'warning')
  },
  error: (message, error, context = {}) => {
    console.error({ level: 'error', message, error, ...context })
    // production: Sentry.captureException(error, { extra: context })
  },
}

export default logger
```

```js
// Usage — import logger, never use console directly in components
import logger from '../services/logger.service'

logger.info('Order placed', { orderId, userId })
logger.error('Payment failed', err, { cartTotal })
```

### Capturing Unhandled Errors

- Wrap every major route/section in an `ErrorBoundary` component (React class component)
- Also capture global JS errors and unhandled promise rejections in `main.jsx`

```js
// src/main.jsx — global safety net alongside ErrorBoundary components
window.onerror = (message, source, lineno, colno, error) => {
  logger.error('Unhandled JS error', error, { message, source, lineno, colno })
}

window.onunhandledrejection = (event) => {
  logger.error('Unhandled promise rejection', event.reason)
}
```

```jsx
// src/components/ErrorBoundary.jsx
import { Component } from 'react'
import logger from '../services/logger.service'

export class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // sends to logger provider (Sentry etc.) in production
    logger.error('React ErrorBoundary caught', error, { componentStack: info.componentStack })
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? <p>Something went wrong.</p>
    return this.props.children
  }
}
```

### Logging Route Changes and API Durations

- Log every route change as a structured `info` event
- Wrap Axios interceptors to log request start and end with duration

```js
// src/router/RouterLogger.jsx — place inside your router
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import logger from '../services/logger.service'

export function RouterLogger() {
  const location = useLocation()
  useEffect(() => {
    logger.info('Route changed', { path: location.pathname, search: location.search })
  }, [location])
  return null
}
```

```js
// src/services/api.js — add duration logging to the Axios instance
api.interceptors.request.use((config) => {
  config.metadata = { startTime: Date.now() }
  return config
})

api.interceptors.response.use(
  (response) => {
    const duration = Date.now() - response.config.metadata.startTime
    logger.info('API call succeeded', { url: response.config.url, status: response.status, duration })
    return response
  },
  (error) => {
    const duration = Date.now() - (error.config?.metadata?.startTime ?? Date.now())
    logger.error('API call failed', error, { url: error.config?.url, duration })
    return Promise.reject(error)
  }
)
```

## Progressive Web App (PWA)

The app must work offline and load instantly on repeat visits.

### Service Worker Registration
- Use the `vite-plugin-pwa` plugin (backed by Workbox) — do not write a service worker manually
- Register the service worker in `vite.config.js`
- Never register the service worker in dev mode — use `registerType: 'autoUpdate'` only in production builds

```js
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    VitePWA({
      registerType: 'prompt',   // 'prompt' so we can show an update notification
      workbox: {
        // App Shell: cache the HTML skeleton so layout loads offline instantly
        navigateFallback: '/index.html',

        // Product listing: cache at runtime with stale-while-revalidate
        runtimeCaching: [
          {
            urlPattern: /\/api\/products/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'products-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 }, // 1 hour
            },
          },
        ],
      },
    }),
  ],
}
```

### App Shell Caching Strategy
- The app shell (HTML, CSS, JS bundles) is pre-cached by Workbox automatically via `navigateFallback`
- On first load the shell is stored; all subsequent navigations load from cache — zero network needed for the layout

### Offline Product Browsing
- Product listing API calls are cached with `StaleWhileRevalidate` (see `runtimeCaching` above)
- Users can browse previously loaded products even with no internet connection
- Do NOT cache the cart or checkout endpoints offline — those require server truth

### Update-Available Notification
- Use `registerType: 'prompt'` so the service worker waits for user confirmation before activating
- Listen to the `useRegisterSW` hook from `vite-plugin-pwa` and show a toast/banner when an update is ready

```jsx
// src/components/PwaUpdatePrompt.jsx
import { useRegisterSW } from 'virtual:pwa-register/react'

export function PwaUpdatePrompt() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div className="pwa-update-banner">
      <p>A new version is available.</p>
      <button onClick={() => updateServiceWorker(true)}>Reload</button>
    </div>
  )
}
```

- Mount `<PwaUpdatePrompt />` once near the root of the app (e.g., inside `App.jsx`)
- The banner must be dismissible and must not block interaction with the page
        