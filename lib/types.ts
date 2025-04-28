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