'use client'

import type React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { DeveloperSignupData } from '@/lib/types/auth'
import { authApi, publicApi,  } from '@/lib/config/axios.instance'


export default function DeveloperSignupForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState<DeveloperSignupData>({
    email: '',
    phoneNumber: '',
    password: '',
    role: 'developer',
    companyName: '',
    companyLogo: '',
    companyDescription: '',
    yearsOfExperience: '',
    website: '',
    portfolio: '',
  })

  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    console.log('Selected file:', file) // Debugging

    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)
      console.log('FormData:', formData) // Debugging

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await response.json()
      console.log('Upload response:', data) // Debugging

      if (data.secure_url) {
        setFormData((prev) => ({
          ...prev,
          companyLogo: data.secure_url,
        }))
        toast.success('Logo uploaded successfully!')
      } else {
        throw new Error('Failed to upload logo')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Unable to upload resource to cloud. Please try again.')
    }
  }
  // Update form data
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    if (name === 'yearsOfExperience') {
      setFormData({
        ...formData,
        [name]: value,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Step validation
  const validateStep1 = () => {
    if (
      !formData.companyName.trim() ||
      !formData.companyDescription.trim() ||
      !formData.yearsOfExperience
    ) {
      setFormError('Please fill in all required fields for this step')
      toast.error('Please fill in all required fields for this step')
      return false
    }
    setFormError(null)
    return true
  }

  const validateStep2 = () => {
    if (
      !formData.email.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.password.trim()
    ) {
      setFormError('Please fill in all required fields for this step')
      toast.error('Please fill in all required fields for this step')
      return false
    }
    setFormError(null)
    return true
  }

  // Signup mutation
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
      // Example in developer-signup-form.tsx or applicant-signup-form.tsx
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step !== 3) return

    if (!agreedToTerms) {
      setFormError('You must agree to the Terms, Privacy Policy, and Fees')
      toast.error('You must agree to the Terms, Privacy Policy, and Fees')
      return
    }

    // Final validation
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

    try {
      await signupMutation.mutateAsync(formData)
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        'An unexpected error occurred. Please try again.'
      setFormError(message)
    }
  }

  // Step rendering
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="companyName">
                Company Name/Fullname<span className="text-red-500">*</span>
              </Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter your company name/fullname"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyDescription">
                Company Description<span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="companyDescription"
                name="companyDescription"
                value={formData.companyDescription}
                onChange={handleChange}
                placeholder="Describe your company or something you do?"
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">
                Years of Experience<span className="text-red-500">*</span>
              </Label>
              <Input
                id="yearsOfExperience"
                name="yearsOfExperience"
                type="number"
                min="0"
                value={formData.yearsOfExperience || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourcompany.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio</Label>
              <Input
                id="portfolio"
                name="portfolio"
                type="url"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button
                type="button"
                className="bg-[#7D1F2C]"
                onClick={() => {
                  if (validateStep1()) setStep(2)
                }}
              >
                Next
              </Button>
            </div>
          </>
        )
      case 2:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">
                Email<span className="text-red-500">*</span>
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
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">
                Phone Number<span className="text-red-500">*</span>
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div className="space-y-2">
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
            <div className="space-y-2">
              <Label htmlFor="companyLogo">Company Logo URL</Label>
              <Input
                id="companyLogo"
                name="companyLogo"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e)}
              />
            </div>
            <div className="flex justify-between mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                type="button"
                className="bg-[#7D1F2C]"
                onClick={() => {
                  if (validateStep2()) setStep(3)
                }}
              >
                Next
              </Button>
            </div>
          </>
        )
      case 3:
        return (
          <>
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) =>
                  setAgreedToTerms(checked === true)
                }
              />
              <Label htmlFor="terms" className="text-sm font-normal">
                I agree to the Terms, Privacy Policy, and Fees
              </Label>
            </div>
            <div className="flex justify-between mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="bg-[#7D1F2C] hover:bg-[#6a1a25] text-white"
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div>
      <p className="text-gray-600 mb-6">
        Start listing and selling properties today.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 pb-6">
        {formError && (
          <div className="text-red-500 text-sm text-center">{formError}</div>
        )}
        {renderStep()}
      </form>
      <div className="text-center text-sm mt-8">
        Already have an account?{' '}
        <Link href="/login" className="text-[#7D1F2C] hover:underline">
          Log in
        </Link>
      </div>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => {
          // Implement Google login logic here
        }}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
          <path d="M1 1h22v22H1z" fill="none" />
        </svg>
        Login with Google
      </Button>
    </div>
  )
}
