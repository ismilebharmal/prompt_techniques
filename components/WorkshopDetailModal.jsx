import { useState } from 'react'
import ImageSlideshow from './ImageSlideshow'
import DatabaseImage from './DatabaseImage'

const WorkshopDetailModal = ({ slide, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!isOpen || !slide) return null

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDuration = (hours) => {
    if (!hours) return 'Not specified'
    if (hours === 1) return '1 hour'
    if (hours < 24) return `${hours} hours`
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    if (remainingHours === 0) return `${days} day${days > 1 ? 's' : ''}`
    return `${days} day${days > 1 ? 's' : ''} ${remainingHours} hour${remainingHours > 1 ? 's' : ''}`
  }

  const getWorkshopTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'technical':
        return 'bg-blue-100 text-blue-800'
      case 'workshop':
        return 'bg-green-100 text-green-800'
      case 'presentation':
        return 'bg-purple-100 text-purple-800'
      case 'training':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {slide.title}
                </h3>
                <div className="flex items-center space-x-4 mb-4">
                  {slide.workshop_type && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getWorkshopTypeColor(slide.workshop_type)}`}>
                      {slide.workshop_type}
                    </span>
                  )}
                  {slide.workshop_date && (
                    <span className="text-sm text-gray-500">
                      {formatDate(slide.workshop_date)}
                    </span>
                  )}
                  {slide.duration_hours && (
                    <span className="text-sm text-gray-500">
                      Duration: {formatDuration(slide.duration_hours)}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {['overview', 'images', 'details'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">
                    {slide.detailed_description || slide.description || 'No description available.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {slide.duration_hours && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-blue-900 mb-1">Duration</h5>
                      <p className="text-blue-700">{formatDuration(slide.duration_hours)}</p>
                    </div>
                  )}
                  
                  {slide.participants_count && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-green-900 mb-1">Participants</h5>
                      <p className="text-green-700">{slide.participants_count} attendees</p>
                    </div>
                  )}
                  
                  {slide.workshop_type && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-purple-900 mb-1">Type</h5>
                      <p className="text-purple-700">{slide.workshop_type}</p>
                    </div>
                  )}
                  
                  {slide.workshop_date && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-yellow-900 mb-1">Date</h5>
                      <p className="text-yellow-700">{formatDate(slide.workshop_date)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">Workshop Slides</h4>
                  {slide.images && slide.images.length > 0 && (
                    <span className="text-sm text-gray-500">
                      {slide.images.length} slide{slide.images.length !== 1 ? 's' : ''} available
                    </span>
                  )}
                </div>
                
                {slide.images && slide.images.length > 0 ? (
                  <div className="space-y-4">
                    {/* Main Slideshow */}
                    <ImageSlideshow
                      images={slide.images}
                      autoPlay={true}
                      interval={4000}
                      showThumbnails={true}
                      showControls={true}
                      aspectRatio="16:9"
                      maxHeight="96"
                      allowFullscreen={true}
                      currentIndex={currentIndex}
                      onIndexChange={setCurrentIndex}
                      className="w-full"
                    />
                    
                    {/* Image Grid View */}
                    <div className="mt-6">
                      <h5 className="text-md font-medium text-gray-700 mb-3">All Slides</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {slide.images.map((image, index) => (
                          <div
                            key={image.id || index}
                            className="relative group cursor-pointer rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-all"
                            onClick={() => setCurrentIndex(index)}
                          >
                            <DatabaseImage
                              imageId={image.id}
                              imageUrl={image.image_url}
                              fallback={
                                <div className="w-full h-24 bg-gray-100 flex items-center justify-center">
                                  <span className="text-xs text-gray-500">?</span>
                                </div>
                              }
                              className="w-full h-24 object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                              <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                {index + 1}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No slides available</h3>
                    <p className="mt-2 text-sm text-gray-500">No workshop slides have been uploaded yet.</p>
                    <p className="mt-1 text-xs text-gray-400">Check back later for workshop materials and presentations.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Workshop Type</h4>
                    <p className="mt-1 text-sm text-gray-900">{slide.workshop_type || 'Not specified'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Date</h4>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(slide.workshop_date)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                    <p className="mt-1 text-sm text-gray-900">{formatDuration(slide.duration_hours)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Participants</h4>
                    <p className="mt-1 text-sm text-gray-900">{slide.participants_count || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkshopDetailModal
