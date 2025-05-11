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
import Image from 'next/image'
import { useAuth } from '@/lib/store/auth.store'

interface SidebarProps {
  userRole: 'developer' | 'applicant'
}


export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()

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

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b">
        <Link href={`/${userRole}`} className="flex items-center">
          <Image
            src="/assets/images/header-logo.png"
            alt="Her Homes"
            width={40}
            height={40}
            className="mr-0"
          />
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
