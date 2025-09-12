import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useScrollPosition } from '../hooks/useScrollAnimation'
import DatabaseImage from '../components/DatabaseImage'
import WorkSlidesSection from '../components/WorkSlidesSection'

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [projects, setProjects] = useState([])
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const scrollPosition = useScrollPosition()

  useEffect(() => {
    setIsScrolled(scrollPosition > 50)
    setShowBackToTop(scrollPosition > 300)
  }, [scrollPosition])

  // Fetch projects and slides from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, slidesRes] = await Promise.all([
          fetch('/api/projects?featured=true'),
          fetch('/api/slides')
        ])
        
        const projectsData = await projectsRes.json()
        const slidesData = await slidesRes.json()
        
        setProjects(projectsData.data || [])
        setSlides(slidesData.data || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        // Fallback to hardcoded data if API fails
        setProjects([
          {
            id: 1,
            title: 'Prompt Techniques Hub',
            description: 'A comprehensive AI prompt library with advanced filtering, admin dashboard, and database management.',
            shortDescription: 'AI prompt library with search and filtering',
            technologies: ['Next.js', 'PostgreSQL', 'Neon', 'TailwindCSS', 'bcrypt'],
            imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
            liveUrl: '/',
            githubUrl: 'https://github.com/ismilebharmal/prompt_techniques',
            featured: true
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

  const skills = [
    { name: 'JavaScript', level: 95, color: 'from-yellow-400 to-orange-500' },
    { name: 'React/Next.js', level: 90, color: 'from-blue-400 to-cyan-500' },
    { name: 'Node.js', level: 85, color: 'from-green-400 to-emerald-500' },
    { name: 'Python', level: 80, color: 'from-blue-500 to-indigo-600' },
    { name: 'PostgreSQL', level: 85, color: 'from-purple-400 to-pink-500' },
    { name: 'MongoDB', level: 80, color: 'from-green-500 to-teal-600' },
    { name: 'AWS/Vercel', level: 75, color: 'from-orange-400 to-red-500' },
    { name: 'Docker', level: 70, color: 'from-blue-600 to-blue-800' }
  ]


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
            <div className="flex justify-between items-center py-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Ismile Bharmal
              </div>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex space-x-8">
                {['home', 'about', 'skills', 'projects', 'slides', 'prompts', 'contact'].map((item) => (
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
                className="md:hidden text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden bg-gray-900/95 backdrop-blur-md rounded-lg mt-2 p-4">
                {['home', 'about', 'skills', 'projects', 'slides', 'prompts', 'contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className="block w-full text-left py-2 capitalize transition-colors duration-200 hover:text-blue-400"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 p-1">
                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                  <span className="text-4xl font-bold">IB</span>
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Ismile Bharmal
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-6">
                Full Stack Developer & AI Enthusiast
              </p>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
                Crafting digital experiences with modern technologies. 
                Passionate about building scalable applications and exploring AI innovations.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection('projects')}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                View My Work
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="px-8 py-3 border-2 border-blue-400 rounded-full font-semibold hover:bg-blue-400 hover:text-gray-900 transition-all duration-300"
              >
                Get In Touch
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              About Me
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-6">Hello, I'm Ismile! 👋</h3>
                <p className="text-gray-300 mb-4 text-lg leading-relaxed">
                  I'm a passionate Full Stack Developer with a love for creating innovative solutions 
                  and exploring the latest technologies. With expertise in modern web development 
                  and AI applications, I enjoy building products that make a difference.
                </p>
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  When I'm not coding, you'll find me experimenting with AI tools, contributing to 
                  open-source projects, or sharing knowledge with the developer community. I believe 
                  in continuous learning and staying updated with the latest tech trends.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-gray-800/50 rounded-lg px-4 py-2">
                    <span className="text-blue-400">📍</span> Based in India
                  </div>
                  <div className="bg-gray-800/50 rounded-lg px-4 py-2">
                    <span className="text-green-400">💼</span> Available for Work
                  </div>
                  <div className="bg-gray-800/50 rounded-lg px-4 py-2">
                    <span className="text-purple-400">🎯</span> Open to Collaborations
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-8 backdrop-blur-sm">
                  <h4 className="text-xl font-semibold mb-4">Quick Stats</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Projects Completed</span>
                      <span className="text-blue-400 font-bold">50+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Years Experience</span>
                      <span className="text-blue-400 font-bold">3+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Technologies Mastered</span>
                      <span className="text-blue-400 font-bold">15+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Happy Clients</span>
                      <span className="text-blue-400 font-bold">25+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 px-4 bg-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Skills & Technologies
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((skill, index) => (
                <div
                  key={skill.name}
                  className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${skill.color} flex items-center justify-center text-2xl font-bold text-white`}>
                      {skill.name.charAt(0)}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000`}
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-400">{skill.level}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                <p className="mt-4 text-gray-400">Loading projects...</p>
              </div>
            ) : projects.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    className={`bg-gray-800/50 rounded-xl overflow-hidden backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 ${
                      project.featured ? 'md:col-span-2 lg:col-span-1' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="h-48 relative overflow-hidden">
                      <DatabaseImage
                        imageId={project.imageId}
                        imageUrl={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        fallback={
                          <div className="h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                                <span className="text-2xl">🚀</span>
                              </div>
                              <p className="text-gray-400">Project Preview</p>
                            </div>
                          </div>
                        }
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold">{project.title}</h3>
                        {project.featured && (
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 mb-4">
                        {project.shortDescription || project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies && project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="bg-gray-700/50 text-blue-400 px-2 py-1 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-center py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                          >
                            Live Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 border border-gray-600 text-center py-2 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300"
                          >
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700/50 flex items-center justify-center">
                  <span className="text-2xl">📁</span>
                </div>
                <p className="text-gray-400">No projects available at the moment.</p>
                <p className="text-gray-500 text-sm mt-2">Check back later for updates!</p>
              </div>
            )}
          </div>
        </section>

        {/* Prompts Section */}
        <section id="prompts" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Prompt Templates
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-semibold mb-6">
                  Discover Powerful AI Prompts
                </h3>
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  Explore my curated collection of AI prompt templates designed to help you get the most out of 
                  AI tools like ChatGPT, Claude, and other language models. Each prompt is carefully crafted 
                  and tested for optimal results.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">50+ Professional prompt templates</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Categorized by use case and industry</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Copy-paste ready with examples</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Regularly updated with new prompts</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/prompts"
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-center"
                  >
                    Explore Prompt Library
                  </Link>
                  <a
                    href="https://github.com/ismilebharmal/prompt_techniques"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 border-2 border-blue-400 rounded-full font-semibold hover:bg-blue-400 hover:text-gray-900 transition-all duration-300 text-center"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-8 backdrop-blur-sm">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                      <span className="text-3xl">🤖</span>
                    </div>
                    <h4 className="text-2xl font-semibold mb-2">AI Prompt Hub</h4>
                    <p className="text-gray-300">Curated collection of powerful AI prompts</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-400">50+</div>
                      <div className="text-sm text-gray-400">Prompt Templates</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-400">6</div>
                      <div className="text-sm text-gray-400">Categories</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-400">100%</div>
                      <div className="text-sm text-gray-400">Free to Use</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-yellow-400">∞</div>
                      <div className="text-sm text-gray-400">Possibilities</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Work & Workshop Slides Section */}
        <WorkSlidesSection />

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 bg-gray-800/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Let's Work Together
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Have a project in mind? I'd love to hear about it. Let's create something amazing together!
            </p>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  📧
                </div>
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="text-gray-400">ismile@example.com</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  💼
                </div>
                <h3 className="text-lg font-semibold mb-2">LinkedIn</h3>
                <p className="text-gray-400">linkedin.com/in/ismilebharmal</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  🐙
                </div>
                <h3 className="text-lg font-semibold mb-2">GitHub</h3>
                <p className="text-gray-400">github.com/ismilebharmal</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:ismile@example.com"
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Send Email
              </a>
              <a
                href="/resume.pdf"
                className="px-8 py-3 border-2 border-blue-400 rounded-full font-semibold hover:bg-blue-400 hover:text-gray-900 transition-all duration-300"
              >
                Download Resume
              </a>
            </div>
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
              href="https://github.com/ismilebharmal"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full shadow-lg hover:from-gray-800 hover:to-black transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
              title="GitHub Profile"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
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
      </div>
    </>
  )
}
