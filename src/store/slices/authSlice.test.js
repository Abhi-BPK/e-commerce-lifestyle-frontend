// Tests for authSlice — covers initial state, setCredentials, and logout.
// We test the reducer directly (pure function: state + action → new state)
// so no store setup or React rendering is needed here.

import { describe, it, expect } from 'vitest'
import authReducer, { setCredentials, logout, selectIsAuthenticated, selectCurrentUser } from './authSlice'

// ── Helpers ───────────────────────────────────────────────────────
const mockUser = { id: '1', firstName: 'Jane', lastName: 'Doe', email: 'jane@test.com', role: 'user' }
const mockToken = 'mock.jwt.token'

// ── Tests ─────────────────────────────────────────────────────────
describe('authSlice reducer', () => {
  it('returns correct initial state when called with undefined', () => {
    const state = authReducer(undefined, { type: '@@INIT' })
    // token and user come from localStorage via the initialState hydration;
    // in tests localStorage is empty so both should be null
    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
  })

  it('setCredentials stores token and user', () => {
    const state = authReducer(undefined, setCredentials({ token: mockToken, user: mockUser }))
    expect(state.token).toBe(mockToken)
    expect(state.user).toEqual(mockUser)
  })

  it('logout clears token and user', () => {
    // Start from an authenticated state
    const authenticatedState = { token: mockToken, user: mockUser }
    const state = authReducer(authenticatedState, logout())
    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
  })
})

describe('authSlice selectors', () => {
  it('selectIsAuthenticated returns true when token is present', () => {
    const rootState = { auth: { token: mockToken, user: mockUser } }
    expect(selectIsAuthenticated(rootState)).toBe(true)
  })

  it('selectIsAuthenticated returns false when token is null', () => {
    const rootState = { auth: { token: null, user: null } }
    expect(selectIsAuthenticated(rootState)).toBe(false)
  })

  it('selectCurrentUser returns the user object', () => {
    const rootState = { auth: { token: mockToken, user: mockUser } }
    expect(selectCurrentUser(rootState)).toEqual(mockUser)
  })

  it('selectCurrentUser returns null when not authenticated', () => {
    const rootState = { auth: { token: null, user: null } }
    expect(selectCurrentUser(rootState)).toBeNull()
  })
})
