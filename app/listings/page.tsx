'use client'

export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useFilterState, FilterProvider } from '@/lib/hooks/use-filter-taste'
import PropertyCard from '@/components/applicants/PropertyCard'
import Header from '@/components/landing/header'
import Footer from '@/components/landing/footer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Loader2, X, Filter } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/hooks/use-auth'
import {
  useGetPropertyListings,
  type PropertyFilterParams,
} from '@/lib/hooks/api/usePropertyApi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LoadingSpinner from '@/components/loading-spinner'

// Create a client
const queryClient = new QueryClient()

// Wrapper component with QueryClientProvider
export default function ListingsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingSpinner />}>
        <FilterProvider>
          <ListingsContent />
        </FilterProvider>
      </Suspense>
    </QueryClientProvider>
  )
}

enum PriceFilter {
  UNDER_10M = '0m-10m',
  BETWEEN_10M_25M = '10m-25m',
  BETWEEN_25M_50M = '25m-50m',
  BETWEEN_50M_100M = '50m-100m',
  ABOVE_100M = '100m-999m',
}

const priceOptions = [
  { label: 'Under N10M', value: PriceFilter.UNDER_10M },
  { label: 'N10M - N25M', value: PriceFilter.BETWEEN_10M_25M },
  { label: 'N25M - N50M', value: PriceFilter.BETWEEN_25M_50M },
  { label: 'N50M - N100M', value: PriceFilter.BETWEEN_50M_100M },
  { label: 'Above N100M', value: PriceFilter.ABOVE_100M },
]

// Debounce function to limit API calls
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

function ListingsContent() {
  const { filters, setFilter, resetFilters } = useFilterState()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalResults, setTotalResults] = useState(0)
  const { isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500) // 500ms debounce
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Local state for filter UI values
  const [localFilters, setLocalFilters] = useState({
    propertyType: '',
    priceRange: '',
    bedrooms: '',
    location: '',
    moreFilters: '',
  })

  // Build filter params for API
  const [filterParams, setFilterParams] = useState<PropertyFilterParams>({})

  const houseImages = [
    '/assets/images/listingBG-1.png',
    '/assets/images/listingBG-2.png',
    '/assets/images/listingBG-3.png',
    '/assets/images/listingBG-4.png',
  ]
  const [[page, direction], setPage] = useState([0, 0])

  // Use React Query to fetch property listings
  const { data: propertyResponse, isLoading } =
    useGetPropertyListings(filterParams)
  const properties = propertyResponse?.data || []

  useEffect(() => {
    const interval = setInterval(() => {
      const newPage = (page + 1) % houseImages.length
      setPage([newPage, 1])
    }, 5000)

    return () => clearInterval(interval)
  }, [page, houseImages.length])

  // Initialize search query from URL params
  useEffect(() => {
    const urlSearchQuery = searchParams.get('searchQuery')
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery)
    }

    // Initialize local filters from URL params
    setLocalFilters({
      propertyType: searchParams.get('propertyType') || '',
      priceRange: searchParams.get('priceRange') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      location: searchParams.get('location') || '',
      moreFilters: searchParams.get('moreFilters') || '',
    })
  }, [searchParams])

  // Function to update URL query params when filters change
  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    // Use local filter values for the URL
    if (localFilters.propertyType)
      params.set('propertyType', localFilters.propertyType)
    else params.delete('propertyType')

    if (localFilters.priceRange)
      params.set('priceRange', localFilters.priceRange)
    else params.delete('priceRange')

    if (localFilters.bedrooms) params.set('bedrooms', localFilters.bedrooms)
    else params.delete('bedrooms')

    if (localFilters.location) params.set('location', localFilters.location)
    else params.delete('location')

    if (localFilters.moreFilters)
      params.set('moreFilters', localFilters.moreFilters)
    else params.delete('moreFilters')

    if (searchQuery) params.set('searchQuery', searchQuery)
    else params.delete('searchQuery')

    // Update the URL with filters
    router.push(`/listings?${params.toString()}`)

    // Update filter params for API
    const apiFilters: PropertyFilterParams = {}
    if (localFilters.propertyType)
      apiFilters.propertyType = localFilters.propertyType
    if (localFilters.priceRange) apiFilters.priceRange = localFilters.priceRange
    if (localFilters.bedrooms) apiFilters.bedrooms = localFilters.bedrooms
    if (localFilters.location) apiFilters.location = localFilters.location
    if (localFilters.moreFilters)
      apiFilters.moreFilters = localFilters.moreFilters
    if (searchQuery) apiFilters.search = searchQuery

    apiFilters.limit = 34
    setFilterParams(apiFilters)

    // Hide mobile filters after applying
    setShowMobileFilters(false)
  }, [localFilters, router, searchParams, searchQuery])

  // Apply live search when debounced search query changes
  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      const params = new URLSearchParams(searchParams.toString())

      if (debouncedSearchQuery) {
        params.set('searchQuery', debouncedSearchQuery)
      } else {
        params.delete('searchQuery')
      }

      router.push(`/listings?${params.toString()}`)

      // Update filter params for API
      setFilterParams((prev) => ({
        ...prev,
        search: debouncedSearchQuery || undefined,
      }))
    }
  }, [debouncedSearchQuery, router, searchParams])

  // Update total results when data changes
  useEffect(() => {
    if (propertyResponse) {
      setTotalResults(propertyResponse.total || properties.length || 0)
    }
  }, [propertyResponse, properties.length])

  // Initial load of filters from URL
  useEffect(() => {
    const apiFilters: PropertyFilterParams = {}
    if (searchParams.get('propertyType'))
      apiFilters.propertyType = searchParams.get('propertyType')!
    if (searchParams.get('priceRange'))
      apiFilters.priceRange = searchParams.get('priceRange')!
    if (searchParams.get('bedrooms'))
      apiFilters.bedrooms = searchParams.get('bedrooms')!
    if (searchParams.get('location'))
      apiFilters.location = searchParams.get('location')!
    if (searchParams.get('searchQuery'))
      apiFilters.search = searchParams.get('searchQuery')!
    if (searchParams.get('moreFilters'))
      apiFilters.moreFilters = searchParams.get('moreFilters')!

    apiFilters.limit = 34
    setFilterParams(apiFilters)
  }, [searchParams])

  const handleViewMore = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/user/listings`)
    } else {
      router.push('/user/listings')
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('searchQuery')
    router.push(`/listings?${params.toString()}`)

    // Update filter params for API
    setFilterParams((prev) => {
      const newFilters = { ...prev }
      delete newFilters.search
      return newFilters
    })
  }

  const clearAllFilters = () => {
    // Reset local filters
    setLocalFilters({
      propertyType: '',
      priceRange: '',
      bedrooms: '',
      location: '',
      moreFilters: '',
    })

    // Reset search query
    setSearchQuery('')

    // Reset URL
    router.push('/listings')

    // Reset filter params for API
    setFilterParams({ limit: 34 })

    // Hide mobile filters
    setShowMobileFilters(false)
  }

  // Count active filters
  const activeFilterCount = Object.values(localFilters).filter(
    (value) => value !== ''
  ).length

  return (
    <div className="flex min-h-screen flex-col bg-[#F1F1F1] overflow-hidden">
      <Header />

      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[400px] bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute w-full h-full"
            >
              <Image
                src={houseImages[page] || '/placeholder.svg'}
                alt="House"
                fill
                className="object-cover opacity-40"
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-white font-bold z-10 px-4 text-center">
          Homes for Sale in Nigeria
        </h1>
      </div>

      {/* Search + Filters - Now using relative positioning for better responsiveness */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 -mt-16 md:-mt-20 mb-24">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              applyFilters()
            }}
            className="flex w-full mb-4 relative"
          >
            <Input
              placeholder="Search homes by type, location..."
              className="pr-20 rounded-md h-[40px] md:h-[35px] bg-white flex-grow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-[110px] top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <Button
              type="submit"
              className="absolute right-1 top-1/2 h-[30px] w-[100px] -translate-y-1/2 bg-[#546B2F] hover:bg-green-800 text-white text-sm"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>

          {/* Mobile Filter Toggle */}
          <div className="flex items-center justify-between mb-3 md:hidden">
            <Button
              type="button"
              variant="outline"
              className="text-sm flex items-center gap-2"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-[#546B2F] rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {activeFilterCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                className="text-xs text-gray-500"
                onClick={clearAllFilters}
              >
                Clear all
              </Button>
            )}
          </div>

          {/* Desktop Filters - Always visible on md and up */}
          <div className="hidden md:flex md:flex-wrap md:gap-2">
            <select
              className="px-3 py-2 border rounded-md text-sm"
              value={localFilters.propertyType}
              onChange={(e) => {
                setLocalFilters((prev) => ({
                  ...prev,
                  propertyType: e.target.value,
                }))
              }}
            >
              <option value="">Property Type</option>
              <option value="Duplex">Duplex</option>
              <option value="Detached House">Detached House</option>
              <option value="Apartment">Apartment</option>
            </select>

            <select
              className="px-3 py-2 border rounded-md text-sm"
              value={localFilters.priceRange}
              onChange={(e) => {
                setLocalFilters((prev) => ({
                  ...prev,
                  priceRange: e.target.value,
                }))
              }}
            >
              <option value="">Price Range</option>
              {priceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 border rounded-md text-sm"
              value={localFilters.bedrooms}
              onChange={(e) => {
                setLocalFilters((prev) => ({
                  ...prev,
                  bedrooms: e.target.value,
                }))
              }}
            >
              <option value="">Bedrooms</option>
              <option value="1+">1+</option>
              <option value="2+">2+</option>
              <option value="3+">3+</option>
              <option value="4+">4+</option>
            </select>

            <select
              className="px-3 py-2 border rounded-md text-sm"
              value={localFilters.location}
              onChange={(e) => {
                setLocalFilters((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }}
            >
              <option value="">Location</option>
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja</option>
              <option value="Port Harcourt">Port Harcourt</option>
            </select>

            <select
              className="px-3 py-2 border rounded-md text-sm"
              value={localFilters.moreFilters}
              onChange={(e) => {
                setLocalFilters((prev) => ({
                  ...prev,
                  moreFilters: e.target.value,
                }))
              }}
            >
              <option value="">More Filters</option>
              <option value="pool">Swimming Pool</option>
              <option value="gym">Gym</option>
              <option value="security">24/7 Security</option>
            </select>
            <Button
              type="button"
              onClick={clearAllFilters}
              variant="outline"
              className="px-3 py-2 text-sm"
            >
              Clear All
            </Button>
          </div>

          {/* Mobile Filters - Only visible when toggled */}
          {showMobileFilters && (
            <div className="flex flex-col gap-3 mt-3 md:hidden">
              <select
                className="px-3 py-2 border rounded-md text-sm w-full"
                value={localFilters.propertyType}
                onChange={(e) => {
                  setLocalFilters((prev) => ({
                    ...prev,
                    propertyType: e.target.value,
                  }))
                }}
              >
                <option value="">Property Type</option>
                <option value="Duplex">Duplex</option>
                <option value="Detached House">Detached House</option>
                <option value="Apartment">Apartment</option>
              </select>

              <select
                className="px-3 py-2 border rounded-md text-sm w-full"
                value={localFilters.priceRange}
                onChange={(e) => {
                  setLocalFilters((prev) => ({
                    ...prev,
                    priceRange: e.target.value,
                  }))
                }}
              >
                <option value="">Price Range</option>
                {priceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                className="px-3 py-2 border rounded-md text-sm w-full"
                value={localFilters.bedrooms}
                onChange={(e) => {
                  setLocalFilters((prev) => ({
                    ...prev,
                    bedrooms: e.target.value,
                  }))
                }}
              >
                <option value="">Bedrooms</option>
                <option value="1+">1+</option>
                <option value="2+">2+</option>
                <option value="3+">3+</option>
                <option value="4+">4+</option>
              </select>

              <select
                className="px-3 py-2 border rounded-md text-sm w-full"
                value={localFilters.location}
                onChange={(e) => {
                  setLocalFilters((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }}
              >
                <option value="">Location</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Port Harcourt">Port Harcourt</option>
              </select>

              <select
                className="px-3 py-2 border rounded-md text-sm w-full"
                value={localFilters.moreFilters}
                onChange={(e) => {
                  setLocalFilters((prev) => ({
                    ...prev,
                    moreFilters: e.target.value,
                  }))
                }}
              >
                <option value="">More Filters</option>
                <option value="pool">Swimming Pool</option>
                <option value="gym">Gym</option>
                <option value="security">24/7 Security</option>
              </select>

              <div className="flex justify-between gap-2 mt-2">
                <Button
                  type="button"
                  onClick={clearAllFilters}
                  variant="outline"
                  className="text-sm flex-1"
                >
                  Clear All
                </Button>
                <Button
                  type="button"
                  onClick={applyFilters}
                  className="text-sm bg-[#546B2F] hover:bg-green-800 flex-1"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Property Listings */}
      <div className="flex-grow py-4 px-4 md:py-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#546B2F]" />
            <span className="ml-2">Loading properties...</span>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <Button onClick={clearAllFilters} className="mt-4 bg-[#5D0F1D]">
              Clear Filters
            </Button>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-10">
            <p>No properties found matching your criteria.</p>
            <Button onClick={clearAllFilters} className="mt-4 bg-[#5D0F1D]">
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="max-w-7xl mx-auto mb-4 md:mb-6 px-2 text-gray-700">
              <h2 className="text-base md:text-lg font-semibold">
                {properties.length > 0
                  ? `Showing ${properties.length} of ${totalResults} properties`
                  : 'No properties found'}
              </h2>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id || property._id}
                  id={property.id || property._id || ''}
                  name={property.name}
                  type={property.propertyType}
                  location={property.location}
                  price={`₦${property.price.toLocaleString()}`}
                  monthlyPayment={`₦${property.minMonthlyPayment.toLocaleString()}`}
                  rating={property.rating}
                  tags={property.tags || []}
                  imageUrl={
                    property.images && property.images.length > 0
                      ? property.images[0]
                      : '/placeholder.jpg'
                  }
                />
              ))}
            </div>
          </>
        )}

        {/* View More Button */}
        <div className="flex justify-center mt-6 md:mt-8">
          <Button className="bg-[#5D0F1D]" onClick={handleViewMore}>
            View More
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
