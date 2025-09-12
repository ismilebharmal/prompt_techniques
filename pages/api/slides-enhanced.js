import { 
  getSlidesWithImages, 
  getSlides, 
  createSlide, 
  updateSlide, 
  deleteSlide,
  addImageToSlide,
  removeImageFromSlide,
  setSlideCoverImage,
  reorderSlideImages
} from '../../lib/neon'

export default async function handler(req, res) {
  const { method, query } = req

  try {
    switch (method) {
      case 'GET':
        if (query.withImages === 'true') {
          const slides = await getSlidesWithImages()
          res.status(200).json(slides)
        } else {
          const slides = await getSlides()
          res.status(200).json(slides)
        }
        break

      case 'POST':
        const slideData = req.body
        const newSlide = await createSlide(slideData)
        res.status(201).json({ id: newSlide, ...slideData })
        break

      case 'PUT':
        const { id, ...updateData } = req.body
        await updateSlide(id, updateData)
        res.status(200).json({ id, ...updateData })
        break

      case 'DELETE':
        const { id: deleteId } = query
        await deleteSlide(deleteId)
        res.status(200).json({ message: 'Slide deleted successfully' })
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
