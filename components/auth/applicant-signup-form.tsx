'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
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
    password: '',
    role: 'applicant',
    fullName: '',
    termsAccepted: true,
  })

  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
    setFormError(null)

    if (!agreedToTerms) {
      toast.error('You must agree to the Terms, Privacy Policy, and Fees')
      return
    }

    // Validate required fields
    if (
      !formData.fullName.trim() ||
      !formData.email ||
      !formData.password
    ) {
      toast.error('Please fill in all required fields')
       setFormError('Please fill in all required fields')
      return
    }
    console.log(formData)

    try {
      await signupMutation.mutateAsync({
        ...formData,
        termsAccepted: true, 
      })
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        'An unexpected error occurred. Please try again.'
      setFormError(message)
    }
  }

  // Generate year options (100 years back from current year)


  // Step rendering
  return (
    <div className="h-[400px]">
      <p className="text-gray-600 mb-2 text-[14px]">
        Start your journey to owning your dream home today.
      </p>
      <form onSubmit={handleSubmit} className="space-y-2 pb-2">
        {formError && (
          <div className="text-red-500 text-sm text-center">{formError}</div>
        )}
        <div className="space-y-1">
          <Label htmlFor="fulName">
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
        {formData.fullName &&
          formData.email &&
          formData.password &&
           (
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
