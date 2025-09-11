export default async function handler(req, res) {
  try {
    // Check environment variables
    const envCheck = {
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
      MONGODB_DB: process.env.MONGODB_DB ? 'Set' : 'Not set',
      NODE_ENV: process.env.NODE_ENV,
    };

    // Try to connect to MongoDB
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection('prompts');
    const count = await collection.countDocuments();
    
    await client.close();

    return res.status(200).json({
      success: true,
      environment: envCheck,
      mongoConnection: 'Success',
      documentCount: count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      environment: {
        MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
        MONGODB_DB: process.env.MONGODB_DB ? 'Set' : 'Not set',
        NODE_ENV: process.env.NODE_ENV,
      },
      timestamp: new Date().toISOString()
    });
  }
}
