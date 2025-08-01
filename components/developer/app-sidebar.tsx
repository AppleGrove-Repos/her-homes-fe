'use client'

import type * as React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Home,
  Building2,
  PlusCircle,
  FileText,
  MessageSquare,
  Settings,
  User,
  Bell,
  TrendingUp,
  Search,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarRail,
} from '@/components/ui/sidebar'

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole: 'developer' | 'applicant'
}

const developerMenuItems = [
  {
    title: 'Dashboard',
    url: '/developers',
    icon: Home,
    badge: null,
  },
  {
    title: 'My Listings',
    url: '/developers/listing',
    icon: Building2,
    badge: '24',
  },
  {
    title: 'Add Property',
    url: '/developers/properties/add',
    icon: PlusCircle,
    badge: null,
  },
  {
    title: 'Applications',
    url: '/developers/applications',
    icon: FileText,
    badge: '8',
  },
  {
    title: 'Messages',
    url: '/developers/messages',
    icon: MessageSquare,
    badge: '3',
  },
]

const quickActions = [
  {
    title: 'Analytics',
    url: '/developers/analytics',
    icon: TrendingUp,
  },
  {
    title: 'Search',
    url: '/developers/search',
    icon: Search,
  },
  {
    title: 'Notifications',
    url: '/developers/notifications',
    icon: Bell,
  },
]

export function AppSidebar({ userRole, ...props }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/developers" className="flex items-center">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg ">
                  <Image
                    src="/assets/images/header-logo.png"
                    alt="Her Homes"
                    width={24}
                    height={24}
                    className="size-6"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-black">
                    Her Homes
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {developerMenuItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={
                        isActive
                          ? 'bg-[#546B2F] text-white hover:bg-[#3d4e22]'
                          : 'hover:bg-green-50'
                      }
                    >
                      <Link href={item.url} className="flex items-center">
                        <item.icon
                          className={`size-4 ${isActive ? 'text-white' : ''}`}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge className="bg-green-100 text-green-700 border-green-200">
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-green-700 font-medium">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.url} className="flex items-center">
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Account Settings">
              <Link href="/developers/settings" className="flex items-center">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-green-100 text-green-700">
                  <User className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Account</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Settings & Profile
                  </span>
                </div>
                <Settings className="size-4 text-muted-foreground" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
