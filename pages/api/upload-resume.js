import formidable from 'formidable'
import fs from 'fs'
import { createResume } from '../../lib/neon'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
    return
  }

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      filter: ({ mimetype }) => {
        // Only allow PDF files
        return mimetype && mimetype.includes('application/pdf')
      }
    })

    const [fields, files] = await form.parse(req)
    
    const file = files.resume?.[0]
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Read the file data
    const fileData = fs.readFileSync(file.filepath)
    
    // Generate a unique filename
    const timestamp = Date.now()
    const filename = `resume_${timestamp}.pdf`
    
    // Create resume in database
    const resume = await createResume(
      filename,
      file.originalFilename || 'resume.pdf',
      file.mimetype || 'application/pdf',
      file.size,
      fileData
    )

    if (!resume) {
      return res.status(500).json({ error: 'Failed to save resume' })
    }

    // Clean up temporary file
    fs.unlinkSync(file.filepath)

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resume: {
        id: resume.id,
        filename: resume.filename,
        original_name: resume.original_name,
        mime_type: resume.mime_type,
        size: resume.size,
        is_active: resume.is_active,
        created_at: resume.created_at
      }
    })
  } catch (error) {
    console.error('Error uploading resume:', error)
    res.status(500).json({ error: 'Failed to upload resume' })
  }
}
