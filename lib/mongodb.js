import { MongoClient } from 'mongodb'

// MongoDB Atlas connection - Railway compatible
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
    // Railway-optimized MongoDB options
    const opts = {
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000, // Shorter timeout for Railway
      socketTimeoutMS: 30000,
      connectTimeoutMS: 5000,
      // Railway-specific options
      retryWrites: true,
      retryReads: true,
      // SSL options for better compatibility
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
    }

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      console.log('✅ MongoDB connected successfully on Railway')
      return {
        client,
        db: client.db(MONGODB_DB),
      }
    }).catch((error) => {
      console.error('❌ MongoDB connection error on Railway:', error)
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
