'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useFilterState, FilterProvider } from '@/hooks/use-filter-taste'
import PropertyCard from '@/components/applicants/PropertyCard'
import Header from '@/components/landing/header'
import Footer from '@/components/landing/footer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'

interface Property {
  id: string
  name: string
  propertyType: string
  location: string
  price: number
  minMonthlyPayment: number
  rating: number
  images: string[]
  tags?: string[]
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

function ListingsContent() {
  const { filters, setFilter } = useFilterState()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalResults, setTotalResults] = useState(0)
  const { isAuthenticated } = useAuth()

  const houseImages = [
    '/assets/images/listingBG-1.png',
    '/assets/images/listingBG-2.png',
    '/assets/images/listingBG-3.png',
    '/assets/images/listingBG-4.png',
  ]
  const [[page, direction], setPage] = useState([0, 0])

  useEffect(() => {
    const interval = setInterval(() => {
      const newPage = (page + 1) % houseImages.length
      setPage([newPage, 1])
    }, 5000)

    return () => clearInterval(interval)
  }, [page, houseImages.length])

  // Function to update URL query params when filters change
  const applyFilters = () => {
    const params = new URLSearchParams()

    if (filters.propertyType) params.set('propertyType', filters.propertyType)
    if (filters.priceRange) params.set('priceRange', filters.priceRange)
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms)
    if (filters.location) params.set('location', filters.location)
    if (filters.moreFilters) params.set('moreFilters', filters.moreFilters)
    if (filters.searchQuery) params.set('searchQuery', filters.searchQuery)

    router.push(`/listings?${params.toString()}`)
  }

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      setError(null)
    
      try {
        const queryParams = new URLSearchParams()
    
        if (searchParams.get('propertyType'))
          queryParams.set('propertyType', searchParams.get('propertyType')!)
        if (searchParams.get('priceRange'))
          queryParams.set('priceRange', searchParams.get('priceRange')!)
        if (searchParams.get('bedrooms'))
          queryParams.set('bedrooms', searchParams.get('bedrooms')!)
        if (searchParams.get('location'))
          queryParams.set('location', searchParams.get('location')!)
        if (searchParams.get('searchQuery'))
          queryParams.set('search', searchParams.get('searchQuery')!)
    
        queryParams.set('limit', '34')
    
        const res = await fetch(`/api/listings?${queryParams.toString()}`)
    
        if (!res.ok) throw new Error('Failed to fetch properties.')
    
        const data = await res.json()
    
        setProperties(data.data || [])
        setTotalResults(data.total ?? data.data.length ?? 0)
      } catch (err) {
        console.error(err)
        setError('Failed to load properties.')
        setProperties([])   // <- Clear properties if error happens
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleViewMore = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/user/listings`)
    } else {
      router.push('/user/listings')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F1F1F1] overflow-hidden">
      <Header />

      {/* Hero Section */}
      <div className="relative w-full h-[400px] bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center mb-36">
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
        <h1 className="text-4xl md:text-5xl text-white font-bold z-10">
          Homes for Sale in Nigeria
        </h1>
      </div>

      {/* Search + Filters */}
      <div className="absolute top-[400px] left-1/2 transform -translate-x-1/2 w-full max-w-5xl px-2">
        <div className="bg-white rounded-xl shadow-lg p-6 md:h-[160px]">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              applyFilters()
            }}
            className="flex w-full mb-4 relative"
          >
            <Input
              placeholder="Search homes by type, location..."
              className="pr-20 rounded-md h-[35px] bg-white flex-grow"
              value={filters.searchQuery}
              onChange={(e) => setFilter('searchQuery', e.target.value)}
            />
            <Button
              type="submit"
              className="absolute right-1 top-1/2 h-[30px] w-[100px] -translate-y-1/2 bg-[#546B2F] hover:bg-green-800 text-white text-sm"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            <select
              className="px-3 py-2 border rounded-md text-sm"
              value={filters.propertyType}
              onChange={(e) => {
                setFilter('propertyType', e.target.value)
                applyFilters()
              }}
            >
              <option value="">Property Type</option>
              <option value="Duplex">Duplex</option>
              <option value="Detached House">Detached House</option>
              <option value="Apartment">Apartment</option>
            </select>

            <select
              className="px-3 py-2 border rounded-md text-sm"
              value={filters.priceRange}
              onChange={(e) => {
                setFilter('priceRange', e.target.value)
                applyFilters()
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
              value={filters.bedrooms}
              onChange={(e) => {
                setFilter('bedrooms', e.target.value)
                applyFilters()
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
              value={filters.location}
              onChange={(e) => {
                setFilter('location', e.target.value)
                applyFilters()
              }}
            >
              <option value="">Location</option>
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja</option>
              <option value="Port Harcourt">Port Harcourt</option>
            </select>

            <select
              className="px-3 py-2 border rounded-md text-sm"
              value={filters.moreFilters}
              onChange={(e) => {
                setFilter('moreFilters', e.target.value)
                applyFilters()
              }}
            >
              <option value="">More Filters</option>
              <option value="pool">Swimming Pool</option>
              <option value="gym">Gym</option>
              <option value="security">24/7 Security</option>
            </select>
          </div>
        </div>
      </div>

      {/* Property Listings */}
      <div className="flex-grow py-6 px-4">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#546B2F]" />
            <span className="ml-2">Loading properties...</span>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-10">
            <p>No properties found matching your criteria.</p>
            <Button
              onClick={() => router.push('/listings')}
              className="mt-4 bg-[#5D0F1D]"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
          <div className="max-w-7xl mx-auto mb-6 px-2 text-gray-700">
              <h2 className="text-lg font-semibold">
                {properties.length > 0
                  ? `Showing ${properties.length} of ${totalResults} properties`
                  : 'No properties found'}
              </h2>
            </div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                name={property.name}
                type={property.propertyType}
                location={property.location}
                price={`₦${property.price.toLocaleString()}`}
                monthlyPayment={`₦${property.minMonthlyPayment.toLocaleString()}`}
                rating={property.rating}
                tags={property.tags || []}
                imageUrl={
                  property.images.length > 0
                    ? property.images[0]
                    : '/placeholder.jpg'
                }
              />
            ))}
          </div>
          </>
        )}

        {/* View More Button */}
        <div className="flex justify-center mt-8">
          <Button className="bg-[#5D0F1D]" onClick={handleViewMore}>
            View More
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

import { Suspense } from 'react'

export default function ListingsPage() {
  return (
    <FilterProvider>
      <Suspense fallback={<div>Loading listings...</div>}>
        <ListingsContent />
      </Suspense>
    </FilterProvider>
  )
}

