import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL

  export interface LoginType {
    email: string
    password: string
  }

  export interface User {
    id: string
    name: string
    email: string
    role: 'developer' | 'applicant' | string
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
export const loginUser = async (formData: LoginType): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/auth/signin`, formData)
    const { data } = response.data

    if (!data?.access_token) {
      throw new Error('No access token received')
    }

    return data.access_token
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      'Authentication failed. Please try again.'
    toast.error(errorMessage)
    throw new Error(errorMessage)
  }
}
export const fetchUser = async (accessToken: string): Promise<User> => {
  try {
    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const { data } = response.data
    if (!data || !data.role) {
      throw new Error('Invalid user data')
    }

    return data
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      'Failed to fetch user info. Please try again.'
    toast.error(errorMessage)
    throw new Error(errorMessage)
  }
}