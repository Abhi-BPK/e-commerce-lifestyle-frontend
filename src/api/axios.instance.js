import axios from 'axios'

// Single Axios instance used by all service files.
// Interceptors are attached separately in interceptors.js so they can
// reference the Redux store without creating a circular import.

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

export default api
