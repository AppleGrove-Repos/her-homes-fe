'use client'

import type React from 'react'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/store/auth.store'
import Sidebar from '@/components/developer/sidebar'
import UserNav from '@/components/developer/user-nav'

export default function DeveloperDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated, fetchUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      fetchUser().then(() => {
        if (!user) {
          router.push('/login')
        } else if (user.role !== 'developer') {
          // Redirect to appropriate dashboard if not a developer
          router.push('/applicant')
        }
      })
    } else if (user && user.role !== 'developer') {
      // Redirect if authenticated but not a developer
      router.push('applicant')
    }
  }, [isAuthenticated, user, router, fetchUser])

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="developer" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Her Homes</h1>
          <UserNav user={user} />
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
