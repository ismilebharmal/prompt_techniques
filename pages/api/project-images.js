import { 
  addImageToProject,
  removeImageFromProject,
  setProjectCoverImage,
  reorderProjectImages
} from '../../lib/neon'

export default async function handler(req, res) {
  const { method, query } = req
  const { projectId } = query

  if (!projectId) {
    return res.status(400).json({ error: 'Project ID is required' })
  }

  try {
    switch (method) {
      case 'POST':
        const { imageId, isCover = false, displayOrder = 0 } = req.body
        const result = await addImageToProject(projectId, imageId, isCover, displayOrder)
        res.status(201).json({ id: result, projectId, imageId, isCover, displayOrder })
        break

      case 'DELETE':
        const { imageId: deleteImageId } = query
        await removeImageFromProject(projectId, deleteImageId)
        res.status(200).json({ message: 'Image removed from project successfully' })
        break

      case 'PUT':
        if (req.body.action === 'setCover') {
          const { imageId } = req.body
          await setProjectCoverImage(projectId, imageId)
          res.status(200).json({ message: 'Cover image set successfully' })
        } else if (req.body.action === 'reorder') {
          const { imageOrders } = req.body
          await reorderProjectImages(projectId, imageOrders)
          res.status(200).json({ message: 'Images reordered successfully' })
        } else {
          res.status(400).json({ error: 'Invalid action' })
        }
        break

      default:
        res.setHeader('Allow', ['POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
