// API service for user profile operations
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { https } from '@/lib/config/axios.config'

// Convert file to base64 (returns only the base64 string, no prefix)
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Send the full base64 string with prefix
        resolve(reader.result)
      } else {
        reject(new Error('Failed to read file'))
      }
    }
    reader.onerror = (error) => reject(error)
  })
}

// Hook for changing password
export const useChangePassword = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string
      newPassword: string
    }) => {
      try {
        const response = await https.put('/users/change-password', {
          oldPassword,
          newPassword,
        })
        return response.data
      } catch (error: any) {
        throw new Error(
          error?.response?.data?.message || 'Failed to change password'
        )
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      toast.success('Password changed successfully')
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })
}

// Hook for uploading profile picture
// ...existing code...

// Hook for uploading profile picture
export const useUploadProfilePicture = () => {
    const queryClient = useQueryClient()
  
    return useMutation({
      // Accepts a base64 string directly
      mutationFn: async (base64Image: string) => {
        try {
          const response = await https.put('/users/profile-picture', {
            picture: base64Image,
          })
          return response.data
        } catch (error: any) {
          throw new Error(
            error?.response?.data?.message || 'Failed to upload profile picture'
          )
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user'] })
        toast.success('Profile picture updated!')
      },
      onError: (error: any) => {
        toast.error(error.message)
      },
    })
  }
