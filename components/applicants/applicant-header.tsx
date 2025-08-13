import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'

export function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/assets/images/header-logo.png"
            alt="Her Homes Logo"
            width={40}
            height={40}
            className="h-6 w-6"
          />
          <span className="text-xl font-semibold text-gray-900">Her Homes</span>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            Properties
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            Mortgage
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            Savings
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            Investments
          </a>
        </nav>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 p-2">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src="/placeholder.svg?height=32&width=32"
                  alt="User profile"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
