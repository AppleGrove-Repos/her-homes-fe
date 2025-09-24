'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

interface VerificationSuccessProps {
  email: string
}

export default function VerificationSuccess({
  email,
}: VerificationSuccessProps) {
  const router = useRouter()

  const handleProceedToVerifyEmail = () => {
    router.push(
      `/account/verify?email=${encodeURIComponent(email)}&role=developer`
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Success Message */}
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 text-sm">
              Your submission has been received. We'll review and contact you
              shortly.
            </p>
          </div>

          {/* Verification Card */}
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Verification In Progress
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our team is currently reviewing your documents. You'll be receive
              a feedback from us in 2-3 business days.
            </p>
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceedToVerifyEmail}
            className="w-full bg-[#7D1F2C] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#6B1A24] transition-colors"
          >
            Proceed to verify your email
          </button>
        </motion.div>
      </div>
    </div>
  )
}
