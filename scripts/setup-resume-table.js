require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function setupResumeTable() {
  console.log('🚀 Setting up resume table...');
  try {
    // Create resume table
    await sql`
      CREATE TABLE IF NOT EXISTS resumes (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        size INTEGER NOT NULL,
        data BYTEA NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ resume table created successfully!');

    // Create index for better performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_resumes_active ON resumes(is_active);
    `;
    console.log('✅ Resume indexes created!');

    console.log('🎉 Resume setup completed!');
  } catch (error) {
    console.error('❌ Error setting up resume table:', error);
  } finally {
    // Ensure the process exits
    process.exit();
  }
}

setupResumeTable();
