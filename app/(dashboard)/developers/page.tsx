'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/store/auth.store'
import { getProperties } from '@/lib/services/developer/developer.services'
import { Building, FileText, MessageSquare, Eye } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

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
      <div className="flex items-center justify-center h-full">Loading...</div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>
        <p className="text-gray-600">
          Here's what's happening with your properties
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 flex flex-col items-center">
          <div className="p-3 bg-green-100 rounded-full mb-3">
            <Building className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-3xl font-bold">20</div>
          <p className="text-gray-500">Active Listings</p>
        </Card>

        <Card className="p-6 flex flex-col items-center">
          <div className="p-3 bg-blue-100 rounded-full mb-3">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-3xl font-bold">15</div>
          <p className="text-gray-500">Applications</p>
        </Card>

        <Card className="p-6 flex flex-col items-center">
          <div className="p-3 bg-yellow-100 rounded-full mb-3">
            <MessageSquare className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold">7</div>
          <p className="text-gray-500">Unread messages</p>
        </Card>

        <Card className="p-6 flex flex-col items-center">
          <div className="p-3 bg-purple-100 rounded-full mb-3">
            <Eye className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-3xl font-bold">1,254</div>
          <p className="text-gray-500">Property views</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Property Performance</h2>
        <div className="aspect-[3/1] bg-gray-100 rounded-md flex items-center justify-center">
          <p className="text-gray-500">
            Performance chart will be displayed here
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
              <div>
                <p>New application received for 123 Main Street</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
              <div>
                <p>Property listing updated: 456 Park Avenue</p>
                <p className="text-sm text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
              <div>
                <p>New message from potential buyer</p>
                <p className="text-sm text-gray-500">5 hours ago</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/dashboard/developer/properties/add"
              className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-gray-50 transition-colors"
            >
              <Building className="h-8 w-8 mb-2 text-[#7C0A02]" />
              <span>Add Property</span>
            </Link>
            <Link
              href="/dashboard/developer/applications"
              className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-8 w-8 mb-2 text-[#7C0A02]" />
              <span>View Applications</span>
            </Link>
            <Link
              href="/dashboard/developer/messages"
              className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="h-8 w-8 mb-2 text-[#7C0A02]" />
              <span>Send Message</span>
            </Link>
            <Link
              href="/dashboard/developer/settings"
              className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-8 w-8 mb-2 text-[#7C0A02]" />
              <span>View Reports</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
