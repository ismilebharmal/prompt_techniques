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
  const [refreshing, setRefreshing] = useState(false)

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('prompt-favorites')
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)))
    }
  }, [])

  // Fetch prompts from API
  const fetchPrompts = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      
      const response = await fetch(`/api/prompts-neon?t=${Date.now()}`)
      const data = await response.json()
      console.log('Fetched data:', data.length, 'prompts')
      setPrompts(data)
      setFilteredPrompts(data)
      
      if (showRefreshing) {
        showToast(`Refreshed! Found ${data.length} prompts`)
      }
    } catch (error) {
      console.error('Error fetching prompts:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchPrompts()
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
                href="/admin/login"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Admin
              </Link>
              <button
                onClick={() => fetchPrompts(true)}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {refreshing ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Refreshing...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Refresh Data</span>
                  </>
                )}
              </button>
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
