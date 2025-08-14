'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import VerificationSuccess from '@/components/auth/verification-success'

function VerificationSuccessContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  return <VerificationSuccess email={email} />
}

export default function VerificationSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerificationSuccessContent />
    </Suspense>
  )
}
