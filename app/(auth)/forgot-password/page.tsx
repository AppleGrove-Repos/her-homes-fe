'use client'

import type React from 'react'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/common/button'
import BackButton from '@/components/common/button/back-button'
import { Input } from '@/components/ui/input'
import { Mail } from 'lucide-react'
import { forgotPassword } from '@/lib/services/auth.service'
import toast from 'react-hot-toast'
import { WritingAnimation } from '@/components/animations/writing-animations'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      await forgotPassword(email)
      setIsLoading(false)
      setEmailSent(true)
      toast.success('Password reset link sent to your email')
    } catch (error: any) {
      setIsLoading(false)
      setErrorMessage(
        error.message || 'Failed to send reset email. Please try again.'
      )
      toast.error(
        error.message || 'Failed to send reset email. Please try again.'
      )
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white overflow-hidden">
      <div className="flex min-h-screen overflow-hidden items-center">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
          <div className="w-full max-w-md">
            {/* Only show header and tagline if emailSent is false */}
            {!emailSent && (
              <div className="mb-8">
                <BackButton />
                <h1 className="text-3xl font-bold mb-2">
                  Forgot your password?
                </h1>
                <p className="text-gray-600 mt-9">
                  Don't know your password? Reset it after confirming your email
                  address.
                </p>
              </div>
            )}

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

            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email address
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-gray-100 border-gray-100 py-4 pr-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail size={20} />
                    </span>
                  </div>
                </div>
                <Button
                  type="submit"
                  loading={isLoading}
                  fullWidth
                  className="w-full text-white text-sm bg-[#7C0A02] hover:bg-[#600000]"
                >
                  Send Reset Link
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="py-6"
              >
                <div className="flex justify-center mb-6">
                  <WritingAnimation />
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-center"
                >
                  <h2 className="text-2xl font-semibold mb-2 text-[#7C0A02]">
                    Check your email
                  </h2>
                  <p className="text-gray-700">
                    A verification link has been sent to{' '}
                    <span className="font-semibold">{email}</span>.<br />
                    Please check your inbox and follow the instructions to reset
                    your password.
                  </p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="mt-6"
                  >
                    <p className="text-sm text-gray-500">
                      Click the link in your email to continue with the password
                      reset process.
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

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
              Our mission is to help you explore, find, and settle into homes
              that match your lifestyle, preferences, and dreams — all in just a
              few clicks.
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
  )
}
