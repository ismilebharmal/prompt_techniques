import { MongoClient } from 'mongodb'

// MongoDB connection with Vercel-compatible settings
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://smile463bharmal463_db_user:GNyzuCCumul8bVhB@prompttechnique.pql8lmx.mongodb.net/?retryWrites=true&w=majority&appName=promptTechnique'
const MONGODB_DB = process.env.MONGODB_DB || 'prompt-hub'

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo

if (!cached) {
  cached = global.mongo = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    // Vercel-compatible MongoDB options
    const opts = {
      maxPoolSize: 1, // Reduced for serverless
      serverSelectionTimeoutMS: 5000, // Shorter timeout
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      // Vercel-specific options
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      // Retry options
      retryWrites: true,
      retryReads: true,
    }

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      return {
        client,
        db: client.db(MONGODB_DB),
      }
    }).catch((error) => {
      console.error('MongoDB connection error:', error)
      cached.promise = null
      throw error
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

/**
 * Helper function to safely close the database connection
 * Call this when your application is shutting down
 */
export async function closeDatabaseConnection() {
  if (cached.conn) {
    await cached.conn.client.close()
    cached.conn = null
    cached.promise = null
  }
}
