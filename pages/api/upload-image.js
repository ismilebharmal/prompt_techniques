import { neon } from '@neondatabase/serverless'
import formidable from 'formidable'
import fs from 'fs'

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!sql) {
    return res.status(500).json({ error: 'Database not configured' })
  }

  try {
    // Parse the form data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      filter: ({ mimetype }) => {
        // Only allow image files
        return mimetype && mimetype.startsWith('image/')
      }
    })

    const [fields, files] = await form.parse(req)
    const file = files.image?.[0]

    if (!file) {
      return res.status(400).json({ error: 'No image file provided' })
    }

    // Read the file data
    const fileData = fs.readFileSync(file.filepath)
    const filename = file.originalFilename || 'uploaded-image'
    const mimeType = file.mimetype
    const size = file.size

    // Store the image in the database
    const result = await sql`
      INSERT INTO images (filename, original_name, mime_type, size, data)
      VALUES (${filename}, ${file.originalFilename}, ${mimeType}, ${size}, ${fileData})
      RETURNING id, filename, mime_type, size
    `

    const imageRecord = result[0]

    // Clean up the temporary file
    fs.unlinkSync(file.filepath)

    return res.status(200).json({
      success: true,
      image: {
        id: imageRecord.id,
        filename: imageRecord.filename,
        mimeType: imageRecord.mime_type,
        size: imageRecord.size
      }
    })

  } catch (error) {
    console.error('Image upload error:', error)
    return res.status(500).json({ 
      error: 'Failed to upload image',
      message: error.message 
    })
  }
}
