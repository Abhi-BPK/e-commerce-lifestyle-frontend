// Wraps RTL's render with Redux Provider, MemoryRouter, and AuthProvider so
// tests don't need to repeat the provider boilerplate.
// AuthProvider must live inside MemoryRouter because it calls useNavigate.

import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../store/slices/authSlice'
import cartReducer from '../store/slices/cartSlice'
import { AuthProvider } from '../features/auth/AuthContext'

export function makeStore(preloadedState = {}) {
  return configureStore({
    reducer: { auth: authReducer, cart: cartReducer },
    preloadedState,
  })
}

export function renderWithProviders(
  ui,
  { preloadedState = {}, route = '/', store = makeStore(preloadedState) } = {},
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        {/* MemoryRouter must wrap AuthProvider because AuthProvider calls useNavigate */}
        <MemoryRouter initialEntries={[route]}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </MemoryRouter>
      </Provider>
    )
  }
  return { store, ...render(ui, { wrapper: Wrapper }) }
}
