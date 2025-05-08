// Shared types for the application
export interface Property {
  id: string
  propertyType: string
  location: string
  price: number
  minMonthlyPayment: number
  rating: number
  images: string[]
  tags?: string[] // option
}
export interface ApiResponse<T, M = undefined> {
  success: boolean
  message: string
  data: T
  meta?: M
}

export interface PropertyListingResponse {
  data: Property[]
  total: number
  page: number
  limit: number
}

export enum PriceFilter {
  UNDER_10M = '0m-10m',
  BETWEEN_10M_25M = '10m-25m',
  BETWEEN_25M_50M = '25m-50m',
  BETWEEN_50M_100M = '50m-100m',
  ABOVE_100M = '100m-999m',
}

export interface FilterState {
  searchQuery: string
  propertyType: string
  priceRange: string
  bedrooms: string
  location: string
  moreFilters: string
}
export interface PropertyCardProps {
  id?: string
  name: string
  type: string
  location: string
  price: string
  monthlyPayment: string
  rating: number
  tags: string[]
  imageUrl: string
}
export interface AddProperty {
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
  images?: string[]
  video?: string
  amenities?: string[]
  listingType?: 'sale' | 'rent' | 'lease'
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
  // New fields
  images?: string[] | File[]
  video?: string | File
  amenities?: string[]
  listingType?: 'sale' | 'rent' | 'lease'
}

export interface SearchProperties {
  page?: number
  limit?: number
  search?: string
  propertyType?: string
  status?: string
  // New search parameters
  amenities?: string[]
  listingType?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
}
