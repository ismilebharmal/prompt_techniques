const { neon } = require('@neondatabase/serverless')
const prompts = require('../data/prompts.json')

// Use your Neon connection string
const sql = neon(process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_H1ckWgmQVE4v@ep-crimson-firefly-adi2ki7d-pooler.c-2.us-east-1.aws.neon.tech/prompt_techniques?sslmode=require&channel_binding=require')

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')

    // Create the prompts table
    console.log('📋 Creating prompts table...')
    await sql`
      CREATE TABLE IF NOT EXISTS prompts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        tags JSONB,
        description TEXT,
        prompt TEXT NOT NULL,
        example_input TEXT,
        example_output TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await sql`DELETE FROM prompts`

    // Insert prompts
    console.log('📝 Inserting prompts...')
    for (const prompt of prompts) {
      await sql`
        INSERT INTO prompts (title, category, tags, description, prompt, example_input, example_output)
        VALUES (${prompt.title}, ${prompt.category}, ${JSON.stringify(prompt.tags)}, ${prompt.description}, ${prompt.prompt}, ${prompt.exampleInput}, ${prompt.exampleOutput})
      `
      console.log(`✅ Inserted: ${prompt.title}`)
    }

    // Verify the data
    const count = await sql`SELECT COUNT(*) FROM prompts`
    console.log(`🎉 Successfully seeded ${count[0].count} prompts!`)

    // Show sample data
    const sample = await sql`SELECT title, category FROM prompts LIMIT 3`
    console.log('📊 Sample data:')
    sample.forEach(p => console.log(`  - ${p.title} (${p.category})`))

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
