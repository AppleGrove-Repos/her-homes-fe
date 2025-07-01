import { motion } from 'framer-motion'

export function LoadingSpinner({
  size = 20,
  color = '#fff',
}: {
  size?: number
  color?: string
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className="inline-block"
      aria-label="Loading"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
    >
      <circle
        cx="20"
        cy="20"
        r="16"
        stroke={color}
        strokeWidth="4"
        strokeDasharray="80"
        strokeDashoffset="60"
        strokeLinecap="round"
        opacity="0.3"
      />
      <circle
        cx="20"
        cy="20"
        r="16"
        stroke={color}
        strokeWidth="4"
        strokeDasharray="40"
        strokeDashoffset="20"
        strokeLinecap="round"
      />
    </motion.svg>
  )
}
export function LoadingSpinnerFullScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <LoadingSpinner size={40} color="#6B8E23" />
    </div>
  )
}