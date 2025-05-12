'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { createProperty } from '@/lib/services/developer/developer.services'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Button from '@/components/common/button'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'

// Define the property types
const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
]

// Define the form data type
interface PropertyFormData {
  name: string
  description: string
  bedrooms: string
  location: string
  price: string // <-- change to string
  propertyType: string
  minDownPaymentPercent: string // <-- change to string
  minMonthlyPayment: string
}

export default function AddPropertyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormData>({
    defaultValues: {
      name: '',
      description: '',
      bedrooms: '',
      location: '',
      price: '',
      propertyType: '',
      minDownPaymentPercent: '',
      minMonthlyPayment: '',
    },
  })

  // Watch the property type to use in the UI
  const selectedPropertyType = watch('propertyType')

  // Handle property type selection
  const handlePropertyTypeChange = (value: string) => {
    setValue('propertyType', value)
  }
  const queryClient = useQueryClient()
  // Handle form submission
  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true)
    try {
      await createProperty({
        ...data,
        status: 'pending', // Default status for new properties
      })
      toast.success('Property added successfully!')
      queryClient.invalidateQueries({ queryKey: ['propertyListings'] }) 
      router.push('/developers/listing')
    } catch (error) {
      console.error('Error adding property:', error)
      toast.error('Failed to add property. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF0ED] to-white space-y-6 px-4 py-6 md:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <Link
          href="/developer/listing"
          className="text-gray-600 hover:text-[#FF9A8B] transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#333333]">
            Add New Property
          </h1>
          <p className="text-gray-600">Create a new property listing</p>
        </div>
      </div>

      <Card className="p-4 md:p-6 border border-[#FFE4E0] shadow-md rounded-xl bg-white">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#7C0A02] flex items-center">
              <span className="inline-block w-1.5 h-6 bg-[#FF9A8B] mr-2 rounded-full"></span>
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#333333] font-medium">
                  Property Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter property name"
                  className="border-[#FFE4E0] focus:border-[#FF9A8B] focus:ring-[#FF9A8B]/20"
                  {...register('name', {
                    required: 'Property name is required',
                  })}
                />
                {errors.name && (
                  <p className="text-[#7C0A02] text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="propertyType"
                  className="text-[#333333] font-medium"
                >
                  Property Type
                </Label>
                <Select
                  onValueChange={handlePropertyTypeChange}
                  value={selectedPropertyType}
                >
                  <SelectTrigger className="border-[#FFE4E0] focus:ring-[#FF9A8B]/20">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.propertyType && (
                  <p className="text-[#7C0A02] text-sm">
                    {errors.propertyType.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="description"
                  className="text-[#333333] font-medium"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the property"
                  rows={4}
                  className="border-[#FFE4E0] focus:border-[#FF9A8B] focus:ring-[#FF9A8B]/20 resize-none"
                  {...register('description', {
                    required: 'Description is required',
                    minLength: {
                      value: 20,
                      message: 'Description should be at least 20 characters',
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-[#7C0A02] text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#FFE4E0]">
            <h2 className="text-xl font-semibold text-[#7C0A02] flex items-center">
              <span className="inline-block w-1.5 h-6 bg-[#FF9A8B] mr-2 rounded-full"></span>
              Location & Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-[#333333] font-medium"
                >
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="Enter property location"
                  className="border-[#FFE4E0] focus:border-[#FF9A8B] focus:ring-[#FF9A8B]/20"
                  {...register('location', {
                    required: 'Location is required',
                  })}
                />
                {errors.location && (
                  <p className="text-[#7C0A02] text-sm">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="bedrooms"
                  className="text-[#333333] font-medium"
                >
                  Bedrooms
                </Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  className="border-[#FFE4E0] focus:border-[#FF9A8B] focus:ring-[#FF9A8B]/20"
                  {...register('bedrooms', {
                  
                    min: {
                      value: 0,
                      message: 'Bedrooms cannot be negative',
                    },
                  })}
                />
                {errors.bedrooms && (
                  <p className="text-[#7C0A02] text-sm">
                    {errors.bedrooms.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#FFE4E0]">
            <h2 className="text-xl font-semibold text-[#7C0A02] flex items-center">
              <span className="inline-block w-1.5 h-6 bg-[#FF9A8B] mr-2 rounded-full"></span>
              Pricing Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-[#333333] font-medium">
                  Price (₦)
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  className="border-[#FFE4E0] focus:border-[#FF9A8B] focus:ring-[#FF9A8B]/20"
                  {...register('price', {
                    required: 'Price is required',
                    
                    min: {
                      value: 0,
                      message: 'Price cannot be negative',
                    },
                  })}
                />
                {errors.price && (
                  <p className="text-[#7C0A02] text-sm">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="minDownPaymentPercent"
                  className="text-[#333333] font-medium"
                >
                  Minimum Down Payment (%)
                </Label>
                <Input
                  id="minDownPaymentPercent"
                  type="number"
                  min="0"
                  max="100"
                  className="border-[#FFE4E0] focus:border-[#FF9A8B] focus:ring-[#FF9A8B]/20"
                  {...register('minDownPaymentPercent', {
                    required: 'Minimum down payment percentage is required',
                  
                    min: {
                      value: 0,
                      message: 'Percentage cannot be negative',
                    },
                    max: {
                      value: 100,
                      message: 'Percentage cannot exceed 100%',
                    },
                  })}
                />
                {errors.minDownPaymentPercent && (
                  <p className="text-[#7C0A02] text-sm">
                    {errors.minDownPaymentPercent.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label
                  htmlFor="minMonthlyPayment"
                  className="text-[#333333] font-medium"
                >
                  Minimum Monthly Payment (₦)
                </Label>
                <Input
                  id="minMonthlyPayment"
                  type="number"
                  min="0"
                  className="border-[#FFE4E0] focus:border-[#FF9A8B] focus:ring-[#FF9A8B]/20"
                  {...register('minMonthlyPayment', {
                    required: 'Minimum monthly payment is required',
                    
                    min: {
                      value: 0,
                      message: 'Payment cannot be negative',
                    },
                  })}
                />
                {errors.minMonthlyPayment && (
                  <p className="text-[#7C0A02] text-sm">
                    {errors.minMonthlyPayment.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-[#FFE4E0]">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/developer/listings')}
              className="px-4 py-2 border-[#FF9A8B] text-[#7C0A02] hover:bg-[#FFF0ED]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              className="px-4 py-2 bg-[#7C0A02] text-white hover:bg-[#600000] shadow-md transition-all duration-200 hover:shadow-lg"
            >
              {isSubmitting ? 'Adding Property...' : 'Add Property'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
