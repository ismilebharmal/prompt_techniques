import { 
  getFeaturedProjects, 
  getFeaturedProjectById, 
  createFeaturedProject, 
  updateFeaturedProject, 
  deleteFeaturedProject 
} from '../../lib/neon'

export default async function handler(req, res) {
  const { method } = req

  try {
    switch (method) {
      case 'GET':
        if (req.query.id) {
          // Get single featured project
          const project = await getFeaturedProjectById(req.query.id)
          if (!project) {
            return res.status(404).json({ error: 'Featured project not found' })
          }
          return res.status(200).json(project)
        } else {
          // Get all featured projects
          const projects = await getFeaturedProjects()
          return res.status(200).json(projects)
        }

      case 'POST':
        // Create new featured project
        const newProject = await createFeaturedProject(req.body)
        return res.status(201).json(newProject)

      case 'PUT':
        // Update featured project
        const { id, ...updateData } = req.body
        if (!id) {
          return res.status(400).json({ error: 'Project ID is required' })
        }
        const updatedProject = await updateFeaturedProject(id, updateData)
        if (!updatedProject) {
          return res.status(404).json({ error: 'Featured project not found' })
        }
        return res.status(200).json(updatedProject)

      case 'DELETE':
        // Delete featured project
        const projectId = req.query.id
        if (!projectId) {
          return res.status(400).json({ error: 'Project ID is required' })
        }
        const result = await deleteFeaturedProject(projectId)
        return res.status(200).json(result)

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        return res.status(405).json({ error: `Method ${method} not allowed` })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
