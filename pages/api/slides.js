import { 
  getSlides, 
  createSlide, 
  updateSlide, 
  deleteSlide 
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
        const slides = await getSlides()
        
        res.status(200).json({
          success: true,
          data: slides,
          count: slides.length
        })
        break

      case 'POST':
        const slideData = req.body
        const newSlideId = await createSlide(slideData)
        
        res.status(201).json({
          success: true,
          message: 'Slide created successfully',
          data: { id: newSlideId }
        })
        break

      case 'PUT':
        const { id } = req.query
        if (!id) {
          return res.status(400).json({
            success: false,
            error: 'Slide ID is required'
          })
        }

        const updateData = req.body
        await updateSlide(parseInt(id), updateData)
        
        res.status(200).json({
          success: true,
          message: 'Slide updated successfully'
        })
        break

      case 'DELETE':
        const { id: deleteId } = req.query
        if (!deleteId) {
          return res.status(400).json({
            success: false,
            error: 'Slide ID is required'
          })
        }

        await deleteSlide(parseInt(deleteId))
        
        res.status(200).json({
          success: true,
          message: 'Slide deleted successfully'
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
    console.error('Slides API error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    })
  }
}
