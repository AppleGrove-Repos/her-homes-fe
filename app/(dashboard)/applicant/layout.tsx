'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/store/auth.store'
import ApplicantHeader from '@/components/applicants/applicant-header'


export default function ApplicantDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated, fetchUser } = useAuth()
  const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if we already have a user in the store
        if (!user) {
          // If not, try to fetch the user
          await fetchUser()

          // After fetching, check again if we have a user
          const currentUser = useAuth.getState().user

          if (!currentUser) {
            console.log('No user found after fetch, redirecting to login')
            router.push('/login?redirect=/applicant')
            return
          }

          // Check if user has the correct role
          if (currentUser.role !== 'applicant') {
            console.log(`User has role ${currentUser.role}, redirecting`)
            router.push(`/${currentUser.role}`)
            return
          }
        } else if (user.role !== 'applicant') {
          // If we already have a user but wrong role
          console.log(`User has role ${user.role}, redirecting`)
          router.push(`/${user.role}`)
          return
        }

        // If we reach here, authentication is successful
        setIsLoading(false)
      } catch (error) {
        console.error('Authentication check failed:', error)
        router.push('/login?redirect=/developers')
      }
    }

    checkAuth()
  }, [user, router, fetchUser]) // Ensure dependencies are correct


  // If not authenticated, show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F1F1F1]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#7C0A02] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <ApplicantHeader notifications={3} />
      {children}
    </>
  )
}
