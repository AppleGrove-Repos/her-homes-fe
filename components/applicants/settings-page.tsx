'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'

import { ProfilePictureUploader } from '@/components/applicants/profile-picture-upload'
import { PasswordChangeForm } from '@/components/applicants/password-page-form'
import { Button } from '@/components/ui/button'
import {  ArrowLeft } from 'lucide-react'

export default function ProfilePage() {
     const router = useRouter()
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 pl-0 text-[#7C0A02]"
          onClick={() => router.push('/applicant')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="profile">Profile Picture</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfilePictureUploader />
          </TabsContent>

          <TabsContent value="security">
            <PasswordChangeForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
