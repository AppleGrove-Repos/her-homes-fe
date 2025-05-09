'use client'

import { useState, type FC } from 'react'
import { BiTrash, BiUpload } from 'react-icons/bi'

interface Props {
  uploaded_video?: File
  onUploadVideo?(file: File): void
  onRemoveVideo?(): void
  id?: string
}

const VideoUploader: FC<Props> = ({
  id = Math.random().toString(),
  uploaded_video,
  onUploadVideo,
  onRemoveVideo,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Generate preview URL when a video is uploaded
  useState(() => {
    if (uploaded_video) {
      setPreviewUrl(URL.createObjectURL(uploaded_video))
    }
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  })

  if (uploaded_video && previewUrl) {
    return (
      <div className="w-full h-[200px] rounded-md border-4 relative">
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <video className="w-full h-full object-contain" controls>
            <source src={previewUrl} type={uploaded_video.type} />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="absolute top-2 right-2 flex gap-2">
          <span
            onClick={onRemoveVideo}
            className="w-[30px] h-[30px] rounded-md flex items-center justify-center bg-red-50 cursor-pointer"
          >
            <BiTrash />
          </span>
        </div>
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
          Upload Video
        </p>
        <p className="text-xs text-gray-500 mt-1">
          MP4, WebM or MOV (max 100MB)
        </p>
      </label>

      <input
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            // Check file size (100MB max)
            if (file.size > 100 * 1024 * 1024) {
              alert('Video file is too large. Maximum size is 100MB.')
              return
            }
            onUploadVideo?.(file)
          }
        }}
        type="file"
        className="hidden"
        id={id}
        accept="video/mp4,video/webm,video/quicktime"
      />
    </>
  )
}

export default VideoUploader
