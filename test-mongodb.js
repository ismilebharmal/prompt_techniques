const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://smile463bharmal463_db_user:GNyzuCCumul8bVhB@prompttechnique.pql8lmx.mongodb.net/?retryWrites=true&w=majority&appName=promptTechnique';
const MONGODB_DB = 'prompt-hub';

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    const client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');
    
    const db = client.db(MONGODB_DB);
    const collection = db.collection('prompts');
    
    const count = await collection.countDocuments();
    console.log(`✅ Found ${count} documents in prompts collection`);
    
    const sample = await collection.findOne();
    if (sample) {
      console.log('✅ Sample document:', sample.title);
    }
    
    await client.close();
    console.log('✅ Connection closed successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
}

testConnection();
