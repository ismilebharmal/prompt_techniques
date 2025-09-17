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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-4 border-blue-500/30 border-t-blue-500 mx-auto mb-6"></div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Loading Prompts
          </h3>
          <p className="text-gray-400">Discovering amazing AI prompts for you...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 cursor-default">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-gray-900/80 via-blue-900/80 to-purple-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Prompt Techniques Hub
              </h1>
              <p className="text-gray-300 mt-2 text-lg">Discover and share powerful AI prompts</p>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className="group px-6 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back to Portfolio</span>
                </span>
              </Link>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
                <span className="text-sm text-gray-300 font-medium">
                  {filteredPrompts.length} prompts
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 cursor-default">
        <div className="mb-8">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-6 py-4 pl-12 pr-6 text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300 placeholder-gray-400 group-hover:bg-white/15 group-hover:border-white/30"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        <FilterTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Prompts Grid */}
        <div className="mt-8 cursor-default">
          {filteredPrompts.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <svg className="h-12 w-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No prompts found</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Try adjusting your search or filter criteria to find the perfect prompt for your needs.
                </p>
              </div>
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
      <section className="py-20 relative overflow-hidden cursor-default">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
              About the Developer
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              This project is part of my portfolio showcasing modern web development skills and AI integration.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">
                  Built by <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Ismile Bharmal</span>
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  Passionate Flutter & AI/ML Developer with 4+ years of experience in designing, developing, and deploying mobile applications and AI-driven solutions. I specialize in building cross-platform applications with Flutter for both mobile and web, as well as in AI/ML technologies.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  My expertise covers the full development lifecycle, from architecture and design to deployment and monitoring. I have a solid understanding of implementing design patterns and developing model-agnostic chatbots using technologies like FastAPI, StreamLit, LangChain, and various LLM models.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {['Next.js', 'PostgreSQL', 'Neon', 'TailwindCSS', 'bcrypt', 'React'].map((tech, index) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-blue-300 hover:from-blue-500/30 hover:to-purple-500/30 hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="pt-4">
                <Link
                  href="/"
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  <span>View Full Portfolio</span>
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl"></div>
                <div className="relative text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center p-1 animate-pulse">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">IB</span>
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">Ismile Bharmal</h4>
                  <p className="text-blue-300 mb-6 text-lg">Full Stack Developer & AI Enthusiast</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 px-4 bg-white/5 rounded-lg">
                      <span className="text-gray-300">Experience:</span>
                      <span className="font-semibold text-green-400">4+ Years</span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-4 bg-white/5 rounded-lg">
                      <span className="text-gray-300">Projects:</span>
                      <span className="font-semibold text-blue-400">50+</span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-4 bg-white/5 rounded-lg">
                      <span className="text-gray-300">Status:</span>
                      <span className="font-semibold text-green-400 flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        Available
                      </span>
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
