'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/store/auth.store'
import {
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Plus,
} from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface DeveloperHeaderProps {
  user: {
    fullName: string
    email: string
    profilePicture?: string
  } | null
}

export function DeveloperHeader({ user }: DeveloperHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const notifications = [
    {
      id: 1,
      title: 'New Application Received',
      message: 'Sarah Johnson applied for your 3-bedroom apartment',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Property Approved',
      message: 'Your luxury duplex listing has been approved',
      time: 'Yesterday',
      unread: true,
    },
    {
      id: 3,
      title: 'Payment Received',
      message: 'Monthly payment received for Victoria Island property',
      time: '2 days ago',
      unread: false,
    },
  ]

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 sm:gap-4 border-b border-gray-200 bg-white px-3 sm:px-4 shadow-sm">
      {/* Sidebar Trigger */}
      <SidebarTrigger className="-ml-1 text-green-600 hover:bg-green-50" />

      {/* Mobile Layout */}
      <div className="flex md:hidden flex-1 items-center justify-between">
        {/* Mobile Search */}
        <div className="relative flex-1 max-w-[200px] mr-2">
          <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-7 h-8 text-xs border-gray-300 focus:border-green-500 focus:ring-green-500/20"
          />
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-1">
          {/* Mobile Notifications */}
          <DropdownMenu
            open={notificationsOpen}
            onOpenChange={setNotificationsOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-green-50 h-8 w-8"
              >
                <Bell className="h-4 w-4 text-gray-600" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 p-0 text-xs text-white flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 sm:w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span className="text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 text-xs"
                  >
                    {unreadCount} new
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start p-3 cursor-pointer"
                  >
                    <div className="flex w-full items-start justify-between">
                      <div className="flex-1 pr-2">
                        <p
                          className={`text-xs sm:text-sm ${
                            notification.unread
                              ? 'font-semibold'
                              : 'font-normal'
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.time}
                        </p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/developers/notifications"
                  className="w-full text-center text-green-600 hover:text-green-700 text-sm"
                >
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-1 hover:bg-green-50 px-2 h-8"
              >
                {user?.profilePicture ? (
                  <Image
                    src={user.profilePicture || '/placeholder.svg'}
                    alt={user.fullName || 'User'}
                    width={24}
                    height={24}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-medium">
                    {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user?.fullName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || ''}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/developers/profile" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/developers/settings" className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1 items-center justify-between">
        {/* Desktop Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search properties, applications..."
            className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500/20"
          />
        </div>

        {/* Desktop Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Add Button */}
          {/* <Button
            asChild
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
          >
            <Link
              href="/developers/properties/add"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden lg:inline">Add Property</span>
              <span className="lg:hidden">Add</span>
            </Link>
          </Button> */}

          {/* Desktop Notifications */}
          <DropdownMenu
            open={notificationsOpen}
            onOpenChange={setNotificationsOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-green-50"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 p-0 text-xs text-white flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700"
                  >
                    {unreadCount} new
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start p-3 cursor-pointer"
                  >
                    <div className="flex w-full items-start justify-between">
                      <div className="flex-1">
                        <p
                          className={`text-sm ${
                            notification.unread
                              ? 'font-semibold'
                              : 'font-normal'
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.time}
                        </p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/developers/notifications"
                  className="w-full text-center text-green-600 hover:text-green-700"
                >
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-green-50 px-3"
              >
                <div className="flex items-center gap-3">
                  {user?.profilePicture ? (
                    <Image
                      src={user.profilePicture || '/placeholder.svg'}
                      alt={user.fullName || 'User'}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-medium">
                      {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.fullName || 'User'}
                    </div>
                    <div className="text-xs text-gray-500 max-w-[120px] truncate">
                      {user?.email || ''}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user?.fullName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || ''}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/developers/profile" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/developers/settings" className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
