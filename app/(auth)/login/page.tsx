// app/login/page.tsx
'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import LoadingSpinner from '@/components/loading-spinner'

const Login = dynamic(() => import('@/app/(auth)/login/loginClient'), {
  ssr: false,
})

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Login />
    </Suspense>
  )
}
