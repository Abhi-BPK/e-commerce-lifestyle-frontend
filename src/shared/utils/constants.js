export const APP_NAME = 'DOPPEY'

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  MEN_CLOTHING: '/men-clothing',
  CART: '/cart',
  ORDERS: '/orders',
  ORDER_DETAIL: (id) => `/orders/${id}`,
  CHECKOUT: '/checkout',
}

export const ROLES = {
  USER: 'user',
  VENDOR: 'vendor',
}

// Men's clothing subcategory definitions — used by the landing page and listing page.
// Imported directly from here so the data lives in one place (single source of truth).
export { MEN_SUBCATEGORIES } from '../../features/men/data/menCategories'

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
]

export const TAX_RATE = 0.1
