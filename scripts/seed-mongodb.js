const { MongoClient } = require('mongodb')
const fs = require('fs')
const path = require('path')

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://smile463bharmal463_db_user:GNyzuCCumul8bVhB@prompttechnique.pql8lmx.mongodb.net/?retryWrites=true&w=majority&appName=promptTechnique'
const MONGODB_DB = 'prompt-hub'

async function seedDatabase() {
  let client
  
  try {
    console.log('🔄 Connecting to MongoDB...')
    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const db = client.db(MONGODB_DB)
    const collection = db.collection('prompts')
    
    // Read prompts from JSON file
    const promptsPath = path.join(__dirname, '../data/prompts.json')
    const promptsData = JSON.parse(fs.readFileSync(promptsPath, 'utf8'))
    
    console.log(`📄 Found ${promptsData.length} prompts in JSON file`)
    
    // Add timestamps to each prompt
    const promptsWithTimestamps = promptsData.map(prompt => ({
      ...prompt,
      _id: prompt._id || new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: prompt.createdAt || new Date().toISOString(),
      updatedAt: prompt.updatedAt || new Date().toISOString()
    }))
    
    // Clear existing prompts (optional - remove this if you want to keep existing data)
    console.log('🗑️  Clearing existing prompts...')
    await collection.deleteMany({})
    
    // Insert all prompts
    console.log('📝 Inserting prompts into database...')
    const result = await collection.insertMany(promptsWithTimestamps)
    
    console.log(`✅ Successfully inserted ${result.insertedCount} prompts`)
    
    // Verify the data
    const count = await collection.countDocuments()
    console.log(`📊 Total prompts in database: ${count}`)
    
    // Show a sample
    const sample = await collection.findOne({})
    console.log('📋 Sample prompt:', {
      title: sample.title,
      category: sample.category,
      tags: sample.tags
    })
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
      console.log('🔌 Database connection closed')
    }
  }
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log('🎉 Database seeding completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error)
    process.exit(1)
  })
