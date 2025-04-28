import Link from 'next/link'
import { Button } from '@/components/ui/button'
// import { Home } from 'lucide-react'
import MobileMenu from './mobile-menu'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="relative w-full py-3 px-4 md:px-6 lg:px-8 mb-10 bg-[#ffffff] shadow-lg  ">
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
          <Link href="#" className="text-sm font-medium hover:text-[#e6a287]">
            Browse Listings
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-[#e6a287]">
            Apply for Financing
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-[#e6a287]">
            Contact Us
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button className="bg-[#6e1a2c] hover:bg-[#5a1523] text-white rounded-md text-sm hidden md:inline-flex">
            Sign Up
          </Button>
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
