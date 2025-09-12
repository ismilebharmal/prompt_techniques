import { useState, useEffect } from 'react'
import DatabaseImage from './DatabaseImage'
import SlideDetailModal from './SlideDetailModal'

export default function WorkSlidesSection() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSlide, setSelectedSlide] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/slides/featured')
      const data = await response.json()
      if (data.success) {
        setSlides(data.data)
      }
    } catch (error) {
      console.error('Error fetching slides:', error)
    } finally {
      setLoading(false)
    }
  }

  const openSlideDetail = (slide) => {
    setSelectedSlide(slide)
    setShowDetailModal(true)
  }

  const closeSlideDetail = () => {
    setSelectedSlide(null)
    setShowDetailModal(false)
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading work slides...</p>
          </div>
        </div>
      </section>
    )
  }

  if (slides.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Work & Workshop Slides</h2>
            <p className="text-gray-600">No slides available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Work & Workshop Slides
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore my presentations, workshops, and work samples. Click on any slide to view details and additional images.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => openSlideDetail(slide)}
              >
                {/* Cover Image */}
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  {slide.coverImageId ? (
                    <DatabaseImage
                      imageId={slide.coverImageId}
                      fallback={
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <div className="text-4xl mb-2">📊</div>
                            <p>No cover image</p>
                          </div>
                        </div>
                      }
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📊</div>
                        <p>No cover image</p>
                      </div>
                    </div>
                  )}

                  {/* Image Count Badge */}
                  {slide.totalImages > 0 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-full text-sm">
                      {slide.totalImages} image{slide.totalImages !== 1 ? 's' : ''}
                    </div>
                  )}

                  {/* Featured Badge */}
                  {slide.featured && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                      {slide.title}
                    </h3>
                  </div>

                  {slide.description && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                      {slide.description}
                    </p>
                  )}

                  {/* Category and Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {slide.category && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {slide.category}
                      </span>
                    )}
                    {slide.tags && slide.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {slide.tags && slide.tags.length > 2 && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        +{slide.tags.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* View Details Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 text-sm font-medium hover:text-blue-800">
                      View Details →
                    </span>
                    <span className="text-gray-400 text-xs">
                      {new Date(slide.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
              View All Slides
            </button>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      <SlideDetailModal
        slide={selectedSlide}
        isOpen={showDetailModal}
        onClose={closeSlideDetail}
      />
    </>
  )
}
