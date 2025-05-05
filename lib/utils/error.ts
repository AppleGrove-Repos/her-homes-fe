import toast from 'react-hot-toast'
import { AxiosError } from 'axios'

export const errorHandler = (error: unknown) => {
  if (error instanceof AxiosError) {
    const errorMessage =
      error.response?.data?.message || error.message || 'An error occurred'
    toast.error(errorMessage)
    return errorMessage
  }

  toast.error('An unexpected error occurred')
  return 'An unexpected error occurred'
}
