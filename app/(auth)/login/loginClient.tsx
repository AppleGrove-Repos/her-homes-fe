'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/lib/store/auth.store'
import  Button  from '@/components/common/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { LoginType } from '@/lib/types/auth'
import { useMutation } from '@tanstack/react-query'
import { loginUser } from '@/lib/services/auth.service'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
// import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import Header from '@/components/landing/header'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  
  const searchParams = useSearchParams()

  // Get redirect URL from query params if available
  const router = useRouter()
  const { fetchUser, setToken } = useAuth()
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<LoginType>({
    defaultValues: {
      role: 'User',
    },
  })

  const { mutateAsync: _signIn, isPending: _signingIn } = useMutation({
    mutationKey: ['auth', 'sign-in'],
    mutationFn: loginUser,
    onSuccess() {
      toast.success('Signed in successfully')
      router.push('/dashboard')
    },
  })

  const submit = async (e: LoginType) => {
    const data = await _signIn(e)
    setToken(data?.access_token as string)
    fetchUser()
  }


  // const handleGoogleLogin = async () => {
  //   try {
  //     await loginWithGoogle()
  //     // Redirect happens in the loginWithGoogle function
  //   } catch (error) {
  //     console.error('Google login error:', error)
  //   }
  // }

  return (
    <div className="flex min-h-screen flex-col bg-white overflow-hidden">
      <Header />
      <div className="flex min-h-screen">
        {/* Left side - Login form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <Link href="/">
                <Image
                  src="/assets/images/header-logo.png"
                  alt="Her Homes Logo"
                  width={20}
                  height={50}
                  className="mb-8"
                />
              </Link>
              <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
              <p className="text-gray-600">
                Log in to continue your journey to homeownership.
              </p>
            </div>

            <form onSubmit={handleSubmit(submit)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                    className="mr-2"
                  />
                  <label htmlFor="remember-me" className="text-sm">
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#7C0A02] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                loading={_signingIn}
                fullWidth
                className="w-full text-white text-sm bg-[#7C0A02] hover:bg-[#600000]"
              >
                {' '}
                <>Log in</>
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
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
                fullWidth
                className="w-full text-sm small mt-4 flex items-center justify-center"
                // onClick={handleGoogleLogin}
                // disabled={isLoading}
              >
                <Image
                  src="/assets/images/google.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2 inline-block small"
                />
                Login with Google
              </Button>
            </div>

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

        {/* Right side - Image and text */}
        <div className="hidden md:mx-32 lg:block  bg-[#F1F1F1] relative  w-[500px] h-[600px] overflow-hidden rounded-2xl">
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
              <span className="inline-flex items-center md:ml-32 px-3 py-1 rounded-full text-sm border border-white/30 bg-black/20">
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
