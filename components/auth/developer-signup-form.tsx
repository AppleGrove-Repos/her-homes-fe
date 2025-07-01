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
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { DeveloperSignupData } from '@/lib/types/auth'
import { authApi, publicApi } from '@/lib/config/axios.instance'

export default function DeveloperSignupForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const defaultBase64Image =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wIAAgMBAp2jkwAAAABJRU5ErkJggg=='

  const [formData, setFormData] = useState<DeveloperSignupData>({
    email: '',
    phoneNumber: '',
    password: '',
    role: 'developer',
    companyName: '',
    companyLogo: defaultBase64Image,
    companyDescription: '',
    yearsOfExperience: '',
    website: '',
    portfolio: '',
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      toast.error('No file selected. Please choose a file.')
      return
    }
    try {
      const reader = new FileReader()
      reader.onload = () => {
        const base64String = reader.result as string
        setFormData((prev) => ({
          ...prev,
          companyLogo: base64String || '',
        }))
        toast.success('Logo converted to Base64 successfully!')
      }
      reader.onerror = () => {
        toast.error('Failed to convert file to Base64. Please try again.')
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error processing file:', error)
      toast.error('An unexpected error occurred. Please try again.')
    }
  }

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

  // Signup mutation (unchanged)
  const signupMutation = useMutation({
    mutationFn: async (data: DeveloperSignupData) => {
      try {
        const response = await publicApi.post('/auth/signup/developer', data)
        return response.data
      } catch (error: any) {
        throw error
      }
    },
    onSuccess: async () => {
      toast.success('')
      router.push(
        `/account/verify?email=${encodeURIComponent(formData.email)}&role=${
          formData.role
        }`
      )
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || 'Signup failed. Please try again.'
      toast.error(errorMessage)
      setFormError(errorMessage)
    },
  })

  // Handle form submission (no step check)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToTerms) {
      setFormError('You must agree to the Terms, Privacy Policy, and Fees')
      toast.error('You must agree to the Terms, Privacy Policy, and Fees')
      return
    }
    if (
      !formData.companyName ||
      !formData.companyDescription ||
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
    try {
      await signupMutation.mutateAsync(formData)
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        'An unexpected error occurred. Please try again.'
      setFormError(message)
    }
  }

  return (
    <div className='h-[400px]'>
      <p className="text-gray-600 mb-2 text-[14px]">
        Register as a developer to start listing your properties
      </p>
      <form onSubmit={handleSubmit} className="space-y-2 pb-2">
        {formError && (
          <div className="text-red-500 text-sm text-center">{formError}</div>
        )}
        <div className="space-y-1">
          <Label htmlFor="companyName">
            Full name<span className="text-red-500">*</span>
          </Label>
          <Input
            id="companyName"
            name="companyName"
            value={formData.companyName || ''}
            onChange={handleChange}
            placeholder="Enter your company name/fullname"
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
          <Label htmlFor="companyDescription">
            Company Name<span className="text-red-500">*</span>
          </Label>
          <Input
            id="companyDescription"
            name="companyDescription"
            value={formData.companyDescription}
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
          formData.companyDescription &&
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
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? 'Creating...' : 'Create Account'}
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
