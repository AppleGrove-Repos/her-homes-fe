'use client'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import type React from 'react'

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
import { Alert, AlertDescription } from '@/components/ui/alert'
import Button from '@/components/common/button'
import {
  ArrowLeft,
  Check,
  MapPin,
  Upload,
  FilePen,
  X,
  AlertCircle,
  Wallet,
  DollarSign,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
]

interface PropertyFormData {
  title: string
  propertyDescription: string
  neighborhoodDescription: string
  propertyAddress: string
  nearbyLandmark: string
  images: string[]
  videos: string[]
  price: string
  propertyType: string
  minDownPaymentPercent: string
  minMonthlyPayment: string
  specifications: {
    bedrooms: number
    area: number
    floor: number
    bathrooms?: number
    parkingSlots?: number
    [key: string]: number | undefined
  }
  features: Record<string, boolean>
}

const uploadSteps = [
  { id: 'basic', label: 'Basic Info', completed: false },
  { id: 'pricing', label: 'Pricing', completed: false },
  { id: 'specifications', label: 'Specifications', completed: false },
  { id: 'features', label: 'Features', completed: false },
  { id: 'media', label: 'Media', completed: false },
  { id: 'location', label: 'Location', completed: false },
]

const defaultFeatures = [
  'POP ceiling',
  'Modern kitchen',
  'Marble flooring',
  'Granite countertops',
  'CCTV infrastructure',
  'En-suite bathrooms',
  'Swimming pool',
  'Gym',
  'Parking space',
  'Generator',
  'Security',
  'Garden',
]

// Utility function to format number with commas
const formatNumberWithCommas = (value: string) => {
  const numericValue = value.replace(/[^0-9]/g, '')
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Utility function to parse formatted number
const parseFormattedNumber = (value: string) => {
  return Number.parseFloat(value.replace(/,/g, '')) || 0
}

export default function AddPropertyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [imageError, setImageError] = useState('')
  const [videos, setVideos] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  )
  const [submitError, setSubmitError] = useState<string>('')
  const [formErrors, setFormErrors] = useState<string[]>([])

  // File input refs
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm<PropertyFormData>({
    defaultValues: {
      title: '',
      propertyDescription: '',
      neighborhoodDescription: '',
      propertyAddress: '',
      nearbyLandmark: '',
      price: '',
      images: [],
      videos: [],
      propertyType: '',
      minDownPaymentPercent: '',
      minMonthlyPayment: '',
      specifications: {
        bedrooms: 0,
        area: 0,
        floor: 0,
        bathrooms: 0,
        parkingSlots: 0,
      },
      features: {},
    },
  })

  const watchedValues = watch()
  const selectedPropertyType = watch('propertyType')

  const [features, setFeatures] = useState<Record<string, boolean>>({
    'POP ceiling': true,
    'Modern kitchen': true,
    'Marble flooring': true,
  })

  const [customSpecs, setCustomSpecs] = useState<
    { name: string; value: number }[]
  >([])
  const [showFeatureModal, setShowFeatureModal] = useState(false)
  const [showSpecModal, setShowSpecModal] = useState(false)
  const [newFeature, setNewFeature] = useState('')
  const [newSpecName, setNewSpecName] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')

  // Price formatting handlers
  const handlePriceChange = useCallback(
    (field: 'price' | 'minDownPaymentPercent' | 'minMonthlyPayment') =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatNumberWithCommas(e.target.value)
        setValue(field, formatted)
        clearErrors(field)
      },
    [setValue, clearErrors]
  )

  const handlePropertyTypeChange = useCallback(
    (value: string) => {
      setValue('propertyType', value)
      clearErrors('propertyType')
    },
    [setValue, clearErrors]
  )

  const toggleFeature = useCallback((feature: string) => {
    setFeatures((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }))
  }, [])

  const handleRemoveVideo = useCallback((idx: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== idx))
  }, [])

  const handleRemoveImage = useCallback((idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
    setImageError('')
  }, [])

  // Validation function
  const validateForm = useCallback(() => {
    const errors: string[] = []

    if (!watchedValues.title?.trim()) errors.push('Property title is required')
    if (!watchedValues.propertyDescription?.trim())
      errors.push('Property description is required')
    if (!watchedValues.neighborhoodDescription?.trim())
      errors.push('Neighborhood description is required')
    if (!watchedValues.propertyType) errors.push('Property type is required')
    if (!watchedValues.price?.trim()) errors.push('Price is required')
    if (!watchedValues.minDownPaymentPercent?.trim())
      errors.push('Down payment percentage is required')
    if (!watchedValues.minMonthlyPayment?.trim())
      errors.push('Monthly payment is required')
    if (!watchedValues.propertyAddress?.trim())
      errors.push('Property address is required')
    if (!watchedValues.nearbyLandmark?.trim())
      errors.push('Nearby landmarks are required')
    if (images.length === 0)
      errors.push('At least one property image is required')

    // Validate numeric values
    const price = parseFormattedNumber(watchedValues.price || '')
    const downPayment = parseFormattedNumber(
      watchedValues.minDownPaymentPercent || ''
    )
    const monthlyPayment = parseFormattedNumber(
      watchedValues.minMonthlyPayment || ''
    )

    if (price <= 0) errors.push('Price must be greater than 0')
    if (downPayment <= 0 || downPayment > 100)
      errors.push('Down payment must be between 1-100%')
    if (monthlyPayment <= 0)
      errors.push('Monthly payment must be greater than 0')

    setFormErrors(errors)
    return errors.length === 0
  }, [watchedValues, images])

  // Replace the existing progress tracking useEffect with this optimized version
  const progressData = useMemo(() => {
    const newCompletedSteps: string[] = []
    let newCurrentStep = 0

    // Basic Info
    if (
      watchedValues.title &&
      watchedValues.propertyDescription &&
      watchedValues.neighborhoodDescription &&
      watchedValues.propertyType
    ) {
      newCompletedSteps.push('basic')
      newCurrentStep = Math.max(newCurrentStep, 1)
    }

    // Pricing
    if (
      watchedValues.price &&
      watchedValues.minDownPaymentPercent &&
      watchedValues.minMonthlyPayment
    ) {
      const price = parseFormattedNumber(watchedValues.price)
      const downPayment = parseFormattedNumber(
        watchedValues.minDownPaymentPercent
      )
      const monthlyPayment = parseFormattedNumber(
        watchedValues.minMonthlyPayment
      )

      if (price > 0 && downPayment > 0 && monthlyPayment > 0) {
        newCompletedSteps.push('pricing')
        newCurrentStep = Math.max(newCurrentStep, 2)
      }
    }

    // Specifications
    if (
      watchedValues.specifications?.bedrooms ||
      watchedValues.specifications?.area ||
      customSpecs.length > 0
    ) {
      newCompletedSteps.push('specifications')
      newCurrentStep = Math.max(newCurrentStep, 3)
    }

    // Features
    if (Object.keys(features).length > 0) {
      newCompletedSteps.push('features')
      newCurrentStep = Math.max(newCurrentStep, 4)
    }

    // Media
    if (images.length > 0) {
      newCompletedSteps.push('media')
      newCurrentStep = Math.max(newCurrentStep, 5)
    }

    // Location
    if (watchedValues.propertyAddress && watchedValues.nearbyLandmark) {
      newCompletedSteps.push('location')
      newCurrentStep = Math.max(newCurrentStep, 6)
    }

    return { completedSteps: newCompletedSteps, currentStep: newCurrentStep }
  }, [watchedValues, features, images, customSpecs])

  // Update state only when values actually change
  useEffect(() => {
    setCompletedSteps(progressData.completedSteps)
    setCurrentStep(progressData.currentStep)
  }, [progressData.completedSteps.join(','), progressData.currentStep])

  // Also optimize the form value sync useEffects
  useEffect(() => {
    if (JSON.stringify(images) !== JSON.stringify(watchedValues.images)) {
      setValue('images', images)
    }
  }, [images, setValue, watchedValues.images])

  useEffect(() => {
    if (JSON.stringify(videos) !== JSON.stringify(watchedValues.videos)) {
      setValue('videos', videos)
    }
  }, [videos, setValue, watchedValues.videos])

  useEffect(() => {
    if (JSON.stringify(features) !== JSON.stringify(watchedValues.features)) {
      setValue('features', features)
    }
  }, [features, setValue, watchedValues.features])

  // File conversion utility
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Image upload handler
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files
    if (!files) return

    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported image format`)
        continue
      }

      // Validate file size
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`)
        continue
      }

      // Check if we've reached the limit
      if (images.length >= 10) {
        toast.error('Maximum 10 images allowed')
        break
      }

      try {
        setUploadProgress((prev) => ({ ...prev, [`image-${i}`]: 0 }))

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const current = prev[`image-${i}`] || 0
            if (current >= 90) {
              clearInterval(progressInterval)
              return prev
            }
            return { ...prev, [`image-${i}`]: current + 10 }
          })
        }, 100)

        const base64 = await convertFileToBase64(file)

        setUploadProgress((prev) => ({ ...prev, [`image-${i}`]: 100 }))
        setTimeout(() => {
          setUploadProgress((prev) => {
            const newProgress = { ...prev }
            delete newProgress[`image-${i}`]
            return newProgress
          })
        }, 500)

        setImages((prev) => [...prev, base64])
        setImageError('')
        toast.success(`${file.name} uploaded successfully`)
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`)
        setUploadProgress((prev) => {
          const newProgress = { ...prev }
          delete newProgress[`image-${i}`]
          return newProgress
        })
      }
    }

    // Reset input
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  // Video upload handler
  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files
    if (!files) return

    const maxSize = 100 * 1024 * 1024 // 100MB
    const allowedTypes = [
      'video/mp4',
      'video/webm',
      'video/mov',
      'video/quicktime',
    ]

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported video format`)
        continue
      }

      // Validate file size
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 100MB`)
        continue
      }

      // Check if we've reached the limit
      if (videos.length >= 3) {
        toast.error('Maximum 3 videos allowed')
        break
      }

      try {
        setUploadProgress((prev) => ({ ...prev, [`video-${i}`]: 0 }))

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const current = prev[`video-${i}`] || 0
            if (current >= 90) {
              clearInterval(progressInterval)
              return prev
            }
            return { ...prev, [`video-${i}`]: current + 5 }
          })
        }, 200)

        const base64 = await convertFileToBase64(file)

        setUploadProgress((prev) => ({ ...prev, [`video-${i}`]: 100 }))
        setTimeout(() => {
          setUploadProgress((prev) => {
            const newProgress = { ...prev }
            delete newProgress[`video-${i}`]
            return newProgress
          })
        }, 500)

        setVideos((prev) => [...prev, base64])
        toast.success(`${file.name} uploaded successfully`)
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`)
        setUploadProgress((prev) => {
          const newProgress = { ...prev }
          delete newProgress[`video-${i}`]
          return newProgress
        })
      }
    }

    // Reset input
    if (videoInputRef.current) {
      videoInputRef.current.value = ''
    }
  }

  const addCustomFeature = () => {
    if (newFeature.trim() && !features.hasOwnProperty(newFeature.trim())) {
      setFeatures((prev) => ({
        ...prev,
        [newFeature.trim()]: true,
      }))
      setNewFeature('')
      setShowFeatureModal(false)
    }
  }

  const addCustomSpec = () => {
    if (newSpecName.trim() && newSpecValue.trim()) {
      const value = Number.parseFloat(newSpecValue.trim())
      if (!isNaN(value)) {
        setCustomSpecs((prev) => [...prev, { name: newSpecName.trim(), value }])
        setNewSpecName('')
        setNewSpecValue('')
        setShowSpecModal(false)
      }
    }
  }

  const removeCustomSpec = (index: number) => {
    setCustomSpecs((prev) => prev.filter((_, i) => i !== index))
  }

  const queryClient = useQueryClient()

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true)
    setSubmitError('')
    setFormErrors([])

    try {
      // Validate form before submission
      if (!validateForm()) {
        setIsSubmitting(false)
        return
      }

      const validImages = images.filter((img) => {
        if (!img || typeof img !== 'string') return false
        return img.startsWith('data:image/')
      })

      if (validImages.length === 0) {
        setImageError('At least one valid image is required.')
        setIsSubmitting(false)
        return
      }

      const validVideos = videos.filter((vid) => {
        if (!vid || typeof vid !== 'string') return false
        return vid.startsWith('data:video/')
      })

      // Parse formatted numbers
      const price = parseFormattedNumber(data.price)
      const minDownPaymentPercent = parseFormattedNumber(
        data.minDownPaymentPercent
      )
      const minMonthlyPayment = parseFormattedNumber(data.minMonthlyPayment)

      // Prepare specifications object with custom specs
      const specifications: {
        bedrooms: number
        area: number
        floor: number
        bathrooms?: number
        parkingSlots?: number
        [key: string]: number | undefined
      } = {
        bedrooms: Number.parseInt(data.specifications.bedrooms.toString()) || 0,
        area: Number.parseInt(data.specifications.area.toString()) || 0,
        floor: Number.parseInt(data.specifications.floor.toString()) || 0,
        bathrooms:
          Number.parseInt(data.specifications.bathrooms?.toString() || '0') ||
          0,
        parkingSlots:
          Number.parseInt(
            data.specifications.parkingSlots?.toString() || '0'
          ) || 0,
      }

      // Add custom specifications
      customSpecs.forEach((spec) => {
        specifications[spec.name.toLowerCase().replace(/\s+/g, '')] = spec.value
      })

      // Ensure all required features are present for CreatePropertyDto
      const requiredFeatures = {
        gym: false,
        pool: false,
        ...features,
      }

      const propertyData = {
        title: data.title,
        propertyDescription: data.propertyDescription,
        neighborhoodDescription: data.neighborhoodDescription,
        propertyAddress: data.propertyAddress,
        nearbyLandmark: data.nearbyLandmark,
        images: validImages,
        videos: validVideos,
        price,
        propertyType: data.propertyType,
        minDownPaymentPercent,
        minMonthlyPayment,
        specifications,
        features: requiredFeatures,
      }

      console.log('Submitting property data:', propertyData)
      await createProperty(propertyData)
      toast.success('Property added successfully!')
      setTimeout(() => {
        router.push('/developers/listing')
      }, 3000)
    } catch (error: any) {
      console.error('Error adding property:', error)

      // Enhanced error handling
      let errorMessage = 'Failed to add property. Please try again.'

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error?.message) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }

      // Handle specific error types
      if (error?.response?.status === 400) {
        errorMessage =
          'Invalid data provided. Please check all fields and try again.'
      } else if (error?.response?.status === 401) {
        errorMessage =
          'You are not authorized to perform this action. Please log in again.'
      } else if (error?.response?.status === 413) {
        errorMessage =
          'Files are too large. Please reduce file sizes and try again.'
      } else if (error?.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.'
      }

      setSubmitError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F1EB] p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4 sm:mb-6">
          <Link
            href="/developers/listing"
            className="text-gray-600 hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-[25px] font-bold text-gray-800">
              Add New Property
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Create a new property listing
            </p>
          </div>
        </div>

        {/* Error Display */}
        {(submitError || formErrors.length > 0) && (
          <Alert className="mb-4 sm:mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {submitError && (
                <div className="font-medium mb-2">{submitError}</div>
              )}
              {formErrors.length > 0 && (
                <div>
                  <div className="font-medium mb-1">
                    Please fix the following errors:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {formErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Main Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Basic Information */}
              <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-base sm:text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Basic Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="title"
                        className="text-sm sm:text-base text-gray-700 font-medium"
                      >
                        Property Title
                      </Label>
                      <Input
                        id="title"
                        placeholder="e.g. 3-Bedroom Bungalow in Lekki"
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500/20 placeholder:text-sm sm:placeholder:text-base"
                        {...register('title', {
                          required: 'Property title is required',
                        })}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-xs sm:text-sm">
                          {errors.title.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="propertyType"
                        className="text-sm sm:text-base text-gray-700 font-medium"
                      >
                        Property Type
                      </Label>
                      <Select
                        onValueChange={handlePropertyTypeChange}
                        value={selectedPropertyType}
                      >
                        <SelectTrigger className="border-gray-300 focus:ring-green-500/20 text-sm sm:text-base">
                          <SelectValue
                            placeholder="Select Type"
                            className="text-sm sm:text-base"
                          />
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
                        <p className="text-red-500 text-xs sm:text-sm">
                          {errors.propertyType.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label
                        htmlFor="propertyDescription"
                        className="text-sm sm:text-base text-gray-700 font-medium"
                      >
                        Property Description
                      </Label>
                      <Textarea
                        id="propertyDescription"
                        placeholder="Describe the property features, layout, and unique selling points..."
                        rows={4}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500/20 resize-none placeholder:text-sm sm:placeholder:text-base"
                        {...register('propertyDescription', {
                          required: 'Property description is required',
                          minLength: {
                            value: 20,
                            message:
                              'Description should be at least 20 characters',
                          },
                        })}
                      />
                      {errors.propertyDescription && (
                        <p className="text-red-500 text-xs sm:text-sm">
                          {errors.propertyDescription.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label
                        htmlFor="neighborhoodDescription"
                        className="text-sm sm:text-base text-gray-700 font-medium"
                      >
                        Neighborhood Description
                      </Label>
                      <Textarea
                        id="neighborhoodDescription"
                        placeholder="Describe the neighborhood, nearby amenities, and location benefits..."
                        rows={3}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500/20 resize-none placeholder:text-sm sm:placeholder:text-base"
                        {...register('neighborhoodDescription', {
                          required: 'Neighborhood description is required',
                        })}
                      />
                      {errors.neighborhoodDescription && (
                        <p className="text-red-500 text-xs sm:text-sm">
                          {errors.neighborhoodDescription.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Pricing & Mortgage */}
              <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-base sm:text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Pricing & Mortgage
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="price"
                        className="text-sm sm:text-base text-gray-700 font-medium"
                      >
                        Total Price (₦)
                      </Label>
                      <div className="relative">
                        <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="price"
                          placeholder="50,000,000"
                          className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500/20 placeholder:text-sm sm:placeholder:text-base"
                          value={watchedValues.price || ''}
                          onChange={handlePriceChange('price')}
                        />
                      </div>
                      {errors.price && (
                        <p className="text-red-500 text-xs sm:text-sm">
                          {errors.price.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="minDownPaymentPercent"
                        className="text-sm sm:text-base text-gray-700 font-medium"
                      >
                        Down Payment %
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          %
                        </span>
                        <Input
                          id="minDownPaymentPercent"
                          placeholder="20"
                          className="pl-8 border-gray-300 focus:border-green-500 focus:ring-green-500/20 placeholder:text-sm sm:placeholder:text-base"
                          value={watchedValues.minDownPaymentPercent || ''}
                          onChange={handlePriceChange('minDownPaymentPercent')}
                        />
                      </div>
                      {errors.minDownPaymentPercent && (
                        <p className="text-red-500 text-xs sm:text-sm">
                          {errors.minDownPaymentPercent.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="minMonthlyPayment"
                        className="text-sm sm:text-base text-gray-700 font-medium"
                      >
                        Monthly Payment (₦)
                      </Label>
                      <div className="relative">
                        <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="minMonthlyPayment"
                          placeholder="500,000"
                          className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500/20 placeholder:text-sm sm:placeholder:text-base"
                          value={watchedValues.minMonthlyPayment || ''}
                          onChange={handlePriceChange('minMonthlyPayment')}
                        />
                      </div>
                      {errors.minMonthlyPayment && (
                        <p className="text-red-500 text-xs sm:text-sm">
                          {errors.minMonthlyPayment.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Property Specifications */}
              <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-base sm:text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Property Specifications
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="bedrooms"
                        className="text-sm sm:text-base text-gray-700 font-medium"
                      >
                        Bedrooms
                      </Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        min="0"
                        placeholder="3"
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500/20 placeholder:text-sm sm:placeholder:text-base"
                        {...register('specifications.bedrooms', {
                          min: {
                            value: 0,
                            message: 'Bedrooms cannot be negative',
                          },
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="bathrooms"
                        className="text-sm sm:text-base text-gray-700 font-medium"
                      >
                        Bathrooms
                      </Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        min="0"
                        placeholder="2"
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500/20 placeholder:text-sm sm:placeholder:text-base"
                        {...register('specifications.bathrooms', {
                          min: {
                            value: 0,
                            message: 'Bathrooms cannot be negative',
                          },
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="area"
                        className="text-sm sm:text-base text-gray-700 font-medium"
                      >
                        Area (sqm)
                      </Label>
                      <Input
                        id="area"
                        type="number"
                        min="0"
                        placeholder="120"
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500/20 placeholder:text-sm sm:placeholder:text-base"
                        {...register('specifications.area', {
                          min: {
                            value: 0,
                            message: 'Area cannot be negative',
                          },
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="parkingSlots"
                        className="text-sm sm:text-base text-gray-700 font-medium"
                      >
                        Parking Slots
                      </Label>
                      <Input
                        id="parkingSlots"
                        type="number"
                        min="0"
                        placeholder="2"
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500/20 placeholder:text-sm sm:placeholder:text-base"
                        {...register('specifications.parkingSlots', {
                          min: {
                            value: 0,
                            message: 'Parking slots cannot be negative',
                          },
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="floor"
                        className="text-sm sm:text-base text-gray-700 font-medium"
                      >
                        Floor
                      </Label>
                      <Input
                        id="floor"
                        type="number"
                        min="0"
                        placeholder="2"
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500/20 placeholder:text-sm sm:placeholder:text-base"
                        {...register('specifications.floor', {
                          min: {
                            value: 0,
                            message: 'Floor cannot be negative',
                          },
                        })}
                      />
                    </div>
                  </div>

                  {/* Custom Specifications */}
                  {customSpecs.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-sm sm:text-base text-gray-700 font-medium">
                        Additional Specifications
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {customSpecs.map((spec, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                          >
                            <span className="text-sm text-gray-700">
                              {spec.name}: {spec.value}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeCustomSpec(index)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    onClick={() => setShowSpecModal(true)}
                    className="border-green-300 text-green-600 hover:bg-green-50 bg-transparent"
                  >
                    + Add Specifications
                  </Button>
                </div>
              </Card>

              {/* Property Features */}
              <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-base sm:text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Property Features
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(features).map(([feature, isSelected]) => (
                      <label
                        key={feature}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleFeature(feature)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </label>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    onClick={() => setShowFeatureModal(true)}
                    className="border-green-300 text-green-600 hover:bg-green-50 bg-transparent"
                  >
                    + Add Features
                  </Button>
                </div>
              </Card>

              {/* Media Upload */}
              <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-base sm:text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Media Upload
                  </h2>

                  {/* Images */}
                  <div className="space-y-4">
                    <Label className="text-sm sm:text-base text-gray-700 font-medium">
                      Property Images
                    </Label>

                    {/* Upload Progress */}
                    {Object.entries(uploadProgress).map(([key, progress]) => (
                      <div
                        key={key}
                        className="w-full bg-gray-200 rounded-full h-2"
                      >
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Uploading {key}... {progress}%
                        </p>
                      </div>
                    ))}

                    {/* Existing Images */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                        {images.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={img || '/placeholder.svg'}
                              alt={`Property image ${idx + 1}`}
                              className="w-full h-20 sm:h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            {idx === 0 && (
                              <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                Cover
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Area */}
                    {images.length < 10 && (
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                          </div>
                          <p className="text-gray-600 mb-2 text-sm sm:text-base">
                            Drop your images here or{' '}
                            <span className="text-green-600 hover:underline">
                              browse
                            </span>
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            PNG, JPG up to 10MB each (Max 10 images)
                          </p>
                        </div>
                      </div>
                    )}

                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    {imageError && (
                      <p className="text-red-500 text-xs sm:text-sm">
                        {imageError}
                      </p>
                    )}
                  </div>

                  {/* Videos */}
                  <div className="space-y-4">
                    <Label className="text-sm sm:text-base text-gray-700 font-medium">
                      Property Videos (Optional)
                    </Label>

                    {/* Existing Videos */}
                    {videos.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {videos.map((vid, idx) => (
                          <div key={idx} className="relative group">
                            <video
                              src={vid}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              controls
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveVideo(idx)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Area */}
                    {videos.length < 3 && (
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
                        onClick={() => videoInputRef.current?.click()}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                          </div>
                          <p className="text-gray-600 mb-2 text-sm sm:text-base">
                            Drop your videos here or{' '}
                            <span className="text-green-600 hover:underline">
                              browse
                            </span>
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            MP4, WebM, MOV up to 100MB each (Max 3 videos)
                          </p>
                        </div>
                      </div>
                    )}

                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </Card>

              {/* Location & Map */}
              <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-base sm:text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Location & Map
                  </h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="propertyAddress"
                        className="text-sm sm:text-base text-gray-700 font-medium"
                      >
                        Property Address
                      </Label>
                      <Input
                        id="propertyAddress"
                        placeholder="Enter full property address"
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500/20 placeholder:text-sm sm:placeholder:text-base"
                        {...register('propertyAddress', {
                          required: 'Property address is required',
                        })}
                      />
                      {errors.propertyAddress && (
                        <p className="text-red-500 text-xs sm:text-sm">
                          {errors.propertyAddress.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="nearbyLandmark"
                        className="text-sm sm:text-base text-gray-700 font-medium"
                      >
                        Nearby Landmarks
                      </Label>
                      <Textarea
                        id="nearbyLandmark"
                        placeholder="List nearby landmarks with distances (e.g. 5 minutes to Lekki Phase I Gate)"
                        rows={3}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500/20 resize-none placeholder:text-sm sm:placeholder:text-base"
                        {...register('nearbyLandmark', {
                          required: 'Nearby landmarks are required',
                        })}
                      />
                      {errors.nearbyLandmark && (
                        <p className="text-red-500 text-xs sm:text-sm">
                          {errors.nearbyLandmark.message}
                        </p>
                      )}
                    </div>
                    <div className="bg-gray-100 rounded-lg p-6 sm:p-8 text-center">
                      <MapPin className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 text-sm sm:text-base">
                        Map integration will appear here
                      </p>
                      {/* <Button
                        type="button"
                        variant="outline"
                        size="small"
                        className="mt-3 border-green-300 text-green-600 hover:bg-green-50 bg-transparent"
                      >
                        📍 Set Location
                      </Button> */}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-300 text-sm sm:text-base text-gray-700 hover:bg-gray-50 bg-transparent flex text-center p-3 h-[50px] sm:h-[60px] items-center justify-center"
                >
                  <FilePen className="w-4 h-4 inline mr-2 sm:mr-3" />
                  Save as Draft
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  className="bg-green-600 text-white text-xs sm:text-[12px] hover:bg-green-700 shadow-md transition-all duration-200 flex gap-2 text-center p-3 h-[50px] sm:h-[60px] items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!isSubmitting && (
                    <Upload className="w-4 h-4 inline mr-2 sm:mr-3" />
                  )}
                  {isSubmitting ? 'Publishing Property...' : 'Publish Property'}
                </Button>
              </div>
            </form>
          </div>

          {/* Upload Progress Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4 sm:p-6 sticky top-6">
              <h3 className="font-semibold text-gray-800 mb-4 text-sm sm:text-base">
                Upload Progress
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {uploadSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        completedSteps.includes(step.id)
                          ? 'bg-green-500 text-white'
                          : index === currentStep
                          ? 'bg-green-100 text-green-600 border-2 border-green-500'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {completedSteps.includes(step.id) ? (
                        <Check className="h-2 w-2 sm:h-3 sm:w-3" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`text-xs sm:text-sm ${
                        completedSteps.includes(step.id)
                          ? 'text-green-600 font-medium'
                          : index === currentStep
                          ? 'text-gray-800 font-medium'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
                  <span>Overall Progress</span>
                  <span>
                    {Math.round(
                      (completedSteps.length / uploadSteps.length) * 100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        (completedSteps.length / uploadSteps.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-800 mb-3 text-sm">
                  Quick Tips
                </h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <p>• Use high-quality images for better engagement</p>
                  <p>• Include detailed property description</p>
                  <p>• Verify all pricing information</p>
                  <p>• Add nearby landmarks</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Feature Modal */}
      {showFeatureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-4">
            <h3 className="text-base sm:text-lg font-semibold mb-4">
              Add Custom Feature
            </h3>
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Enter feature name"
              className="mb-4"
              onKeyPress={(e) => e.key === 'Enter' && addCustomFeature()}
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFeatureModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={addCustomFeature}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Add Feature
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Specification Modal */}
      {showSpecModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-4">
            <h3 className="text-base sm:text-lg font-semibold mb-4">
              Add Custom Specification
            </h3>
            <div className="space-y-4">
              <Input
                value={newSpecName}
                onChange={(e) => setNewSpecName(e.target.value)}
                placeholder="Specification name (e.g., Pool Size)"
                className="mb-2"
              />
              <Input
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                placeholder="Numeric value (e.g., 50)"
                type="number"
                onKeyPress={(e) => e.key === 'Enter' && addCustomSpec()}
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSpecModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={addCustomSpec}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Add Specification
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
