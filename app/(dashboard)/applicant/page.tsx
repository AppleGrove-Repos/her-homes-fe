'use client'

import Image from 'next/image'
import {
  Calculator,
  Search,
  TrendingUp,
  Upload,
  Home,
  PiggyBank,
  Heart,
  Check,
  Clock,
  Banknote,
  Building,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/lib/store/auth.store'

export default function ApplicantDashboard() {
  const { user } = useAuth()
  return (
    <>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#64111F] to-[#C6203C] rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.fullName || 'User'}!
        </h1>
        <p className="text-[#DBEAFE] mb-6">
          {user?.fullName ? `${user.fullName.split(' ')[0]}, your` : 'Your'} home
          ownership journey is progressing well. Here's your latest update.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#FFFFFF]/20 rounded-lg p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-red-200 text-sm">Mortgage Status</p>
              <p className="font-semibold">Pre-approved</p>
            </div>
            <Home className="w-6 h-6 text-white fill-slate-50" />
          </div>

          <div className="bg-[#FFFFFF]/20  rounded-lg p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-red-200 text-sm">Savings Goal</p>
              <p className="font-semibold">₦2.5M / ₦5M</p>
            </div>
            <PiggyBank className="w-6 h-6 text-white fill-slate-50" />
          </div>

          <div className="bg-[#FFFFFF]/20  rounded-lg p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-red-200 text-sm">Properties Saved</p>
              <p className="font-semibold">12</p>
            </div>
            <Heart className="w-6 h-6 text-white fill-slate-50" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Building className="h-8 w-8 text-[#546B2F] mb-3 mx-auto  " />
              <p className="font-medium text-gray-900">Mortgage Calculator</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Search className="h-8 w-8 text-[#546B2F] mb-3 mx-auto" />
              <p className="font-medium text-gray-900">Search Properties</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-gray-600 mx-auto mb-3" />
              <p className="font-medium text-gray-900">Investment Portfolio</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 mx-auto text-[#546B2F] mb-3" />
              <p className="font-medium text-gray-900">Upload Documents</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Mortgage Application */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Mortgage Application
                </h3>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Pre-approved
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Personal Information
                    </p>
                    <p className="text-sm text-gray-500">Completed</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Financial Details
                    </p>
                    <p className="text-sm text-gray-500">Completed</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Document Verification
                    </p>
                    <p className="text-sm text-gray-500">In Review</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Final Approval</p>
                    <p className="text-sm text-gray-500">Pending</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Saved Properties */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Saved Properties
              </h3>
              <Button
                variant="ghost"
                className="text-[#546B2F] hover:text-[#3d4e22]"
              >
                View All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src="/placeholder.svg?height=200&width=300"
                    alt="Luxury Apartment"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Luxury Apartment
                  </h4>
                  <p className="text-sm text-gray-500 mb-2">
                    Victoria Island, Lagos
                  </p>
                  <p className="text-lg font-bold text-[#546B2F] mb-2">
                    ₦45,000,000
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>3 beds</span>
                    <span>2 baths</span>
                    <span>120 sqm</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src="/placeholder.svg?height=200&width=300"
                    alt="Modern Duplex"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Modern Duplex
                  </h4>
                  <p className="text-sm text-gray-500 mb-2">Gwarinpa, Abuja</p>
                  <p className="text-lg font-bold text-[#546B2F] mb-2">
                    ₦38,000,000
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>4 beds</span>
                    <span>3 baths</span>
                    <span>200 sqm</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recommended Properties */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recommended Properties
              </h3>
              <Button
                variant="ghost"
                className="text-[#546B2F] hover:text-[#3d4e22]"
              >
                View All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src="/placeholder.svg?height=200&width=300"
                    alt="Luxury Apartment"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Luxury Apartment
                  </h4>
                  <p className="text-sm text-gray-500 mb-2">
                    Victoria Island, Lagos
                  </p>
                  <p className="text-lg font-bold text-[#546B2F] mb-2">
                    ₦45,000,000
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>3 beds</span>
                    <span>2 baths</span>
                    <span>120 sqm</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src="/placeholder.svg?height=200&width=300"
                    alt="Modern Duplex"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Modern Duplex
                  </h4>
                  <p className="text-sm text-gray-500 mb-2">Gwarinpa, Abuja</p>
                  <p className="text-lg font-bold text-[#546B2F] mb-2">
                    ₦38,000,000
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>4 beds</span>
                    <span>3 baths</span>
                    <span>200 sqm</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Savings Goal */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Savings Goal
              </h3>
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-[#22C55E] mb-1">
                  ₦2,500,000
                </p>
                <p className="text-sm text-gray-500">of ₦5,000,000 goal</p>
              </div>

              <Progress value={50} className="mb-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Target</span>
                  <span className="font-medium">₦200,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-medium text-[#22C55E]">₦180,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time to Goal</span>
                  <span className="font-medium">14 months</span>
                </div>
              </div>

              <Button className="w-full mt-4 bg-[#64111F] hover:bg-red-900">
                Add to Savings
              </Button>
            </CardContent>
          </Card>

          {/* Investment Portfolio */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Investment Portfolio
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Real Estate Fund
                      </p>
                      <p className="text-sm text-gray-500">₦850,000</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-medium">+12.5%</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Banknote className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Fixed Deposit</p>
                      <p className="text-sm text-gray-500">₦500,000</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-medium">+8.2%</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 bg-[#546B2F] text-white hover:bg-green-700"
              >
                Manage Portfolio
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      Document uploaded
                    </p>
                    <p className="text-sm text-gray-500">
                      Bank statement verified
                    </p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Savings deposit</p>
                    <p className="text-sm text-gray-500">
                      ₦50,000 added to goal
                    </p>
                    <p className="text-xs text-gray-400">1 day ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Property saved</p>
                    <p className="text-sm text-gray-500">
                      Luxury Apartment in VI
                    </p>
                    <p className="text-xs text-gray-400">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
