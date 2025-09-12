import { verifyAdminUser } from '../../../lib/neon'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, password } = req.body

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ 
      error: 'Username and password are required' 
    })
  }

  try {
    // Verify admin user against database
    const result = await verifyAdminUser(username, password)

    if (result.success) {
      // Generate a simple session token (in production, use JWT)
      const sessionToken = Buffer.from(`${result.user.id}:${Date.now()}`).toString('base64')
      
      return res.status(200).json({ 
        success: true, 
        message: 'Login successful',
        user: {
          id: result.user.id,
          username: result.user.username,
          email: result.user.email
        },
        sessionToken: sessionToken
      })
    } else {
      return res.status(401).json({ 
        error: result.message || 'Invalid credentials' 
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ 
      error: 'Internal server error' 
    })
  }
}
