require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function enhanceHeroSlidesSchema() {
  try {
    console.log('🚀 Enhancing hero_slides table with image settings...')

    // Add new columns for image customization
    try {
      await sql`ALTER TABLE hero_slides ADD COLUMN image_position VARCHAR(20) DEFAULT 'center'`
    } catch (e) {
      console.log('Column image_position already exists or error:', e.message)
    }

    try {
      await sql`ALTER TABLE hero_slides ADD COLUMN image_fit VARCHAR(20) DEFAULT 'cover'`
    } catch (e) {
      console.log('Column image_fit already exists or error:', e.message)
    }

    try {
      await sql`ALTER TABLE hero_slides ADD COLUMN image_opacity INTEGER DEFAULT 100`
    } catch (e) {
      console.log('Column image_opacity already exists or error:', e.message)
    }

    try {
      await sql`ALTER TABLE hero_slides ADD COLUMN text_position VARCHAR(20) DEFAULT 'bottom-left'`
    } catch (e) {
      console.log('Column text_position already exists or error:', e.message)
    }

    try {
      await sql`ALTER TABLE hero_slides ADD COLUMN custom_css TEXT`
    } catch (e) {
      console.log('Column custom_css already exists or error:', e.message)
    }

    console.log('✅ Hero slides schema enhanced successfully!')

    // Update existing records with default values
    await sql`
      UPDATE hero_slides 
      SET 
        image_position = 'center',
        image_fit = 'cover',
        image_opacity = 100,
        text_position = 'bottom-left'
      WHERE image_position IS NULL OR image_position = ''
    `

    console.log('✅ Updated existing hero slides with default values!')
    console.log('🎉 Hero slides enhancement completed!')
  } catch (error) {
    console.error('❌ Error enhancing hero slides schema:', error)
  }
}

enhanceHeroSlidesSchema()
