import { 
  getProjects, 
  getFeaturedProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} from '../../lib/neon'

export default async function handler(req, res) {
  const { method } = req

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    switch (method) {
      case 'GET':
        const { featured } = req.query
        const projects = featured === 'true' ? await getFeaturedProjects() : await getProjects()
        
        res.status(200).json({
          success: true,
          data: projects,
          count: projects.length
        })
        break

      case 'POST':
        const projectData = req.body
        const newProjectId = await createProject(projectData)
        
        res.status(201).json({
          success: true,
          message: 'Project created successfully',
          data: { id: newProjectId }
        })
        break

      case 'PUT':
        const { id } = req.query
        if (!id) {
          return res.status(400).json({
            success: false,
            error: 'Project ID is required'
          })
        }

        const updateData = req.body
        await updateProject(parseInt(id), updateData)
        
        res.status(200).json({
          success: true,
          message: 'Project updated successfully'
        })
        break

      case 'DELETE':
        const { id: deleteId } = req.query
        if (!deleteId) {
          return res.status(400).json({
            success: false,
            error: 'Project ID is required'
          })
        }

        await deleteProject(parseInt(deleteId))
        
        res.status(200).json({
          success: true,
          message: 'Project deleted successfully'
        })
        break

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).json({
          success: false,
          error: `Method ${method} not allowed`
        })
    }
  } catch (error) {
    console.error('Projects API error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    })
  }
}
