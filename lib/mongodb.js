import { MongoClient } from 'mongodb'

// Direct MongoDB connection - using SRV format with different SSL settings
const MONGODB_URI = 'mongodb+srv://smile463bharmal463_db_user:GNyzuCCumul8bVhB@prompttechnique.pql8lmx.mongodb.net/?retryWrites=true&w=majority&appName=promptTechnique&ssl=true&tlsAllowInvalidCertificates=false&tlsAllowInvalidHostnames=false'
const MONGODB_DB = 'prompt-hub'

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
    const opts = {
      // Simple options for better compatibility
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      // Additional SSL options for Vercel
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
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
