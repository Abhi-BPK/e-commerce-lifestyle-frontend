# State Management Rules

## When to Use What

| Scenario | Solution |
|---|---|
| Local UI state (toggle, input) | `useState` |
| Complex local state with transitions | `useReducer` |
| Shared state across a few components | Lift state up |
| Shared state across many/nested components | Context API |
| Global app-wide state (cart, auth, settings) | Redux Toolkit |

## Context API Rules
- Create context files in `src/context/`
- Each context file exports: the Provider component + a custom hook
- Never export raw context object for direct use in components
- Keep context focused — one context per concern (AuthContext, ThemeContext, CartContext)

```js
// Pattern to follow in src/context/AuthContext.jsx
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
```

## Redux Toolkit Rules
- Store config lives in `src/store/store.js`
- Each feature gets its own slice in `src/store/slices/featureName.slice.js`
- Use `createSlice` — never write raw reducers or action creators manually
- Use `createAsyncThunk` for async operations (HTTP calls) in Redux
- Selectors go at the bottom of the slice file
- Never put UI state (modal open/close) in Redux — that belongs in local state
- Access store with `useSelector`, dispatch with `useDispatch`

## useReducer Rules
- Keep reducers in `src/reducers/`
- Reducer must be a pure function — no side effects inside it
- Use alongside Context for feature-level shared state that doesn't need Redux

## Lifting State Up Rules
- When two siblings share state, move it to their nearest common parent
- Pass the state value as a prop down to children
- Pass the setter/updater function as a callback prop
- Add a comment `// Lifted from ChildComponent` when it's non-obvious

## Server State vs Client State

Server state (API responses) and client state (UI state) are fundamentally different — treat them separately.

- **Never** store API responses in Redux/Zustand if a data-fetching library (React Query, SWR) already manages them
- React Query / SWR own server state: loading, caching, refetching, and error handling
- Redux/Zustand own client state: UI preferences, modal open/close, selected tab, auth token

| State Type | Example | Where it lives |
|---|---|---|
| Server data | product list, order history | React Query cache |
| Auth user | logged-in user object | React Query + AuthContext |
| Cart (server-backed) | items in cart | React Query cache |
| UI flag | sidebar open, active tab | `useState` (local) |
| Global UI preference | theme, locale | Context API or Zustand |

```js
// WRONG — duplicating server state into Redux
dispatch(setProducts(await getProducts()))

// CORRECT — let React Query own the server data
const { data: products } = useQuery({ queryKey: ['products'], queryFn: getProducts })
```

## Cart — Optimistic Updates

Update the UI immediately on cart actions, then roll back if the server call fails.
This makes the cart feel instant even on slow connections.

```js
// src/hooks/useAddToCart.js
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToCart } from '../services/cart.service'

export function useAddToCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addToCart,

    // Step 1: optimistically add item before the request fires
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] })
      const previousCart = queryClient.getQueryData(['cart'])

      queryClient.setQueryData(['cart'], (old) => ({
        ...old,
        items: [...(old?.items ?? []), newItem],
      }))

      // return snapshot so we can roll back on error
      return { previousCart }
    },

    // Step 2: roll back if the server rejects the change
    onError: (_err, _newItem, context) => {
      queryClient.setQueryData(['cart'], context.previousCart)
    },

    // Step 3: sync with server truth after success or error
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}
```

## Form State Rules

Form state is temporary and belongs to the form — not the application.

- Manage form state with React Hook Form or `useActionState` (React 19) — not Redux/Zustand
- Do not lift form values into global state while the user is typing
- Only promote form output to global/server state **after** successful submission
- Reset the form after submission; do not leave stale form data in memory

```js
// WRONG — putting live form input into global store
onChange={(e) => dispatch(setSearchQuery(e.target.value))}

// CORRECT — keep form state local; push to URL/server on submit only
const { register, handleSubmit } = useForm()
const onSubmit = (data) => navigate(`/search?q=${data.query}`)
```

## Justifying Global State

Before adding anything to Redux or a global Context, answer these questions:

1. **Can it be local?** If only one component needs it, use `useState`.
2. **Can it be URL state?** If it affects navigation or should be bookmarkable (filters, page number, selected ID), put it in the URL via `useSearchParams`.
3. **Can it be server state?** If it comes from an API, let React Query manage it.
4. **Is it truly shared?** Only if multiple unrelated components need it and none of the above applies should it go in global state.

```
Decision tree:
  Used by one component?        → useState
  Drives the URL / shareable?   → useSearchParams
  Comes from an API?            → React Query
  Shared across many features?  → Context API (small) or Redux (large/complex)
```
