'use client'

import type React from 'react'
import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/common/button'
import BackButton from '@/components/common/button/back-button'
import { Input } from '@/components/ui/input'
import { verifyResetToken, resetPassword } from '@/lib/services/auth.service'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [tokenVerified, setTokenVerified] = useState(false)
  const [verifying, setVerifying] = useState(true)

  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const token = searchParams.get('token') || ''

  // Verify token when component mounts
  useEffect(() => {
    async function checkToken() {
      // If no email or token is provided, redirect to forgot password page
      if (!email || !token) {
        toast.error('Invalid reset link. Please request a new one.')
        router.push('/forgot-password')
        return
      }

      try {
        setVerifying(true)
        // Verify the token is valid
        await verifyResetToken(email, token)
        setTokenVerified(true)
        setVerifying(false)
      } catch (error: any) {
        console.error('Token verification error:', error)
        toast.error('Invalid or expired reset link. Please request a new one.')
        router.push('/forgot-password')
      }
    }

    checkToken()
  }, [email, token, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      await resetPassword({
        email,
        token,
        password,
      })

      setIsLoading(false)
      setResetSuccess(true)
      toast.success('Password reset successful!')

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error: any) {
      setIsLoading(false)
      setErrorMessage(
        error.message || 'Failed to reset password. Please try again.'
      )
      toast.error(
        error.message || 'Failed to reset password. Please try again.'
      )
    }
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col bg-white overflow-hidden">
          <div className="flex min-h-screen overflow-hidden items-center">
            {/* Left side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
              <div className="w-full max-w-md">
                {verifying ? (
                  <div className="text-center py-8">
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 border-4 border-[#7C0A02] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h2 className="text-2xl font-semibold mb-2 text-[#7C0A02]">
                      Verifying your reset link
                    </h2>
                    <p className="text-gray-700 mb-6">
                      Please wait while we verify your password reset link...
                    </p>
                  </div>
                ) : tokenVerified && !resetSuccess ? (
                  <>
                    <div className="mb-8">
                      <BackButton />
                      <h1 className="text-3xl font-bold mb-2">
                        Reset your password
                      </h1>
                      <p className="text-gray-600 mt-9">
                        Please enter a new password for your account.
                      </p>
                    </div>

                    {errorMessage && (
                      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md mb-4 flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium"
                        >
                          Email address
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          disabled
                          className="w-full bg-gray-100 border-gray-100 py-4"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium"
                        >
                          New Password
                        </label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-gray-100 border-gray-100 py-4 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                          >
                            {showPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium"
                        >
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full bg-gray-100 border-gray-100 py-4 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        loading={isLoading}
                        fullWidth
                        className="w-full text-white text-sm bg-[#7C0A02] hover:bg-[#600000]"
                      >
                        Reset Password
                      </Button>
                    </form>
                  </>
                ) : resetSuccess ? (
                  <div className="text-center py-8">
                    <div className="flex justify-center mb-6">
                      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <h2 className="text-2xl font-semibold mb-2 text-[#7C0A02]">
                      Password Reset Successful!
                    </h2>
                    <p className="text-gray-700 mb-6">
                      Your password has been reset successfully. You will be
                      redirected to the login page shortly.
                    </p>
                  </div>
                ) : null}

                <p className="mt-8 text-center text-sm text-gray-600">
                  Remember your password?{' '}
                  <Link
                    href="/login"
                    className="text-[#7C0A02] hover:underline font-semibold"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>
            {/* Right side - Image and text */}
            <div className="hidden md:mx-32 lg:block bg-[#F1F1F1] relative w-[500px] h-[600px] overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20">
                <Image
                  src="/assets/images/login.png"
                  alt="Home interior"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-12 text-white text-center items-center">
                <h2 className="text-3xl font-bold mb-4">
                  Discovering the Perfect Place to Call Home Has Never Been This
                  Easy
                </h2>
                <p className="mb-6">
                  Our mission is to help you explore, find, and settle into
                  homes that match your lifestyle, preferences, and dreams — all
                  in just a few clicks.
                </p>
                <div className="flex flex-wrap gap-3 items-center">
                  <span className="inline-flex items-center md:ml-12 px-3 py-1 rounded-full text-sm border border-white/30 bg-black/20">
                    <svg
                      className="w-4 h-4 mr-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Trusted Agent
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm border border-white/30 bg-black/20">
                    Available Across Nigeria
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    ></Suspense>
  )
}
