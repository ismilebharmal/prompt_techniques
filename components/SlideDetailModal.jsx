import { useState, useEffect, useCallback } from 'react'
import DatabaseImage from './DatabaseImage'

export default function SlideDetailModal({ slide, isOpen, onClose }) {
  const [slideImages, setSlideImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (isOpen && slide?.id) {
      fetchSlideImages()
    }
  }, [isOpen, slide?.id, fetchSlideImages])

  const fetchSlideImages = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/slide-images?slideId=${slide.id}`)
      const data = await response.json()
      if (data.success) {
        setSlideImages(data.data)
      }
    } catch (error) {
      console.error('Error fetching slide images:', error)
    } finally {
      setLoading(false)
    }
  }, [slide?.id])

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev < slideImages.length - 1 ? prev + 1 : 0
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev > 0 ? prev - 1 : slideImages.length - 1
    )
  }

  if (!isOpen || !slide) return null

  const currentImage = slideImages[currentImageIndex]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{slide.title}</h2>
            {slide.category && (
              <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full mt-1">
                {slide.category}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Description */}
          {slide.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{slide.description}</p>
            </div>
          )}

          {/* Details */}
          {slide.details && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Details</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{slide.details}</p>
            </div>
          )}

          {/* Tags */}
          {slide.tags && slide.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {slide.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Images */}
          {slideImages.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Images ({slideImages.length})
              </h3>
              
              {/* Current Image */}
              <div className="relative mb-4">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {currentImage ? (
                    <DatabaseImage
                      imageId={currentImage.imageId}
                      fallback={
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          Image not available
                        </div>
                      }
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      No image selected
                    </div>
                  )}
                </div>

                {/* Navigation */}
                {slideImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                    >
                      ›
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {slideImages.length}
                </div>
              </div>

              {/* Thumbnail Grid */}
              {slideImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {slideImages.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-video rounded overflow-hidden border-2 ${
                        index === currentImageIndex 
                          ? 'border-blue-500' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <DatabaseImage
                        imageId={image.imageId}
                        fallback={
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                            No image
                          </div>
                        }
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading images...</p>
            </div>
          )}

          {/* No Images */}
          {!loading && slideImages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No images available for this slide.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
