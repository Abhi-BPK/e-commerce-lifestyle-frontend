# Routing & Authentication Rules

## React Router v7

- Router config lives in `src/router/index.jsx`
- Use `createBrowserRouter` with `RouterProvider` — not the old `<BrowserRouter>` wrapper
- Page components live in `src/pages/` — one file per route
- Use `<Outlet />` for nested layouts
- Use `<Link>` and `<NavLink>` for navigation — never use `<a href>` for internal links
- Use `useNavigate` for programmatic navigation
- Use `useParams` to read URL params, `useSearchParams` for query strings
- Use loader functions for data fetching at the route level (React Router v7 pattern)
- Use `<Suspense>` with lazy-loaded routes for code splitting

```js
// src/router/index.jsx pattern
import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const Home = lazy(() => import('../pages/Home'))
const Dashboard = lazy(() => import('../pages/Dashboard'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Suspense><Home /></Suspense> },
      { path: 'dashboard', element: <ProtectedRoute><Suspense><Dashboard /></Suspense></ProtectedRoute> },
    ]
  }
])
```

## Protected Routes
- Create a `ProtectedRoute` component in `src/components/`
- It checks auth state from `useAuth()` context
- Redirects to `/login` if unauthenticated using `<Navigate>`

## Authentication Rules
- Auth state (user, token) lives in `AuthContext` (`src/context/AuthContext.jsx`)
- Token stored in `localStorage` — read on app init to persist sessions
- Never store passwords or sensitive data in state or localStorage
- HTTP requests with auth use an Axios instance with an Authorization header interceptor
- On logout: clear token from localStorage, reset auth state, redirect to `/login`
- Use `useAuth()` custom hook to access auth state in any component
