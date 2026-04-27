# Hooks Rules

## Built-in Hook Usage

### useState
- Use for simple local UI state (toggles, form fields, counters)
- Group related state into one object only if they always update together
- Never mutate state directly — always use the setter function

### useEffect
- Use ONLY for side effects: data fetching, subscriptions, timers, DOM manipulation
- Always specify the dependency array — never omit it
- Always return a cleanup function if the effect sets up subscriptions or timers
- Prefer `useEffect` for browser-only effects; for data fetching prefer React Query or Axios service layer
- Never fetch data in `useEffect` directly in a component — extract to a custom hook

### useReducer
- Use instead of `useState` when state has multiple sub-values or complex transition logic
- Keep reducer functions in `src/reducers/` as pure functions
- Name actions in SCREAMING_SNAKE_CASE: `INCREMENT`, `SET_USER`, `RESET_FORM`
- Pair with Context API for shared complex state without Redux overhead

### useContext
- Use for: theme, auth user, language/locale, anything needed across many components
- Always create context in `src/context/` with a dedicated provider component
- Export a custom hook (e.g., `useAuth`, `useTheme`) that wraps `useContext` — never use raw `useContext` in components

### useRef
- For DOM references and mutable values only
- Never use to work around re-render rules

### useMemo / useCallback
- Do NOT add prematurely — only when a measurable performance problem exists
- `useMemo`: memoize expensive computed values
- `useCallback`: memoize callback functions passed to child components that are wrapped in `React.memo`

### React 19 Hooks
- `use()`: use for reading resources (promises, context) inside components and conditionals
- `useOptimistic`: use for optimistic UI updates on mutations
- `useFormStatus`: use inside form children to read the parent form's pending state
- `useActionState`: use to manage form action state and errors in React 19 forms

## Custom Hooks

- All custom hooks go in `src/hooks/`
- Must start with `use` prefix: `useAuth`, `useFetch`, `useLocalStorage`, `useDebounce`
- One hook per file, filename matches hook name
- Custom hooks should encapsulate a single concern
- Custom hooks must be reusable — no hardcoded component-specific logic inside them
- Always return a consistent shape: `{ data, loading, error }` for async hooks

## Example Custom Hook Shape
```js
// src/hooks/useFetch.js
import { useState, useEffect } from 'react'

export function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // fetch logic here
  }, [url])

  return { data, loading, error }
}
```
