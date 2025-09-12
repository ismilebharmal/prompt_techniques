require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function setupHeroSlidesTable() {
  try {
    console.log('🚀 Setting up hero_slides table...')

    // Create hero_slides table
    await sql`
      CREATE TABLE IF NOT EXISTS hero_slides (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_id INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Create index for better performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON hero_slides(display_order);
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_hero_slides_active ON hero_slides(is_active);
    `

    console.log('✅ hero_slides table created successfully!')

    // Insert some sample hero slides
    console.log('📝 Inserting sample hero slides...')
    
    // First, let's check if we have any images
    const images = await sql`SELECT id FROM images LIMIT 3`
    
    if (images.length > 0) {
      await sql`
        INSERT INTO hero_slides (title, description, image_id, display_order, is_active) VALUES
        ('Welcome to My Portfolio', 'Discover my journey in Flutter and AI/ML development', ${images[0].id}, 1, true),
        ('Innovation in Technology', 'Building the future with cutting-edge solutions', ${images[1]?.id || images[0].id}, 2, true),
        ('Creative Development', 'Crafting digital experiences that matter', ${images[2]?.id || images[0].id}, 3, true)
        ON CONFLICT DO NOTHING;
      `
      console.log('✅ Sample hero slides inserted!')
    } else {
      console.log('⚠️  No images found. Please upload some images first.')
    }

    console.log('🎉 Hero slides setup completed!')
  } catch (error) {
    console.error('❌ Error setting up hero slides:', error)
  }
}

setupHeroSlidesTable()
