'use client'

import type React from 'react'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/store/auth.store'

export default function ApplicantDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated, fetchUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        if (!isAuthenticated) {
          await fetchUser()

          if (!user) {
            router.push('/login?redirect=/applicant')
          } else if (user.role !== 'applicant') {
            // Redirect to appropriate dashboard if not an applicant
            router.push(`/dashboard/${user.role}`)
          }
        } else if (user && user.role !== 'applicant') {
          // Redirect if authenticated but not an applicant
          router.push(`/dashboard/${user.role}`)
        }
      } catch (error) {
        console.error('Authentication check failed:', error)
        router.push('/login')
      }
    }

    checkAuth()
  }, [isAuthenticated, user, router, fetchUser])

  // If not authenticated, show loading state
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F1F1F1]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#7C0A02] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
