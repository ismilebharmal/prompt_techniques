require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function enhanceHeroSlidesSchema() {
  try {
    console.log('🚀 Enhancing hero_slides table with image display options...')

    // Add new columns for image display settings
    await sql`
      ALTER TABLE hero_slides 
      ADD COLUMN IF NOT EXISTS image_fit VARCHAR(20) DEFAULT 'cover'
    `

    await sql`
      ALTER TABLE hero_slides 
      ADD COLUMN IF NOT EXISTS image_position VARCHAR(20) DEFAULT 'center'
    `

    await sql`
      ALTER TABLE hero_slides 
      ADD COLUMN IF NOT EXISTS text_position VARCHAR(20) DEFAULT 'bottom-left'
    `

    // Update existing records with default values
    await sql`
      UPDATE hero_slides 
      SET 
        image_fit = 'cover',
        image_position = 'center',
        text_position = 'bottom-left'
      WHERE image_fit IS NULL OR image_position IS NULL OR text_position IS NULL
    `

    console.log('✅ Hero slides schema enhanced successfully!')
    console.log('📝 Added columns: image_fit, image_position, text_position')
    
  } catch (error) {
    console.error('❌ Error enhancing hero slides schema:', error)
  }
}

enhanceHeroSlidesSchema()
