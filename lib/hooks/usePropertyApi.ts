import { https, http } from '@/lib/config/axios.config'
import { errorHandler } from '@/lib/utils/error'
import toast from 'react-hot-toast'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

// Property interface
export interface Property {
  _id: string
  id: string
  title: string
  name?: string // Keep for backward compatibility
  propertyType: string
  propertyAddress: string
  location?: string // Keep for backward compatibility
  price: number
  minDownPaymentPercent: number
  minMonthlyPayment: number
  rating?: number
  images: string[]
  propertyDescription?: string
  description?: string // Keep for backward compatibility
  neighborhoodDescription?: string
  nearbyLandmark?: string
  specifications?: Record<string, string | number>
  bedrooms?: number // Keep for backward compatibility
  videos: string[]
  developer?: any
  status?: string
  createdAt?: string
  updatedAt?: string
  __v?: number
  tags?: string[]
  features?: Record<string, boolean>
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
          `/listing/${propertyId}/user`
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
export const useGetProperties = (propertyId: string) => {
  return useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      try {
        // Direct API call without authentication check
        const response = await http.get<ApiResponse<Property>>(
          `/properties/${propertyId}`
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
          `/properties${queryString ? `?${queryString}` : ''}`
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
          `/properties/developer${queryString ? `?${queryString}` : ''}`
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
        const response = await https.get<ApiResponse<any>>('/properties/filters')
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
        const response = await https.post<ApiResponse<any>>(
          `/properties/${propertyId}/toggle-favorite`
        )
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
          `/properties/${propertyId}/toggle-favorite`
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
        `${API_URL}/properties/user?${queryParams.toString()}`,
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
export function useGetSimilarProperties(property: any) {
  // Fetch all properties
  const { data: allPropertiesResponse, isLoading } = useGetPropertyListings()
  const allProperties = allPropertiesResponse?.data || []

  // Helper functions
  const normalize = (str: string) =>
    str
      ?.toLowerCase()
      .replace(/[^a-z0-9\s]/gi, '')
      .trim() || ''

  const getLocationParts = (location: string | undefined) => {
    if (!location) return []
    return location
      .split(',')
      .map((p) =>
        p
          .toLowerCase()
          .replace(/[^a-z0-9\s]/gi, '')
          .trim()
      )
      .filter(Boolean)
  }

  const locationsOverlap = (
    locA: string | undefined,
    locB: string | undefined
  ) => {
    const partsA = getLocationParts(locA)
    const partsB = getLocationParts(locB)
    return partsA.some((part) => partsB.includes(part))
  }

  // Compute similar properties
  const similarProperties = property
    ? allProperties
        .filter((p) => {
          if (p.id === property.id) return false

          let matchCount = 0

          if (locationsOverlap(p.location, property.location)) matchCount++
          if (
            p.developer?._id &&
            property.developer?._id &&
            p.developer._id === property.developer._id
          )
            matchCount++
          if (
            typeof p.bedrooms === 'number' &&
            typeof property.bedrooms === 'number' &&
            Math.abs(p.bedrooms - property.bedrooms) <= 1
          )
            matchCount++
          if (
            p.propertyType &&
            property.propertyType &&
            p.propertyType.toLowerCase() === property.propertyType.toLowerCase()
          )
            matchCount++

          return matchCount >= 2
        })
        .slice(0, 4)
    : []

  return { similarProperties, isLoading }
}

// Get properties with the same property type
export const useGetPropertiesByType = (propertyType: string, excludePropertyId?: string) => {
  return useQuery({
    queryKey: ['propertiesByType', propertyType, excludePropertyId],
    queryFn: async () => {
      try {
        // Use the existing property listings API with property type filter
        const queryParams = new URLSearchParams()
        queryParams.append('propertyType', propertyType)
        queryParams.append('limit', '10') // Get more to account for filtering out current property

        const response = await http.get<ApiResponse<Property[]>>(
          `/properties?${queryParams.toString()}`
        )
        
        // Filter out the current property if excludePropertyId is provided
        let properties = response.data.data || []
        if (excludePropertyId) {
          properties = properties.filter(p => p._id !== excludePropertyId)
        }
        
        return {
          ...response.data,
          data: properties.slice(0, 3) // Return max 3 similar properties
        }
      } catch (error) {
        errorHandler(error)
        throw error
      }
    },
    enabled: !!propertyType,
    retry: 1,
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
        `${API_URL}/properties/${propertyId}/favorite`,
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
