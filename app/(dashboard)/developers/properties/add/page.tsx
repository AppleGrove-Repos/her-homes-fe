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
  bedrooms: number
  location: string
  price: number
  propertyType: string
  minDownPaymentPercent: number
  minMonthlyPayment: number
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
      bedrooms: 1,
      location: '',
      price: 0,
      propertyType: '',
      minDownPaymentPercent: 10,
      minMonthlyPayment: 0,
    },
  })

  // Watch the property type to use in the UI
  const selectedPropertyType = watch('propertyType')

  // Handle property type selection
  const handlePropertyTypeChange = (value: string) => {
    setValue('propertyType', value)
  }

  // Handle form submission
  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true)
    try {
      await createProperty({
        ...data,
        status: 'pending', // Default status for new properties
      })
      toast.success('Property added successfully!')
      router.push('/dashboard/developer/listings')
    } catch (error) {
      console.error('Error adding property:', error)
      toast.error('Failed to add property. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/developer/listings"
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add New Property</h1>
          <p className="text-gray-600">Create a new property listing</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Property Name</Label>
                <Input
                  id="name"
                  placeholder="Enter property name"
                  {...register('name', {
                    required: 'Property name is required',
                  })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type</Label>
                <Select
                  onValueChange={handlePropertyTypeChange}
                  value={selectedPropertyType}
                >
                  <SelectTrigger>
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
                  <p className="text-red-500 text-sm">
                    {errors.propertyType.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the property"
                  rows={4}
                  {...register('description', {
                    required: 'Description is required',
                    minLength: {
                      value: 20,
                      message: 'Description should be at least 20 characters',
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Location & Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter property location"
                  {...register('location', {
                    required: 'Location is required',
                  })}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  {...register('bedrooms', {
                    required: 'Number of bedrooms is required',
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: 'Bedrooms cannot be negative',
                    },
                  })}
                />
                {errors.bedrooms && (
                  <p className="text-red-500 text-sm">
                    {errors.bedrooms.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Pricing Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₦)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  {...register('price', {
                    required: 'Price is required',
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: 'Price cannot be negative',
                    },
                  })}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="minDownPaymentPercent">
                  Minimum Down Payment (%)
                </Label>
                <Input
                  id="minDownPaymentPercent"
                  type="number"
                  min="0"
                  max="100"
                  {...register('minDownPaymentPercent', {
                    required: 'Minimum down payment percentage is required',
                    valueAsNumber: true,
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
                  <p className="text-red-500 text-sm">
                    {errors.minDownPaymentPercent.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="minMonthlyPayment">
                  Minimum Monthly Payment (₦)
                </Label>
                <Input
                  id="minMonthlyPayment"
                  type="number"
                  min="0"
                  {...register('minMonthlyPayment', {
                    required: 'Minimum monthly payment is required',
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: 'Payment cannot be negative',
                    },
                  })}
                />
                {errors.minMonthlyPayment && (
                  <p className="text-red-500 text-sm">
                    {errors.minMonthlyPayment.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/developer/listings')}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              className="px-4 py-2 bg-[#7C0A02] text-white hover:bg-[#600000]"
            >
              {isSubmitting ? 'Adding Property...' : 'Add Property'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
