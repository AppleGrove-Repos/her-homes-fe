'use client'

export const dynamic = 'force-dynamic'
import { Suspense, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Search,
  Loader2,
  X,
  Filter,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/store/auth.store'
import PropertyCard from '@/components/applicants/PropertyCard'
import LoadingSpinner from '@/components/loading-spinner'
import { motion, AnimatePresence } from 'framer-motion'
import { useGetUserListings, Property } from '@/lib/hooks/usePropertyApi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Footer from '@/components/landing/footer'

// Create a client
const queryClient = new QueryClient()

// Wrapper component with QueryClientProvider
export default function ApplicantDashboardPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingSpinner />}>
        <ApplicantDashboard />
      </Suspense>
    </QueryClientProvider>
  )
}

// Price filter options
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

function ApplicantDashboard() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [notifications, setNotifications] = useState(3) // Example notification count
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [totalResults, setTotalResults] = useState(0)

  console.log('User object:', user) 
  // Local state for filter UI values
  const [filters, setFilters] = useState({
    propertyType: '',
    priceRange: '',
    bedrooms: '',
    location: '',
    moreFilters: '',
  })

  // Fetch user listings
  const { data: userListingsResponse, isLoading: listingsLoading } =
    useGetUserListings({
      page: currentPage,
      limit: itemsPerPage,
      search: searchQuery,
      propertyType: filters.propertyType,
      priceRange: filters.priceRange,
      bedrooms: filters.bedrooms,
      location: filters.location,
      moreFilters: filters.moreFilters,
    })

  const properties = userListingsResponse?.data || []

  // Update total results when data changes
  useEffect(() => {
    if (userListingsResponse) {
      setTotalResults(userListingsResponse.total || properties.length || 0)
    }
  }, [userListingsResponse, properties.length])

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / itemsPerPage)

  // Handle pagination
  const handlePageChange = (newPage: number): void => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  // Handle property click
  const handlePropertyClick = (propertyId: string): void => {
    router.push(`/listing/${propertyId}`)
  }

  // Handle logout
  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  // Apply filters
  const applyFilters = () => {
    // The filters are already applied via the useGetUserListings hook
    setShowMobileFilters(false)
  }

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      propertyType: '',
      priceRange: '',
      bedrooms: '',
      location: '',
      moreFilters: '',
    })
    setSearchQuery('')
  }

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== ''
  ).length

  // Background images for the hero section
  const heroImages = [
    '/assets/images/listingBG-1.png',
    '/assets/images/listingBG-2.png',
    '/assets/images/listingBG-3.png',
    '/assets/images/listingBG-4.png',
  ]
  const [heroImageIndex, setHeroImageIndex] = useState(0)

  // Rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  return (
    <div className="flex min-h-screen flex-col bg-[#F1F1F1] overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/assets/images/header-logo.png"
              alt="Her Homes"
              width={40}
              height={40}
              className="mr-20 md:ml-20"
            />
            <nav className="hidden md:flex space-x-6">
              <a
                href="/listings"
                className="text-gray-700 hover:text-[#7C0A02]"
              >
                Browse Listings
              </a>
              <a
                href="/financing"
                className="text-gray-700 hover:text-[#7C0A02]"
              >
                Apply for Financing
              </a>
              <a href="/contact" className="text-gray-700 hover:text-[#7C0A02]">
                Contact Us
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-auto">
                  <div className="p-3 hover:bg-gray-50 cursor-pointer">
                    <p className="font-medium text-sm">Application Update</p>
                    <p className="text-xs text-gray-500">
                      Your application for 3-Bedroom Terrace Duplex has been
                      reviewed.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                  <div className="p-3 hover:bg-gray-50 cursor-pointer">
                    <p className="font-medium text-sm">New Property Match</p>
                    <p className="text-xs text-gray-500">
                      A new property matching your preferences is now available.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                  </div>
                  <div className="p-3 hover:bg-gray-50 cursor-pointer">
                    <p className="font-medium text-sm">Mortgage Pre-Approval</p>
                    <p className="text-xs text-gray-500">
                      Your mortgage pre-approval has been processed.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#7C0A02] text-xs"
                  >
                    View all notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile */}
            <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                    {user?.profilePicture ? (
                      <Image
                        src={user.profilePicture || '/placeholder.svg'}
                        alt={user?.name || 'User'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500" />
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">Applicant</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push('/applicant/profile')}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/applicant/settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[400px] bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <AnimatePresence initial={false}>
            <motion.div
              key={heroImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute w-full h-full"
            >
              <Image
                src={heroImages[heroImageIndex] || '/placeholder.svg'}
                alt="House"
                fill
                className="object-cover opacity-40"
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-white font-bold z-10 px-4 text-center">
          House for sale in Nigeria
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
                onClick={() => setSearchQuery('')}
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
              value={filters.propertyType}
              onChange={(e) => {
                setFilters((prev) => ({
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
              value={filters.priceRange}
              onChange={(e) => {
                setFilters((prev) => ({
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
              value={filters.bedrooms}
              onChange={(e) => {
                setFilters((prev) => ({
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
              value={filters.location}
              onChange={(e) => {
                setFilters((prev) => ({
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
              value={filters.moreFilters}
              onChange={(e) => {
                setFilters((prev) => ({
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
                value={filters.propertyType}
                onChange={(e) => {
                  setFilters((prev) => ({
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
                value={filters.priceRange}
                onChange={(e) => {
                  setFilters((prev) => ({
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
                value={filters.bedrooms}
                onChange={(e) => {
                  setFilters((prev) => ({
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
                value={filters.location}
                onChange={(e) => {
                  setFilters((prev) => ({
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
                value={filters.moreFilters}
                onChange={(e) => {
                  setFilters((prev) => ({
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
        {listingsLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#546B2F]" />
            <span className="ml-2">Loading properties...</span>
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
              {properties.map((property: Property) => (
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
                  onClick={() =>
                    handlePropertyClick(property.id || property._id)
                  }
                  isSaved={true}
                />
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? 'bg-[#7C0A02]' : ''}
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

    
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
