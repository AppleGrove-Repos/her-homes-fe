import axios from 'axios'

// Create axios instance with base URL and credentials
export const http = axios.create({
  baseURL: 'https://her-homes-dev.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
 
  withCredentials: true,
})

// Add response interceptor for global error handling
http.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle session expiration or unauthorized access
    if (error.response && error.response.status === 401) {
      // Only redirect for authenticated endpoints
      if (error.config.url?.startsWith('/user/')) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)
