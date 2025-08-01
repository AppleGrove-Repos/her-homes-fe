'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Menu, Home, DollarSign, Shield, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/store/auth.store'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export default function Header() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Mobile Menu Trigger */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[270px] sm:w-[300px] flex flex-col bg-gradient-to-b from-white to-gray-50 px-6 py-5"
          >
            {/* Top Welcome Section */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <Image
                src="/assets/images/header-logo.png"
                width={36}
                height={36}
                alt="Her Homes"
              />
              <div>
                <p className="text-sm text-muted-foreground">Welcome back,</p>
                <h2 className="text-base font-semibold">
                  {user?.fullName || 'User'}
                </h2>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-2 py-6">
              <Link
                href="/applicant/properties"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
              >
                <Home className="text-primary" />
                <span className="text-base font-medium">Browse Properties</span>
              </Link>
              <Link
                href="/applicant/mortgage"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
              >
                <DollarSign className="text-primary" />
                <span className="text-base font-medium">My Mortgage</span>
              </Link>
              <Link
                href="/applicant/savings"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
              >
                <Shield className="text-primary" />
                <span className="text-base font-medium">Savings</span>
              </Link>
              <Link
                href="/applicant/investments"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
              >
                <Shield className="text-primary" />
                <span className="text-base font-medium">Investments</span>
              </Link>
            </nav>

            {/* CTA Button */}
            <Button className="w-full bg-[#64111F] text-white hover:bg-red-700 rounded-lg text-sm py-2">
              Make a New Investment
            </Button>

            {/* Bottom User Snippet */}
            <div className="mt-auto pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#64111F] text-white rounded-full flex items-center justify-center font-semibold">
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.fullName}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-3 text-sm text-red-500 hover:underline"
              >
                Log out
              </button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link
          href="/applicant"
          className="flex items-center gap-2 md:ml-0 ml-4"
        >
          <Image
            src="/assets/images/header-logo.png"
            alt="Her Homes Logo"
            width={40}
            height={40}
            className="h-6 w-6"
          />
          <span className="text-[15px] font-semibold text-gray-900">
            Her Homes
          </span>
        </Link>

        {/* Desktop links and profile dropdown are hidden for brevity */}
      </div>
    </header>
  )
}
