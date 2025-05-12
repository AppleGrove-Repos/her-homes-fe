import axios from 'axios'
import toast from 'react-hot-toast'
import { API_URL } from '@/lib/constants/env'
import { useMutation } from '@tanstack/react-query'
import { http, https } from '../config/axios.config'
import { errorHandler } from '../config/axios-error'
import { toastSuccess } from '../utils/toast'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/lib/store/auth.store'

export interface LoginType {
  email: string
  password: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'developer' | 'applicant' | string
  profilePicture?: string
}

interface LoginResponse {
  access_token: string
  user: User
}

export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    console.log('Fetching user data from:', `${API_URL}/user`)
    const response = await https.get('/user') // Axios instance with cookies enabled
    console.log('User data response:', response.data)

    return response.data.data
  } catch (error: any) {
    if (error.response) {
      console.error('Server error:', error.response.data)
    } else if (error.request) {
      console.error('No response received:', error.request)
    } else {
      console.error('Error setting up request:', error.message)
    }

    return null
  }
}



export const changePassword = async (data: {
  currentPassword: string
  newPassword: string
}) => {
  try {
    const token = localStorage.getItem('token')

    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await axios.put(`${API_URL}/user/change-password`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data.data
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to change password'
    toast.error(errorMessage)
    throw new Error(errorMessage)
  }
}

export const updateProfilePicture = async (formData: FormData) => {
  try {
    const token = localStorage.getItem('token')

    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await axios.put(
      `${API_URL}/user/profile-picture`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return response.data.data
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to update profile picture'
    toast.error(errorMessage)
    throw new Error(errorMessage)
  }
}
export const verifyEmail = async (email: string, token: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-email`, {
      email,
      token,
    })

    if (response.data && response.data.success) {
      toast.success('Email verified successfully')
      return response.data
    }

    throw new Error('Invalid response from server')
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      'Failed to verify email. Please try again.'
    toast.error(errorMessage)
    throw new Error(errorMessage)
  }
}
export const useLogin = () => {
  const payload = useMutation({
    mutationKey: ['useLogin'],
    mutationFn: async (data: LoginType) => {
      const response = await http.post('/auth/signin', {
        email: data.email,
        password: data.password,
      })
      const userData = response.data.user
      useAuth.getState().setUser(userData)
      return response?.data
    },
    onError(error) {
      return errorHandler(error)
    },
    onSuccess(data) {
      toastSuccess(data.message)
      if (data?.data?.user?.role === 'applicant') {
        window.location.href = '/applicant'
      } else {
        window.location.href = '/developers'
      }
    },
  })

  return payload
}

export const fetchUser = async (): Promise<User> => {
  try {
    console.log('Fetching user data from:', `${API_URL}/user`)

    const response = await axios.get(`${API_URL}/user`)

    console.log('User data response received:', response.status)

    const { data } = response.data
    if (!data) {
      console.error('No user data in response:', response.data)
      throw new Error('No user data received')
    }

    if (!data.role) {
      console.warn('User data missing role information:', data)
      throw new Error('User role is missing in the response')
    }

    return data
  } catch (error: any) {
    console.error('User fetch error details:', error.response || error)
    const errorMessage =
      error.response?.data?.message ||
      (error.message === 'Network Error'
        ? 'Network error. Please check your connection.'
        : 'Failed to fetch user info. Please try again.')

    toast.error(errorMessage)
    throw new Error(errorMessage)
  }
}

export const getRoleBasedRedirectPath = (role: string): string => {
  console.log('Getting redirect path for role:', role)

  switch (role) {
    case 'developer':
      return '/developers'
    case 'applicant':
      return '/applicant'
    case 'admin':
      return '/admin'
    default:
      console.warn('Unknown role:', role)
      return '/' // Default redirect if role is unknown
  }
}
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    console.log(
      'Making forgot password request to:',
      `${API_URL}/auth/forgot-password`
    )

    if (!API_URL) {
      throw new Error(
        'API URL is not defined. Check your environment variables.'
      )
    }

    if (!email) {
      throw new Error('Email is required')
    }

    const response = await axios.post(`${API_URL}/auth/forgot-password`, {
      email,
    })
    console.log('Forgot password response received:', response.status)

    // Check if the response indicates success
    if (response.status !== 200) {
      throw new Error('Failed to send password reset email')
    }

    return
  } catch (error: any) {
    console.error('Forgot password error details:', error.response || error)
    const errorMessage =
      error.response?.data?.message ||
      (error.message === 'Network Error'
        ? 'Network error. Please check your connection.'
        : 'Failed to send password reset email. Please try again.')

    throw new Error(errorMessage)
  }
}

export const verifyResetToken = async (
  email: string,
  token: string
): Promise<void> => {
  try {
    console.log('Verifying reset token for:', email)

    if (!API_URL) {
      throw new Error(
        'API URL is not defined. Check your environment variables.'
      )
    }

    if (!email || !token) {
      throw new Error('Email and token are required')
    }

    // This endpoint might be different in your API
    // You might need to adjust it based on your backend implementation
    const response = await axios.post(`${API_URL}/auth/verify-reset-token`, {
      email,
      token,
    })
    console.log('Token verification response received:', response.status)

    // Check if the response indicates success
    if (response.status !== 200) {
      throw new Error('Invalid or expired reset token')
    }

    return
  } catch (error: any) {
    console.error('Token verification error details:', error.response || error)
    const errorMessage =
      error.response?.data?.message ||
      (error.message === 'Network Error'
        ? 'Network error. Please check your connection.'
        : 'Invalid or expired reset token. Please request a new one.')

    throw new Error(errorMessage)
  }
}

export interface ResetPasswordParams {
  email: string
  token: string
  password: string
}

export const resetPassword = async (
  params: ResetPasswordParams
): Promise<void> => {
  try {
    console.log(
      'Making reset password request to:',
      `${API_URL}/auth/reset-password`
    )

    if (!API_URL) {
      throw new Error(
        'API URL is not defined. Check your environment variables.'
      )
    }

    if (!params.email || !params.token || !params.password) {
      throw new Error('Email, token, and password are required')
    }

    const response = await axios.post(`${API_URL}/auth/reset-password`, params)
    console.log('Reset password response received:', response.status)

    // Check if the response indicates success
    if (response.status !== 200) {
      throw new Error('Failed to reset password')
    }

    return
  } catch (error: any) {
    console.error('Reset password error details:', error.response || error)
    const errorMessage =
      error.response?.data?.message ||
      (error.message === 'Network Error'
        ? 'Network error. Please check your connection.'
        : 'Failed to reset password. Please try again.')

    throw new Error(errorMessage)
  }
}
