export const APP_NAME = 'DOPPEY'

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id) => `/products/${id}`,
  CART: '/cart',
  ORDERS: '/orders',
  ORDER_DETAIL: (id) => `/orders/${id}`,
  CHECKOUT: '/checkout',
}

export const ROLES = {
  USER: 'user',
  VENDOR: 'vendor',
}

export const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Accessories', 'Home']

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
]

export const TAX_RATE = 0.1
