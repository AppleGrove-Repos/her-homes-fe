'use client'

import type React from 'react'

import { useState } from 'react'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { https } from '@/lib/config/axios.config'
import { useAuth } from '@/lib/hooks/use-auth'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

interface DeveloperSignupData {
  email: string
  phoneNumber: string
  password: string
  role: 'developer'
  companyName: string
  companyLogo: string
  companyDescription: string
  yearsOfExperience: number
  website: string
  portfolio: string
}

export default function DeveloperSignupForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
   const [formError, setFormError] = useState<string | null>(null)

  const [formData, setFormData] = useState<DeveloperSignupData>({
    email: '',
    phoneNumber: '',
    password: '',
    role: 'developer',
    companyName: '',
    companyLogo: '',
    companyDescription: '',
    yearsOfExperience: 0,
    website: '',
    portfolio: '',
  })

  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Update form data
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    if (name === 'yearsOfExperience') {
      setFormData({
        ...formData,
        [name]: Number.parseInt(value) || 0,
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

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: async (data: DeveloperSignupData) => {
      try {
        console.log('Sending data to API:', data)
        const response = await https.post('/auth/signup/developer', data)

        return response.data
      } catch (error: any) {
        console.error('API Error:', error.response?.data || error.message)
        throw error
      }
    },
    onSuccess: async (data) => {
      toast.success('Account created successfully')

      // After successful signup, log the user in
      try {
        await login(formData.email, formData.password)
        router.push('/developer/dashboard')
      } catch (error: any) {
        console.error('Error logging in after signup:', error)
        toast.error(
          "Account created but couldn't log you in automatically. Please log in manually."
        )
        router.push('/login')
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || 'Signup failed. Please try again.'
      toast.error(errorMessage)
      console.error('Signup error:', error)
    },
  })

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreedToTerms) {
      toast.error('You must agree to the Terms, Privacy Policy, and Fees')
      return
    }

    // Validate required fields
    if (
      !formData.companyName ||
      !formData.companyDescription ||
      !formData.email ||
      !formData.password ||
      !formData.phoneNumber
    ) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      await signupMutation.mutateAsync(formData)
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        'An unexpected error occurred. Please try again.'

      // Set this in state to display in the UI
      setFormError(message)
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
        <div className="space-y-2">
          <Label htmlFor="companyName">
            Company Name<span className="text-red-500">*</span>
          </Label>
          <Input
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Enter your company name"
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
            placeholder="Describe your company"
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
            type="url"
            value={formData.companyLogo}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
          />
        </div>

        <div className="flex items-start space-x-2 pt-2">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
          />
          <Label htmlFor="terms" className="text-sm font-normal">
            I agree to the Terms, Privacy Policy, and Fees
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#7D1F2C] hover:bg-[#6a1a25] text-white"
          disabled={signupMutation.isPending}
        >
          {signupMutation.isPending ? 'Signing Up...' : 'Sign Up'}
        </Button>

        <div className="text-center text-sm">
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
      </form>
    </div>
  )
}
