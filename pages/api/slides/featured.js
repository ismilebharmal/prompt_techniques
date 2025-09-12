import { getFeaturedSlides } from '../../../lib/neon'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ error: `Method ${req.method} not allowed` })
    return
  }

  try {
    const slides = await getFeaturedSlides()
    res.status(200).json({ success: true, data: slides })
  } catch (error) {
    console.error('Error fetching featured slides:', error)
    res.status(500).json({ error: 'Failed to fetch featured slides' })
  }
}
