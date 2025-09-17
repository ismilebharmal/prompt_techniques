export default function FilterTabs({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category, index) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`group px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 ${
            selectedCategory === category
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
              : 'bg-white/10 backdrop-blur-sm text-gray-300 border border-white/20 hover:bg-white/20 hover:text-white hover:border-white/30'
          }`}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <span className="relative z-10">{category}</span>
          {selectedCategory === category && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          )}
        </button>
      ))}
    </div>
  )
}
