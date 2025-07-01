import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface DropdownOption {
  label: string
  value: string
}

interface AnimatedDropdownProps {
  label: string
  options: DropdownOption[]
  selected: string | null
  setSelected: (val: string) => void
}

export function AnimatedDropdown({
  label,
  options,
  selected,
  setSelected,
}: AnimatedDropdownProps) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-sm text-gray-700 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#6B8E23] transition-all">
        {selected ? options.find((o) => o.value === selected)?.label : label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: 'spring',
                stiffness: 250,
                damping: 20,
                delayChildren: 0.1,
                staggerChildren: 0.05,
              },
            }}
            exit={{
              opacity: 0,
              y: -6,
              scale: 0.95,
              transition: {
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1],
              },
            }}
            className="absolute left-0 w-full bg-white backdrop-blur-md drop-shadow-md mt-2 rounded-md py-2 z-40"
          >
            {options.map((opt) => (
              <motion.div
                key={opt.value}
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                onClick={() => {
                  setSelected(opt.value)
                  setOpen(false)
                }}
                className="px-4 py-2 text-sm text-gray-700 cursor-pointer"
              >
                {opt.label}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
