'use client'

import type React from 'react'

import { useState } from 'react'
import { Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useUploadProfilePicture } from '@/lib/services/applicant/applicant.service'
import { useQueryClient } from '@tanstack/react-query'
import { fileToBase64 } from '@/lib/services/applicant/applicant.service'
import { useToast } from '@/hooks/use-toast'

export function ProfilePictureUploader() {
  const { toast } = useToast()
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const uploadMutation = useUploadProfilePicture()
  const queryClient = useQueryClient()

  // Handle profile picture change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select an image under 5MB',
          variant: 'destructive',
        })
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file',
          variant: 'destructive',
        })
        return
      }

      setProfileImage(file)

      // Create preview URL
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileImage) return

    try {
      const base64String = await fileToBase64(profileImage)
      uploadMutation.mutate(base64String, {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Profile picture updated successfully',
          })
          setProfileImage(null)
          setPreviewUrl(null)

          queryClient.invalidateQueries({ queryKey: ['user'] })
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: error.message || 'Failed to update profile picture',
            variant: 'destructive',
          })
        },
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to convert image',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>
          Update your profile picture. This will be displayed on your profile
          and across the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
              <AvatarImage
                src={previewUrl || '/placeholder.svg?height=128&width=128'}
                alt="Profile"
              />
              <AvatarFallback>
                <Loader2 className="h-8 w-8 animate-spin" />
              </AvatarFallback>
            </Avatar>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture" className="text-center">
                Upload Picture
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!profileImage || uploadMutation.isPending}
              className="flex items-center gap-2"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Picture
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
