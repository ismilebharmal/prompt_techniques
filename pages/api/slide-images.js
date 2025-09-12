import { 
  getSlideImages, 
  addSlideImage, 
  removeSlideImage, 
  setCoverImage, 
  reorderSlideImages 
} from '../../lib/neon'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Get images for a specific slide
    const { slideId } = req.query
    
    if (!slideId) {
      return res.status(400).json({ error: 'Slide ID is required' })
    }

    try {
      const images = await getSlideImages(slideId)
      res.status(200).json({ success: true, data: images })
    } catch (error) {
      console.error('Error fetching slide images:', error)
      res.status(500).json({ error: 'Failed to fetch slide images' })
    }
  } 
  else if (req.method === 'POST') {
    // Add image to slide
    const { slideId, imageId, isCover, displayOrder } = req.body
    
    if (!slideId || !imageId) {
      return res.status(400).json({ error: 'Slide ID and Image ID are required' })
    }

    try {
      const slideImageId = await addSlideImage(slideId, imageId, isCover || false, displayOrder || 0)
      res.status(201).json({ success: true, data: { id: slideImageId } })
    } catch (error) {
      console.error('Error adding slide image:', error)
      res.status(500).json({ error: 'Failed to add image to slide' })
    }
  } 
  else if (req.method === 'PUT') {
    // Set cover image or reorder images
    const { action, slideId, imageId, imageOrders } = req.body
    
    if (!slideId) {
      return res.status(400).json({ error: 'Slide ID is required' })
    }

    try {
      if (action === 'setCover' && imageId) {
        await setCoverImage(slideId, imageId)
        res.status(200).json({ success: true, message: 'Cover image updated' })
      } else if (action === 'reorder' && imageOrders) {
        await reorderSlideImages(slideId, imageOrders)
        res.status(200).json({ success: true, message: 'Images reordered' })
      } else {
        res.status(400).json({ error: 'Invalid action or missing parameters' })
      }
    } catch (error) {
      console.error('Error updating slide images:', error)
      res.status(500).json({ error: 'Failed to update slide images' })
    }
  } 
  else if (req.method === 'DELETE') {
    // Remove image from slide
    const { slideImageId } = req.query
    
    if (!slideImageId) {
      return res.status(400).json({ error: 'Slide Image ID is required' })
    }

    try {
      await removeSlideImage(slideImageId)
      res.status(200).json({ success: true, message: 'Image removed from slide' })
    } catch (error) {
      console.error('Error removing slide image:', error)
      res.status(500).json({ error: 'Failed to remove image from slide' })
    }
  } 
  else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).json({ error: `Method ${req.method} not allowed` })
  }
}
