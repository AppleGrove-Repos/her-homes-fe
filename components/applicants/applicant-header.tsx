'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Bell, User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/store/auth.store'

interface ApplicantHeaderProps {
  notifications?: number
  onLogout?: () => void
}

export default function ApplicantHeader({
  notifications = 0,
  onLogout,
}: ApplicantHeaderProps) {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    if (onLogout) onLogout()
    router.push('/login')
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/assets/images/header-logo.png"
            alt="Her Homes"
            width={40}
            height={40}
            className="mr-20 md:ml-20"
          />
          {/* <nav className="hidden md:flex space-x-6">
            <a href="/listings" className="text-gray-700 hover:text-[#7C0A02]">
              Browse Listings
            </a>
            <a href="/financing" className="text-gray-700 hover:text-[#7C0A02]">
              Apply for Financing
            </a>
            <a href="/contact" className="text-gray-700 hover:text-[#7C0A02]">
              Contact Us
            </a>
          </nav> */}
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-auto">
                <div className="p-3 hover:bg-gray-50 cursor-pointer">
                  <p className="font-medium text-sm">Application Update</p>
                  <p className="text-xs text-gray-500">
                    Your application for 3-Bedroom Terrace Duplex has been
                    reviewed.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
                <div className="p-3 hover:bg-gray-50 cursor-pointer">
                  <p className="font-medium text-sm">New Property Match</p>
                  <p className="text-xs text-gray-500">
                    A new property matching your preferences is now available.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                </div>
                <div className="p-3 hover:bg-gray-50 cursor-pointer">
                  <p className="font-medium text-sm">Mortgage Pre-Approval</p>
                  <p className="text-xs text-gray-500">
                    Your mortgage pre-approval has been processed.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#7C0A02] text-xs"
                >
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                  {user?.profilePicture ? (
                    <Image
                      src={user.profilePicture || '/placeholder.svg'}
                      alt={user?.name || 'User'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="h-8 w-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500" />
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">
                    {user?.name
                      ? user.name
                      : user?.email
                      ? user.email.slice(0, 5)
                      : 'User'}
                  </p>
                  <p className="text-xs text-gray-500">Applicant</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push('/applicant/profile')}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push('/applicant/settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
