'use client'

import { useEffect, useState, type FC } from 'react'
import { BiTrash, BiUpload } from 'react-icons/bi'

interface Props {
  uploaded_video?: string // base64 string
  onUploadVideo?(base64: string): void
  onRemoveVideo?(): void
  id?: string
}

const VideoUploader: FC<Props> = ({
  id = Math.random().toString(),
  uploaded_video,
  onUploadVideo,
  onRemoveVideo,
}) => {
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (uploaded_video?.startsWith('data:video/')) {
      setPreview(uploaded_video)
    } else {
      setPreview(null)
    }
  }, [uploaded_video])

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // Reset input so same file can be re-uploaded

    if (!file) return

    if (!file.type.startsWith('video/')) {
      alert('Only video files are allowed.')
      return
    }

    if (file.size > 500 * 1024 * 1024) {
      alert('Video file is too large. Maximum size is 500MB.')
      return
    }

    const base64 = await fileToBase64(file)
    if (!base64.startsWith('data:video/')) {
      alert('Invalid video format.')
      return
    }

    onUploadVideo?.(base64)
  }

  if (preview) {
    return (
      <div className="w-full h-[250px] rounded-md border-4 relative">
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <video className="w-full h-full object-contain" controls>
            <source src={preview} />
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
        className="flex flex-col items-center justify-center gap-2 w-full h-52 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
      >
        <BiUpload size={25} />
        <p className="text-[.9rem] font-semibold text-gray-600 mt-2">
          Upload Video
        </p>
        <p className="text-xs text-gray-500 mt-1">
          MP4, WebM or MOV (max 500MB)
        </p>
      </label>

      <input
        onChange={handleChange}
        type="file"
        className="hidden"
        id={id}
        accept="video/mp4,video/webm,video/quicktime"
      />
    </>
  )
}

export default VideoUploader
