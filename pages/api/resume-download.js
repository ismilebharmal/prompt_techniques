import { getActiveResume } from '../../lib/neon'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
    return
  }

  try {
    const resume = await getActiveResume()
    
    if (!resume) {
      return res.status(404).json({ error: 'No active resume found' })
    }

    // Set appropriate headers for file download
    res.setHeader('Content-Type', resume.mime_type)
    res.setHeader('Content-Disposition', `attachment; filename="${resume.original_name}"`)
    res.setHeader('Content-Length', resume.size)
    
    // Send the binary data
    res.status(200).send(resume.data)
  } catch (error) {
    console.error('Error downloading resume:', error)
    res.status(500).json({ error: 'Failed to download resume' })
  }
}
