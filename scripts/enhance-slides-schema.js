const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function enhanceSlidesSchema() {
  try {
    console.log('🚀 Enhancing slides schema for advanced image management...');

    // Add cover_image_id to projects table
    await sql`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS cover_image_id INTEGER REFERENCES images(id)
    `;
    console.log('✅ Added cover_image_id to projects table');

    // Add cover_image_id to slides table
    await sql`
      ALTER TABLE slides 
      ADD COLUMN IF NOT EXISTS cover_image_id INTEGER REFERENCES images(id)
    `;
    console.log('✅ Added cover_image_id to slides table');

    // Add detailed fields to projects table
    await sql`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS detailed_description TEXT,
      ADD COLUMN IF NOT EXISTS tools_used TEXT[],
      ADD COLUMN IF NOT EXISTS project_date DATE,
      ADD COLUMN IF NOT EXISTS client_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS project_status VARCHAR(50) DEFAULT 'completed'
    `;
    console.log('✅ Added detailed fields to projects table');

    // Add detailed fields to slides table
    await sql`
      ALTER TABLE slides 
      ADD COLUMN IF NOT EXISTS detailed_description TEXT,
      ADD COLUMN IF NOT EXISTS workshop_date DATE,
      ADD COLUMN IF NOT EXISTS duration_hours INTEGER,
      ADD COLUMN IF NOT EXISTS participants_count INTEGER,
      ADD COLUMN IF NOT EXISTS workshop_type VARCHAR(100)
    `;
    console.log('✅ Added detailed fields to slides table');

    // Create project_images junction table for multiple images per project
    await sql`
      CREATE TABLE IF NOT EXISTS project_images (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        image_id INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE,
        display_order INTEGER DEFAULT 0,
        is_cover BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(project_id, image_id)
      )
    `;
    console.log('✅ Created project_images junction table');

    // Create slide_images junction table for multiple images per slide
    await sql`
      CREATE TABLE IF NOT EXISTS slide_images (
        id SERIAL PRIMARY KEY,
        slide_id INTEGER NOT NULL REFERENCES slides(id) ON DELETE CASCADE,
        image_id INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE,
        display_order INTEGER DEFAULT 0,
        is_cover BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(slide_id, image_id)
      )
    `;
    console.log('✅ Created slide_images junction table');

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_project_images_image_id ON project_images(image_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_slide_images_slide_id ON slide_images(slide_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_slide_images_image_id ON slide_images(image_id)`;
    console.log('✅ Created performance indexes');

    console.log('🎉 Database schema enhancement completed successfully!');
    console.log('\n📋 New Features Available:');
    console.log('• Multiple images per project/slide');
    console.log('• Cover image selection');
    console.log('• Detailed project information');
    console.log('• Image ordering and management');
    console.log('• Enhanced metadata fields');

  } catch (error) {
    console.error('❌ Error enhancing schema:', error);
    process.exit(1);
  }
}

enhanceSlidesSchema();
