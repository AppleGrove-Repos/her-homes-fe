'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { useAuth } from '@/lib/store/auth.store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function Header() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/applicant" className="flex items-center gap-2">
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

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/applicant/listing"
            className="text-[#0F0F0F] hover:text-gray-900 font-medium"
          >
            Properties
          </Link>
          <Link
            href="/applicant/mortgage"
            className="text-[#0F0F0F] hover:text-gray-900 font-medium"
          >
            Mortgage
          </Link>
          <Link
            href="/applicant/savings"
            className="text-[#0F0F0F] hover:text-gray-900 font-medium"
          >
            Savings
          </Link>
          <Link
            href="/applicant/investments"
            className="text-[#0F0F0F] hover:text-gray-900 font-medium"
          >
            Investments
          </Link>
        </nav>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 h-auto p-2"
            >
              {user?.profilePicture ? (
                <Image
                  src={user.profilePicture || '/placeholder.svg'}
                  alt={user.fullName || 'User'}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-medium">
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.fullName || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || ''}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/applicant/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/applicant/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
