import axios, { AxiosInstance } from 'axios'
import { API_URL } from '../constants/env'

export const publicApi: AxiosInstance = axios.create({
  baseURL: API_URL,
})

export const authApi: AxiosInstance = axios.create({
  baseURL: API_URL,
})

authApi.interceptors.request.use(
  (req) => {
    const accessToken = sessionStorage.getItem('user-store')
      ? JSON.parse(sessionStorage.getItem('user-store')!)?.state?.accessToken
      : undefined

    console.log(accessToken)
    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`
    }

    return req
  },
  (error) => Promise.reject(error)
)

authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/admin/login'
    }

    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'An error occurred'
      return Promise.reject(new Error(message))
    }

    return Promise.reject(error)
  }
)
