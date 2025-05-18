'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { MailAnimation } from '@/components/animations/mail-animations'
import { HandshakeAnimation } from '@/components/animations/handshake-animations'
import { useMutation } from '@tanstack/react-query'
import { verifyEmail } from '@/lib/services/auth.service'

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const token = searchParams.get('token') || ''
  const role = searchParams.get('role') || ''

  const [verificationStatus, setVerificationStatus] = useState<
    'pending' | 'loading' | 'success' | 'error'
  >('pending')
  const [errorMessage, setErrorMessage] = useState('')
  const [countdown, setCountdown] = useState(5)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [verificationAttempted, setVerificationAttempted] = useState(false)

  // Handle the redirect in a separate useEffect
  useEffect(() => {
    if (shouldRedirect) {
      router.push('/login')
    }
  }, [shouldRedirect, router])

  const verifyEmailMutation = useMutation({
    mutationFn: ({ email, token }: { email: string; token: string }) =>
      verifyEmail(email, token),
    onSuccess: () => {
      setVerificationStatus('success')
      toast.success('Email verified successfully! Redirecting to login...')

      // Start countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setShouldRedirect(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    },
    onError: (error: any) => {
      setVerificationStatus('error')
      const message =
        error?.response?.data?.message ||
        'Verification failed. Please try again.'
      setErrorMessage(message)
      toast.error(message)
    },
  })

  // Use useCallback to prevent recreation of this function on each render
  const attemptVerification = useCallback(() => {
    if (email && token && !verificationAttempted) {
      setVerificationStatus('loading')
      setVerificationAttempted(true)
      verifyEmailMutation.mutate({ email, token })
    }
  }, [email, token, verificationAttempted, verifyEmailMutation])

  // Only run once when the component mounts
  useEffect(() => {
    attemptVerification()
  }, [attemptVerification])

  return (
    <div className="flex min-h-screen flex-col bg-white overflow-hidden">
      <div className="flex min-h-screen overflow-hidden items-center">
        {/* Left side - Success message */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="py-6"
            >
              <div className="flex justify-center mb-6">
                {verificationStatus === 'success' ? (
                  <HandshakeAnimation />
                ) : (
                  <MailAnimation email={email} />
                )}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-center"
              >
                {verificationStatus === 'pending' && (
                  <>
                    <h2 className="text-2xl font-semibold mb-2 text-[#7C0A02]">
                      Check your email
                    </h2>
                    <p className="text-gray-700">
                      A verification link has been sent to{' '}
                      <span className="font-semibold">{email}</span>.<br />
                      {role && (
                        <span>
                          <span className="capitalize">{role}</span> account
                          registration successful.
                        </span>
                      )}
                      <br />
                      Please check your inbox and follow the instructions to
                      verify your account.
                      <span>
                        Cant't find the mail, Check your spam folder
                      </span>
                    </p>
                  </>
                )}

                {verificationStatus === 'loading' && (
                  <>
                    <h2 className="text-2xl font-semibold mb-2 text-[#7C0A02]">
                      Verifying your email
                    </h2>
                    <p className="text-gray-700">
                      Please wait while we verify your email address...
                    </p>
                    <div className="mt-4 flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C0A02]"></div>
                    </div>
                  </>
                )}

                {verificationStatus === 'success' && (
                  <>
                    <h2 className="text-2xl font-semibold mb-2 text-[#7C0A02]">
                      Email Verified Successfully!
                    </h2>
                    <p className="text-gray-700 mb-4">
                      Your account has been verified. You can now access all
                      features of our platform.
                    </p>
                    <p className="text-gray-600 mt-2">
                      Redirecting to login page in{' '}
                      <span className="font-bold">{countdown}</span> seconds...
                    </p>
                    <Link
                      href="/login"
                      className="inline-block mt-4 px-6 py-2 bg-[#7C0A02] text-white rounded-md hover:bg-[#5A0701] transition-colors"
                    >
                      Login Now
                    </Link>
                  </>
                )}

                {verificationStatus === 'error' && (
                  <>
                    <h2 className="text-2xl font-semibold mb-2 text-red-600">
                      Verification Failed
                    </h2>
                    <p className="text-gray-700 mb-4">
                      {errorMessage ||
                        'We could not verify your email address. The link may have expired or is invalid.'}
                    </p>
                    <Link
                      href="/auth/resend-verification"
                      className="inline-block px-6 py-2 bg-[#7C0A02] text-white rounded-md hover:bg-[#5A0701] transition-colors"
                    >
                      Resend Verification
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
        {/* Right side - Image and text */}
        <div className="hidden md:mx-32 lg:block bg-[#F1F1F1] relative w-[500px] h-[600px] overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70">
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

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  )
}
