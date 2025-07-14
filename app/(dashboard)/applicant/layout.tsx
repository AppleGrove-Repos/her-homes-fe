'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation' // ⬅️ Added
import { useAuth } from '@/lib/store/auth.store'
import Header from '@/components/applicants/applicant-header'

export default function ApplicantDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated, fetchUser } = useAuth()
  const router = useRouter()
  const pathname = usePathname() // ⬅️ Get the current path
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!user) {
          await fetchUser()
          const currentUser = useAuth.getState().user
          if (!currentUser) {
            router.push('/login?redirect=/applicant')
            return
          }
          if (currentUser.role !== 'applicant') {
            router.push(`/${currentUser.role}`)
            return
          }
        } else if (user.role !== 'applicant') {
          router.push(`/${user.role}`)
          return
        }
        setIsLoading(false)
      } catch (error) {
        router.push('/login?redirect=/applicant')
      }
    }

    checkAuth()
  }, [user, router, fetchUser])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-red-800 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    )
  }

 
  const isListingPage = pathname.startsWith('/applicant/listing')


  return (
    <div className={isListingPage ? '' : 'min-h-screen bg-[#F5F1EB]'}>
      <Header />
      <main className={isListingPage ? '' : 'max-w-7xl mx-auto px-6 py-8'}>
        {children}
      </main>
    </div>
  )
}
