'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  ListFilter,
  PlusCircle,
  MessageSquare,
  Settings,
  FileText,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  userRole: 'developer' | 'applicant'
}

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Check if the sidebar state is stored in localStorage
  useEffect(() => {
    const storedState = localStorage.getItem('sidebarCollapsed')
    if (storedState) {
      setIsCollapsed(storedState === 'true')
    }
  }, [])

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString())
  }, [isCollapsed])

  // Define menu items based on user role
  const developerMenuItems = [
    {
      title: 'Dashboard',
      url: '/developers',
      icon: Home,
    },
    {
      title: 'My Listings',
      url: '/developers/listing',
      icon: ListFilter,
    },
    {
      title: 'Add New Property',
      url: '/developers/properties/add',
      icon: PlusCircle,
    },
    {
      title: 'Application',
      url: '/developers/applications',
      icon: FileText,
    },
    {
      title: 'Messages',
      url: '/developers/messages',
      icon: MessageSquare,
    },
    {
      title: 'Account Settings',
      url: '/developers/settings',
      icon: Settings,
    },
  ]

  const applicantMenuItems = [
    {
      title: 'Dashboard',
      url: '/dashboard/applicant',
      icon: Home,
    },
    {
      title: 'Browse Properties',
      url: '/applicant/properties',
      icon: ListFilter,
    },
    {
      title: 'My Applications',
      url: '/applicant/applications',
      icon: FileText,
    },
    {
      title: 'Messages',
      url: '/applicant/messages',
      icon: MessageSquare,
    },
    {
      title: 'Account Settings',
      url: '/applicant/settings',
      icon: Settings,
    },
  ]

  const menuItems =
    userRole === 'developer' ? developerMenuItems : applicantMenuItems

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <>
      {/* Mobile Menu Toggle Button - Only visible on small screens */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={toggleMobileMenu}
          variant="ghost"
          size="icon"
          className="bg-white shadow-md border border-[#FFE4E0] rounded-full h-10 w-10 flex items-center justify-center"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5 text-[#7C0A02]" />
          ) : (
            <Menu className="h-5 w-5 text-[#7C0A02]" />
          )}
        </Button>
      </div>

      {/* Sidebar - Hidden on mobile unless toggled */}
      <div
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed inset-y-0 left-0 z-40 ${
          isCollapsed ? 'w-20' : 'w-64'
        } bg-white border-r border-[#FFE4E0] flex flex-col transition-all duration-300 ease-in-out shadow-lg lg:shadow-none`}
      >
        <div
          className={`p-4 border-b border-[#FFE4E0] bg-gradient-to-r from-[#FFF0ED] to-white flex ${
            isCollapsed ? 'justify-center' : 'justify-between'
          } items-center`}
        >
          {!isCollapsed && (
            <Link href={`/${userRole}`} className="flex items-center">
              <Image
                src="/assets/images/header-logo.png"
                alt="Her Homes"
                width={40}
                height={40}
                className="mr-0"
              />
              <span className="ml-2 text-xl font-bold text-[#7C0A02]">
                Her Homes
              </span>
            </Link>
          )}
          {isCollapsed && (
            <Link
              href={`/${userRole}`}
              className="flex items-center justify-center"
            >
              <Image
                src="/assets/images/header-logo.png"
                alt="Her Homes"
                width={40}
                height={40}
              />
            </Link>
          )}
          {!isCollapsed && (
            <Button
              onClick={toggleCollapse}
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-[#FFF0ED]"
            >
              <ChevronLeft className="h-5 w-5 text-[#7C0A02]" />
            </Button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-white to-[#FFF0ED]/30">
          <ul className="space-y-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.url
              return (
                <li key={item.title}>
                  <Link
                    href={item.url}
                    className={`flex items-center ${
                      isCollapsed ? 'justify-center' : ''
                    } p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-[#7C0A02] text-white shadow-md'
                        : 'text-gray-700 hover:bg-[#FFF0ED] hover:text-[#7C0A02] hover:shadow-sm'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    title={isCollapsed ? item.title : ''}
                  >
                    <item.icon
                      className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'} ${
                        isActive ? 'text-white' : 'text-[#FF9A8B]'
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="font-medium">{item.title}</span>
                    )}
                    {!isCollapsed && isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div
          className={`p-4 border-t border-[#FFE4E0] bg-white ${
            isCollapsed ? 'flex justify-center' : ''
          }`}
        >
          {!isCollapsed ? (
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#FFF0ED] flex items-center justify-center text-[#7C0A02]">
                <Settings className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">Account</p>
                <p className="text-xs text-gray-500">
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </p>
              </div>
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded-full bg-[#FFF0ED] flex items-center justify-center text-[#7C0A02]"
              title="Account"
            >
              <Settings className="h-5 w-5" />
            </div>
          )}
        </div>

        {/* Collapse toggle button - Only visible when sidebar is collapsed */}
        {isCollapsed && (
          <Button
            onClick={toggleCollapse}
            variant="ghost"
            size="icon"
            className="absolute -right-4 top-20 h-8 w-8 rounded-full bg-white border border-[#FFE4E0] shadow-md hover:bg-[#FFF0ED]"
          >
            <ChevronRight className="h-5 w-5 text-[#7C0A02]" />
          </Button>
        )}
      </div>

      {/* Overlay for mobile - only visible when mobile menu is open */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  )
}
