import { getResumes, createResume, updateResume, deleteResume, setActiveResume } from '../../lib/neon'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const resumes = await getResumes()
      res.status(200).json(resumes)
    } catch (error) {
      console.error('Error fetching resumes:', error)
      res.status(500).json({ error: 'Failed to fetch resumes' })
    }
  } else if (req.method === 'POST') {
    try {
      const { filename, originalName, mimeType, size, data } = req.body
      
      if (!filename || !originalName || !mimeType || !size || !data) {
        return res.status(400).json({ error: 'All fields are required' })
      }

      const resume = await createResume(filename, originalName, mimeType, size, data)
      res.status(201).json(resume)
    } catch (error) {
      console.error('Error creating resume:', error)
      res.status(500).json({ error: 'Failed to create resume' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, filename, originalName, mimeType, size, data, setActive } = req.body
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required' })
      }

      if (setActive) {
        // Just set as active without updating data
        const success = await setActiveResume(id)
        if (success) {
          res.status(200).json({ message: 'Resume set as active' })
        } else {
          res.status(500).json({ error: 'Failed to set active resume' })
        }
      } else {
        // Update resume data
        if (!filename || !originalName || !mimeType || !size || !data) {
          return res.status(400).json({ error: 'All fields are required for update' })
        }

        const resume = await updateResume(id, filename, originalName, mimeType, size, data)
        res.status(200).json(resume)
      }
    } catch (error) {
      console.error('Error updating resume:', error)
      res.status(500).json({ error: 'Failed to update resume' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required' })
      }

      const success = await deleteResume(parseInt(id))
      if (success) {
        res.status(200).json({ message: 'Resume deleted successfully' })
      } else {
        res.status(500).json({ error: 'Failed to delete resume' })
      }
    } catch (error) {
      console.error('Error deleting resume:', error)
      res.status(500).json({ error: 'Failed to delete resume' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
