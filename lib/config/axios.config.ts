import axios from 'axios'
import { API_URL } from '../constants/env'

// Create axios instance with base URL and credentials
export const https = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
})

// Add response interceptor for global error handling
https.interceptors.response.use(
  (response) => response,
  (error) => {
    // Allow the component to handle errors
    const status = error.response?.status
    const url = error.config?.url

    if ((status === 401 || status === 403) && url?.startsWith('/user/')) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }

    // Pass detailed error to component
    return Promise.reject(error)
  }
)

https.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token') // or from cookie
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

