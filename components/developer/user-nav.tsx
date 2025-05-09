'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/store/auth.store'
import { Bell, User, Settings, LogOut } from 'lucide-react'

interface UserNavProps {
  user: {
    name: string
    email: string
    profilePicture?: string
  }
}

export default function UserNav({ user }: UserNavProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const { logout } = useAuth()

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
    if (notificationsOpen) setNotificationsOpen(false)
  }

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen)
    if (dropdownOpen) setDropdownOpen(false)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <button
          onClick={toggleNotifications}
          className="p-2 rounded-full hover:bg-gray-100 relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {notificationsOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20 border border-gray-200">
            <div className="p-3 border-b border-gray-200">
              <h3 className="font-semibold">Notifications</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <div className="p-3 border-b border-gray-100 hover:bg-gray-50">
                <p className="text-sm">
                  New application received for your property.
                </p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
              <div className="p-3 border-b border-gray-100 hover:bg-gray-50">
                <p className="text-sm">
                  Your property listing has been approved.
                </p>
                <p className="text-xs text-gray-500 mt-1">Yesterday</p>
              </div>
            </div>
            <div className="p-3 text-center text-sm">
              <Link
                href="/notifications"
                className="text-[#7C0A02] hover:underline"
              >
                View all notifications
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-3 focus:outline-none"
          aria-label="User menu"
        >
          <div className="flex-shrink-0">
            {user.profilePicture ? (
              <Image
                src={user.profilePicture || '/placeholder.svg'}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-[#7C0A02] flex items-center justify-center text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium">{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 border border-gray-200">
            <div className="py-2">
              <Link
                href="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                <User className="h-4 w-4 mr-2" />
                My Account
              </Link>
              <Link
                href="/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
