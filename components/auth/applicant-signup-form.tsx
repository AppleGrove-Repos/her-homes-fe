'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { https } from '@/lib/config/axios.config'
// import { useAuth } from '@/lib/services/use-auth'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { ApplicantSignupData  } from '@/lib/types/auth'
import { authApi, publicApi } from '@/lib/config/axios.instance'



export default function ApplicantSignupForm() {
  const router = useRouter()
  // const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState<ApplicantSignupData>({
    email: '',
    phoneNumber: '',
    password: '',
    role: 'applicant',
    firstName: '',
    lastName: '',
    gender: 'male',
    dateOfBirth: '',
    annualIncome: '',
    employmentStatus: '',
    location: '',
  })

  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Update form data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  useEffect(() => {
    if (day && month && year) {
      const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(
        2,
        '0'
      )}T00:00:00.000Z`
      setFormData((prev) => ({
        ...prev,
        dateOfBirth: dateStr,
      }))
    }
  }, [day, month, year])

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: async (data: ApplicantSignupData) => {
      try {
        const response = await publicApi.post('/auth/signup/applicant', data)
        return response.data
      } catch (error: unknown) {
        throw error
      }
    },
    onSuccess: async (data) => {
      toast.success('Account created successfully')
      setShowPassword(false)
      // Redirect to verify email page
      // Example in developer-signup-form.tsx or applicant-signup-form.tsx
      router.push(
        `/account/verify?email=${encodeURIComponent(
          formData.email
        )}&role=${formData.role}`
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
      toast.error('You must agree to the Terms, Privacy Policy, and Fees')
      return
      
    }

    // Validate required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.phoneNumber ||
      !formData.location ||
      !formData.employmentStatus ||
      !formData.dateOfBirth
    ) {
      toast.error('Please fill in all required fields')
      return
    }
    console.log(formData)

    try {
      await signupMutation.mutateAsync(formData)
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        'An unexpected error occurred. Please try again.'
      setFormError(message)
    }
  }

  // Generate year options (100 years back from current year)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i)

  // Generate month options
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ]

  // Employment status options
  const employmentStatusOptions = [
    { value: 'employed', label: 'Employed' },
    { value: 'self-employed', label: 'Self-employed' },
    { value: 'unemployed', label: 'Unemployed' },
    { value: 'student', label: 'Student' },
    { value: 'retired', label: 'Retired' },
  ]
  const validateStep1 = () => {
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.gender ||
      !day ||
      !month ||
      !year
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
      !formData.employmentStatus ||
      !formData.annualIncome ||
      !formData.location.trim()
    ) {
      setFormError('Please fill in all required fields for this step')
      toast.error('Please fill in all required fields for this step')
      return false
    }
    setFormError(null)
    return true
  }

  // Step rendering
  const applicantSignup = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">
                Gender<span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange('gender', value)}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                Date of birth<span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  type="number"
                  min="1"
                  max="31"
                  placeholder="Day"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  required
                />
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                type="button"
                className="bg-[#7D1F2C] "
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
              <Label htmlFor="employmentStatus">
                Employment status<span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.employmentStatus}
                onValueChange={(value) =>
                  handleSelectChange('employmentStatus', value)
                }
              >
                <SelectTrigger id="employmentStatus">
                  <SelectValue placeholder="Select your employment status" />
                </SelectTrigger>
                <SelectContent>
                  {employmentStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="annualIncome">
                Annual income<span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-400 font-bold">NGN</span>
                </div>
                <Input
                  id="annualIncome"
                  name="annualIncome"
                  type="number" 
                  min="0"
                  step="0.01"
                  className="pl-14"
                  value={formData.annualIncome || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">
                Location<span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your location"
                required
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
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                className="w-4 h-4 text-[#7D1F2C] border-[#7D1F2C] rounded focus:ring-[#7D1F2C]
                data-[state=checked]:bg-[#546B2F]
                data-[state=checked]:border-none
                data-[state=checked]:text-white"
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
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 flex items-center text-[#7D1F2C] hover:underline"
      >
        {/* Optional: Add a left arrow icon */}
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>
      <p className="text-gray-600 mb-6">
        Start your journey to owning your dream home today.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 pb-6">
        {formError && (
          <div className="text-red-500 text-sm text-center">{formError}</div>
        )}
        {applicantSignup()}
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
