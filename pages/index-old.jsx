import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import PromptCard from '../components/PromptCard'
import PromptModal from '../components/PromptModal'
import FilterTabs from '../components/FilterTabs'

const categories = ['All', 'Code', 'Mail', 'Data', 'Content', 'Role', 'Verifier']

export default function Home({ showToast }) {
  const [prompts, setPrompts] = useState([])
  const [filteredPrompts, setFilteredPrompts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPrompt, setSelectedPrompt] = useState(null)
  const [favorites, setFavorites] = useState(new Set())

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('prompt-favorites')
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)))
    }
  }, [])

  // Fetch prompts from API
  const fetchPrompts = useCallback(async () => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/prompts-neon?t=${Date.now()}`)
      const data = await response.json()
      console.log('Fetched data:', data.length, 'prompts')
      setPrompts(data)
      setFilteredPrompts(data)
    } catch (error) {
      console.error('Error fetching prompts:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPrompts()
  }, [fetchPrompts])

  // Auto-refresh when page becomes visible (user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchPrompts()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [fetchPrompts])

  // Auto-refresh on window focus (user switches back to window)
  useEffect(() => {
    const handleFocus = () => {
      fetchPrompts()
    }

    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [fetchPrompts])

  // Filter prompts based on category and search
  useEffect(() => {
    let filtered = prompts

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(prompt => prompt.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(prompt =>
        prompt.title.toLowerCase().includes(query) ||
        prompt.description.toLowerCase().includes(query) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    setFilteredPrompts(filtered)
  }, [prompts, selectedCategory, searchQuery])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const toggleFavorite = (promptId) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(promptId)) {
      newFavorites.delete(promptId)
    } else {
      newFavorites.add(promptId)
    }
    setFavorites(newFavorites)
    localStorage.setItem('prompt-favorites', JSON.stringify([...newFavorites]))
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      showToast('Copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
      showToast('Failed to copy to clipboard')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Prompt Techniques Hub</h1>
              <p className="text-gray-600 mt-1">Discover and share powerful AI prompts</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/portfolio"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-100"
              >
                Portfolio
              </Link>
              <Link
                href="/admin/login"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-100"
              >
                Admin
              </Link>
              <span className="text-sm text-gray-500">
                {filteredPrompts.length} prompts
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-3 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <FilterTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Prompts Grid */}
        <div className="mt-8">
          {filteredPrompts.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No prompts found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt._id}
                  prompt={prompt}
                  isFavorite={favorites.has(prompt._id)}
                  onToggleFavorite={toggleFavorite}
                  onCopy={copyToClipboard}
                  onOpenModal={setSelectedPrompt}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              About the Developer
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              This project is part of my portfolio showcasing modern web development skills and AI integration.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Built by Ismile Bharmal
              </h3>
              <p className="text-gray-600 mb-6">
                A passionate Full Stack Developer with expertise in React, Node.js, and modern web technologies. 
                This Prompt Techniques Hub demonstrates my skills in building scalable applications with 
                database integration, authentication, and modern UI/UX design.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Next.js', 'PostgreSQL', 'Neon', 'TailwindCSS', 'bcrypt', 'React'].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <Link
                  href="/portfolio"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  View Full Portfolio
                </Link>
                <a
                  href="https://github.com/ismilebharmal/prompt_techniques"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  View on GitHub
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">IB</span>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Ismile Bharmal</h4>
                  <p className="text-gray-600 mb-4">Full Stack Developer & AI Enthusiast</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex justify-between">
                      <span>Experience:</span>
                      <span className="font-medium">3+ Years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Projects:</span>
                      <span className="font-medium">50+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-medium text-green-600">Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedPrompt && (
        <PromptModal
          prompt={selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
          onCopy={copyToClipboard}
        />
      )}
    </div>
  )
}
