'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/store/auth.store'
import { useMutation } from '@tanstack/react-query'
import { loginUser } from '@/lib/services/auth.service'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import Button from '@/components/common/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Link    from 'next/link'
import { Key, Lock, Unlock } from 'lucide-react'

interface LoginType {
  email: string
  password: string
}

export default function Login() {
  const [rememberMe, setRememberMe] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [animationComplete, setAnimationComplete] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/'
  const action = searchParams.get('action') || ''
  const { fetchUser, setToken } = useAuth()
  const formRef = useRef<HTMLDivElement>(null)
  const [animationStep, setAnimationStep] = useState(0)

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginType>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { mutateAsync: _signIn, isPending: _signingIn } = useMutation({
    mutationKey: ['auth', 'sign-in'],
    mutationFn: loginUser,
    onSuccess(data) {
      console.log('Login successful:', data) // Debugging
      toast.success('Signed in successfully')
      if (data?.access_token) {
        setToken(data.access_token)
        fetchUser()

        let redirectPath = searchParams.get('redirect') || '/'
        if (!redirectPath.startsWith('/')) {
          redirectPath = '/'
        }
        console.log(`Redirecting to: ${redirectPath}`) // Debugging
        router.push(redirectPath)
      }
    },
    onError(error: unknown) {
      console.error('Login error:', error) // Debugging
      setErrorMessage(
        'Unable to sign in. Please check your credentials and try again.'
      )
      toast.error('Authentication failed. Please try again.')
    },
  })

  const submit = async (formData: LoginType) => {
    try {
      setErrorMessage(null)
      await _signIn(formData)
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  useEffect(() => {
    // Simple animation sequence with steps
    const timer1 = setTimeout(() => {
      setAnimationStep(1)
    }, 800)

    const timer2 = setTimeout(() => {
      setAnimationStep(2)
    }, 1600)

    const timer3 = setTimeout(() => {
      setAnimationStep(3)
    }, 2400)

    const timer4 = setTimeout(() => {
      setAnimationComplete(true)
    }, 3000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [])

  // Get the destination name from the redirect URL for display
  const getDestinationName = () => {
    const redirectPath = searchParams.get('redirect') || ''

    if (redirectPath.includes('/listings/') && action === 'view-more') {
      return 'view property details'
    } else if (redirectPath.includes('/listings') && action === 'view-more') {
      return 'browse more properties'
    } else if (action === 'contact') {
      return 'contact an agent'
    } else if (action === 'mortgage') {
      return 'apply for a mortgage'
    }

    return 'continue'
  }

  return (
    <div className="flex min-h-screen flex-col bg-white overflow-hidden">
      <div className="flex min-h-screen items-center">
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center mt-8 p-8 relative">
          {/* Custom CSS Animation Container */}
          <div
            className={`w-full max-w-md mb-6 transition-all duration-700 ${
              animationComplete
                ? 'opacity-0 scale-90 -translate-y-10'
                : 'opacity-100'
            }`}
          >
            <div className="w-full h-64 flex justify-center items-center relative">
              {/* House outline */}
              <div className="relative w-48 h-48 flex justify-center items-center">
                {/* House base */}
                <div
                  className={`absolute w-40 h-32 border-4 border-[#7C0A02] rounded-md bottom-0 
                  transition-all duration-500 ${
                    animationStep >= 0 ? 'opacity-100' : 'opacity-0'
                  } 
                  ${
                    animationStep >= 1
                      ? 'bg-gray-100'
                      : 'bg-transparent border-dashed'
                  }`}
                ></div>

                {/* Roof */}
                <div
                  className={`absolute w-48 h-24 bottom-28 transition-all duration-500 
                  ${animationStep >= 0 ? 'opacity-100' : 'opacity-0'}
                  ${
                    animationStep >= 1
                      ? 'bg-[#7C0A02]'
                      : 'border-4 border-dashed border-[#7C0A02]'
                  }`}
                  style={{
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  }}
                ></div>

                {/* Door */}
                <div
                  className={`absolute w-10 h-16 border-4 rounded-t-md bottom-0 
                  transition-all duration-500 ${
                    animationStep >= 0 ? 'opacity-100' : 'opacity-0'
                  }
                  ${
                    animationStep >= 1
                      ? 'bg-[#7C0A02] border-[#7C0A02]'
                      : 'bg-transparent border-dashed border-[#7C0A02]'
                  }`}
                ></div>

                {/* Windows */}
                <div
                  className={`absolute w-8 h-8 border-4 rounded-sm bottom-16 -left-12 
                  transition-all duration-500 ${
                    animationStep >= 0 ? 'opacity-100' : 'opacity-0'
                  }
                  ${
                    animationStep >= 1
                      ? 'bg-blue-100 border-[#7C0A02]'
                      : 'bg-transparent border-dashed border-[#7C0A02]'
                  }`}
                ></div>
                <div
                  className={`absolute w-8 h-8 border-4 rounded-sm bottom-16 -right-12 
                  transition-all duration-500 ${
                    animationStep >= 0 ? 'opacity-100' : 'opacity-0'
                  }
                  ${
                    animationStep >= 1
                      ? 'bg-blue-100 border-[#7C0A02]'
                      : 'bg-transparent border-dashed border-[#7C0A02]'
                  }`}
                ></div>

                {/* Key animation */}
                <div
                  className={`absolute transition-all duration-500 
                  ${animationStep >= 2 ? 'opacity-100' : 'opacity-0'}
                  ${animationStep === 2 ? '-right-40' : 'right-0'}
                  ${animationStep >= 3 ? 'scale-0' : 'scale-100'}`}
                >
                  <Key
                    size={40}
                    className={`text-yellow-600 transition-transform duration-500 ${
                      animationStep >= 2 ? 'animate-pulse' : ''
                    }`}
                  />
                </div>

                {/* Lock/Unlock icon */}
                <div
                  className={`absolute bottom-8 transition-all duration-300 
                  ${animationStep < 3 ? 'opacity-100' : 'opacity-0'}`}
                >
                  <Lock size={20} className="text-gray-700" />
                </div>
                <div
                  className={`absolute bottom-8 transition-all duration-300 
                  ${animationStep >= 3 ? 'opacity-100' : 'opacity-0'}`}
                >
                  <Unlock size={20} className="text-green-600" />
                </div>

                {/* Sparkles */}
                {animationStep >= 3 && (
                  <>
                    <div className="absolute -top-4 -left-4 animate-ping">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    </div>
                    <div className="absolute top-8 -right-8 animate-ping delay-100">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    </div>
                    <div className="absolute -bottom-4 left-8 animate-ping delay-200">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <p className="text-center text-lg font-medium text-[#7C0A02] animate-pulse">
              {animationStep < 1
                ? 'Drawing your blueprint...'
                : animationStep < 2
                ? 'Building your dream home...'
                : animationStep < 3
                ? 'Finding your key...'
                : 'Unlocking your future home...'}
            </p>
          </div>

          {/* Form container with animation */}
          <div
            ref={formRef}
            className={`w-full max-w-md transition-all duration-700 transform ${
              animationComplete
                ? 'translate-y-0 opacity-100'
                : 'translate-y-20 opacity-0 pointer-events-none'
            } ${
              animationComplete ? 'absolute top-8 md:relative md:top-0' : ''
            }`}
          >
            <button
              onClick={() => router.back()}
              className="mb-4 text-sm text-[#7C0A02] hover:underline flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              Back
            </button>
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-gray-600">
              Log in to continue your journey to homeownership.
            </p>

            {/* Show redirect destination if available */}
            {redirectUrl && redirectUrl !== '/' && (
              <div className="mt-2 text-sm text-[#7C0A02] bg-red-50 p-2 rounded-md border border-red-100">
                Sign in to {getDestinationName()}
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md mb-4 mt-4 flex items-start">
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

            <form onSubmit={handleSubmit(submit)} className="space-y-6 mt-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="w-full"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className="w-full"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#7C0A02] focus:ring-[#7C0A02] border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-[#7C0A02] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                loading={_signingIn}
                fullWidth
                className="w-full text-white text-sm bg-[#7C0A02] hover:bg-[#600000]"
              >
                {_signingIn ? 'Logging in...' : 'Log in'}
              </Button>
            </form>
              <p className="mt-8 text-center text-sm text-gray-600">
                          Don&apos;t have an account?{' '}
                          <Link
                            href="/signup"
                            className="text-[#7C0A02] hover:underline font-semibold"
                          >
                            Sign up
                          </Link>
                        </p>
          </div>
        </div>
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
