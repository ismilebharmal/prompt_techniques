import { connectToDatabase } from '../../../lib/mongodb'

// Rate limiting helper (simple in-memory store for demo)
const rateLimitMap = new Map()

function rateLimit(identifier, limit = 100, windowMs = 15 * 60 * 1000) {
  const now = Date.now()
  const windowStart = now - windowMs
  
  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, [])
  }
  
  const requests = rateLimitMap.get(identifier).filter(time => time > windowStart)
  
  if (requests.length >= limit) {
    return false
  }
  
  requests.push(now)
  rateLimitMap.set(identifier, requests)
  return true
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Rate limiting
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  if (!rateLimit(clientIP)) {
    return res.status(429).json({ error: 'Too many requests' })
  }

  try {
    const { db } = await connectToDatabase()

    if (req.method === 'GET') {
      const { category, q: searchQuery, limit = 50 } = req.query
      
      // Build filter object
      const filter = {}
      if (category && category !== 'All') {
        filter.category = category
      }
      if (searchQuery) {
        // Sanitize search query to prevent injection
        const sanitizedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        filter.$or = [
          { title: { $regex: sanitizedQuery, $options: 'i' } },
          { description: { $regex: sanitizedQuery, $options: 'i' } },
          { tags: { $in: [new RegExp(sanitizedQuery, 'i')] } }
        ]
      }

      const prompts = await db
        .collection('prompts')
        .find(filter)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .toArray()

      // Set cache headers for better performance
      res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=60')
      
      return res.status(200).json(prompts)
    }

    if (req.method === 'POST') {
      // Check for API key
      const apiKey = req.headers.authorization?.replace('Bearer ', '')
      if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const { title, category, tags, description, prompt, exampleInput, exampleOutput } = req.body

      // Validate required fields
      if (!title || !category || !description || !prompt) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const newPrompt = {
        title,
        category,
        tags: tags || [],
        description,
        prompt,
        exampleInput: exampleInput || '',
        exampleOutput: exampleOutput || '',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const result = await db.collection('prompts').insertOne(newPrompt)
      
      return res.status(201).json({ 
        success: true, 
        id: result.insertedId,
        prompt: { ...newPrompt, _id: result.insertedId }
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
