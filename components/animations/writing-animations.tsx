'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export const WritingAnimation = () => {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 500)
    const timer2 = setTimeout(() => setStep(2), 1000)
    const timer3 = setTimeout(() => setStep(3), 1500)
    const timer4 = setTimeout(() => setStep(4), 2000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [])

  return (
    <div className="w-64 h-64 relative">
      {/* Paper */}
      <motion.div
        className="absolute w-48 h-60 bg-white rounded-md shadow-lg border border-gray-200"
        initial={{ rotate: -5, y: 20 }}
        animate={{ rotate: 0, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Lines on paper */}
        <div className="w-full h-full px-4 pt-8 flex flex-col gap-4">
          <motion.div
            className="h-0.5 bg-blue-100 w-full"
            initial={{ width: '0%' }}
            animate={{ width: step >= 1 ? '100%' : '0%' }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="h-0.5 bg-blue-100 w-full"
            initial={{ width: '0%' }}
            animate={{ width: step >= 2 ? '80%' : '0%' }}
            transition={{ duration: 0.3, delay: 0.5 }}
          />
          <motion.div
            className="h-0.5 bg-blue-100 w-full"
            initial={{ width: '0%' }}
            animate={{ width: step >= 3 ? '90%' : '0%' }}
            transition={{ duration: 0.3, delay: 1 }}
          />
          <motion.div
            className="h-0.5 bg-blue-100 w-full"
            initial={{ width: '0%' }}
            animate={{ width: step >= 4 ? '60%' : '0%' }}
            transition={{ duration: 0.3, delay: 1.5 }}
          />
        </div>
      </motion.div>

      {/* Pencil */}
      <motion.div
        className="absolute w-8 h-48 origin-bottom"
        initial={{ rotate: 45, x: 60, y: -40 }}
        animate={{
          rotate:
            step === 1
              ? 30
              : step === 2
              ? 35
              : step === 3
              ? 25
              : step === 4
              ? 40
              : 45,
          x: step >= 1 ? 40 : 60,
          y: step >= 1 ? -20 : -40,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-2 h-32 bg-yellow-400 rounded-t-sm"></div>
        <div className="w-2 h-4 bg-pink-300 rounded-b-sm"></div>
        <div className="w-2 h-0 border-l-[4px] border-r-[4px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-700"></div>
      </motion.div>

      {/* Envelope appearing at the end */}
      <motion.div
        className="absolute top-16 left-16"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: step >= 4 ? 1 : 0,
          opacity: step >= 4 ? 1 : 0,
        }}
        transition={{ duration: 0.5, delay: 2 }}
      >
        <div className="w-16 h-12 bg-[#7C0A02] rounded-md relative">
          <div className="absolute inset-0.5 bg-white rounded-sm flex items-center justify-center">
            <div className="text-[#7C0A02] font-bold text-xs">SENT</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
