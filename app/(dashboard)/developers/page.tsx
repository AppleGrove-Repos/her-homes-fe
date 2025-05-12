'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/store/auth.store'
import { getProperties } from '@/lib/services/developer/developer.services'
import {
  Building,
  FileText,
  MessageSquare,
  Eye,
  TrendingUp,
  Users,
  Calendar,
  ArrowRight,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'

export default function DeveloperDashboard() {
  const { user } = useAuth()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties()
        setProperties(data || [])
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-[#FF9A8B] mb-4"></div>
          <p className="text-[#7C0A02] font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF0ED] to-white px-4 py-6 md:px-6 lg:px-8 space-y-6">
      <div className="bg-white rounded-xl p-6 border border-[#FFE4E0] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#333333]">
              Welcome back, <span className="text-[#7C0A02]">{user?.name}</span>
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your properties
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Today is</span>
            <span className="font-medium bg-[#FFF0ED] text-[#7C0A02] px-3 py-1 rounded-full">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border border-[#FFE4E0] shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 mb-1">Active Listings</p>
              <div className="text-3xl font-bold text-[#333333]">20</div>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> +2 this month
              </p>
            </div>
            <div className="p-3 bg-[#FFF0ED] rounded-full">
              <Building className="h-6 w-6 text-[#7C0A02]" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-[#FFE4E0] shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 mb-1">Applications</p>
              <div className="text-3xl font-bold text-[#333333]">15</div>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> +5 this week
              </p>
            </div>
            <div className="p-3 bg-[#FFF0ED] rounded-full">
              <FileText className="h-6 w-6 text-[#7C0A02]" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-[#FFE4E0] shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 mb-1">Unread Messages</p>
              <div className="text-3xl font-bold text-[#333333]">7</div>
              <p className="text-xs text-yellow-600 mt-2 flex items-center">
                <Users className="h-3 w-3 mr-1" /> From 3 applicants
              </p>
            </div>
            <div className="p-3 bg-[#FFF0ED] rounded-full">
              <MessageSquare className="h-6 w-6 text-[#7C0A02]" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-[#FFE4E0] shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 mb-1">Property Views</p>
              <div className="text-3xl font-bold text-[#333333]">1,254</div>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> +12% this week
              </p>
            </div>
            <div className="p-3 bg-[#FFF0ED] rounded-full">
              <Eye className="h-6 w-6 text-[#7C0A02]" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 border border-[#FFE4E0] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-xl font-bold text-[#333333] flex items-center">
            <span className="inline-block w-1.5 h-6 bg-[#FF9A8B] mr-2 rounded-full"></span>
            Property Performance
          </h2>
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <button className="text-sm px-3 py-1 rounded-full bg-[#FFF0ED] text-[#7C0A02] font-medium">
              Weekly
            </button>
            <button className="text-sm px-3 py-1 rounded-full text-gray-500 hover:bg-gray-100">
              Monthly
            </button>
            <button className="text-sm px-3 py-1 rounded-full text-gray-500 hover:bg-gray-100">
              Yearly
            </button>
          </div>
        </div>
        <div className="aspect-[3/1] bg-white rounded-md border border-[#FFE4E0] flex items-center justify-center p-4">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Image
              src="/placeholder.svg?height=200&width=600"
              alt="Performance Chart"
              width={600}
              height={200}
              className="opacity-70"
            />
            <p className="text-gray-500 mt-4">
              Performance data is being processed. Check back soon for insights.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border border-[#FFE4E0] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#333333] flex items-center">
              <span className="inline-block w-1.5 h-6 bg-[#FF9A8B] mr-2 rounded-full"></span>
              Recent Activity
            </h2>
            <Link
              href="/dashboard/developer/notifications"
              className="text-sm text-[#7C0A02] hover:underline flex items-center"
            >
              View all <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#FFF0ED] transition-colors">
              <div className="mt-1 h-2 w-2 rounded-full bg-[#7C0A02]"></div>
              <div className="flex-1">
                <p className="text-gray-800">
                  New application received for 123 Main Street
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" /> 2 hours ago
                  </p>
                  <button className="text-xs text-[#7C0A02] hover:underline">
                    View
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#FFF0ED] transition-colors">
              <div className="mt-1 h-2 w-2 rounded-full bg-[#7C0A02]"></div>
              <div className="flex-1">
                <p className="text-gray-800">
                  Property listing updated: 456 Park Avenue
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" /> 4 hours ago
                  </p>
                  <button className="text-xs text-[#7C0A02] hover:underline">
                    View
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#FFF0ED] transition-colors">
              <div className="mt-1 h-2 w-2 rounded-full bg-[#7C0A02]"></div>
              <div className="flex-1">
                <p className="text-gray-800">
                  New message from potential buyer
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" /> 5 hours ago
                  </p>
                  <button className="text-xs text-[#7C0A02] hover:underline">
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-[#FFE4E0] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#333333] flex items-center">
              <span className="inline-block w-1.5 h-6 bg-[#FF9A8B] mr-2 rounded-full"></span>
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/developers/properties/add"
              className="flex flex-col items-center justify-center p-4 border border-[#FFE4E0] rounded-lg hover:bg-[#FFF0ED] hover:shadow-sm transition-all duration-200"
            >
              <Building className="h-8 w-8 mb-2 text-[#7C0A02]" />
              <span className="text-center text-gray-800 font-medium">
                Add Property
              </span>
            </Link>
            <Link
              href="/developers/applications"
              className="flex flex-col items-center justify-center p-4 border border-[#FFE4E0] rounded-lg hover:bg-[#FFF0ED] hover:shadow-sm transition-all duration-200"
            >
              <FileText className="h-8 w-8 mb-2 text-[#7C0A02]" />
              <span className="text-center text-gray-800 font-medium">
                View Applications
              </span>
            </Link>
            <Link
              href="/developers/messages"
              className="flex flex-col items-center justify-center p-4 border border-[#FFE4E0] rounded-lg hover:bg-[#FFF0ED] hover:shadow-sm transition-all duration-200"
            >
              <MessageSquare className="h-8 w-8 mb-2 text-[#7C0A02]" />
              <span className="text-center text-gray-800 font-medium">
                Send Message
              </span>
            </Link>
            <Link
              href="/developers/settings"
              className="flex flex-col items-center justify-center p-4 border border-[#FFE4E0] rounded-lg hover:bg-[#FFF0ED] hover:shadow-sm transition-all duration-200"
            >
              <Eye className="h-8 w-8 mb-2 text-[#7C0A02]" />
              <span className="text-center text-gray-800 font-medium">
                View Reports
              </span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
