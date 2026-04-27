# HTTP Requests & Forms Rules

## HTTP Requests (Axios)

- All HTTP logic lives in `src/services/`
- Create a base Axios instance in `src/services/api.js` with baseURL and interceptors
- Group requests by feature: `src/services/auth.service.js`, `src/services/posts.service.js`
- Service functions are plain async functions — not hooks
- Wrap service calls in custom hooks for use in components: `useFetch`, `usePost`
- Always handle loading, success, and error states
- Use `useOptimistic` (React 19) for instant UI feedback on mutations

```js
// src/services/api.js pattern
import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
```

```js
// src/services/posts.service.js pattern
import api from './api'

export const getPosts = () => api.get('/posts')
export const createPost = (data) => api.post('/posts', data)
export const deletePost = (id) => api.delete(`/posts/${id}`)
```

## Environment Variables
- API base URL goes in `.env`: `VITE_API_URL=https://api.example.com`
- All Vite env vars must be prefixed with `VITE_`
- Never hardcode URLs in service files

## Caching Strategy

Different resources have different freshness requirements — apply the right strategy per resource type.

### Product Listing — Stale-While-Revalidate
- Slightly stale data is acceptable; speed is the priority
- Use React Query's `staleTime` to serve cached data immediately while a background refetch runs
- Recommended: `staleTime: 60_000` (1 minute) so the UI is instant on repeat visits

```js
// src/hooks/useProducts.js
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../services/products.service'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 60_000, // serve cached, refetch silently after 1 min
  })
}
```

### Cart — No Client-Side Caching
- Cart must always reflect server truth — never serve a stale cached version
- Set `staleTime: 0` and `gcTime: 0` so React Query never holds a stale copy
- Refetch on every mount and window focus

```js
// src/hooks/useCart.js
export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    staleTime: 0,   // always considered stale
    gcTime: 0,      // remove from cache immediately when unused
    refetchOnWindowFocus: true,
  })
}
```

### Order History — Cached Per Page, Invalidated on New Order
- Cache each page independently using the page number in the query key
- Invalidate all order history cache entries when a new order is placed

```js
// src/hooks/useOrderHistory.js
export function useOrderHistory(page) {
  return useQuery({
    queryKey: ['orders', page],   // separate cache entry per page
    queryFn: () => getOrders(page),
    staleTime: 5 * 60_000,
  })
}

// After placing an order, bust the cache:
// queryClient.invalidateQueries({ queryKey: ['orders'] })
```

### Manual Cache Busting
- Call `queryClient.invalidateQueries` after any mutation that changes server data
- Prefer `invalidateQueries` over `setQueryData` unless you have the full updated payload
- Wrap mutations in `useMutation` and use the `onSuccess` callback to invalidate

```js
// Pattern: invalidate after mutation
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function usePlaceOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: placeOrder,
    onSuccess: () => {
      // bust order history so next fetch is fresh
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      // also bust cart since it is now empty
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}
```

## Forms Rules

- Use React Hook Form for complex forms (validation, errors, submission)
- Use React 19 form actions (`action` prop on `<form>`) for server-integrated forms
- Use `useActionState` to track form action results and errors (React 19)
- Use `useFormStatus` inside submit buttons to show pending state (React 19)
- Two-way binding for simple forms: controlled inputs with `useState`
- Always validate on the client before submitting
- Show inline error messages per field — not just a generic top-level error
- Disable submit button while request is pending
- Clear form after successful submission

```jsx
// React 19 Form Action Pattern
import { useActionState } from 'react'

async function submitForm(prevState, formData) {
  const name = formData.get('name')
  // call your service here
  return { success: true }
}

export function MyForm() {
  const [state, action] = useActionState(submitForm, null)
  return (
    <form action={action}>
      <input name="name" />
      <button type="submit">Submit</button>
      {state?.success && <p>Done!</p>}
    </form>
  )
}
```
