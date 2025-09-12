import { useState, useEffect } from 'react'
import DatabaseImage from './DatabaseImage'

const HeroSlides = () => {
  const [slides, setSlides] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [loading, setLoading] = useState(true)
  const [imageAspectRatios, setImageAspectRatios] = useState({})

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    try {
      console.log('🔄 Fetching hero slides...')
      const response = await fetch('/api/hero-slides')
      console.log('📡 Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('✅ Hero slides data:', data)
      console.log('📊 Number of slides:', data?.length || 0)
      
      if (data && data.length > 0) {
        console.log('🖼️ First slide image settings:', {
          image_fit: data[0].image_fit,
          image_position: data[0].image_position,
          text_position: data[0].text_position,
          image_id: data[0].image_id
        })
      }
      
      setSlides(data || [])
      setLoading(false)
    } catch (error) {
      console.error('❌ Error fetching hero slides:', error)
      setLoading(false)
    }
  }

  const detectImageAspectRatio = (imageId) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const aspectRatio = img.width / img.height
        setImageAspectRatios(prev => ({
          ...prev,
          [imageId]: aspectRatio
        }))
        resolve(aspectRatio)
      }
      img.onerror = () => {
        resolve(1) // Default to square if error
      }
      img.src = `/api/images/${imageId}`
    })
  }

  const getOptimalImageFit = (slide) => {
    const aspectRatio = imageAspectRatios[slide.image_id]
    if (!aspectRatio) return slide.image_fit || 'contain'
    
    // If it's a portrait image (height > width), use contain
    if (aspectRatio < 1) {
      return 'contain'
    }
    // If it's a landscape image (width > height), use cover
    else if (aspectRatio > 1.5) {
      return 'cover'
    }
    // For square or near-square images, use contain
    else {
      return 'contain'
    }
  }

  useEffect(() => {
    if (slides.length <= 1 || !isPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [slides.length, isPlaying])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  console.log('🎬 HeroSlides render - loading:', loading, 'slides:', slides.length)

  if (loading) {
    console.log('⏳ Showing loading state')
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (slides.length === 0) {
    console.log('❌ No slides available - showing empty state')
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-2xl">📸</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">No Slides Available</h2>
          <p className="text-gray-300">Check back later for updates!</p>
        </div>
      </section>
    )
  }

  console.log('✅ Rendering slideshow with', slides.length, 'slides')

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Featured Work
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore some of my recent projects and achievements
          </p>
        </div>

        {/* Slideshow Container */}
        <div className="relative">
          {/* Main Slide Display - Dynamic Height for Portrait Images */}
          <div className="relative min-h-96 md:min-h-[500px] max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {/* Image Container with Smart Fitting */}
                <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                  <DatabaseImage
                    imageId={slide.image_id}
                    alt={slide.title}
                    className="max-w-full max-h-full"
                    onLoad={() => {
                      // Detect aspect ratio when image loads
                      detectImageAspectRatio(slide.image_id)
                    }}
                    style={{
                      objectFit: getOptimalImageFit(slide),
                      objectPosition: (() => {
                        const position = slide.image_position || 'center'
                        // Convert our position values to valid CSS object-position values
                        switch (position) {
                          case 'top': return 'center top'
                          case 'bottom': return 'center bottom'
                          case 'left': return 'left center'
                          case 'right': return 'right center'
                          case 'top-left': return 'left top'
                          case 'top-right': return 'right top'
                          case 'bottom-left': return 'left bottom'
                          case 'bottom-right': return 'right bottom'
                          case 'center': return 'center center'
                          default: return 'center center'
                        }
                      })(),
                      width: 'auto',
                      height: 'auto',
                      maxWidth: '100%',
                      maxHeight: '100%'
                    }}
                    fallback={
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="text-2xl">🖼️</span>
                          </div>
                          <p className="text-lg font-medium">{slide.title}</p>
                        </div>
                      </div>
                    }
                  />
                  
                  {/* Image Overlay for Better Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
                  
                  {/* Debug Info - Remove in production */}
                  <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {getOptimalImageFit(slide)} {imageAspectRatios[slide.image_id] ? `(${(imageAspectRatios[slide.image_id]).toFixed(2)})` : ''}
                  </div>
                </div>
                
                {/* Slide Overlay Content with Dynamic Positioning */}
                <div className={`absolute inset-0 ${
                  slide.text_position === 'center' ? 'flex items-center justify-center' :
                  slide.text_position === 'top-left' ? 'flex items-start justify-start' :
                  slide.text_position === 'top-center' ? 'flex items-start justify-center' :
                  slide.text_position === 'top-right' ? 'flex items-start justify-end' :
                  slide.text_position === 'left' ? 'flex items-center justify-start' :
                  slide.text_position === 'right' ? 'flex items-center justify-end' :
                  slide.text_position === 'bottom-right' ? 'flex items-end justify-end' :
                  slide.text_position === 'bottom-center' ? 'flex items-end justify-center' :
                  'flex items-end justify-start' // default: bottom-left
                }`}>
                  <div className={`p-8 ${
                    slide.text_position === 'center' ? 'text-center' :
                    slide.text_position === 'top-left' || slide.text_position === 'left' ? 'text-left' :
                    slide.text_position === 'top-right' || slide.text_position === 'right' || slide.text_position === 'bottom-right' ? 'text-right' :
                    'text-left' // default
                  }`}>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                      {slide.title}
                    </h3>
                    {slide.description && (
                      <p className="text-lg text-gray-200 max-w-2xl drop-shadow-md">
                        {slide.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Controls */}
            {slides.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
                  aria-label="Previous slide"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
                  aria-label="Next slide"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Play/Pause Button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                  aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                >
                  {isPlaying ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Slide Indicators */}
          {slides.length > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide
                      ? 'bg-blue-400 scale-125'
                      : 'bg-gray-400 hover:bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Slide Counter */}
          {slides.length > 1 && (
            <div className="text-center mt-4">
              <span className="text-gray-300 text-sm">
                {currentSlide + 1} of {slides.length}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default HeroSlides
