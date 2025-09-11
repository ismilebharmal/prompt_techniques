const { MongoClient } = require('mongodb')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB || 'prompt-hub'

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set')
  console.log('Please create a .env.local file with your MongoDB connection string')
  process.exit(1)
}

async function seedDatabase() {
  let client
  
  try {
    console.log('🔄 Connecting to MongoDB...')
    client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const db = client.db(MONGODB_DB)
    const collection = db.collection('prompts')
    
    // Read seed data
    console.log('📖 Reading seed data...')
    const seedDataPath = path.join(__dirname, '..', 'data', 'prompts.json')
    const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'))
    
    console.log(`📊 Found ${seedData.length} prompts to seed`)
    
    // Add timestamps to each prompt
    const promptsWithTimestamps = seedData.map(prompt => ({
      ...prompt,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    
    // Clear existing data (optional - remove if you want to keep existing data)
    console.log('🗑️  Clearing existing prompts...')
    await collection.deleteMany({})
    
    // Insert new data
    console.log('🌱 Seeding database...')
    const result = await collection.insertMany(promptsWithTimestamps)
    
    console.log(`✅ Successfully seeded ${result.insertedCount} prompts`)
    
    // Verify the data
    const count = await collection.countDocuments()
    console.log(`📈 Total prompts in database: ${count}`)
    
    // Show sample data
    const sample = await collection.findOne({})
    if (sample) {
      console.log('\n📋 Sample prompt:')
      console.log(`   Title: ${sample.title}`)
      console.log(`   Category: ${sample.category}`)
      console.log(`   Tags: ${sample.tags.join(', ')}`)
    }
    
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

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('\n🎉 Database seeding completed successfully!')
    console.log('You can now run "npm run dev" to start the application')
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error)
    process.exit(1)
  })
