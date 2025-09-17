export default function PromptCard({ prompt, onCopy, onOpenModal }) {
  const handleCopy = (e) => {
    e.stopPropagation()
    onCopy(prompt.prompt)
  }

  const handleCardClick = () => {
    onOpenModal(prompt)
  }

  return (
    <div
      className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl transition-all duration-300 group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-2xl transition-all duration-300"></div>
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">
              {prompt.title}
            </h3>
            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-300 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full">
              {prompt.category}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
          {prompt.description}
        </p>

        {/* Tags */}
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {prompt.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block px-3 py-1 text-xs font-medium text-gray-300 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 hover:text-white transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                #{tag}
              </span>
            ))}
            {prompt.tags.length > 3 && (
              <span className="inline-block px-3 py-1 text-xs text-gray-400 bg-white/5 rounded-full">
                +{prompt.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="group/btn inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-sm border border-white/20 rounded-xl hover:from-blue-600 hover:to-purple-600 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
          >
            <svg className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </button>
          
          <button
            onClick={handleCardClick}
            className="group/view inline-flex items-center px-4 py-2 text-sm font-semibold text-blue-300 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-400/30 rounded-xl hover:from-blue-500/30 hover:to-purple-500/30 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
          >
            <svg className="w-4 h-4 mr-2 group-hover/view:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Explore Prompt
          </button>
        </div>
      </div>
    </div>
  )
}
