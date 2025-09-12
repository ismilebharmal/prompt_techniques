import { neon } from '@neondatabase/serverless'

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!sql) {
    return res.status(500).json({ error: 'Database not configured' })
  }

  const { id } = req.query

  if (!id) {
    return res.status(400).json({ error: 'Image ID is required' })
  }

  try {
    const result = await sql`
      SELECT data, mime_type, filename, size
      FROM images 
      WHERE id = ${parseInt(id)}
    `

    if (result.length === 0) {
      return res.status(404).json({ error: 'Image not found' })
    }

    const image = result[0]

    // Set appropriate headers
    res.setHeader('Content-Type', image.mime_type)
    res.setHeader('Content-Length', image.size)
    res.setHeader('Cache-Control', 'public, max-age=31536000') // Cache for 1 year
    res.setHeader('Content-Disposition', `inline; filename="${image.filename}"`)

    // Send the image data
    return res.status(200).send(image.data)

  } catch (error) {
    console.error('Image retrieval error:', error)
    return res.status(500).json({ 
      error: 'Failed to retrieve image',
      message: error.message 
    })
  }
}
