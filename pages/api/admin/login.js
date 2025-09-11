export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { password } = req.body

  // Simple password check - in production, use environment variables
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  if (password === adminPassword) {
    // In a real app, you'd generate a JWT token here
    return res.status(200).json({ 
      success: true, 
      message: 'Login successful' 
    })
  } else {
    return res.status(401).json({ 
      error: 'Invalid password' 
    })
  }
}
