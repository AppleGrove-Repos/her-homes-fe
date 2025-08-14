'use client'

import type React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import type { DeveloperSignupData } from '@/lib/types/auth'
import { authApi } from '@/lib/config/axios.instance'

interface DeveloperSignupFormProps {
  onStepChange?: (step: number) => void
}

export default function DeveloperSignupForm({
  onStepChange,
}: DeveloperSignupFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')

  const [formData, setFormData] = useState<DeveloperSignupData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'developer',
    companyName: '',
    companyRegistrationNumber: '',
    companyAddress: '',
    certificateOfIncorporation: '',
    companyPortfolio: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1] // Remove data:image/jpeg;base64, prefix
        setFormData((prev) => ({
          ...prev,
          [fieldName]: base64String,
        }))
        toast.success('File uploaded successfully!')
      }
      reader.readAsDataURL(file)
    }
  }

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: async (data: DeveloperSignupData) => {
      try {
        const response = await authApi.post('/auth/signup/developer', data)
        return response.data
      } catch (error: any) {
        throw error
      }
    },
    onSuccess: async () => {
      toast.success('Account created successfully!')
      router.push(
        `/verification-success?email=${encodeURIComponent(formData.email)}`
      )
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || 'Signup failed. Please try again.'
      toast.error(errorMessage)
      setFormError(errorMessage)
    },
  })

  // Handle step 1 submission (continue to step 2)
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToTerms) {
      setFormError('You must agree to the Terms, Privacy Policy, and Fees')
      toast.error('You must agree to the Terms, Privacy Policy, and Fees')
      return
    }
    if (
      !formData.fullName ||
      !formData.companyName ||
      !formData.email ||
      !formData.password ||
      !formData.phoneNumber
    ) {
      setFormError('Please fill in all required fields')
      toast.error('Please fill in all required fields')
      return
    }
    if (formData.password !== confirmPassword) {
      setFormError('Passwords do not match')
      toast.error('Passwords do not match')
      return
    }

    setCurrentStep(2)
    onStepChange?.(2)
    setFormError(null)
  }

  // Handle step 2 submission (final submission)
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !formData.companyRegistrationNumber ||
      !formData.companyAddress ||
      !formData.certificateOfIncorporation ||
      !formData.companyPortfolio
    ) {
      toast.error(
        'Please fill in all company verification fields and upload required documents'
      )
      return
    }

    try {
      await signupMutation.mutateAsync(formData)
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        'An unexpected error occurred. Please try again.'
      setFormError(message)
    }
  }

  const goBackToStep1 = () => {
    setCurrentStep(1)
    onStepChange?.(1)
  }

  const isStep2Complete =
    formData.companyRegistrationNumber &&
    formData.companyAddress &&
    formData.certificateOfIncorporation &&
    formData.companyPortfolio

  if (currentStep === 1) {
    return (
      <div className="h-[400px]">
        <p className="text-gray-600 mb-2 text-[14px]">
          Register as a developer to start listing your properties
        </p>
        <form onSubmit={handleStep1Submit} className="space-y-2 pb-2">
          {formError && (
            <div className="text-red-500 text-sm text-center">{formError}</div>
          )}
          <div className="space-y-1">
            <Label htmlFor="fullName">
              Full name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName || ''}
              onChange={handleChange}
              placeholder="Enter your fullname"
              required
            />
          </div>
          <div className="space-y-1 ">
            <Label htmlFor="email">
              Business Email<span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="phoneNumber">
              Phone Number<span className="text-red-500">*</span>
            </Label>
            <PhoneInput
              country={'ng'}
              value={formData.phoneNumber}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, phoneNumber: value }))
              }
              enableSearch={true}
              inputProps={{
                name: 'phoneNumber',
                required: true,
                id: 'phoneNumber',
                autoFocus: false,
              }}
              containerClass="!w-full !rounded-md !border !border-gray-300 focus-within:!ring-2 focus-within:!ring-blue-500"
              inputClass="!w-full !py-2 !pl-16 !pr-4 !text-sm !rounded-md !border-none focus:!outline-none"
              buttonClass="!bg-transparent !border-none"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="companyName">
              Company Name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter your company Name"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">
              Create Password<span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirmPassword">
              Confirm Password<span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword((v) => !v)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {formData.companyName &&
            formData.fullName &&
            formData.email &&
            formData.password &&
            formData.phoneNumber && (
              <div className="flex items-start space-x-1 pt-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) =>
                    setAgreedToTerms(checked === true)
                  }
                  className="scale-75"
                />
                <Label htmlFor="terms" className="text-[12px] font-normal">
                  I agree to the Terms, Privacy Policy, and Fees
                </Label>
              </div>
            )}
          <div className="w-full mt-4">
            <Button
              type="submit"
              className="w-full bg-[#7D1F2C] hover:bg-[#6a1a25] text-white"
              disabled={false}
            >
              Continue
            </Button>
          </div>
        </form>
        <div className="text-left text-gray-400/70 text-sm mt-2">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-[#546B2F] font-bold hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Complete your company verification
        </h2>
        <p className="text-gray-600">
          Register as a developer to start listing your properties
        </p>
      </div>

      <form onSubmit={handleStep2Submit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name*
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            placeholder="Foranmi Realty"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Registration Number*
          </label>
          <input
            type="text"
            name="companyRegistrationNumber"
            value={formData.companyRegistrationNumber}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter registration number"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Address*
          </label>
          <textarea
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter company Address"
            required
          />
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Required Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">
                Certificate of Incorporation
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                PDF, PNG, JPG (max. 5mb)
              </p>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) =>
                  handleFileChange(e, 'certificateOfIncorporation')
                }
                className="hidden"
                id="certificate"
                required
              />
              <label
                htmlFor="certificate"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                Choose file
              </label>
              {formData.certificateOfIncorporation && (
                <p className="text-sm text-green-600 mt-2">✓ File uploaded</p>
              )}
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">
                Company's portfolio
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                PDF, PNG, JPG (max. 10mb)
              </p>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e, 'companyPortfolio')}
                className="hidden"
                id="portfolio"
                required
              />
              <label
                htmlFor="portfolio"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                Choose file
              </label>
              {formData.companyPortfolio && (
                <p className="text-sm text-green-600 mt-2">✓ File uploaded</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={goBackToStep1}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={signupMutation.isPending}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 ${
              isStep2Complete
                ? 'bg-[#7D1F2C] hover:bg-[#6a1a25] text-white'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            {signupMutation.isPending
              ? 'Submitting...'
              : 'Submit for Verification'}
          </button>
        </div>
      </form>
    </div>
  )
}
