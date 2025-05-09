import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.herhomees.com/api'

// Property interfaces
export interface Property {
  _id: string
  name: string
  description: string
  bedrooms: number
  location: string
  price: number
  propertyType: string
  minDownPaymentPercent: number
  minMonthlyPayment: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface CreatePropertyDto {
  name: string
  description: string
  bedrooms: number
  location: string
  price: number
  propertyType: string
  minDownPaymentPercent: number
  minMonthlyPayment: number
  status?: 'pending' | 'approved' | 'rejected'
}

export interface SearchProperties {
  page?: number
  limit?: number
  search?: string
  propertyType?: string
  status?: string
}

// Get developer's properties
export const getProperties = async (query?: SearchProperties) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Authentication required')

    const queryString = query
      ? Object.entries(query)
          .filter(([_, value]) => value !== undefined && value !== '')
          .map(([key, value]) => `${key}=${value}`)
          .join('&')
      : ''

    const endpoint = `/listing/developer${queryString ? `?${queryString}` : ''}`
    const response = await axios.get(`${API_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data.data
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to fetch properties'
    console.error(errorMessage)
    return []
  }
}

// Get property by ID
export const getPropertyById = async (propertyId: string) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Authentication required')

    const response = await axios.get(`${API_URL}/listing/${propertyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data.data
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to fetch property details'
    toast.error(errorMessage)
    return null
  }
}

// Create a new property
export const createProperty = async (data: CreatePropertyDto) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Authentication required')

    const response = await axios.post(`${API_URL}/listing`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    toast.success('Property created successfully')
    return response.data.data
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to create property'
    toast.error(errorMessage)
    throw new Error(errorMessage)
  }
}

// Update a property
export const updateProperty = async (
  propertyId: string,
  data: Partial<CreatePropertyDto>
) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Authentication required')

    const response = await axios.patch(
      `${API_URL}/listing/${propertyId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    toast.success('Property updated successfully')
    return response.data.data
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to update property'
    toast.error(errorMessage)
    throw new Error(errorMessage)
  }
}

// Delete a property
export const deleteProperty = async (propertyId: string) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Authentication required')

    await axios.delete(`${API_URL}/listing/${propertyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    toast.success('Property deleted successfully')
    return true
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to delete property'
    toast.error(errorMessage)
    return false
  }
}
