'use client'

import Image from 'next/image'
import type { FC } from 'react'
import { BiTrash, BiUpload } from 'react-icons/bi'

interface Props {
  uploaded_image?: File
  onUploadImage?(file: File): void
  onRemoveImage?(): void
  id?: string
}

const ImageUploader: FC<Props> = ({
  id = Math.random().toString(),
  uploaded_image,
  onUploadImage,
  onRemoveImage,
}) => {
  if (uploaded_image) {
    return (
      <div className="w-full h-[120px] rounded-md border-4 relative">
        <Image
          src={URL.createObjectURL(uploaded_image) || '/placeholder.svg'}
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
        className="border-2 border-dashed rounded-md bg-gray-200 px-6 py-8 flex flex-col items-center border-primary cursor-pointer"
      >
        <BiUpload size={25} />
        <p className="text-[.9rem] font-semibold text-gray-600 mt-2">
          Choose File
        </p>
      </label>

      <input
        onChange={(e) => onUploadImage?.(e.target.files?.[0]!)}
        type="file"
        className="hidden"
        id={id}
        accept="image/*"
      />
    </>
  )
}

export default ImageUploader
