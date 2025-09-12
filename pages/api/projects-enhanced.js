import { 
  getProjectsWithImages, 
  getFeaturedProjects, 
  createProject, 
  updateProject, 
  deleteProject,
  addImageToProject,
  removeImageFromProject,
  setProjectCoverImage,
  reorderProjectImages
} from '../../lib/neon'

export default async function handler(req, res) {
  const { method, query } = req

  try {
    switch (method) {
      case 'GET':
        if (query.featured === 'true') {
          const projects = await getFeaturedProjects()
          res.status(200).json(projects)
        } else if (query.withImages === 'true') {
          const projects = await getProjectsWithImages()
          res.status(200).json(projects)
        } else {
          const projects = await getFeaturedProjects()
          res.status(200).json(projects)
        }
        break

      case 'POST':
        const projectData = req.body
        const newProject = await createProject(projectData)
        res.status(201).json({ id: newProject, ...projectData })
        break

      case 'PUT':
        const { id, ...updateData } = req.body
        await updateProject(id, updateData)
        res.status(200).json({ id, ...updateData })
        break

      case 'DELETE':
        const { id: deleteId } = query
        await deleteProject(deleteId)
        res.status(200).json({ message: 'Project deleted successfully' })
        break

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
