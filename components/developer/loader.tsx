interface LoaderProps {
  size?: number
  className?: string
}

export default function Loader({ size = 30, className }: LoaderProps) {
  return (
    <div className={`flex items-center justify-center p-2 ${className}`}>
      <div
        className="animate-spin rounded-full border-t-2 border-b-2 border-primary"
        style={{ width: size, height: size }}
      ></div>
    </div>
  )
}
