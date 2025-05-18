'use client'

import type React from 'react'

import Image from 'next/image'
import type { FC } from 'react'
import { BiTrash, BiUpload } from 'react-icons/bi'
import { useEffect, useState } from 'react'

interface Props {
  uploaded_image?: string // Now it's a base64 string, not File
  onUploadImage?(base64: string): void
  onRemoveImage?(): void
  id?: string
}

const ImageUploader: FC<Props> = ({
  id = Math.random().toString(),
  uploaded_image,
  onUploadImage,
  onRemoveImage,
}) => {
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (uploaded_image?.startsWith('data:image/')) {
      setPreview(uploaded_image)
    } else {
      setPreview(null)
    }
  }, [uploaded_image])

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const result = reader.result as string
          if (!result || typeof result !== 'string') {
            reject(new Error('Failed to convert file to base64'))
            return
          }
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = (error) => {
        console.error('FileReader error:', error)
        reject(error)
      }
      reader.readAsDataURL(file)
    })

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // ✅ Reset input value to allow re-upload of the same file

    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed.')
      return
    }

    const base64 = await fileToBase64(file)
    if (!base64.startsWith('data:image/')) {
      alert('Invalid image format.')
      return
    }

    onUploadImage?.(base64)
  }

  if (preview) {
    return (
      <div className="w-full h-[120px] rounded-md border-4 relative">
        <Image
          src={preview || '/placeholder.svg'}
          alt="image-uploader-image"
          width={600}
          height={200}
          unoptimized
          className="w-full h-full object-cover object-center"
        />
        <span
          onClick={onRemoveImage}
          className="w-[30px] h-[30px] rounded-md flex items-center justify-center bg-red-50 absolute top-2 right-2 cursor-pointer"
        >
          <BiTrash />
        </span>
      </div>
    )
  }

  return (
    <>
      <label
        htmlFor={id}
        className="flex flex-col items-center justify-center gap-2 w-full h-52 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
      >
        <BiUpload size={25} />
        <p className="text-[.9rem] font-semibold text-gray-600 mt-2">
          Choose File
        </p>
      </label>

      <input
        onChange={handleChange}
        type="file"
        className="hidden"
        id={id}
        accept="image/*"
      />
    </>
  )
}

export default ImageUploader
