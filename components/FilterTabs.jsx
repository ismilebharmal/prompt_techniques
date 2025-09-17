export default function FilterTabs({ categories, selectedCategory, onCategoryChange }) {
  // Category colors and icons
  const categoryStyles = {
    'All': { color: 'from-gray-500 to-gray-600', icon: '🔍' },
    'Code': { color: 'from-blue-500 to-cyan-500', icon: '💻' },
    'Mail': { color: 'from-green-500 to-emerald-500', icon: '📧' },
    'Data': { color: 'from-purple-500 to-pink-500', icon: '📊' },
    'Content': { color: 'from-orange-500 to-red-500', icon: '📝' },
    'Role': { color: 'from-indigo-500 to-purple-500', icon: '🎭' },
    'Verifier': { color: 'from-pink-500 to-rose-500', icon: '✅' }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => {
        const categoryStyle = categoryStyles[category] || categoryStyles['All']
        const isActive = selectedCategory === category
        
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`flex items-center px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:-translate-y-0.5 ${
              isActive
                ? `bg-gradient-to-r ${categoryStyle.color} text-white shadow-lg`
                : 'bg-gray-800/50 text-gray-300 border border-gray-600/50 hover:bg-gray-700/50 hover:text-white hover:border-gray-500/50 backdrop-blur-sm'
            }`}
          >
            <span className="text-lg mr-2">{categoryStyle.icon}</span>
            {category}
          </button>
        )
      })}
    </div>
  )
}
