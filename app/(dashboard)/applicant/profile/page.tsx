'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { User, Mail, Edit, Upload, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/lib/store/auth.store'
import { useToast } from '@/hooks/use-toast'

export default function ApplicantProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfileImage(file)
      setProfileImageUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would send this data to your API
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
    })

    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      {/* Header */}
      

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6 pl-0 text-[#7C0A02]"
          onClick={() => router.push('/applicant')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Profile header */}
          <div className="bg-[#7C0A02] h-32 relative">
            <div className="absolute -bottom-16 left-8 h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white">
              {profileImageUrl || user?.profilePicture ? (
                <Image
                  src={profileImageUrl || user?.profilePicture || ''}
                  alt={user?.fullName || 'User'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-200">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
              )}

              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer">
                  <Upload className="h-8 w-8 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            <div className="absolute bottom-4 right-6">
              <Button
                variant={isEditing ? 'default' : 'outline'}
                className={
                  isEditing
                    ? 'bg-white text-[#7C0A02]'
                    : 'bg-white text-[#7C0A02] border-white'
                }
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="mr-2 h-4 w-4" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </div>

          {/* Profile content */}
          <div className="pt-20 px-8 pb-8">
            <form onSubmit={handleSubmit}>
              {isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="max-w-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="max-w-md"
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="bg-[#7C0A02] hover:bg-[#600000]"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold mb-1">
                    {user?.fullName || 'User Name'}
                  </h1>
                  <p className="text-gray-500 mb-6">Applicant</p>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">
                          {user?.email || 'email@example.com'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>

            <Separator className="my-8" />

            {/* Account activity */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Account Activity</h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Last Login</p>
                    <p className="text-sm text-gray-500">Today, 10:30 AM</p>
                  </div>
                  <div className="text-sm text-gray-500">Lagos, Nigeria</div>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Account Created</p>
                    <p className="text-sm text-gray-500">January 15, 2023</p>
                  </div>
                  <div className="text-sm text-gray-500">Lagos, Nigeria</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
