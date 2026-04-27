import { createSlice } from '@reduxjs/toolkit'

// Redux owns only CLIENT state: the auth token and the logged-in user object.
// API responses (product lists, orders, etc.) live in React Query, not here.
//
// localStorage sync happens OUTSIDE this reducer (in useLogin / AuthContext)
// so that the reducer stays a pure function with no side effects.

const initialState = {
  // Hydrate from localStorage so a page refresh keeps the user logged in
  token: localStorage.getItem('token') ?? null,
  user: JSON.parse(localStorage.getItem('user') ?? 'null'),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Called after a successful login — receives { token, user }
    setCredentials(state, action) {
      state.token = action.payload.token
      state.user = action.payload.user
    },

    // Called on logout or 401 auto-logout from the Axios interceptor
    logout(state) {
      state.token = null
      state.user = null
    },
  },
})

export const { setCredentials, logout } = authSlice.actions

// Selectors
export const selectCurrentToken = (state) => state.auth.token
export const selectCurrentUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => !!state.auth.token

export default authSlice.reducer
