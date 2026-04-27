import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'

// Redux manages CLIENT state only.
// Server state (product lists, orders) lives in component hooks using useState.

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
})
