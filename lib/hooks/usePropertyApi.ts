import { https, http } from '@/lib/config/axios.config'
import { errorHandler } from '@/lib/utils/error'
import toast from 'react-hot-toast'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

// Property interface
export interface Property {
  _id: string
  id: string
  name: string
  propertyType: string
  location: string
  price: number
  minDownPaymentPercent: number
  minMonthlyPayment: number
  rating: number
  images: string[]
  description: string
  bedrooms: number
  videos: string[]
  developer: any
  status: string
  createdAt: string
  updatedAt: string
  __v: number
  tags?: string[]
}

// Response interface
interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  total?: number
  page?: number
  limit?: number
}

export interface PropertyFilterParams {
  page?: number
  limit?: number
  search?: string
  propertyType?: string
  priceRange?: string
  bedrooms?: string
  location?: string
  moreFilters?: string
  status?: string
  minPrice?: number
  maxPrice?: number
  minBedrooms?: number
  maxBedrooms?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}


// Get property by ID - no auth required
export const useGetProperty = (propertyId: string) => {
  return useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      try {
        // Direct API call without authentication check
        const response = await https.get<ApiResponse<Property>>(
          `/listing/${propertyId}`
        )
        return response.data
      } catch (error) {
        errorHandler(error)
        throw error
      }
    },
    enabled: !!propertyId,
    retry: 1,
  })
}

// Get property listings with filters - no auth required
export const useGetPropertyListings = (filters?: PropertyFilterParams) => {
  return useQuery({
    queryKey: ['propertyListings', filters],
    queryFn: async () => {
      try {
        // Build query string from filters
        const queryParams = new URLSearchParams()

        if (filters) {
          // Handle each filter parameter according to the API requirements
          if (filters.page) queryParams.append('page', filters.page.toString())
          if (filters.limit)
            queryParams.append('limit', filters.limit.toString())
          if (filters.search) queryParams.append('search', filters.search)
          if (filters.propertyType)
            queryParams.append('propertyType', filters.propertyType)
          if (filters.priceRange)
            queryParams.append('priceRange', filters.priceRange)
          if (filters.bedrooms) queryParams.append('bedrooms', filters.bedrooms)
          if (filters.location) queryParams.append('location', filters.location)
          if (filters.moreFilters)
            queryParams.append('moreFilters', filters.moreFilters)
        }

        const queryString = queryParams.toString()
        const response = await http.get<ApiResponse<Property[]>>(
          `/listing/${queryString ? `?${queryString}` : ''}`
        )
        return response.data
      } catch (error) {
        errorHandler(error)
        throw error
      }
    },
    retry: 1,
  })
}

export const useGetDeveloperPropertyListings = (
  filters?: PropertyFilterParams
) => {
  return useQuery({
    queryKey: ['propertyListings', filters],
    queryFn: async () => {
      try {
        
        const queryParams = new URLSearchParams()

        if (filters) {
          
          if (filters.page) queryParams.append('page', filters.page.toString())
          if (filters.limit)
            queryParams.append('limit', filters.limit.toString())
          if (filters.search) queryParams.append('search', filters.search)
          if (filters.propertyType)
            queryParams.append('propertyType', filters.propertyType)
          if (filters.priceRange)
            queryParams.append('priceRange', filters.priceRange)
          if (filters.bedrooms) queryParams.append('bedrooms', filters.bedrooms)
          if (filters.location) queryParams.append('location', filters.location)
          if (filters.moreFilters)
            queryParams.append('moreFilters', filters.moreFilters)
          if (filters.status) queryParams.append('status', filters.status)
        }

        const queryString = queryParams.toString()
        const response = await https.get<ApiResponse<Property[]>>(
          `/listing/developer${queryString ? `?${queryString}` : ''}`
        )
        return response.data
      } catch (error) {
        errorHandler(error)
        throw error
      }
    },
    retry: 1,
  })
}

// Get property filters - no auth required
export const useGetPropertyFilters = () => {
  return useQuery({
    queryKey: ['propertyFilters'],
    queryFn: async () => {
      try {
        const response = await https.get<ApiResponse<any>>('/listing/filters')
        return response.data
      } catch (error) {
        errorHandler(error)
        throw error
      }
    },
    retry: 1,
  })
}

// Save property to favorites - auth required
export const useSaveProperty = () => {
  return useMutation({
    mutationFn: async ({ propertyId }: { propertyId: string }) => {
      try {
        const response = await https.post<ApiResponse<any>>('/user/favorites', {
          propertyId,
        })
        toast.success('Property saved to favorites')
        return response.data
      } catch (error) {
        errorHandler(error)
        throw error
      }
    },
  })
}

// Remove property from favorites - auth required
export const useRemoveFromFavorites = () => {
  return useMutation({
    mutationFn: async ({ propertyId }: { propertyId: string }) => {
      try {
        const response = await https.delete<ApiResponse<any>>(
          `/user/favorites/${propertyId}`
        )
        toast.success('Property removed from favorites')
        return response.data
      } catch (error) {
        errorHandler(error)
        throw error
      }
    },
  })
}

// Contact agent about property - auth required
export const useContactAgent = () => {
  return useMutation({
    mutationFn: async ({
      propertyId,
      message,
    }: {
      propertyId: string
      message: string
    }) => {
      try {
        const response = await https.post<ApiResponse<any>>('/user/contact', {
          propertyId,
          message,
        })
        toast.success('Message sent to agent')
        return response.data
      } catch (error) {
        errorHandler(error)
        throw error
      }
    },
  })
}

// Apply for mortgage - auth required
export const useApplyForMortgage = () => {
  return useMutation({
    mutationFn: async ({
      propertyId,
      formData,
    }: {
      propertyId: string
      formData: any
    }) => {
      try {
        const response = await https.post<ApiResponse<any>>(
          `/user/mortgage/${propertyId}`,
          formData
        )
        toast.success('Mortgage application submitted')
        return response.data
      } catch (error) {
        errorHandler(error)
        throw error
      }
    },
  })
}
const API_URL = process.env.NEXT_PUBLIC_API_URL || ''
export const useGetUserListings = (params: PropertyFilterParams = {}) => {
  return useQuery({
    queryKey: ['userListings', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams()

      if (params.page) queryParams.set('page', params.page.toString())
      if (params.limit) queryParams.set('limit', params.limit.toString())
      if (params.search) queryParams.set('search', params.search)
      if (params.propertyType)
        queryParams.set('propertyType', params.propertyType)
      if (params.priceRange) queryParams.set('priceRange', params.priceRange)
      if (params.bedrooms) queryParams.set('bedrooms', params.bedrooms)
      if (params.location) queryParams.set('location', params.location)
      if (params.moreFilters) queryParams.set('moreFilters', params.moreFilters)

      // Use the correct endpoint for user listings
      const response = await axios.get(
        `${API_URL}/listing/user?${queryParams.toString()}`,
        {
          withCredentials: true,
        }
      )

      return response.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Get single property
export const useGetAUTHProperty = (propertyId: string) => {
  return useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      // Use the correct endpoint for a specific listing
      const response = await axios.get(`${API_URL}/listing/${propertyId}`)
      return response.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!propertyId,
  })
}

// Toggle property favorite status
export const useToggleFavorite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      propertyId,
      isFavorite,
    }: {
      propertyId: string
      isFavorite: boolean
    }) => {
      // This is a placeholder - you would need to implement the actual endpoint
      // based on your API structure
      const response = await axios.post(
        `${API_URL}/listing/${propertyId}/favorite`,
        { isFavorite },
        {
          withCredentials: true,
        }
      )
      return response.data
    },
    onSuccess: () => {
      // Invalidate user listings query to refetch
      queryClient.invalidateQueries({ queryKey: ['userListings'] })
    },
  })
}
