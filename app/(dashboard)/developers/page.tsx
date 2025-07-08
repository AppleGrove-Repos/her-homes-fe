'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/store/auth.store'
import { getProperties } from '@/lib/services/developer/developer.services'
import {
  Building,
  FileText,
  MessageSquare,
  Eye,
  Home,
  TrendingUp,
  Users,
  Plus,
  Search,
  Upload,
  Bell,
  Heart,
  PiggyBank,
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
          <div className="h-12 w-12 rounded-full bg-green-500 mb-4"></div>
          <p className="text-green-700 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F1EB] p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#546B2F] to-[#8CB34F] rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-[25px] font-bold mb-2">
              Welcome back, {user?.name || 'Alex'}!
            </h1>
            <p className="text-green-100 text-[15px]">
              Here's what's happening with your properties
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 h-[100px]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Active listings</p>
                <div className="text-[20px] font-bold">20</div>
              </div>
              {/* <div className="p-3 bg-white/20 rounded-full"> */}
              <Home className="h-8 w-8" fill="white" stroke="#fffff" />
              {/* </div> */}
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 h-[100px]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Income Generated</p>
                <div className="text-[20px] font-bold inline">₦2.5M</div>
                <p className="text-green-200 text-[20px] inline">/ ₦5M</p>
              </div>
              {/* <div className="p-3 bg-white/20 rounded-full"> */}
              <PiggyBank className="h-8 w-8" fill="white" stroke="#fffff" />
              {/* </div> */}
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 h-[100px]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Properties Sold</p>
                <div className="text-[20px] font-bold">12</div>
              </div>
              {/* <div className="p-3 bg-white/20 rounded-full"> */}
              <Heart className="h-8 w-8" fill="white" stroke="#fffff" />
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 bg-transparent border-none shadow-none">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/developers/properties/add"
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition-all duration-200 group"
          >
            {/* <div className="p-3 bg-green-100 rounded-full mb-3 group-hover:bg-green-200"> */}
            <Building className="h-8 w-8 text-[#546B2F] mb-3" />
            {/* </div> */}
            <span className="text-center text-gray-700 font-medium">
              Add Property
            </span>
          </Link>

          <Link
            href="/developers/listing"
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition-all duration-200 group"
          >
            {/* <div className="p-3 bg-green-100 rounded-full mb-3 group-hover:bg-green-200"> */}
            <Search className="h-8 w-8 text-[#546B2F] mb-3" />
            {/* </div> */}
            <span className="text-center text-gray-700 font-medium">
              View Listings
            </span>
          </Link>

          <Link
            href="/developers/messages"
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition-all duration-200 group"
          >
            {/* <div className="p-3 bg-green-100 rounded-full mb-3 group-hover:bg-green-200"> */}
            <MessageSquare className="h-8 w-8 text-[#546B2F] mb-3" />
            {/* </div> */}
            <span className="text-center text-gray-700 font-medium">
              Unread Messages
            </span>
          </Link>

          <Link
            href="/developers/documents"
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition-all duration-200 group"
          >
            {/* <div className="p-3 bg-green-100 rounded-full mb-3 group-hover:bg-green-200"> */}
            <FileText className="h-8 w-8 text-[#546B2F] mb-3" />
            {/* </div> */}
            <span className="text-center text-gray-700 font-medium">
              Upload Documents
            </span>
          </Link>
        </div>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mortgage Application Volume */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Mortgage Application Volume
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="text-gray-500">
                Chart visualization would appear here
              </p>
            </div>
          </div>
        </Card>

        {/* User Type Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            User Type Breakdown
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <Users className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="text-gray-500">Pie chart would appear here</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Properties */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Saved Properties
            </h3>
            <Link
              href="/developers/saved"
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Image
                src="/placeholder.svg?height=80&width=120"
                alt="Property"
                width={120}
                height={80}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Luxury Apartment</h4>
                <p className="text-sm text-gray-600">Victoria Island, Lagos</p>
                <p className="text-lg font-semibold text-green-600 mt-1">
                  ₦45,000,000
                </p>
                <p className="text-xs text-gray-500">
                  3 beds • 2 baths • 120 sqm
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Image
                src="/placeholder.svg?height=80&width=120"
                alt="Property"
                width={120}
                height={80}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Modern Duplex</h4>
                <p className="text-sm text-gray-600">Gwarinpa, Abuja</p>
                <p className="text-lg font-semibold text-green-600 mt-1">
                  ₦38,000,000
                </p>
                <p className="text-xs text-gray-500">
                  4 beds • 3 baths • 200 sqm
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Applications & Pending Verifications */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Recent Applications
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-green-600">SJ</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sarah Johnson</p>
                  <p className="text-xs text-gray-500">2 bedroom apartment</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Pending
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-green-600">MC</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Michael Chen</p>
                  <p className="text-xs text-gray-500">3 bedroom house</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Approved
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Pending Verifications
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">ID Verification</p>
                    <p className="text-xs text-gray-500">James Wilson</p>
                  </div>
                </div>
                <button className="text-blue-600 text-xs hover:underline">
                  Review
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Address Proof</p>
                    <p className="text-xs text-gray-500">BuildCorp Ltd.</p>
                  </div>
                </div>
                <button className="text-blue-600 text-xs hover:underline">
                  Review
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
