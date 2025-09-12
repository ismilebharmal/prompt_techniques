import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import DatabaseImage from '../../components/DatabaseImage'

export default function AdminDashboard() {
  const [prompts, setPrompts] = useState([])
  const [projects, setProjects] = useState([])
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState(null)
  const [editingProject, setEditingProject] = useState(null)
  const [editingSlide, setEditingSlide] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tags: '',
    description: '',
    prompt: '',
    exampleInput: '',
    exampleOutput: ''
  })
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    detailedDescription: '',
    imageUrl: '',
    imageId: null,
    coverImageId: null,
    images: [],
    githubUrl: '',
    liveUrl: '',
    technologies: '',
    toolsUsed: '',
    category: '',
    featured: false,
    orderIndex: 0,
    projectDate: '',
    clientName: '',
    projectStatus: 'completed'
  })
  const [slideFormData, setSlideFormData] = useState({
    title: '',
    description: '',
    detailedDescription: '',
    imageUrl: '',
    imageId: null,
    coverImageId: null,
    images: [],
    category: '',
    orderIndex: 0,
    workshopDate: '',
    durationHours: '',
    participantsCount: '',
    workshopType: ''
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [heroSlides, setHeroSlides] = useState([])
  const [heroSlideFormData, setHeroSlideFormData] = useState({
    title: '',
    description: '',
    imageId: null,
    displayOrder: 0,
    isActive: true
  })
  const [editingHeroSlide, setEditingHeroSlide] = useState(null)
  const router = useRouter()

  const fetchPrompts = useCallback(async () => {
    try {
      const response = await fetch('/api/prompts-neon')
      const data = await response.json()
      setPrompts(data)
    } catch (error) {
      console.error('Error fetching prompts:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      setProjects(data.data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }, [])

  const fetchSlides = useCallback(async () => {
    try {
      const response = await fetch('/api/slides')
      const data = await response.json()
      setSlides(data.data || [])
    } catch (error) {
      console.error('Error fetching slides:', error)
    }
  }, [])

  const fetchHeroSlides = useCallback(async () => {
    try {
      const response = await fetch('/api/hero-slides')
      const data = await response.json()
      setHeroSlides(data || [])
    } catch (error) {
      console.error('Error fetching hero slides:', error)
    }
  }, [])

  const uploadImage = async (file) => {
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        return result.image
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Image upload error:', error)
      alert('Failed to upload image: ' + error.message)
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  // Image management functions
  const addImageToProject = async (imageId, isCover = false) => {
    try {
      const response = await fetch(`/api/project-images?projectId=${editingProject.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageId,
          isCover,
          displayOrder: (projectFormData.images || []).length
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add image to project')
      }

      return await response.json()
    } catch (error) {
      console.error('Error adding image to project:', error)
      throw error
    }
  }

  const addImageToSlide = async (imageId, isCover = false) => {
    try {
      const response = await fetch(`/api/slide-images?slideId=${editingSlide.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageId,
          isCover,
          displayOrder: (slideFormData.images || []).length
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add image to slide')
      }

      return await response.json()
    } catch (error) {
      console.error('Error adding image to slide:', error)
      throw error
    }
  }

  const removeImageFromProject = async (imageId) => {
    try {
      const response = await fetch(`/api/project-images?projectId=${editingProject.id}&imageId=${imageId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to remove image from project')
      }

      return true
    } catch (error) {
      console.error('Error removing image from project:', error)
      throw error
    }
  }

  const removeImageFromSlide = async (imageId) => {
    try {
      const response = await fetch(`/api/slide-images?slideId=${editingSlide.id}&imageId=${imageId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to remove image from slide')
      }

      return true
    } catch (error) {
      console.error('Error removing image from slide:', error)
      throw error
    }
  }

  const setCoverImage = async (imageId, type = 'project') => {
    try {
      const endpoint = type === 'project' 
        ? `/api/project-images?projectId=${editingProject.id}`
        : `/api/slide-images?slideId=${editingSlide.id}`
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'setCover',
          imageId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to set cover image')
      }

      return true
    } catch (error) {
      console.error('Error setting cover image:', error)
      throw error
    }
  }

  // Hero Slides Management Functions
  const handleHeroSlideSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingHeroSlide) {
        // Update existing hero slide
        const response = await fetch('/api/hero-slides', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: editingHeroSlide.id,
            ...heroSlideFormData
          })
        })

        if (response.ok) {
          fetchHeroSlides()
          setHeroSlideFormData({
            title: '',
            description: '',
            imageId: null,
            displayOrder: 0,
            isActive: true
          })
          setEditingHeroSlide(null)
          alert('Hero slide updated successfully!')
        } else {
          alert('Failed to update hero slide')
        }
      } else {
        // Create new hero slide
        const response = await fetch('/api/hero-slides', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(heroSlideFormData)
        })

        if (response.ok) {
          fetchHeroSlides()
          setHeroSlideFormData({
            title: '',
            description: '',
            imageId: null,
            displayOrder: 0,
            isActive: true
          })
          alert('Hero slide created successfully!')
        } else {
          alert('Failed to create hero slide')
        }
      }
    } catch (error) {
      console.error('Error saving hero slide:', error)
      alert('Error saving hero slide')
    }
  }

  const handleEditHeroSlide = (slide) => {
    setEditingHeroSlide(slide)
    setHeroSlideFormData({
      title: slide.title || '',
      description: slide.description || '',
      imageId: slide.image_id || null,
      displayOrder: slide.display_order || 0,
      isActive: slide.is_active !== false
    })
  }

  const handleDeleteHeroSlide = async (id) => {
    if (confirm('Are you sure you want to delete this hero slide?')) {
      try {
        const response = await fetch(`/api/hero-slides?id=${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          fetchHeroSlides()
          alert('Hero slide deleted successfully!')
        } else {
          alert('Failed to delete hero slide')
        }
      } catch (error) {
        console.error('Error deleting hero slide:', error)
        alert('Error deleting hero slide')
      }
    }
  }

  // Check authentication on component mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    const loginTime = localStorage.getItem('admin_login_time')
    const userData = localStorage.getItem('admin_user')
    
    // Check if login is older than 24 hours
    if (!isAuthenticated || !loginTime || Date.now() - parseInt(loginTime) > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('admin_authenticated')
      localStorage.removeItem('admin_login_time')
      localStorage.removeItem('admin_user')
      localStorage.removeItem('admin_session_token')
      router.push('/admin/login')
      return
    }

    // Set current user data
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData))
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }

    fetchPrompts()
    fetchProjects()
    fetchSlides()
    fetchHeroSlides()
  }, [router, fetchPrompts, fetchProjects, fetchSlides, fetchHeroSlides])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const promptData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }

      if (editingPrompt) {
        // Update existing prompt
        const response = await fetch(`/api/prompts-neon?id=${editingPrompt._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(promptData),
        })

        if (response.ok) {
          setEditingPrompt(null)
          setShowAddForm(false)
          setShowEditModal(false)
          setFormData({
            title: '',
            category: '',
            tags: '',
            description: '',
            prompt: '',
            exampleInput: '',
            exampleOutput: ''
          })
          fetchPrompts()
          alert('Prompt updated successfully!')
        } else {
          alert('Error updating prompt')
        }
      } else {
        // Create new prompt
        const response = await fetch('/api/prompts-neon', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(promptData),
        })

        if (response.ok) {
          setShowAddForm(false)
          setFormData({
            title: '',
            category: '',
            tags: '',
            description: '',
            prompt: '',
            exampleInput: '',
            exampleOutput: ''
          })
          fetchPrompts()
          alert('Prompt added successfully!')
        } else {
          alert('Error adding prompt')
        }
      }
    } catch (error) {
      console.error('Error saving prompt:', error)
      alert('Error saving prompt')
    }
  }

  const handleEdit = (prompt) => {
    setEditingPrompt(prompt)
    setFormData({
      title: prompt.title,
      category: prompt.category,
      tags: prompt.tags.join(', '),
      description: prompt.description,
      prompt: prompt.prompt,
      exampleInput: prompt.exampleInput || '',
      exampleOutput: prompt.exampleOutput || ''
    })
    setShowEditModal(true)
  }

  const handleCancelEdit = () => {
    setEditingPrompt(null)
    setShowAddForm(false)
    setShowEditModal(false)
    setFormData({
      title: '',
      category: '',
      tags: '',
      description: '',
      prompt: '',
      exampleInput: '',
      exampleOutput: ''
    })
  }

  const handleCloseModal = () => {
    setShowEditModal(false)
    setShowAddForm(false)
    setEditingPrompt(null)
    setEditingProject(null)
    setEditingSlide(null)
    setFormData({
      title: '',
      category: '',
      tags: '',
      description: '',
      prompt: '',
      exampleInput: '',
      exampleOutput: ''
    })
    setProjectFormData({
      title: '',
      description: '',
      shortDescription: '',
      imageUrl: '',
      githubUrl: '',
      liveUrl: '',
      technologies: '',
      category: '',
      featured: false,
      orderIndex: 0
    })
    setSlideFormData({
      title: '',
      description: '',
      imageUrl: '',
      category: '',
      orderIndex: 0
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return

    try {
      const response = await fetch(`/api/prompts-neon?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPrompts()
        alert('Prompt deleted successfully!')
      } else {
        alert('Error deleting prompt')
      }
    } catch (error) {
      console.error('Error deleting prompt:', error)
      alert('Error deleting prompt')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    localStorage.removeItem('admin_login_time')
    localStorage.removeItem('admin_user')
    localStorage.removeItem('admin_session_token')
    router.push('/admin/login')
  }

  // Filter prompts based on search and category
  const filteredPrompts = (prompts || []).filter(prompt => {
    const matchesSearch = searchTerm === '' || 
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prompt.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'All' || prompt.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // Get statistics
  const stats = {
    total: prompts?.length || 0,
    categories: [...new Set((prompts || []).map(p => p.category))].length,
    code: (prompts || []).filter(p => p.category === 'Code').length,
    mail: (prompts || []).filter(p => p.category === 'Mail').length,
    data: (prompts || []).filter(p => p.category === 'Data').length,
    content: (prompts || []).filter(p => p.category === 'Content').length,
    role: (prompts || []).filter(p => p.category === 'Role').length,
    verifier: (prompts || []).filter(p => p.category === 'Verifier').length
  }

  const categories = ['All', 'Code', 'Mail', 'Data', 'Content', 'Role', 'Verifier']

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showEditModal) {
        handleCloseModal()
      }
    }

    if (showEditModal) {
      document.addEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'hidden' // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [showEditModal])

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
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <div className="hidden md:block">
                <p className="text-sm text-gray-500">Prompt Techniques Hub Management</p>
                {currentUser && (
                  <p className="text-xs text-gray-400">Logged in as: {currentUser.username}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'prompts', name: 'Manage Prompts', icon: '📝' },
              { id: 'projects', name: 'Featured Projects', icon: '🚀' },
              { id: 'slides', name: 'Work Slides', icon: '🖼️' },
              { id: 'hero-slides', name: 'Hero Slides', icon: '🎨' },
              { id: 'analytics', name: 'Analytics', icon: '📈' },
              { id: 'settings', name: 'Settings', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Prompts</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Categories</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.categories}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Code Prompts</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.code}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Mail Prompts</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.mail}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Category Breakdown</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                  {categories.slice(1).map((category) => (
                    <div key={category} className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{stats[category.toLowerCase()] || 0}</div>
                      <div className="text-sm text-gray-500">{category}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <button
                    onClick={() => setActiveTab('prompts')}
                    className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-300 hover:border-gray-400"
                  >
                    <div>
                      <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </span>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-900">Add New Prompt</h3>
                      <p className="mt-2 text-sm text-gray-500">Create a new prompt for the collection</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('prompts')}
                    className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-300 hover:border-gray-400"
                  >
                    <div>
                      <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </span>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-900">Manage Prompts</h3>
                      <p className="mt-2 text-sm text-gray-500">Edit, delete, and organize prompts</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-300 hover:border-gray-400"
                  >
                    <div>
                      <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </span>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-900">View Analytics</h3>
                      <p className="mt-2 text-sm text-gray-500">Analyze prompt usage and performance</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Prompts Tab */}
        {activeTab === 'prompts' && (
          <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search Prompts</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Search by title, description, or tags..."
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {showAddForm ? 'Cancel' : 'Add New Prompt'}
                  </button>
                </div>
              </div>
            </div>

            {/* Add Form */}
            {showAddForm && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Add New Prompt</h2>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter prompt title"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        >
                          <option value="">Select Category</option>
                          <option value="Code">Code</option>
                          <option value="Mail">Mail</option>
                          <option value="Data">Data</option>
                          <option value="Content">Content</option>
                          <option value="Role">Role</option>
                          <option value="Verifier">Verifier</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g., email, professional, business (comma-separated)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        rows={3}
                        placeholder="Brief description of what this prompt does"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prompt Template</label>
                      <textarea
                        value={formData.prompt}
                        onChange={(e) => setFormData({...formData, prompt: e.target.value})}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
                        rows={6}
                        placeholder="Enter the prompt template with placeholders like <<INPUT>>"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Example Input</label>
                        <textarea
                          value={formData.exampleInput}
                          onChange={(e) => setFormData({...formData, exampleInput: e.target.value})}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          rows={3}
                          placeholder="Example input for the prompt"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Example Output</label>
                        <textarea
                          value={formData.exampleOutput}
                          onChange={(e) => setFormData({...formData, exampleOutput: e.target.value})}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          rows={3}
                          placeholder="Expected output from the prompt"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Add Prompt
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Prompts List */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Prompts ({filteredPrompts.length})
                  </h3>
                  <div className="text-sm text-gray-500">
                    Showing {filteredPrompts.length} of {prompts.length} prompts
                  </div>
                </div>
                
                {filteredPrompts.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No prompts found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm || selectedCategory !== 'All' 
                        ? 'Try adjusting your search or filter criteria.'
                        : 'Get started by adding a new prompt.'
                      }
                    </p>
                    {!searchTerm && selectedCategory === 'All' && (
                      <div className="mt-6">
                        <button
                          onClick={() => setShowAddForm(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add New Prompt
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPrompts.map((prompt) => (
                      <div key={prompt._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-medium text-gray-900 truncate">{prompt.title}</h4>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {prompt.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{prompt.description}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {prompt.tags.map((tag, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="text-xs text-gray-500">
                              Created: {new Date(prompt.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => handleEdit(prompt)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(prompt._id)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Projects Header */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Featured Projects</h2>
                  <p className="text-gray-600 mt-1">Manage your portfolio projects</p>
                </div>
                <button
                  onClick={() => {
                    setEditingProject(null)
                    setProjectFormData({
                      title: '',
                      description: '',
                      shortDescription: '',
                      detailedDescription: '',
                      imageUrl: '',
                      imageId: null,
                      coverImageId: null,
                      images: [],
                      githubUrl: '',
                      liveUrl: '',
                      technologies: '',
                      toolsUsed: '',
                      category: '',
                      featured: false,
                      orderIndex: 0,
                      projectDate: '',
                      clientName: '',
                      projectStatus: 'completed'
                    })
                    setShowAddForm(true)
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Add New Project
                </button>
              </div>
            </div>

            {/* Projects List */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Projects ({(projects || []).length})</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {(projects || []).map((project) => (
                  <div key={project.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-lg font-medium text-gray-900">{project.title}</h4>
                          {project.featured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{project.shortDescription}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500">Category: {project.category}</span>
                          <span className="text-sm text-gray-500">Order: {project.orderIndex}</span>
                          {project.technologies && (project.technologies || []).length > 0 && (
                            <div className="flex space-x-1">
                              {project.technologies.slice(0, 3).map((tech, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {tech}
                                </span>
                              ))}
                              {(project.technologies || []).length > 3 && (
                                <span className="text-xs text-gray-500">+{(project.technologies || []).length - 3} more</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingProject(project)
                            setProjectFormData({
                              title: project.title,
                              description: project.description,
                              shortDescription: project.shortDescription,
                              imageUrl: project.imageUrl,
                              githubUrl: project.githubUrl,
                              liveUrl: project.liveUrl,
                              technologies: project.technologies.join(', '),
                              category: project.category,
                              featured: project.featured,
                              orderIndex: project.orderIndex
                            })
                            setShowAddForm(true)
                          }}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete this project?')) {
                              try {
                                const response = await fetch(`/api/projects?id=${project.id}`, {
                                  method: 'DELETE'
                                })
                                if (response.ok) {
                                  fetchProjects()
                                  alert('Project deleted successfully!')
                                } else {
                                  alert('Error deleting project')
                                }
                              } catch (error) {
                                console.error('Error deleting project:', error)
                                alert('Error deleting project')
                              }
                            }
                          }}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {(projects || []).length === 0 && (
                  <div className="p-6 text-center text-gray-500">
                    No projects found. Add your first project to get started.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Slides Tab */}
        {activeTab === 'slides' && (
          <div className="space-y-6">
            {/* Slides Header */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Work & Workshop Slides</h2>
                  <p className="text-gray-600 mt-1">Manage your work and workshop images</p>
                </div>
                <button
                  onClick={() => {
                    setEditingSlide(null)
                    setSlideFormData({
                      title: '',
                      description: '',
                      detailedDescription: '',
                      imageUrl: '',
                      imageId: null,
                      coverImageId: null,
                      images: [],
                      category: '',
                      orderIndex: 0,
                      workshopDate: '',
                      durationHours: '',
                      participantsCount: '',
                      workshopType: ''
                    })
                    setShowAddForm(true)
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Add New Slide
                </button>
              </div>
            </div>

            {/* Slides Grid */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Slides ({(slides || []).length})</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(slides || []).map((slide) => (
                    <div key={slide.id} className="bg-gray-50 rounded-lg overflow-hidden">
                      <div className="aspect-w-16 aspect-h-9">
                        <DatabaseImage
                          imageId={slide.imageId}
                          imageUrl={slide.imageUrl}
                          alt={slide.title}
                          className="w-full h-48 object-cover"
                          fallback={
                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400">No Image</span>
                            </div>
                          }
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="text-lg font-medium text-gray-900">{slide.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{slide.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-500">{slide.category}</span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingSlide(slide)
                                setSlideFormData({
                                  title: slide.title,
                                  description: slide.description,
                                  imageUrl: slide.imageUrl,
                                  category: slide.category,
                                  orderIndex: slide.orderIndex
                                })
                                setShowAddForm(true)
                              }}
                              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm('Are you sure you want to delete this slide?')) {
                                  try {
                                    const response = await fetch(`/api/slides?id=${slide.id}`, {
                                      method: 'DELETE'
                                    })
                                    if (response.ok) {
                                      fetchSlides()
                                      alert('Slide deleted successfully!')
                                    } else {
                                      alert('Error deleting slide')
                                    }
                                  } catch (error) {
                                    console.error('Error deleting slide:', error)
                                    alert('Error deleting slide')
                                  }
                                }
                              }}
                              className="text-red-600 hover:text-red-900 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(slides || []).length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-8">
                      No slides found. Add your first slide to get started.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Slides Tab */}
        {activeTab === 'hero-slides' && (
          <div className="space-y-6">
            {/* Hero Slides Header */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Hero Slides</h2>
                  <p className="text-gray-600 mt-1">Manage the slideshow images displayed above the About section</p>
                </div>
                <button
                  onClick={() => {
                    setEditingHeroSlide(null)
                    setHeroSlideFormData({
                      title: '',
                      description: '',
                      imageId: null,
                      displayOrder: 0,
                      isActive: true
                    })
                    setShowAddForm(true)
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Add New Hero Slide
                </button>
              </div>
            </div>

            {/* Hero Slides Grid */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Hero Slides ({(heroSlides || []).length})</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(heroSlides || []).map((slide) => (
                    <div key={slide.id} className="bg-gray-50 rounded-lg overflow-hidden">
                      <div className="aspect-w-16 aspect-h-9">
                        <DatabaseImage
                          imageId={slide.image_id}
                          imageUrl={slide.image_url}
                          alt={slide.title}
                          className="w-full h-48 object-cover"
                          fallback={
                            <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                              <span className="text-white text-2xl">🖼️</span>
                            </div>
                          }
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{slide.title}</h4>
                        {slide.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{slide.description}</p>
                        )}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span>Order: {slide.display_order}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            slide.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {slide.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditHeroSlide(slide)}
                            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteHeroSlide(slide.id)}
                            className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(heroSlides || []).length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <div className="text-gray-400 text-6xl mb-4">🖼️</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Hero Slides</h3>
                      <p className="text-gray-500 mb-4">Get started by adding your first hero slide</p>
                      <button
                        onClick={() => {
                          setEditingHeroSlide(null)
                          setHeroSlideFormData({
                            title: '',
                            description: '',
                            imageId: null,
                            displayOrder: 0,
                            isActive: true
                          })
                          setShowAddForm(true)
                        }}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Add First Hero Slide
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Analytics Overview</h3>
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Analytics Coming Soon</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Advanced analytics and usage tracking will be available in a future update.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Settings</h3>
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Settings Coming Soon</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Configuration options and preferences will be available in a future update.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
            onClick={handleCloseModal}
          >
            <div 
              className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mt-3">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Edit Prompt</h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter prompt title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Code">Code</option>
                        <option value="Mail">Mail</option>
                        <option value="Data">Data</option>
                        <option value="Content">Content</option>
                        <option value="Role">Role</option>
                        <option value="Verifier">Verifier</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="e.g., email, professional, business (comma-separated)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      rows={3}
                      placeholder="Brief description of what this prompt does"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prompt Template</label>
                    <textarea
                      value={formData.prompt}
                      onChange={(e) => setFormData({...formData, prompt: e.target.value})}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
                      rows={6}
                      placeholder="Enter the prompt template with placeholders like <<INPUT>>"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Example Input</label>
                      <textarea
                        value={formData.exampleInput}
                        onChange={(e) => setFormData({...formData, exampleInput: e.target.value})}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        rows={3}
                        placeholder="Example input for the prompt"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Example Output</label>
                      <textarea
                        value={formData.exampleOutput}
                        onChange={(e) => setFormData({...formData, exampleOutput: e.target.value})}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        rows={3}
                        placeholder="Expected output from the prompt"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Update Prompt
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Project Form Modal */}
        {showAddForm && (editingProject !== null || activeTab === 'projects') && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
            onClick={handleCloseModal}
          >
            <div 
              className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mt-3">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingProject ? 'Edit Project' : 'Add New Project'}
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  try {
                    const projectData = {
                      ...projectFormData,
                      technologies: projectFormData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
                      toolsUsed: projectFormData.toolsUsed.split(',').map(tool => tool.trim()).filter(tool => tool)
                    }

                    if (editingProject) {
                      const response = await fetch(`/api/projects?id=${editingProject.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(projectData)
                      })
                      if (response.ok) {
                        // Handle image associations for existing projects
                        if ((projectFormData.images || []).length > 0) {
                          for (const image of projectFormData.images) {
                            await addImageToProject(image.id, image.is_cover)
                          }
                        }
                        fetchProjects()
                        alert('Project updated successfully!')
                      } else {
                        alert('Error updating project')
                      }
                    } else {
                      const response = await fetch('/api/projects', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(projectData)
                      })
                      if (response.ok) {
                        const newProject = await response.json()
                        // Handle image associations for new projects
                        if ((projectFormData.images || []).length > 0) {
                          for (const image of projectFormData.images) {
                            await addImageToProject(newProject.id, image.is_cover)
                          }
                        }
                        fetchProjects()
                        alert('Project added successfully!')
                      } else {
                        alert('Error adding project')
                      }
                    }
                    handleCloseModal()
                  } catch (error) {
                    console.error('Error saving project:', error)
                    alert('Error saving project')
                  }
                }} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Project Title</label>
                      <input
                        type="text"
                        value={projectFormData.title}
                        onChange={(e) => setProjectFormData({...projectFormData, title: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <select
                        value={projectFormData.category}
                        onChange={(e) => setProjectFormData({...projectFormData, category: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Web Application">Web Application</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="Desktop App">Desktop App</option>
                        <option value="API">API</option>
                        <option value="Library">Library</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Short Description</label>
                    <input
                      type="text"
                      value={projectFormData.shortDescription}
                      onChange={(e) => setProjectFormData({...projectFormData, shortDescription: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Brief description for display"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Description</label>
                    <textarea
                      value={projectFormData.description}
                      onChange={(e) => setProjectFormData({...projectFormData, description: e.target.value})}
                      rows={4}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Detailed project description"
                    />
                  </div>

                  {/* Enhanced Project Images Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Project Images</label>
                    
                    {/* Image Upload */}
                    <div className="mb-4">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={async (e) => {
                          const files = Array.from(e.target.files)
                          for (const file of files) {
                            const uploadedImage = await uploadImage(file)
                            if (uploadedImage) {
                              const newImage = {
                                id: uploadedImage.id,
                                filename: uploadedImage.filename,
                                mime_type: uploadedImage.mime_type,
                                size: uploadedImage.size,
                                is_cover: (projectFormData.images || []).length === 0, // First image is cover by default
                                display_order: (projectFormData.images || []).length
                              }
                              setProjectFormData({
                                ...projectFormData,
                                images: [...projectFormData.images, newImage],
                                coverImageId: (projectFormData.images || []).length === 0 ? uploadedImage.id : projectFormData.coverImageId,
                                imageId: projectFormData.imageId || uploadedImage.id, // Keep first image as main
                                imageUrl: projectFormData.imageUrl || `/api/images/${uploadedImage.id}`
                              })
                            }
                          }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                      {uploadingImage && (
                        <div className="mt-2 text-sm text-blue-600">Uploading images...</div>
                      )}
                    </div>

                    {/* Image Gallery */}
                    {(projectFormData.images || []).length > 0 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {(projectFormData.images || []).map((image, index) => (
                            <div key={image.id} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                                <img
                                  src={`/api/images/${image.id}`}
                                  alt={`Project image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              
                              {/* Cover Badge */}
                              {image.is_cover && (
                                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                  Cover
                                </div>
                              )}
                              
                              {/* Action Buttons */}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                                  {!image.is_cover && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updatedImages = projectFormData.images.map(img => ({
                                          ...img,
                                          is_cover: img.id === image.id
                                        }))
                                        setProjectFormData({
                                          ...projectFormData,
                                          images: updatedImages,
                                          coverImageId: image.id
                                        })
                                      }}
                                      className="bg-yellow-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-yellow-600"
                                    >
                                      Set Cover
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedImages = projectFormData.images.filter(img => img.id !== image.id)
                                      setProjectFormData({
                                        ...projectFormData,
                                        images: updatedImages,
                                        coverImageId: image.is_cover && (updatedImages || []).length > 0 ? updatedImages[0].id : projectFormData.coverImageId
                                      })
                                    }}
                                    className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-600"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          {(projectFormData.images || []).length} image{(projectFormData.images || []).length !== 1 ? 's' : ''} uploaded
                          {projectFormData.coverImageId && (
                            <span className="ml-2 text-yellow-600">• Cover image selected</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Technologies (comma-separated)</label>
                      <input
                        type="text"
                        value={projectFormData.technologies}
                        onChange={(e) => setProjectFormData({...projectFormData, technologies: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="React, Node.js, MongoDB"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tools Used (comma-separated)</label>
                      <input
                        type="text"
                        value={projectFormData.toolsUsed}
                        onChange={(e) => setProjectFormData({...projectFormData, toolsUsed: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="VS Code, Git, Docker"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
                      <input
                        type="url"
                        value={projectFormData.githubUrl}
                        onChange={(e) => setProjectFormData({...projectFormData, githubUrl: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="https://github.com/username/repo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Live URL</label>
                      <input
                        type="url"
                        value={projectFormData.liveUrl}
                        onChange={(e) => setProjectFormData({...projectFormData, liveUrl: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="https://project-demo.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Project Date</label>
                      <input
                        type="date"
                        value={projectFormData.projectDate}
                        onChange={(e) => setProjectFormData({...projectFormData, projectDate: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Client Name</label>
                      <input
                        type="text"
                        value={projectFormData.clientName}
                        onChange={(e) => setProjectFormData({...projectFormData, clientName: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Client or organization name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Project Status</label>
                      <select
                        value={projectFormData.projectStatus}
                        onChange={(e) => setProjectFormData({...projectFormData, projectStatus: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="completed">Completed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="on-hold">On Hold</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Order Index</label>
                      <input
                        type="number"
                        value={projectFormData.orderIndex}
                        onChange={(e) => setProjectFormData({...projectFormData, orderIndex: parseInt(e.target.value) || 0})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        min="0"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={projectFormData.featured}
                        onChange={(e) => setProjectFormData({...projectFormData, featured: e.target.checked})}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                        Featured Project
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Detailed Description</label>
                    <textarea
                      value={projectFormData.detailedDescription}
                      onChange={(e) => setProjectFormData({...projectFormData, detailedDescription: e.target.value})}
                      rows={4}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Comprehensive project description with technical details, challenges, and solutions"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {editingProject ? 'Update Project' : 'Add Project'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Slide Form Modal */}
        {showAddForm && (editingSlide !== null || activeTab === 'slides') && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
            onClick={handleCloseModal}
          >
            <div 
              className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mt-3">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingSlide ? 'Edit Slide' : 'Add New Slide'}
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  try {
                    if (editingSlide) {
                      const response = await fetch(`/api/slides?id=${editingSlide.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(slideFormData)
                      })
                      if (response.ok) {
                        // Handle image associations for existing slides
                        if ((slideFormData.images || []).length > 0) {
                          for (const image of slideFormData.images) {
                            await addImageToSlide(image.id, image.is_cover)
                          }
                        }
                        fetchSlides()
                        alert('Slide updated successfully!')
                      } else {
                        alert('Error updating slide')
                      }
                    } else {
                      const response = await fetch('/api/slides', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(slideFormData)
                      })
                      if (response.ok) {
                        const newSlide = await response.json()
                        // Handle image associations for new slides
                        if ((slideFormData.images || []).length > 0) {
                          for (const image of slideFormData.images) {
                            await addImageToSlide(newSlide.id, image.is_cover)
                          }
                        }
                        fetchSlides()
                        alert('Slide added successfully!')
                      } else {
                        alert('Error adding slide')
                      }
                    }
                    handleCloseModal()
                  } catch (error) {
                    console.error('Error saving slide:', error)
                    alert('Error saving slide')
                  }
                }} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Slide Title</label>
                    <input
                      type="text"
                      value={slideFormData.title}
                      onChange={(e) => setSlideFormData({...slideFormData, title: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={slideFormData.description}
                      onChange={(e) => setSlideFormData({...slideFormData, description: e.target.value})}
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Brief description of the work or workshop"
                    />
                  </div>

                  {/* Enhanced Slide Images Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Workshop Slides</label>
                    
                    {/* Image Upload */}
                    <div className="mb-4">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={async (e) => {
                          const files = Array.from(e.target.files)
                          for (const file of files) {
                            const uploadedImage = await uploadImage(file)
                            if (uploadedImage) {
                              const newImage = {
                                id: uploadedImage.id,
                                filename: uploadedImage.filename,
                                mime_type: uploadedImage.mime_type,
                                size: uploadedImage.size,
                                is_cover: (slideFormData.images || []).length === 0, // First image is cover by default
                                display_order: (slideFormData.images || []).length
                              }
                              setSlideFormData({
                                ...slideFormData,
                                images: [...slideFormData.images, newImage],
                                coverImageId: (slideFormData.images || []).length === 0 ? uploadedImage.id : slideFormData.coverImageId,
                                imageId: slideFormData.imageId || uploadedImage.id, // Keep first image as main
                                imageUrl: slideFormData.imageUrl || `/api/images/${uploadedImage.id}`
                              })
                            }
                          }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                      {uploadingImage && (
                        <div className="mt-2 text-sm text-blue-600">Uploading slides...</div>
                      )}
                    </div>

                    {/* Image Gallery */}
                    {(slideFormData.images || []).length > 0 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {(slideFormData.images || []).map((image, index) => (
                            <div key={image.id} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                                <img
                                  src={`/api/images/${image.id}`}
                                  alt={`Slide ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              
                              {/* Cover Badge */}
                              {image.is_cover && (
                                <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                  Cover
                                </div>
                              )}
                              
                              {/* Action Buttons */}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                                  {!image.is_cover && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updatedImages = slideFormData.images.map(img => ({
                                          ...img,
                                          is_cover: img.id === image.id
                                        }))
                                        setSlideFormData({
                                          ...slideFormData,
                                          images: updatedImages,
                                          coverImageId: image.id
                                        })
                                      }}
                                      className="bg-purple-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-purple-600"
                                    >
                                      Set Cover
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedImages = slideFormData.images.filter(img => img.id !== image.id)
                                      setSlideFormData({
                                        ...slideFormData,
                                        images: updatedImages,
                                        coverImageId: image.is_cover && (updatedImages || []).length > 0 ? updatedImages[0].id : slideFormData.coverImageId
                                      })
                                    }}
                                    className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-600"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          {(slideFormData.images || []).length} slide{(slideFormData.images || []).length !== 1 ? 's' : ''} uploaded
                          {slideFormData.coverImageId && (
                            <span className="ml-2 text-purple-600">• Cover slide selected</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Workshop Type</label>
                      <select
                        value={slideFormData.workshopType}
                        onChange={(e) => setSlideFormData({...slideFormData, workshopType: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Type</option>
                        <option value="Technical">Technical</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Presentation">Presentation</option>
                        <option value="Training">Training</option>
                        <option value="Conference">Conference</option>
                        <option value="Event">Event</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <select
                        value={slideFormData.category}
                        onChange={(e) => setSlideFormData({...slideFormData, category: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Category</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Conference">Conference</option>
                        <option value="Event">Event</option>
                        <option value="Work">Work</option>
                        <option value="Presentation">Presentation</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Workshop Date</label>
                      <input
                        type="date"
                        value={slideFormData.workshopDate}
                        onChange={(e) => setSlideFormData({...slideFormData, workshopDate: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duration (hours)</label>
                      <input
                        type="number"
                        value={slideFormData.durationHours}
                        onChange={(e) => setSlideFormData({...slideFormData, durationHours: parseInt(e.target.value) || 0})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        min="0"
                        placeholder="2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Participants Count</label>
                      <input
                        type="number"
                        value={slideFormData.participantsCount}
                        onChange={(e) => setSlideFormData({...slideFormData, participantsCount: parseInt(e.target.value) || 0})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        min="0"
                        placeholder="25"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Detailed Description</label>
                    <textarea
                      value={slideFormData.detailedDescription}
                      onChange={(e) => setSlideFormData({...slideFormData, detailedDescription: e.target.value})}
                      rows={4}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Comprehensive workshop description with objectives, agenda, and key takeaways"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Order Index</label>
                      <input
                        type="number"
                        value={slideFormData.orderIndex}
                        onChange={(e) => setSlideFormData({...slideFormData, orderIndex: parseInt(e.target.value) || 0})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {editingSlide ? 'Update Slide' : 'Add Slide'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Hero Slide Form Modal */}
        {showAddForm && (editingHeroSlide !== null || activeTab === 'hero-slides') && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
            onClick={handleCloseModal}
          >
            <div 
              className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mt-3">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingHeroSlide ? 'Edit Hero Slide' : 'Add New Hero Slide'}
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleHeroSlideSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title *</label>
                    <input
                      type="text"
                      value={heroSlideFormData.title}
                      onChange={(e) => setHeroSlideFormData({...heroSlideFormData, title: e.target.value})}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter slide title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={heroSlideFormData.description}
                      onChange={(e) => setHeroSlideFormData({...heroSlideFormData, description: e.target.value})}
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter slide description (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0]
                        if (file) {
                          const uploadedImage = await uploadImage(file)
                          if (uploadedImage) {
                            setHeroSlideFormData({
                              ...heroSlideFormData,
                              imageId: uploadedImage.id
                            })
                          }
                        }
                      }}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {uploadingImage && (
                      <div className="mt-2 text-sm text-blue-600">Uploading image...</div>
                    )}
                    {heroSlideFormData.imageId && (
                      <div className="mt-2">
                        <DatabaseImage
                          imageId={heroSlideFormData.imageId}
                          alt="Preview"
                          className="w-32 h-20 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Display Order</label>
                      <input
                        type="number"
                        value={heroSlideFormData.displayOrder}
                        onChange={(e) => setHeroSlideFormData({...heroSlideFormData, displayOrder: parseInt(e.target.value) || 0})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        value={heroSlideFormData.isActive}
                        onChange={(e) => setHeroSlideFormData({...heroSlideFormData, isActive: e.target.value === 'true'})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {editingHeroSlide ? 'Update Hero Slide' : 'Add Hero Slide'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
