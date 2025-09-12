import { getHeroSlides, createHeroSlide, updateHeroSlide, deleteHeroSlide, reorderHeroSlides } from '../../lib/neon'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const slides = await getHeroSlides()
      res.status(200).json(slides)
    } catch (error) {
      console.error('Error fetching hero slides:', error)
      res.status(500).json({ error: 'Failed to fetch hero slides' })
    }
  } else if (req.method === 'POST') {
    try {
      const { title, description, imageId, displayOrder, imageFit, imagePosition, textPosition } = req.body
      
      if (!title || !imageId) {
        return res.status(400).json({ error: 'Title and imageId are required' })
      }

      const slide = await createHeroSlide(title, description, imageId, displayOrder, imageFit, imagePosition, textPosition)
      res.status(201).json(slide)
    } catch (error) {
      console.error('Error creating hero slide:', error)
      res.status(500).json({ error: 'Failed to create hero slide' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, title, description, imageId, displayOrder, isActive, imageFit, imagePosition, textPosition } = req.body
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required' })
      }

      const slide = await updateHeroSlide(id, title, description, imageId, displayOrder, isActive, imageFit, imagePosition, textPosition)
      res.status(200).json(slide)
    } catch (error) {
      console.error('Error updating hero slide:', error)
      res.status(500).json({ error: 'Failed to update hero slide' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required' })
      }

      await deleteHeroSlide(id)
      res.status(200).json({ message: 'Hero slide deleted successfully' })
    } catch (error) {
      console.error('Error deleting hero slide:', error)
      res.status(500).json({ error: 'Failed to delete hero slide' })
    }
  } else if (req.method === 'PATCH') {
    // Reorder slides
    try {
      const { slideOrders } = req.body
      
      if (!slideOrders || !Array.isArray(slideOrders)) {
        return res.status(400).json({ error: 'slideOrders array is required' })
      }

      await reorderHeroSlides(slideOrders)
      res.status(200).json({ message: 'Hero slides reordered successfully' })
    } catch (error) {
      console.error('Error reordering hero slides:', error)
      res.status(500).json({ error: 'Failed to reorder hero slides' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
