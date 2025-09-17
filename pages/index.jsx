import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { useScrollPosition } from '../hooks/useScrollAnimation'
import DatabaseImage from '../components/DatabaseImage'
import ImageSlideshow from '../components/ImageSlideshow'
import ProjectDetailModal from '../components/ProjectDetailModal'
import WorkshopDetailModal from '../components/WorkshopDetailModal'
import HeroSlides from '../components/HeroSlides'

// Skills Section Component
const SkillsSection = ({ skills }) => {
  // Group skills by category
  const groupedSkills = (skills || []).reduce((acc, skill) => {
    const category = skill.category || 'Technologies'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(skill)
    return acc
  }, {})

  // Category colors and icons
  const categoryStyles = {
    'Programming Languages': { color: 'from-blue-500 to-cyan-500', icon: '💻' },
    'Frontend Frameworks': { color: 'from-cyan-400 to-blue-500', icon: '🎨' },
    'Backend Frameworks': { color: 'from-green-500 to-emerald-500', icon: '⚙️' },
    'Mobile Development': { color: 'from-purple-500 to-pink-500', icon: '📱' },
    'Databases': { color: 'from-yellow-500 to-orange-500', icon: '🗄️' },
    'Cloud Platforms': { color: 'from-orange-500 to-red-500', icon: '☁️' },
    'DevOps': { color: 'from-indigo-500 to-purple-500', icon: '🔧' },
    'CI/CD': { color: 'from-pink-500 to-rose-500', icon: '🔄' },
    'Version Control': { color: 'from-gray-500 to-gray-700', icon: '📝' },
    'AI Frameworks': { color: 'from-purple-600 to-indigo-600', icon: '🤖' },
    'Artificial Intelligence': { color: 'from-violet-500 to-purple-500', icon: '🧠' },
    'Web Frameworks': { color: 'from-emerald-500 to-teal-500', icon: '🌐' },
    'Design Tools': { color: 'from-pink-400 to-purple-400', icon: '🎭' },
    'Technologies': { color: 'from-slate-500 to-gray-600', icon: '⚡' }
  }

  const categories = Object.keys(groupedSkills).sort()
  const [activeTab, setActiveTab] = useState(categories[0] || '')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Continuous auto-rotation effect
  useEffect(() => {
    if (categories.length <= 1) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % categories.length)
        setActiveTab(categories[(currentIndex + 1) % categories.length])
        setIsTransitioning(false)
      }, 300) // Half of transition duration
    }, 5000) // Change tab every 5 seconds

    return () => clearInterval(interval)
  }, [categories, currentIndex])

  // Update activeTab when currentIndex changes
  useEffect(() => {
    if (categories.length > 0) {
      setActiveTab(categories[currentIndex])
    }
  }, [currentIndex, categories])

  if (categories.length === 0) return null

  return (
    <section id="skills" className="py-12 sm:py-16 lg:py-20 px-4 bg-gray-800/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Skills & Technologies
        </h2>
        
        <div className="relative">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            {categories.map((category, index) => {
              const categoryStyle = categoryStyles[category] || categoryStyles['Technologies']
              const isActive = activeTab === category
              
              return (
                <button
                  key={category}
                  onClick={() => {
                    setCurrentIndex(index)
                    setActiveTab(category)
                  }}
                  className={`flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-500 text-sm sm:text-base ${
                    isActive
                      ? `bg-gradient-to-r ${categoryStyle.color} text-white shadow-lg transform scale-105`
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white hover:scale-105'
                  }`}
                >
                  <span className="text-sm sm:text-lg mr-1 sm:mr-2">{categoryStyle.icon}</span>
                  <span className="font-medium hidden sm:inline">{category}</span>
                  <span className="font-medium sm:hidden">{category.split(' ')[0]}</span>
                  <span className={`ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs transition-all duration-300 ${
                    isActive ? 'bg-white/20' : 'bg-gray-600/50'
                  }`}>
                    {groupedSkills[category].length}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {categories.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === currentIndex
                      ? 'w-8 bg-gradient-to-r from-blue-400 to-purple-400'
                      : 'w-2 bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Active Tab Content with Smooth Transitions */}
          <div className="min-h-[300px] sm:min-h-[400px] relative overflow-hidden">
            {activeTab && groupedSkills[activeTab] && (
              <div 
                className={`transition-all duration-500 transform ${
                  isTransitioning 
                    ? 'opacity-0 translate-x-8 scale-95' 
                    : 'opacity-100 translate-x-0 scale-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center justify-center mb-6 sm:mb-8">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r ${categoryStyles[activeTab]?.color || categoryStyles['Technologies'].color} flex items-center justify-center text-2xl sm:text-3xl mr-0 sm:mr-4 mb-2 sm:mb-0 transition-all duration-500 ${
                    isTransitioning ? 'scale-90' : 'scale-100'
                  }`}>
                    {categoryStyles[activeTab]?.icon || categoryStyles['Technologies'].icon}
                  </div>
                  <div className="text-center">
                    <h3 className={`text-xl sm:text-2xl lg:text-3xl font-bold text-white transition-all duration-500 ${
                      isTransitioning ? 'translate-y-2 opacity-70' : 'translate-y-0 opacity-100'
                    }`}>
                      {activeTab}
                    </h3>
                    <p className={`text-sm sm:text-base text-gray-400 transition-all duration-500 ${
                      isTransitioning ? 'translate-y-1 opacity-50' : 'translate-y-0 opacity-100'
                    }`}>
                      {groupedSkills[activeTab].length} skills in this category
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                  {groupedSkills[activeTab].map((skill, skillIndex) => (
                    <div
                      key={skill.name}
                      className={`bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-500 transform hover:scale-105 group ${
                        isTransitioning ? 'opacity-60 scale-95' : 'opacity-100 scale-100'
                      }`}
                      style={{ 
                        animationDelay: `${skillIndex * 0.05}s`,
                        transitionDelay: `${skillIndex * 0.02}s`
                      }}
                    >
                      <div className="text-center">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-gradient-to-r ${skill.color} flex items-center justify-center text-sm sm:text-base lg:text-lg font-bold text-white group-hover:scale-110 transition-all duration-300 ${
                          isTransitioning ? 'scale-90' : 'scale-100'
                        }`}>
                          {skill.name.charAt(0)}
                        </div>
                        <h4 className={`text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-white group-hover:text-blue-300 transition-all duration-300 ${
                          isTransitioning ? 'opacity-70' : 'opacity-100'
                        }`}>
                          {skill.name}
                        </h4>
                        <div className="w-full bg-gray-700 rounded-full h-1 sm:h-1.5 mb-1 sm:mb-2">
                          <div
                            className={`h-1 sm:h-1.5 rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000 ${
                              isTransitioning ? 'opacity-60' : 'opacity-100'
                            }`}
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs text-gray-400 transition-all duration-300 ${
                          isTransitioning ? 'opacity-50' : 'opacity-100'
                        }`}>
                          {skill.level}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Auto-rotation Indicator */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Auto-rotating through {categories.length} categories</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [projects, setProjects] = useState([])
  const [slides, setSlides] = useState([])
  const [skills, setSkills] = useState([])
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedSlide, setSelectedSlide] = useState(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showSlideModal, setShowSlideModal] = useState(false)
  const scrollPosition = useScrollPosition()

  useEffect(() => {
    setIsScrolled(scrollPosition > 50)
    setShowBackToTop(scrollPosition > 300)
  }, [scrollPosition])

  // Fetch projects and slides from database with enhanced data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, slidesRes, skillsRes, featuredProjectsRes] = await Promise.all([
          fetch('/api/projects-enhanced?withImages=true'),
          fetch('/api/slides-enhanced?withImages=true'),
          fetch('/api/skills'),
          fetch('/api/featured-projects')
        ])
        
        const projectsData = await projectsRes.json()
        const slidesData = await slidesRes.json()
        const skillsData = await skillsRes.json()
        const featuredProjectsData = await featuredProjectsRes.json()
        
        setProjects(projectsData || [])
        setSlides(slidesData || [])
        setSkills(skillsData || [])
        setFeaturedProjects(featuredProjectsData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        // Fallback to hardcoded data if API fails
        setProjects([
          {
            id: 1,
            title: 'Prompt Techniques Hub',
            description: 'A comprehensive AI prompt library with advanced filtering, admin dashboard, and database management.',
            short_description: 'AI prompt library with search and filtering',
            technologies: ['Next.js', 'PostgreSQL', 'Neon', 'TailwindCSS', 'bcrypt'],
            image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
            live_url: '/',
            github_url: 'https://github.com/ismilebharmal/prompt_techniques',
            featured: true,
            images: []
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  const handleProjectClick = (project) => {
    setSelectedProject(project)
    setShowProjectModal(true)
  }

  const handleSlideClick = (slide) => {
    setSelectedSlide(slide)
    setShowSlideModal(true)
  }

  const closeProjectModal = () => {
    setShowProjectModal(false)
    setSelectedProject(null)
  }

  const closeSlideModal = () => {
    setShowSlideModal(false)
    setSelectedSlide(null)
  }



  return (
    <>
      <Head>
        <title>Ismile Bharmal - Full Stack Developer & AI Enthusiast</title>
        <meta name="description" content="Portfolio of Ismile Bharmal - Full Stack Developer specializing in React, Node.js, and AI applications. Explore my projects and AI prompt templates." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
        {/* Navigation */}
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3 sm:py-4">
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Ismile Bharmal
              </div>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex space-x-8">
                {['home', 'about', 'skills', 'featured-work', 'workshops', 'prompts', 'contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className={`capitalize transition-colors duration-200 hover:text-blue-400 ${
                      activeSection === item ? 'text-blue-400' : 'text-gray-300'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-white p-2 -mr-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden bg-gray-900/95 backdrop-blur-md rounded-lg mt-2 p-4 border border-gray-700/50">
                {['home', 'about', 'skills', 'featured-work', 'workshops', 'prompts', 'contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className="block w-full text-left py-3 px-2 capitalize transition-colors duration-200 hover:text-blue-400 hover:bg-gray-800/50 rounded-lg text-sm sm:text-base"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section with Animated Background */}
        <section id="home" className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden pt-16 sm:pt-20">
          {/* Animated Gradient Mesh Backgrounds */}
          <div className="absolute inset-0">
            {/* Gradient Mesh 1 */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
            
            {/* Gradient Mesh 2 */}
            <div className="absolute inset-0 bg-gradient-to-tl from-emerald-600/15 via-cyan-600/15 to-blue-600/15 animate-pulse" style={{animationDelay: '1s'}}></div>
            
            {/* Gradient Mesh 3 */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-rose-600/10 animate-pulse" style={{animationDelay: '2s'}}></div>
            
            {/* Animated Blob Shapes */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-pink-500/30 to-rose-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{animationDelay: '2s'}}></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-yellow-500/30 to-pink-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{animationDelay: '4s'}}></div>
            
            {/* Floating Code Elements */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Dart/Flutter Code */}
              <div className="absolute top-20 left-10 text-green-400/20 text-xs font-mono animate-float" style={{animationDelay: '0s'}}>
                <pre>{`class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
    );
  }
}`}</pre>
              </div>
              
              {/* Python/AI Code */}
              <div className="absolute top-40 right-10 text-blue-400/20 text-xs font-mono animate-float" style={{animationDelay: '1s'}}>
                <pre>{`from langchain import LLMChain
from langchain.llms import OpenAI

def create_chatbot():
    llm = OpenAI(temperature=0.7)
    chain = LLMChain(llm=llm)
    return chain`}</pre>
              </div>
              
              {/* JavaScript/Web Code */}
              <div className="absolute bottom-20 left-20 text-yellow-400/20 text-xs font-mono animate-float" style={{animationDelay: '2s'}}>
                <pre>{`const express = require('express');
const app = express();

app.get('/api/ai', async (req, res) => {
  const response = await openai.createCompletion({
    model: "gpt-3.5-turbo",
    prompt: req.body.prompt
  });
  res.json(response.data);
});`}</pre>
              </div>
              
              {/* Machine Learning Code */}
              <div className="absolute bottom-40 right-20 text-purple-400/20 text-xs font-mono animate-float" style={{animationDelay: '3s'}}>
                <pre>{`import tensorflow as tf
from tensorflow import keras

model = keras.Sequential([
    keras.layers.Dense(128, activation='relu'),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(10, activation='softmax')
])`}</pre>
              </div>
            </div>
            
            {/* Floating Technology Icons */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-32 left-1/4 text-4xl opacity-10 animate-bounce" style={{animationDelay: '0.5s'}}>🚀</div>
              <div className="absolute top-60 right-1/4 text-4xl opacity-10 animate-bounce" style={{animationDelay: '1.5s'}}>🤖</div>
              <div className="absolute bottom-32 left-1/3 text-4xl opacity-10 animate-bounce" style={{animationDelay: '2.5s'}}>📱</div>
              <div className="absolute bottom-60 right-1/3 text-4xl opacity-10 animate-bounce" style={{animationDelay: '3.5s'}}>⚡</div>
              <div className="absolute top-1/2 left-10 text-4xl opacity-10 animate-bounce" style={{animationDelay: '4.5s'}}>🔮</div>
              <div className="absolute top-1/2 right-10 text-4xl opacity-10 animate-bounce" style={{animationDelay: '5.5s'}}>💻</div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
            <div className="mb-6 sm:mb-8">
              <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 p-1 animate-pulse">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                  <Image
                    src="/face_image.png"
                    alt="Ismile Bharmal - Flutter & AI/ML Developer"
                    width={120}
                    height={120}
                    className="w-full h-full object-cover object-center scale-150"
                    priority
                  />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in leading-tight">
                Ismile Bharmal
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-4 sm:mb-6 animate-fade-in" style={{animationDelay: '0.5s'}}>
                Flutter & AI/ML Developer | Full Stack Engineer
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-gray-400 max-w-4xl mx-auto mb-4 sm:mb-6 animate-fade-in leading-relaxed" style={{animationDelay: '1s'}}>
                Passionate Flutter & AI/ML Developer with 4+ years of experience in designing, developing, and deploying mobile applications and AI-driven solutions. I specialize in building cross-platform applications with Flutter for both mobile and web, and in AI/ML technologies.
              </p>
              <p className="text-xs sm:text-sm lg:text-base text-gray-500 max-w-4xl mx-auto mb-6 sm:mb-8 animate-fade-in leading-relaxed" style={{animationDelay: '1.5s'}}>
                My expertise covers the full development lifecycle, from architecture and design to deployment and monitoring. I have a solid understanding of implementing design patterns and developing model-agnostic chatbots using technologies like FastAPI, StreamLit, LangChain, and various LLM models.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in" style={{animationDelay: '1.5s'}}>
              <button
                onClick={() => scrollToSection('projects')}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                View My Work
              </button>
              <button
                onClick={() => window.open('/api/resume-download', '_blank')}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-full font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                📄 Download Resume
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-blue-400 rounded-full font-semibold hover:bg-blue-400 hover:text-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Get In Touch
              </button>
            </div>
          </div>
        </section>

        
{/* About Section */}
<section id="about" className="py-12 sm:py-16 lg:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              About Me
            </h2>
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Hello, I'm Ismile! 👋</h3>
                <p className="text-gray-300 mb-3 sm:mb-4 text-base sm:text-lg leading-relaxed">
                  I'm a passionate Flutter & AI/ML Developer with more than 4+ years of experience 
                  in designing, developing, and deploying mobile applications and AI/ML-driven solutions. 
                  I specialize in building cross-platform applications with Flutter for both mobile and web and in AI.
                </p>
                <p className="text-gray-300 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
                  My expertise covers the full development lifecycle, from architecture and design to 
                  deployment and monitoring. I have a solid understanding of implementing design patterns 
                  and developing model-agnostic chatbots using technologies like FastAPI and StreamLit.
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  <div className="bg-gray-800/50 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base">
                    <span className="text-blue-400">📍</span> Based in India
                  </div>
                  <div className="bg-gray-800/50 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base">
                    <span className="text-green-400">💼</span> Available for Work
                  </div>
                  <div className="bg-gray-800/50 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base">
                    <span className="text-purple-400">🎯</span> Open to Collaborations
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
                  <h4 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Quick Stats</h4>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center text-sm sm:text-base">
                      <span>Projects Completed</span>
                      <span className="text-blue-400 font-bold">50+</span>
                    </div>
                    <div className="flex justify-between items-center text-sm sm:text-base">
                      <span>Years Experience</span>
                      <span className="text-blue-400 font-bold">4+</span>
                    </div>
                    <div className="flex justify-between items-center text-sm sm:text-base">
                      <span>Technologies Mastered</span>
                      <span className="text-blue-400 font-bold">15+</span>
                    </div>
                    <div className="flex justify-between items-center text-sm sm:text-base">
                      <span>Happy Clients</span>
                      <span className="text-blue-400 font-bold">20+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Hero Slides Section */}
        <HeroSlides />

        
        {/* Skills Section */}
        <SkillsSection skills={skills} />


        {/* Prompts Section */}
        <section id="prompts" className="py-12 sm:py-16 lg:py-20 px-4 bg-gray-800/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Prompt Library
            </h2>
            
            {/* Prompt Categories with Thumbnails */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {/* Writing & Content Creation */}
              <div className="group bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">✍️</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Writing & Content</h3>
                <p className="text-gray-400 mb-4">Blog posts, articles, creative writing, and content marketing prompts</p>
                <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-300 italic">"Write a compelling blog post about [topic] that engages readers and drives action..."</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-400 font-medium">15+ Prompts</span>
                  <span className="text-xs text-gray-500">Copy & Use</span>
                </div>
              </div>

              {/* Code & Development */}
              <div className="group bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">💻</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Code & Development</h3>
                <p className="text-gray-400 mb-4">Programming assistance, code review, debugging, and technical documentation</p>
                <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-300 italic">"Review this [language] code for best practices and suggest improvements..."</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-400 font-medium">12+ Prompts</span>
                  <span className="text-xs text-gray-500">Copy & Use</span>
                </div>
              </div>

              {/* Business & Strategy */}
              <div className="group bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Business & Strategy</h3>
                <p className="text-gray-400 mb-4">Business plans, market analysis, strategy development, and decision making</p>
                <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-300 italic">"Analyze the market opportunity for [product/service] and create a go-to-market strategy..."</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-400 font-medium">10+ Prompts</span>
                  <span className="text-xs text-gray-500">Copy & Use</span>
                </div>
              </div>

              {/* AI & Machine Learning */}
              <div className="group bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">AI & Machine Learning</h3>
                <p className="text-gray-400 mb-4">ML model development, AI strategy, data analysis, and automation</p>
                <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-300 italic">"Design a machine learning pipeline for [use case] with data preprocessing steps..."</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-orange-400 font-medium">8+ Prompts</span>
                  <span className="text-xs text-gray-500">Copy & Use</span>
                </div>
              </div>

              {/* Design & UX */}
              <div className="group bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Design & UX</h3>
                <p className="text-gray-400 mb-4">UI/UX design, user research, wireframing, and design system creation</p>
                <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-300 italic">"Create a user journey map for [app/website] focusing on [user persona]..."</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-pink-400 font-medium">6+ Prompts</span>
                  <span className="text-xs text-gray-500">Copy & Use</span>
                </div>
              </div>

              {/* Research & Analysis */}
              <div className="group bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔬</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Research & Analysis</h3>
                <p className="text-gray-400 mb-4">Data analysis, research methodology, hypothesis testing, and insights</p>
                <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-300 italic">"Analyze this dataset and provide insights about [specific aspect] with visualizations..."</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-indigo-400 font-medium">9+ Prompts</span>
                  <span className="text-xs text-gray-500">Copy & Use</span>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-8 backdrop-blur-sm max-w-4xl mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Ready to Boost Your AI Productivity?</h3>
                <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                  Access 60+ carefully crafted AI prompts across 6 categories. Each prompt is designed to deliver specific, high-quality results for your projects.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/prompts"
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-center text-lg"
                  >
                    🎯 Explore All Prompts
                  </Link>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>100% Free</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Copy & Paste</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>Regular Updates</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 sm:py-16 lg:py-20 px-4 bg-gray-800/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 lg:mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Let's Work Together
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12">
              Have a project in mind? I'd love to hear about it. Let's create something amazing together!
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
              <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-lg sm:text-xl">📧</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Email</h3>
                <p className="text-sm sm:text-base text-gray-400 break-all">ismileofficebharmal@gmail.com</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-lg sm:text-xl">💼</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">LinkedIn</h3>
                <p className="text-sm sm:text-base text-gray-400 break-all">linkedin.com/in/ismile-bharmal-3b82241ab</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-lg sm:text-xl">🐙</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">GitHub</h3>
                <p className="text-sm sm:text-base text-gray-400 break-all">github.com/ismilebharmal</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href="mailto:ismileofficebharmal@gmail.com"
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
              >
                Send Email
              </a>
              <button
                onClick={() => window.open('/api/resume-download', '_blank')}
                className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-blue-400 rounded-full font-semibold hover:bg-blue-400 hover:text-gray-900 transition-all duration-300 text-sm sm:text-base"
              >
                📄 Download Resume
              </button>
            </div>
          </div>
        </section>

        {/* Featured Work Section */}
        <section id="featured-work" className="py-12 sm:py-16 lg:py-20 px-4 bg-gray-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <div className="relative">
                {/* Animated background elements */}
                <div className="absolute -top-10 -left-10 w-16 h-16 sm:w-20 sm:h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -top-5 -right-10 w-12 h-12 sm:w-16 sm:h-16 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute -bottom-5 left-1/4 w-8 h-8 sm:w-12 sm:h-12 bg-pink-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
                
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent relative z-10">
                  <span className="inline-block animate-bounce" style={{animationDuration: '3s'}}>✨</span>
                  <span className="mx-2">My Projects</span>
                  <span
                    className="inline-block animate-bounce"
                    style={{
                      animationDuration: '3s',
                      animationDelay: '1.5s',
                      color: '#FFD700',
                      textShadow: '0 0 8px #fff, 0 0 16px #FFD700, 0 0 24px #FFD700'
                    }}
                  >🚀</span>
                </h2>
                
                <div className="relative">
                  <p className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    <span className="inline-block opacity-0 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                      Showcasing my expertise in 
                    </span>
                    <span className="inline-block opacity-0 animate-fade-in-up text-blue-400 font-semibold" style={{animationDelay: '0.4s'}}>
                      Flutter development
                    </span>
                    <span className="inline-block opacity-0 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                      , 
                    </span>
                    <span className="inline-block opacity-0 animate-fade-in-up text-purple-400 font-semibold" style={{animationDelay: '0.8s'}}>
                      AI/ML solutions
                    </span>
                    <span className="inline-block opacity-0 animate-fade-in-up" style={{animationDelay: '1s'}}>
                      , and 
                    </span>
                    <span className="inline-block opacity-0 animate-fade-in-up text-pink-400 font-semibold" style={{animationDelay: '1.2s'}}>
                      full-stack applications
                    </span>
                    <span className="inline-block opacity-0 animate-fade-in-up" style={{animationDelay: '1.4s'}}>
                      . Each project demonstrates different aspects of my technical skills and problem-solving approach.
                    </span>
                  </p>
                  
                  {/* Floating tech icons */}
                  <div className="absolute -top-8 left-1/4 text-2xl opacity-20 animate-float" style={{animationDelay: '0s'}}>🚀</div>
                  <div className="absolute -top-4 right-1/4 text-xl opacity-20 animate-float" style={{animationDelay: '1s'}}>💻</div>
                  <div className="absolute top-2 left-1/6 text-lg opacity-20 animate-float" style={{animationDelay: '2s'}}>⚡</div>
                  <div className="absolute top-4 right-1/6 text-xl opacity-20 animate-float" style={{animationDelay: '3s'}}>🎯</div>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {featuredProjects.map((project, index) => (
                <div 
                  key={project.id} 
                  className="group bg-gray-800/50 rounded-xl sm:rounded-2xl overflow-hidden backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 opacity-0 animate-fade-in-up"
                  style={{
                    animationDelay: `${0.5 + index * 0.1}s`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <div className={`relative h-40 sm:h-48 bg-gradient-to-br from-${project.gradient_from} to-${project.gradient_to} group-hover:shadow-2xl group-hover:shadow-blue-500/20 transition-all duration-500`}>
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                      <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full animate-ping"></div>
                      <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-xl group-hover:shadow-blue-400/30">
                        <span className="text-2xl sm:text-3xl group-hover:animate-bounce">{project.icon}</span>
                      </div>
                    </div>
                    
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                      <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-black px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg group-hover:shadow-green-400/30 group-hover:scale-110 transition-all duration-300">
                        {project.category}
                      </span>
                    </div>
                    
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 rounded-t-xl sm:rounded-t-2xl"></div>
                  </div>
                    <div className="p-4 sm:p-6 group-hover:bg-gradient-to-br group-hover:from-gray-800/20 group-hover:to-gray-700/20 transition-all duration-500">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-blue-300 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                      {project.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex} 
                          className="bg-blue-500/20 text-blue-400 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs group-hover:bg-blue-500/30 group-hover:text-blue-300 group-hover:scale-105 transition-all duration-300 shadow-sm group-hover:shadow-blue-400/20"
                          style={{
                            animationDelay: `${techIndex * 0.1}s`
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    
                    {/* Animated border on hover */}
                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-500"></div>
                  </div>
                </div>
              ))}
              
              {/* More Projects Card with Blur Effect */}
              <div className="group relative bg-gray-800/30 rounded-xl sm:rounded-2xl overflow-hidden backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-105">
                {/* Blurred Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm"></div>
                
                {/* Blurred Content */}
                <div className="relative h-40 sm:h-48 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 backdrop-blur-sm">
                      <span className="text-2xl sm:text-3xl opacity-50">🚀</span>
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="h-3 sm:h-4 bg-gray-600/30 rounded w-24 sm:w-32 mx-auto backdrop-blur-sm"></div>
                      <div className="h-2 sm:h-3 bg-gray-600/20 rounded w-20 sm:w-24 mx-auto backdrop-blur-sm"></div>
                    </div>
                  </div>
                </div>
                
                {/* Overlay Content */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center p-4 sm:p-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-lg sm:text-2xl">✨</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">More Projects</h3>
                    <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
                      Explore additional projects and case studies
                    </p>
                    <button 
                      onClick={() => setActiveSection('contact')}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                    >
                      Discover More
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* More Projects Section */}
            <div className="mt-16">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
                
                {/* Content */}
                <div className="relative p-12 text-center">
                  <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
                      <span className="text-3xl">🚀</span>
                    </div>
                    
                    <h3 className="text-3xl font-bold text-white mb-4">
                      Want to See More Work?
                    </h3>
                    
                    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                      I have many more exciting projects, case studies, and detailed implementations 
                      that showcase my expertise across different technologies and domains. 
                      Each project represents unique challenges and innovative solutions.
                    </p>
                    
                    {/* Project Categories Preview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {[
                        { name: 'AI/ML Solutions', count: '15+', icon: '🤖' },
                        { name: 'Flutter Apps', count: '12+', icon: '📱' },
                        { name: 'Web Applications', count: '8+', icon: '🌐' },
                        { name: 'Data Projects', count: '6+', icon: '📊' }
                      ].map((category, index) => (
                        <div key={index} className="bg-gray-800/30 rounded-xl p-4 backdrop-blur-sm border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300">
                          <div className="text-2xl mb-2">{category.icon}</div>
                          <div className="text-sm text-gray-300 mb-1">{category.name}</div>
                          <div className="text-xs text-purple-400 font-medium">{category.count} Projects</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button 
                        onClick={() => scrollToSection('contact')}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                      >
                        Explore All Projects
                      </button>
                      <button 
                        onClick={() => scrollToSection('contact')}
                        className="border border-gray-500 text-gray-300 px-8 py-4 rounded-full font-medium hover:bg-gray-800/50 transition-all duration-300 hover:border-purple-500/50"
                      >
                        Schedule a Call
                      </button>
        </div>

                    <p className="text-sm text-gray-500 mt-6">
                      💡 <strong>Pro Tip:</strong> Contact me to discuss your specific requirements and see relevant project examples!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-16">
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 backdrop-blur-sm max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-white mb-4">Interested in My Work?</h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  These projects showcase my expertise in Flutter development, AI/ML solutions, and full-stack applications. 
                  Each project demonstrates different aspects of my technical skills and problem-solving approach.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Let's Discuss Your Project
                  </button>
                  
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Work & Workshop Slides Section */}
        <section id="workshops" className="py-12 sm:py-16 lg:py-20 px-4 bg-gray-800/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Work & Workshop Slides
              </h2>
              <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto">
                Explore my workshop presentations, training materials, and work-related slides. 
                Each presentation showcases different aspects of my expertise and teaching approach.
              </p>
            </div>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                <p className="mt-4 text-gray-400">Loading workshops...</p>
              </div>
            ) : slides.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className="bg-gray-800/50 rounded-xl overflow-hidden backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                    style={{ animationDelay: `${index * 0.2}s` }}
                    onClick={() => handleSlideClick(slide)}
                  >
                    <div className="h-56 relative overflow-hidden">
                      {slide.images && slide.images.length > 0 ? (
                        <ImageSlideshow
                          images={slide.images}
                          autoPlay={true}
                          interval={3000}
                          showThumbnails={false}
                          showControls={false}
                          aspectRatio="16:9"
                          className="h-full"
                        />
                      ) : (
                        <DatabaseImage
                          imageId={slide.imageId}
                          imageUrl={slide.image_url}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                          fallback={
                            <div className="h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                              <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                                  <span className="text-2xl">📚</span>
                                </div>
                                <p className="text-gray-400">Workshop Preview</p>
                              </div>
                            </div>
                          }
                        />
                      )}
                      
                      {/* Overlay with slide count */}
                      {slide.images && slide.images.length > 0 && (
                        <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                          {slide.images.length} slide{slide.images.length !== 1 ? 's' : ''}
            </div>
          )}
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white bg-opacity-90 text-gray-900 px-4 py-2 rounded-full text-sm font-medium">
                            View Details
                          </div>
                        </div>
        </div>
      </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                          {slide.title}
                        </h3>
                        {slide.workshop_type && (
                          <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs font-medium">
                            {slide.workshop_type}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {slide.description || 'Workshop presentation and materials.'}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          {slide.duration_hours && (
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              {slide.duration_hours}h
                            </span>
                          )}
                          {slide.participants_count && (
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                              </svg>
                              {slide.participants_count}
                            </span>
                          )}
                        </div>
                        
                        {slide.workshop_date && (
                          <span>
                            {new Date(slide.workshop_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No workshops available</h3>
                <p className="text-gray-400">No workshop slides available at the moment.</p>
                <p className="text-gray-500 text-sm mt-2">Check back later for updates!</p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-gray-700">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-400">
              © 2024 Ismile Bharmal. Built with Next.js and lots of ☕
            </p>
          </div>
        </footer>

        {/* Floating Action Button */}
        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}

        {/* Floating Contact Button */}
        <div className="fixed bottom-8 left-8 z-50">
          <div className="flex flex-col space-y-3">
            <a
              href="mailto:ismile@example.com"
              className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full shadow-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
              title="Send Email"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
            
            <a
              href="https://linkedin.com/in/ismilebharmal"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full shadow-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
              title="LinkedIn Profile"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Project Detail Modal */}
        <ProjectDetailModal
          project={selectedProject}
          isOpen={showProjectModal}
          onClose={closeProjectModal}
        />

        {/* Workshop Detail Modal */}
        <WorkshopDetailModal
          slide={selectedSlide}
          isOpen={showSlideModal}
          onClose={closeSlideModal}
        />
    </div>
    </>
  )
}
