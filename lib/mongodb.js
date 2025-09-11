import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB || 'prompt-hub'

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

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
    // For Vercel, we need to modify the connection string to handle SSL properly
    let connectionString = MONGODB_URI;
    
    // Add SSL parameters to the connection string for Vercel compatibility
    if (process.env.NODE_ENV === 'production' && connectionString.includes('mongodb+srv://')) {
      // Add SSL parameters to the connection string
      const url = new URL(connectionString);
      url.searchParams.set('ssl', 'true');
      url.searchParams.set('tlsAllowInvalidCertificates', 'false');
      url.searchParams.set('tlsAllowInvalidHostnames', 'false');
      connectionString = url.toString();
    }

    const opts = {
      // Minimal options for better Vercel compatibility
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    }

    cached.promise = MongoClient.connect(connectionString, opts).then((client) => {
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
