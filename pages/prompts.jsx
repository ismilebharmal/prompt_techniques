import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  const fetchPrompts = async () => {
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
  }

  useEffect(() => {
    fetchPrompts()
  }, [])

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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading prompts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-6 lg:py-8 space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Prompt Techniques Hub
              </h1>
              <p className="text-gray-300 mt-2 text-base lg:text-lg">Discover and share powerful AI prompts</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              <Link
                href="/"
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto text-center"
              >
                ← Back to Portfolio
              </Link>
              <div className="px-3 sm:px-4 py-2 bg-gray-700/50 rounded-lg border border-gray-600/50 w-full sm:w-auto">
                <span className="text-xs sm:text-sm text-gray-300 font-medium">
                  {filteredPrompts.length} prompts
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="mb-6 lg:mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 pl-10 sm:pl-12 pr-4 text-gray-100 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm placeholder-gray-400 transition-all duration-300 text-sm sm:text-base"
            />
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="mt-12">
          {filteredPrompts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-200 mb-2">No prompts found</h3>
              <p className="text-gray-400">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrompts.map((prompt, index) => (
                <div
                  key={prompt._id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PromptCard
                    prompt={prompt}
                    isFavorite={favorites.has(prompt._id)}
                    onToggleFavorite={toggleFavorite}
                    onCopy={copyToClipboard}
                    onOpenModal={setSelectedPrompt}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Section */}
      <section className="py-12 lg:py-20 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 lg:mb-6">
              About the Developer
            </h2>
            <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
              This project is part of my portfolio showcasing modern web development skills and AI integration.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4 lg:space-y-6 order-2 lg:order-1">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 lg:mb-6">
                Built by <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Ismile Bharmal</span>
              </h3>
              <p className="text-gray-300 text-base lg:text-lg leading-relaxed mb-6 lg:mb-8">
                Passionate Flutter & AI/ML Developer with 4+ years of experience in designing, developing, and deploying mobile applications and AI-driven solutions. I specialize in building cross-platform applications with Flutter for both mobile and web, as well as in AI/ML technologies.
              </p>
              <p className="text-gray-400 text-sm lg:text-base leading-relaxed mb-6 lg:mb-8">
                My expertise covers the full development lifecycle, from architecture and design to deployment and monitoring. I have a solid understanding of implementing design patterns and developing model-agnostic chatbots using technologies like FastAPI, StreamLit, LangChain, and various LLM models.
              </p>
              <div className="flex flex-wrap gap-2 lg:gap-3 mb-6 lg:mb-8">
                {['Next.js', 'PostgreSQL', 'Neon', 'TailwindCSS', 'bcrypt', 'React'].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 lg:px-4 py-1 lg:py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full text-xs lg:text-sm font-medium border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <Link
                  href="/"
                  className="px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm lg:text-base"
                >
                  View Full Portfolio
                </Link>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 lg:p-8 border border-gray-700/50">
                <div className="text-center">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-4 lg:mb-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 p-1 animate-pulse">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                      <Image
                        src="/face_image.png"
                        alt="Ismile Bharmal - Flutter & AI/ML Developer"
                        width={120}
                        height={120}
                        className="w-full h-full object-cover object-top"
                        priority
                      />
                    </div>
                  </div>
                  <h4 className="text-xl lg:text-2xl font-bold text-white mb-2">Ismile Bharmal</h4>
                  <p className="text-gray-300 mb-4 lg:mb-6 text-base lg:text-lg">Full Stack Developer & AI Enthusiast</p>
                  <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm">
                    <div className="flex justify-between items-center py-2 px-3 lg:px-4 bg-gray-700/50 rounded-lg">
                      <span className="text-gray-300">Experience:</span>
                      <span className="font-semibold text-blue-400">4+ Years</span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 lg:px-4 bg-gray-700/50 rounded-lg">
                      <span className="text-gray-300">Projects:</span>
                      <span className="font-semibold text-purple-400">50+</span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 lg:px-4 bg-gray-700/50 rounded-lg">
                      <span className="text-gray-300">Status:</span>
                      <span className="font-semibold text-green-400">Available</span>
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
