import { useState } from 'react'

export default function PromptCard({ prompt, isFavorite, onToggleFavorite, onCopy, onOpenModal }) {
  const [isHovered, setIsHovered] = useState(false)

  const handleCopy = (e) => {
    e.stopPropagation()
    onCopy(prompt.prompt)
  }

  const handleToggleFavorite = (e) => {
    e.stopPropagation()
    onToggleFavorite(prompt._id)
  }

  const handleCardClick = () => {
    onOpenModal(prompt)
  }

  // Category colors
  const categoryColors = {
    'Code': 'from-blue-500 to-cyan-500',
    'Mail': 'from-green-500 to-emerald-500',
    'Data': 'from-purple-500 to-pink-500',
    'Content': 'from-orange-500 to-red-500',
    'Role': 'from-indigo-500 to-purple-500',
    'Verifier': 'from-pink-500 to-rose-500'
  }

  const categoryColor = categoryColors[prompt.category] || 'from-gray-500 to-gray-600'

  return (
    <div
      className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-700/50 hover:border-gray-600/50 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
              {prompt.title}
            </h3>
            <span className={`inline-block px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r ${categoryColor} rounded-full`}>
              {prompt.category}
            </span>
          </div>
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full transition-all duration-300 ${
              isFavorite 
                ? 'text-red-400 hover:text-red-300 bg-red-500/20 hover:bg-red-500/30' 
                : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed">
          {prompt.description}
        </p>

        {/* Tags */}
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {prompt.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block px-3 py-1 text-xs text-gray-300 bg-gray-700/50 rounded-lg border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300"
              >
                #{tag}
              </span>
            ))}
            {prompt.tags.length > 3 && (
              <span className="inline-block px-3 py-1 text-xs text-gray-400 bg-gray-700/30 rounded-lg">
                +{prompt.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Prompt
          </button>
          
          <span className="text-xs text-gray-400 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Details
          </span>
        </div>

        {/* Animated border on hover */}
        <div className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r ${categoryColor} group-hover:w-full transition-all duration-500 rounded-b-2xl`}></div>
      </div>
    </div>
  )
}
