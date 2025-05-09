'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  ListFilter,
  PlusCircle,
  MessageSquare,
  Settings,
  FileText,
} from 'lucide-react'

interface SidebarProps {
  userRole: 'developer' | 'applicant'
}

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()

  // Define menu items based on user role
  const developerMenuItems = [
    {
      title: 'Dashboard',
      url: '/dashboard/developer',
      icon: Home,
    },
    {
      title: 'My Listings',
      url: '/dashboard/developer/listings',
      icon: ListFilter,
    },
    {
      title: 'Add New Property',
      url: '/dashboard/developer/properties/add',
      icon: PlusCircle,
    },
    {
      title: 'Application',
      url: '/dashboard/developer/applications',
      icon: FileText,
    },
    {
      title: 'Messages',
      url: '/dashboard/developer/messages',
      icon: MessageSquare,
    },
    {
      title: 'Account Settings',
      url: '/dashboard/developer/settings',
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
      url: '/dashboard/applicant/properties',
      icon: ListFilter,
    },
    {
      title: 'My Applications',
      url: '/dashboard/applicant/applications',
      icon: FileText,
    },
    {
      title: 'Messages',
      url: '/dashboard/applicant/messages',
      icon: MessageSquare,
    },
    {
      title: 'Account Settings',
      url: '/dashboard/applicant/settings',
      icon: Settings,
    },
  ]

  const menuItems =
    userRole === 'developer' ? developerMenuItems : applicantMenuItems

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b">
        <Link href={`/dashboard/${userRole}`} className="flex items-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 16H4L16 4L28 16H24"
              stroke="#7C0A02"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 16V26C8 26.5304 8.21071 27.0391 8.58579 27.4142C8.96086 27.7893 9.46957 28 10 28H22C22.5304 28 23.0391 27.7893 23.4142 27.4142C23.7893 27.0391 24 26.5304 24 26V16"
              stroke="#7C0A02"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="ml-2 text-xl font-bold">Her Homes</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.url
            return (
              <li key={item.title}>
                <Link
                  href={item.url}
                  className={`flex items-center p-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-[#7C0A02] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
