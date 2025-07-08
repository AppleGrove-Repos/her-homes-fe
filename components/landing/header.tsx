'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
// import { Home } from 'lucide-react'
import MobileMenu from './mobile-menu'
import Image from 'next/image'

import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

   const dropdownVariants = {
     initial: {
       opacity: 0,
       y: -10,
       scale: 0.96,
       filter: 'blur(6px)',
     },
     animate: {
       opacity: 1,
       y: 0,
       scale: 1,
       filter: 'blur(0px)',
       transition: {
         type: 'spring',
         stiffness: 250,
         damping: 22,
         delayChildren: 0.2,
         staggerChildren: 0.04,
       },
     },
     exit: {
       opacity: 0,
       y: -8,
       scale: 0.95,
       filter: 'blur(4px)',
       transition: {
         duration: 0.2,
         ease: [0.4, 0, 0.2, 1],
       },
     },
   }

   const itemVariants = {
     initial: { opacity: 0, y: -4 },
     animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
   }
  return (
    <header className="relative w-full md:py-3 py-[-20px] px-4 md:px-6 lg:px-8 mb-10 bg-[#ffffff] shadow-lg  ">
      <div className="absolute top-[600px] -right-[100px] w-[400px] h-72 z-0 pointer-events-none filter blur-md">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#F7A192"
            fillOpacity="0.3"
            d="M42.8,-65.2C54.9,-56.3,63.8,-43.2,70.2,-28.7C76.7,-14.2,80.8,1.7,77.7,16.3C74.6,30.9,64.3,44.2,51.5,54.1C38.7,64,23.3,70.5,7.4,72.1C-8.5,73.7,-24.9,70.4,-39.7,63C-54.5,55.6,-67.7,44.1,-74.4,29.4C-81.1,14.7,-81.3,-3.2,-76.2,-19.1C-71.1,-35,-60.7,-48.9,-47.4,-57.7C-34.1,-66.5,-17,-70.2,-0.6,-69.3C15.9,-68.4,30.7,-74.1,42.8,-65.2Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
      <div className="absolute -top-[70px] -left-[60px] w-[400px] h-72 z-0 pointer-events-none filter blur-lg">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#F7A192"
            fillOpacity="0.3"
            d="M54.6,-75.3C71.2,-67.3,85.2,-52.6,90.8,-35.4C96.4,-18.2,93.6,1.5,87.4,19.8C81.2,38.1,71.6,55,57.5,65.9C43.4,76.8,24.8,81.7,5.9,79.9C-13,78.1,-26,69.6,-39.9,60.5C-53.8,51.4,-68.6,41.7,-76.2,27.7C-83.8,13.7,-84.2,-4.6,-78.3,-20.1C-72.4,-35.6,-60.2,-48.3,-46.1,-57.1C-32,-65.9,-16,-70.8,1.2,-72.5C18.4,-74.2,36.8,-72.7,54.6,-75.3Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
      <div className="container mx-auto flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-[#e6a287]">
            <Image
              src="/assets/images/header-logo.png"
              alt="footer-logo"
              width={100}
              height={100}
              className="h-10 w-auto object-contain align-middle"
            />
          </div>
          <span className="text-base font-medium hidden sm:block">
            Her Homes
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/listings"
            className="text-sm font-medium hover:text-[#e6a287]"
          >
            Properties
          </Link>
          <div
            className="relative inline-block"
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
          >
            {/* Trigger Button */}
            <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Partners
              <ChevronDown
                className={`h-4 w-4 transform transition-transform duration-300 ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Content */}
            <AnimatePresence>
              {open && (
                <motion.div
                  variants={dropdownVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute left-0 mt-2 w-52 origin-top-left bg-white/70 backdrop-blur-md drop-shadow-md rounded-xl py-2 z-50"
                >
                  {[
                    { label: 'Communities', href: '/partners/banks' },
                    { label: 'Mortgage Institutions', href: '/partners/developers' },
                    { label: 'Real Estate Agents', href: '/signup' },
                    { label: 'Become a Partner', href: '/partnership' },
                  ].map((item, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <Link
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-black/5 rounded-md transition"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/apply-for-financing"
            className="text-sm font-medium hover:text-[#e6a287]"
          >
            About us
          </Link>
          <Link
            href="/contact-us"
            className="text-sm font-medium hover:text-[#e6a287]"
          >
            Contact Us
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" passHref legacyBehavior>
            <Button className="bg-transparent border-[#6e1a2c] hover:bg-[#5a1523] text-black hover:text-white rounded-md text-sm hidden md:inline-flex">
              Login
            </Button>
          </Link>
          <Link href="/signup" passHref legacyBehavior>
            <Button className="bg-[#6e1a2c] hover:bg-[#5a1523] text-white rounded-md text-sm hidden md:inline-flex">
              Sign Up
            </Button>
          </Link>

          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
