// components/loading-spinner.tsx
'use client'

import { Loader2 } from 'lucide-react'

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-6 w-6 animate-spin text-[#7C0A02]" />
      <span className="ml-2 text-[#7C0A02]">Loading...</span>
    </div>
  )
}
