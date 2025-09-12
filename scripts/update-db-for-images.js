const { neon } = require('@neondatabase/serverless');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function updateDatabaseForImages() {
  try {
    console.log('🚀 Updating database schema for image storage...');

    // Add image_data columns to projects table
    await sql`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS image_data BYTEA,
      ADD COLUMN IF NOT EXISTS image_type VARCHAR(50),
      ADD COLUMN IF NOT EXISTS image_size INTEGER;
    `;
    console.log('✅ Added image columns to projects table');

    // Add image_data columns to slides table
    await sql`
      ALTER TABLE slides 
      ADD COLUMN IF NOT EXISTS image_data BYTEA,
      ADD COLUMN IF NOT EXISTS image_type VARCHAR(50),
      ADD COLUMN IF NOT EXISTS image_size INTEGER;
    `;
    console.log('✅ Added image columns to slides table');

    // Create images table for better image management
    await sql`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        size INTEGER NOT NULL,
        data BYTEA NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Created images table');

    // Add foreign key references
    await sql`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS image_id INTEGER REFERENCES images(id);
    `;
    console.log('✅ Added image_id foreign key to projects table');

    await sql`
      ALTER TABLE slides 
      ADD COLUMN IF NOT EXISTS image_id INTEGER REFERENCES images(id);
    `;
    console.log('✅ Added image_id foreign key to slides table');

    console.log('🎉 Database schema updated successfully for image storage!');

  } catch (error) {
    console.error('❌ Error updating database schema:', error);
    process.exit(1);
  }
}

updateDatabaseForImages();
