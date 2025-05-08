import { type AxiosErrorShape, errorHandler } from '@/lib/config/axios-error'
import { authApi } from '@/lib/config/axios.instance'
import type {
  ApiResponse,
  Property,
  CreatePropertyDto,
  SearchProperties,
} from '@/lib/types/types'

export const getProperties = async (query?: SearchProperties) => {
  try {
    const queryString = query
      ? Object.entries(query)
          .filter(([_, value]) => value !== undefined && value !== '')
          .map(([key, value]) => `${key}=${value}`)
          .join('&')
      : ''

    const endpoint = `/listing/developer${queryString ? `?${queryString}` : ''}`
    const response = await authApi.get<ApiResponse<Property[]>>(endpoint)

    return response?.data?.data
  } catch (error) {
    errorHandler(error as AxiosErrorShape | string)
    return []
  }
}

export const getPropertyById = async (propertyId: string) => {
  try {
    const response = await authApi.get<ApiResponse<Property>>(
      `/listing/${propertyId}`
    )
    return response?.data?.data
  } catch (error) {
    errorHandler(error as AxiosErrorShape | string)
  }
}

export const createProperty = async (data: CreatePropertyDto) => {
  try {
    const response = await authApi.post<ApiResponse<Property>>(`/listing`, data)
    return response?.data?.data
  } catch (error) {
    errorHandler(error as AxiosErrorShape | string)
  }
}

export const updateProperty = async (
  propertyId: string,
  data: Partial<CreatePropertyDto>
) => {
  try {
    const response = await authApi.patch<ApiResponse<Property>>(
      `/listing/${propertyId}`,
      data
    )
    return response?.data?.data
  } catch (error) {
    errorHandler(error as AxiosErrorShape | string)
  }
}

export const deleteProperty = async (propertyId: string) => {
  try {
    await authApi.delete(`/listing/${propertyId}`)
    return true
  } catch (error) {
    errorHandler(error as AxiosErrorShape | string)
    return false
  }
}
