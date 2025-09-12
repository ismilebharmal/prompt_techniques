import { useState } from 'react'

export default function DatabaseImage({ 
  imageId, 
  imageUrl, 
  alt, 
  className = '', 
  fallback = null,
  ...props 
}) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  // If there's no imageId, fall back to imageUrl or fallback
  if (!imageId) {
    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt={alt}
          className={className}
          onError={() => setImageError(true)}
          {...props}
        />
      )
    }
    
    if (fallback) {
      return fallback
    }
    
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400">No Image</span>
      </div>
    )
  }

  // If image failed to load, show fallback
  if (imageError) {
    if (fallback) {
      return fallback
    }
    
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400">Image Error</span>
      </div>
    )
  }

  return (
    <div className="relative">
      {imageLoading && (
        <div className={`absolute inset-0 bg-gray-200 flex items-center justify-center ${className}`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      <img
        src={`/api/images/${imageId}`}
        alt={alt}
        className={`${className} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true)
          setImageLoading(false)
        }}
        {...props}
      />
    </div>
  )
}
