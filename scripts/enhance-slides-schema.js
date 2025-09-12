const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function enhanceSlidesSchema() {
  try {
    console.log('🚀 Enhancing slides schema for multiple images...');

    // Create slide_images junction table
    await sql`
      CREATE TABLE IF NOT EXISTS slide_images (
        id SERIAL PRIMARY KEY,
        slide_id INTEGER REFERENCES slides(id) ON DELETE CASCADE,
        image_id INTEGER REFERENCES images(id) ON DELETE CASCADE,
        is_cover BOOLEAN DEFAULT FALSE,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Add cover_image_id to slides table
    await sql`
      ALTER TABLE slides 
      ADD COLUMN IF NOT EXISTS cover_image_id INTEGER REFERENCES images(id)
    `;

    // Add description and details to slides
    await sql`
      ALTER TABLE slides 
      ADD COLUMN IF NOT EXISTS description TEXT,
      ADD COLUMN IF NOT EXISTS details TEXT,
      ADD COLUMN IF NOT EXISTS category VARCHAR(100),
      ADD COLUMN IF NOT EXISTS tags TEXT[],
      ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE
    `;

    // Create index for better performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_slide_images_slide_id ON slide_images(slide_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_slide_images_cover ON slide_images(slide_id, is_cover)
    `;

    console.log('✅ Slides schema enhanced successfully!');
    console.log('📋 New features:');
    console.log('   - Multiple images per slide');
    console.log('   - Cover image selection');
    console.log('   - Description and details');
    console.log('   - Category and tags');
    console.log('   - Featured slides');

  } catch (error) {
    console.error('❌ Error enhancing slides schema:', error);
    process.exit(1);
  }
}

enhanceSlidesSchema();
