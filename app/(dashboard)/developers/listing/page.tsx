'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import {
  PlusCircle,
  MapPin,
  Bed,
  Home,
  Edit,
  Trash2,
  X,
  SlidersHorizontal,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import {
  useGetDeveloperPropertyListings,
  type PropertyFilterParams,
} from '@/lib/hooks/usePropertyApi'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import TextField from '@/components/common/inputs/text-field'
import SelectField from '@/components/common/inputs/select-field'
import { deleteProperty } from '@/lib/services/developer/developer.services'
import Button from '@/components/common/button/index'
import Modal from '@/components/developer/modal'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const propertyTypes = [
  { label: 'All Types', value: '', id: 'all' },
  { label: 'Apartment', value: 'apartment', id: 'apartment' },
  { label: 'House', value: 'house', id: 'house' },
  { label: 'Condo', value: 'condo', id: 'condo' },
  { label: 'Townhouse', value: 'townhouse', id: 'townhouse' },
  { label: 'Land', value: 'land', id: 'land' },
  { label: 'Commercial', value: 'commercial', id: 'commercial' },
]

const statusOptions = [
  { label: 'All', value: '', id: 'all' },
  { label: 'Pending', value: 'pending', id: 'pending' },
  { label: 'Approved', value: 'approved', id: 'approved' },
  { label: 'Rejected', value: 'rejected', id: 'rejected' },
]

const bedroomOptions = [
  { label: 'Any', value: '', id: 'any' },
  { label: '1+', value: '1', id: '1plus' },
  { label: '2+', value: '2', id: '2plus' },
  { label: '3+', value: '3', id: '3plus' },
  { label: '4+', value: '4', id: '4plus' },
  { label: '5+', value: '5', id: '5plus' },
]

const sortOptions = [
  { label: 'Newest First', value: 'createdAt:desc', id: 'newest' },
  { label: 'Oldest First', value: 'createdAt:asc', id: 'oldest' },
  { label: 'Price: Low to High', value: 'price:asc', id: 'price_asc' },
  { label: 'Price: High to Low', value: 'price:desc', id: 'price_desc' },
]

export default function ListingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const [filterParams, setFilterParams] = useState<PropertyFilterParams>({})
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('')
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000])
  const [selectedSort, setSelectedSort] = useState('')

  const { data: propertyResponse, isLoading } =
    useGetDeveloperPropertyListings(filterParams)
  const properties = propertyResponse?.data || []

  // Delete property mutation
  const deletePropertyMutation = useMutation({
    mutationFn: (id: string) => deleteProperty(id),
    onSuccess: () => {
      toast.success('Property deleted successfully')
      setDeleteModalOpen(false)
      setPropertyToDelete(null)
      queryClient.invalidateQueries({ queryKey: ['propertyListings'] })
    },
    onError: (error) => {
      console.error('Error deleting property:', error)
      toast.error('Failed to delete property')
    },
  })

  // Initialize filters from URL params
  useEffect(() => {
    const apiFilters: PropertyFilterParams = {}

    if (searchParams.get('propertyType'))
      apiFilters.propertyType = searchParams.get('propertyType')!

    // Get status from URL and set activeTab
    const statusParam = searchParams.get('status')
    if (statusParam) {
      apiFilters.status = statusParam
      setActiveTab(statusParam)
    } else {
      setActiveTab('')
    }

    if (searchParams.get('search'))
      apiFilters.search = searchParams.get('search')!
    apiFilters.limit = 10

    setFilterParams(apiFilters)
  }, [searchParams])

  const openDeleteModal = (id: string) => {
    setPropertyToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleDeleteProperty = async () => {
    if (!propertyToDelete) return
    deletePropertyMutation.mutate(propertyToDelete)
  }

  // Update the changeQuery function to handle different types of values
  function changeQuery(key: string, value: string | number | undefined): void {
    const params = new URLSearchParams(searchParams.toString())

    if (value !== undefined && value !== '') {
      params.set(key, value.toString())
    } else {
      params.delete(key)
    }

    router.push(`/developers/listing?${params.toString()}`)

    setFilterParams((prev) => ({
      ...prev,
      [key]: value || undefined,
    }))

    if (key === 'status') {
      setActiveTab((value as string) || '')
    }
  }

  const handleSortChange = (sortValue: string) => {
    setSelectedSort(sortValue)
    const [sortBy, sortOrder] = sortValue.split(':')
    changeQuery('sortBy', sortBy)
    changeQuery('sortOrder', sortOrder)
  }

  // Fix the applyPriceRange function
  const applyPriceRange = () => {
    changeQuery('minPrice', priceRange[0])
    changeQuery('maxPrice', priceRange[1])
  }

  const clearAllFilters = () => {
    router.push('/developers/listing')
    setFilterParams({ limit: 10 })
    setActiveTab('')
    setPriceRange([0, 10000000])
    setSelectedSort('')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handlePriceRangeChange = (newRange: [number, number]) => {
    setPriceRange(newRange)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF0ED] to-white px-4 py-6 md:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#333333]">
            My Listings
          </h1>
          <p className="text-gray-600">Manage your property listings</p>
        </div>
        <Link href="/developer/properties/add">
          <Button
            variant="filled"
            icon={<PlusCircle className="h-4 w-4" />}
            iconPosition="left"
            className="whitespace-nowrap bg-[#7C0A02] hover:bg-[#600000] text-white shadow-md transition-all duration-200"
          >
            Add New Property
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {statusOptions.map((option) => (
          <Button
            key={option.id}
            variant={activeTab === option.value ? 'filled' : 'outline'}
            onClick={() => changeQuery('status', option.value)}
            size="extra-small"
            className={
              activeTab === option.value
                ? 'bg-[#7C0A02] text-white hover:bg-[#600000]'
                : 'border-[#FF9A8B] text-[#7C0A02] hover:bg-[#FFF0ED]'
            }
          >
            {option.label}
          </Button>
        ))}
      </div>

      <Card className="p-4 border border-[#FFE4E0] shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <TextField
              label="Search"
              InputProps={{
                placeholder: 'Search by name or location...',
                value: filterParams.search || '',
                onChange: (e) => changeQuery('search', e.target.value),
                className:
                  'border-[#FFE4E0] focus:border-[#FF9A8B] focus:ring-[#FF9A8B]/20',
              }}
              className="w-full"
              labelClassName="text-[#333333] font-medium"
            />
            {filterParams.search && (
              <button
                onClick={() => changeQuery('search', '')}
                className="absolute right-10 top-[38px] text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <SelectField
            label="Property Type"
            data={propertyTypes}
            value={filterParams.propertyType || ''}
            onSelect={(option) => changeQuery('propertyType', option.value)}
            onClear={() => changeQuery('propertyType', '')}
            className="w-full md:w-[200px]"
            labelClassName="text-[#333333] font-medium"
          />

          <SelectField
            label="Bedrooms"
            data={bedroomOptions}
            value={filterParams.bedrooms || ''}
            onSelect={(option) => changeQuery('bedrooms', option.value)}
            onClear={() => changeQuery('bedrooms', '')}
            className="w-full md:w-[150px]"
            labelClassName="text-[#333333] font-medium"
          />

          <Popover
            open={advancedFiltersOpen}
            onOpenChange={setAdvancedFiltersOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 h-[42px] self-end border-[#FF9A8B] text-[#7C0A02] hover:bg-[#FFF0ED]"
                icon={<SlidersHorizontal className="h-4 w-4" />}
                iconPosition="left"
              >
                More Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <h3 className="font-medium text-[#333333]">Advanced Filters</h3>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-sm">Price Range</Label>
                    <div className="text-xs text-gray-500">
                      {formatPrice(priceRange[0])} -{' '}
                      {formatPrice(priceRange[1])}
                    </div>
                  </div>
                  <Slider
                    defaultValue={priceRange}
                    min={0}
                    max={10000000}
                    step={100000}
                    value={priceRange}
                    onValueChange={handlePriceRangeChange}
                    className="my-4"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Sort By</Label>
                  <select
                    value={selectedSort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full border border-[#FFE4E0] rounded-md p-2 text-sm focus:border-[#FF9A8B] focus:ring-[#FF9A8B]/20"
                  >
                    <option value="">Default</option>
                    {sortOptions.map((option) => (
                      <option key={option.id} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex justify-between">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={clearAllFilters}
                    className="text-sm"
                  >
                    Clear All
                  </Button>
                  <Button
                    variant="filled"
                    size="small"
                    onClick={() => {
                      applyPriceRange()
                      setAdvancedFiltersOpen(false)
                    }}
                    className="bg-[#7C0A02] hover:bg-[#600000] text-white text-sm"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Active Filters */}
        {(filterParams.minPrice ||
          filterParams.maxPrice ||
          filterParams.bedrooms ||
          filterParams.propertyType ||
          filterParams.status ||
          filterParams.search) && (
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#FFE4E0]">
            <div className="text-sm text-gray-500 mr-2 pt-1">
              Active Filters:
            </div>

            {filterParams.search && (
              <div className="bg-[#FFF0ED] text-[#7C0A02] px-2 py-1 rounded-full text-xs flex items-center">
                Search: {filterParams.search}
                <button
                  onClick={() => changeQuery('search', '')}
                  className="ml-1 text-gray-500 hover:text-[#7C0A02]"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {filterParams.propertyType && (
              <div className="bg-[#FFF0ED] text-[#7C0A02] px-2 py-1 rounded-full text-xs flex items-center">
                Type: {filterParams.propertyType}
                <button
                  onClick={() => changeQuery('propertyType', '')}
                  className="ml-1 text-gray-500 hover:text-[#7C0A02]"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {filterParams.status && (
              <div className="bg-[#FFF0ED] text-[#7C0A02] px-2 py-1 rounded-full text-xs flex items-center">
                Status: {filterParams.status}
                <button
                  onClick={() => changeQuery('status', '')}
                  className="ml-1 text-gray-500 hover:text-[#7C0A02]"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {filterParams.bedrooms && (
              <div className="bg-[#FFF0ED] text-[#7C0A02] px-2 py-1 rounded-full text-xs flex items-center">
                Bedrooms: {filterParams.bedrooms}+
                <button
                  onClick={() => changeQuery('bedrooms', '')}
                  className="ml-1 text-gray-500 hover:text-[#7C0A02]"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {(filterParams.minPrice || filterParams.maxPrice) && (
              <div className="bg-[#FFF0ED] text-[#7C0A02] px-2 py-1 rounded-full text-xs flex items-center">
                Price:{' '}
                {filterParams.minPrice
                  ? formatPrice(filterParams.minPrice)
                  : '₦0'}{' '}
                -{' '}
                {filterParams.maxPrice
                  ? formatPrice(filterParams.maxPrice)
                  : 'Any'}
                <button
                  onClick={() => {
                    changeQuery('minPrice', undefined)
                    changeQuery('maxPrice', undefined)
                    setPriceRange([0, 10000000])
                  }}
                  className="ml-1 text-gray-500 hover:text-[#7C0A02]"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            <Button
              variant="outline"
              size="extra-small"
              onClick={clearAllFilters}
              className="text-xs border-[#FFE4E0] text-gray-500 hover:bg-[#FFF0ED]"
            >
              Clear All
            </Button>
          </div>
        )}
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 rounded-full bg-[#FF9A8B] mb-4"></div>
            <p className="text-[#7C0A02]">Loading properties...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={{
                  ...property,
                  status: property.status as
                    | 'pending'
                    | 'approved'
                    | 'rejected',
                }}
                onDelete={() => openDeleteModal(property._id)}
              />
            ))
          ) : (
            <div className="col-span-1 md:col-span-3 flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-[#FFE4E0] p-8">
              <div className="text-[#FF9A8B] mb-4">
                <Home className="h-16 w-16" />
              </div>
              <h3 className="text-xl font-semibold text-[#7C0A02] mb-2">
                No Properties Found
              </h3>
              <p className="text-gray-600 text-center mb-6">
                You haven't added any properties yet or none match your current
                filters.
              </p>
              <Link href="/developers/properties/add">
                <Button
                  variant="filled"
                  icon={<PlusCircle className="h-4 w-4" />}
                  iconPosition="left"
                  className="bg-[#7C0A02] hover:bg-[#600000] text-white"
                >
                  Add Your First Property
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        className="bg-white p-6 rounded-lg shadow-lg border border-[#FFE4E0] max-w-md mx-auto"
      >
        <div className="space-y-4">
          <div className="flex items-center text-[#7C0A02] mb-2">
            <Trash2 className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
          </div>
          <p className="text-gray-600">
            Are you sure you want to delete this property? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              className="border-[#FF9A8B] text-[#7C0A02] hover:bg-[#FFF0ED]"
              disabled={deletePropertyMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProperty}
              className="bg-[#7C0A02] hover:bg-[#600000] text-white"
              disabled={deletePropertyMutation.isPending}
            >
              {deletePropertyMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function PropertyCard({
  property,
  onDelete,
}: {
  property: Property
  onDelete: () => void
}) {
  const statusColors = {
    pending: 'bg-[#F9A826]',
    approved: 'bg-[#4CAF50]',
    rejected: 'bg-[#7C0A02]',
  }

  return (
    <Card className="overflow-hidden border border-[#FFE4E0] shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <Image
          src="/placeholder.svg?height=300&width=500"
          alt={property.name}
          fill
          className="object-cover"
        />
        <div
          className={`absolute bottom-2 left-2 ${
            statusColors[property.status]
          } text-white px-2 py-1 rounded-md text-xs font-medium shadow-sm`}
        >
          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold truncate text-[#333333]">
              {property.name}
            </h3>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <MapPin className="h-3 w-3 mr-1 text-[#FF9A8B]" />
              <span className="truncate">{property.location}</span>
            </div>
          </div>
          <div className="font-bold text-[#7C0A02]">
            ₦{property.price.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="flex items-center text-gray-700">
            <Bed className="h-4 w-4 mr-1 text-[#FF9A8B]" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Home className="h-4 w-4 mr-1 text-[#FF9A8B]" />
            <span className="capitalize">{property.propertyType}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#FFE4E0]">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="text-gray-600">Down: </span>
              <span className="text-gray-800 font-medium">
                {property.minDownPaymentPercent}%
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Monthly: </span>
              <span className="text-gray-800 font-medium">
                ₦{property.minMonthlyPayment.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4 pt-4 border-t border-[#FFE4E0]">
          <Link
            href={`/developer/properties/${property._id}`}
            className="w-full sm:w-auto"
          >
            <Button
              variant="outline"
              size="small"
              className="w-full border-[#FF9A8B] text-[#7C0A02] hover:bg-[#FFF0ED]"
            >
              View Details
            </Button>
          </Link>
          <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <Link href={`/developer/properties/edit/${property._id}`}>
              <Button
                variant="outline"
                size="extra-small"
                icon={<Edit className="h-4 w-4" />}
                iconPosition="left"
                className="border-[#FFE4E0] text-gray-700 hover:border-[#FF9A8B] hover:text-[#7C0A02]"
              >
                Edit
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="extra-small"
              icon={<Trash2 className="h-4 w-4" />}
              iconPosition="left"
              onClick={onDelete}
              className="bg-[#7C0A02] hover:bg-[#600000] text-white"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

import type { Property } from '@/lib/types/types'
