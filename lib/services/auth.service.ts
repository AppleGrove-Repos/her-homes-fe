import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL

interface LoginType {
  email: string
  phoneNumber?: string
  password: string
}

interface User {
  id: string
  name: string
  email: string
  role: 'developer' | 'applicant'
  profilePicture?: string
}

interface LoginResponse {
  access_token: string
  user: User
}

export const loginUser = async (data: LoginType): Promise<LoginResponse> => {
  try {
    console.log('Login payload:', data) // Debugging
    const response = await axios.post(`${API_URL}/auth/signin`, data)
    console.log('Login response:', response.data) // Debugging

    if (response.data && response.data.data) {
      return response.data.data
    }

    throw new Error('Invalid response from server')
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message) // Debugging
    const errorMessage =
      error.response?.data?.message || 'Failed to login. Please try again.'
    toast.error(errorMessage)
    throw new Error(errorMessage)
  }
}

export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
}

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token')

    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data.data
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to fetch user data'
    console.error(errorMessage)
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