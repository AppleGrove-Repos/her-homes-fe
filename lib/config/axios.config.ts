import axios from 'axios'
import { API_URL } from '../constants/env'
import { Cookie } from 'lucide-react'

// Create axios instance with base URL and credentials
export const https = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Enable cookies
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export const http = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
})

https.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token') // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}` // Attach token to Authorization header
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Refresh token logic
const refreshToken = async () => {
  try {
    const refresh_token = localStorage.getItem('refresh_token') // Retrieve refresh token
    if (!refresh_token) {
      throw new Error('No refresh token found')
    }

    const response = await axios.post(`${API_URL}/auth/session/refresh`, {
      refresh_token,
    })

    const { access_token, refresh_token: new_refresh_token } =
      response.data.data

    // Update tokens in localStorage
    localStorage.setItem('auth_token', access_token)
    localStorage.setItem('refresh_token', new_refresh_token)

    // Update Axios headers with the new token
    https.defaults.headers.Authorization = `Bearer ${access_token}`
    return access_token
  } catch (error: any) {
    console.error('Failed to refresh token:', error)
    throw error
  }
}

// Add response interceptor for global error handling
https.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    // If the token has expired, attempt to refresh it
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true // Prevent infinite retry loops

      try {
        const newToken = await refreshToken()

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return https(originalRequest)
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)

        // Log the user out if the refresh fails
        logoutUser()
        return Promise.reject(refreshError)
      }
    }

    // Pass other errors to the component
    return Promise.reject(error)
  }
)

// Logout function
function logoutUser() {
  // Clear tokens from localStorage
  localStorage.removeItem('auth_token')
  localStorage.removeItem('refresh_token')

  // Redirect the user to the login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}