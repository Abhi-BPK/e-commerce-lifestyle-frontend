/* eslint-disable react-refresh/only-export-components */
// Router config files inherently mix component definitions (layout wrappers,
// guards) with the exported `router` object. Splitting each helper into its
// own file would fragment a tightly-coupled config — suppression is intentional.

// React Router v7 config using createBrowserRouter.
//
// Architecture:
//   RootLayout            — auth context + error boundary for the whole tree
//   ProtectedLayout       — renders Navbar above all authenticated store pages;
//                           guards against unauthenticated access
//   VendorProtectedLayout — guards vendor routes; redirects non-vendors to /dashboard
//   Public routes         — /login, /signup (no Navbar)
//   Protected routes      — /men-clothing, /cart, /orders, /checkout, /dashboard
//   Vendor routes         — /vendor/* (VendorDashboard layout + nested pages)
//
// Every page is lazy-loaded (React.lazy + Suspense) so the initial bundle
// only contains the shell — not every page.

import { lazy, Suspense, useEffect } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'
import { useSelector } from 'react-redux'

import { AuthProvider } from '../features/auth/AuthContext'
import { ErrorBoundary } from '../shared/components/ErrorBoundary'
import { Spinner } from '../shared/components/Spinner'
import { Navbar } from '../shared/components/Navbar'
import { selectIsAuthenticated, selectCurrentUser } from '../store/slices/authSlice'
import { ROLES } from '../shared/utils/constants'
import logger from '../logger/logger.service'

// ── Lazy page imports ─────────────────────────────────────────────
// Each import() creates a separate code-split chunk so pages are only
// downloaded when first visited — keeps initial load fast.
const Login     = lazy(() => import('../features/auth/pages/Login'))
const Signup    = lazy(() => import('../features/auth/pages/Signup'))
const Dashboard = lazy(() => import('../features/dashboard/pages/Dashboard'))

const Cart = lazy(() => import('../features/cart/pages/Cart'))

const OrderHistory = lazy(() => import('../features/orders/pages/OrderHistory'))
const OrderDetail  = lazy(() => import('../features/orders/pages/OrderDetail'))

const Checkout = lazy(() => import('../features/checkout/pages/Checkout'))

// Men's Clothing section — lazy-loaded like all other pages
const MenCategoryLanding = lazy(() => import('../features/men/pages/MenCategoryLanding'))
const MenProductListing  = lazy(() => import('../features/men/pages/MenProductListing'))
const MenProductDetail   = lazy(() => import('../features/men/pages/MenProductDetail'))

// ── Vendor portal pages (lazy-loaded) ────────────────────────────
// Loaded only when a vendor visits /vendor/* — zero impact on the
// bundle size for regular shoppers.
const VendorDashboard     = lazy(() => import('../features/vendor/pages/VendorDashboard'))
const Analytics           = lazy(() => import('../features/vendor/pages/Analytics'))
const ProductManagement   = lazy(() => import('../features/vendor/pages/ProductManagement'))
const InventoryManagement = lazy(() => import('../features/vendor/pages/InventoryManagement'))
const OrderManagement     = lazy(() => import('../features/vendor/pages/OrderManagement'))

// ── Route-change logger ───────────────────────────────────────────
// Renders nothing — only logs navigation events as structured info entries
// so we can trace which pages users visit (useful for debugging / analytics).
function RouteLogger() {
  const location = useLocation()
  useEffect(() => {
    logger.info('Route changed', { path: location.pathname, search: location.search })
  }, [location])
  return null
}

// ── Root layout ───────────────────────────────────────────────────
// Provides auth context + error boundary to the entire route tree.
// AuthProvider must live INSIDE the router so it can call useNavigate.
function RootLayout() {
  return (
    <AuthProvider>
      <RouteLogger />
      <ErrorBoundary>
        {/* Outlet renders the matched child route (either public or protected layout) */}
        <Outlet />
      </ErrorBoundary>
    </AuthProvider>
  )
}

// ── Protected layout ──────────────────────────────────────────────
// Wraps all authenticated routes.
//  1. Redirects to /login if there is no token in Redux state
//  2. Renders the sticky Navbar above the page content
//  3. Wraps page content in its own ErrorBoundary so a page-level crash
//     doesn't take down the Navbar
function ProtectedLayout() {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  // If not logged in, send the user to the login page.
  // `replace` removes this attempted URL from history so the back button
  // doesn't bring them back to a protected page.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      <Navbar />
      <ErrorBoundary>
        {/* Outlet renders the specific page (MenCategoryLanding, Cart, etc.) */}
        <Outlet />
      </ErrorBoundary>
    </>
  )
}

// ── Vendor protected layout ───────────────────────────────────────
// Guards all /vendor/* routes.
//   - Not logged in at all → /login
//   - Logged in but role is not "vendor" → /dashboard (store home)
// VendorDashboard (the sidebar+navbar layout) is a child of this guard,
// so the guard itself renders no UI — just the Outlet or a redirect.
function VendorProtectedLayout() {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user            = useSelector(selectCurrentUser)

  if (!isAuthenticated)                                  return <Navigate to="/login"     replace />
  if (user?.role?.toLowerCase() !== ROLES.VENDOR)       return <Navigate to="/dashboard" replace />

  return <Outlet />
}

// ── Suspense wrapper ──────────────────────────────────────────────
// Helper that wraps a lazy component in Suspense so we don't repeat
// the fallback on every route definition.
function Page({ component: Component }) {
  return (
    <Suspense fallback={<Spinner.Page />}>
      <Component />
    </Suspense>
  )
}

// ── Router config ─────────────────────────────────────────────────
export const router = createBrowserRouter([
  {
    // RootLayout wraps every route — auth context + catch-all error boundary
    element: <RootLayout />,
    children: [
      // Redirect root "/" to the Men's Clothing landing page (home of the store)
      {
        index: true,
        element: <Navigate to="/men-clothing" replace />,
      },

      // ── Public routes (no Navbar) ───────────────────────────────
      // Users who are already logged in visiting /login are NOT redirected
      // automatically here — they can still reach login/signup to switch accounts.
      {
        path: '/login',
        element: <Page component={Login} />,
      },
      {
        path: '/signup',
        element: <Page component={Signup} />,
      },

      // ── Protected routes (Navbar shown) ────────────────────────
      // ProtectedLayout checks auth and renders the Navbar above each page.
      {
        element: <ProtectedLayout />,
        children: [
          // ── Men's Clothing section ──────────────────────────────
          //   /men-clothing               → category landing (6 subcategory cards)
          //   /men-clothing/:subcategory  → filtered product grid
          //   /men-clothing/:subcategory/:id → product detail page
          { path: '/men-clothing',                  element: <Page component={MenCategoryLanding} /> },
          { path: '/men-clothing/:subcategory',     element: <Page component={MenProductListing} /> },
          { path: '/men-clothing/:subcategory/:id', element: <Page component={MenProductDetail} /> },

          // Shopping cart
          { path: '/cart',      element: <Page component={Cart} /> },

          // Order history + order detail
          { path: '/orders',    element: <Page component={OrderHistory} /> },
          { path: '/orders/:id', element: <Page component={OrderDetail} /> },

          // Checkout flow
          { path: '/checkout',  element: <Page component={Checkout} /> },

          // Dashboard (account page, reached via avatar button)
          { path: '/dashboard', element: <Page component={Dashboard} /> },
        ],
      },

      // ── Vendor portal routes ────────────────────────────────────
      // Completely separate from the store UI — uses its own layout
      // (VendorDashboard = sidebar + top bar + Outlet).
      // VendorProtectedLayout ensures only role:"vendor" users can enter.
      {
        path: '/vendor',
        element: <VendorProtectedLayout />,
        children: [
          // /vendor → bounce directly to the analytics overview
          { index: true, element: <Navigate to="/vendor/dashboard" replace /> },

          // Pathless layout route — VendorDashboard renders sidebar + navbar
          // and its <Outlet> renders whichever /vendor/* child is active.
          {
            element: <Page component={VendorDashboard} />,
            children: [
              // /vendor/dashboard  → Analytics overview (same component as /vendor/analytics)
              { path: 'dashboard',  element: <Page component={Analytics} /> },
              { path: 'products',   element: <Page component={ProductManagement} /> },
              { path: 'inventory',  element: <Page component={InventoryManagement} /> },
              { path: 'orders',     element: <Page component={OrderManagement} /> },
              { path: 'analytics',  element: <Page component={Analytics} /> },
            ],
          },
        ],
      },

      // Catch-all — redirect unknown paths to Men's Clothing landing page
      {
        path: '*',
        element: <Navigate to="/men-clothing" replace />,
      },
    ],
  },
])
