const { neon } = require('@neondatabase/serverless')

async function setupAdminTable() {
  const sql = neon(process.env.DATABASE_URL)
  
  try {
    console.log('🔧 Setting up admin_users table...')
    
    // Create admin_users table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    console.log('✅ admin_users table created successfully')
    
    // Check if admin user already exists
    const existingAdmin = await sql`
      SELECT id FROM admin_users WHERE username = 'ismile'
    `
    
    if (existingAdmin.length === 0) {
      // Create default admin user (password: ismile@8866)
      const bcrypt = require('bcryptjs')
      const passwordHash = await bcrypt.hash('ismile@8866', 12)
      
      await sql`
        INSERT INTO admin_users (username, password_hash, email, is_active)
        VALUES ('ismile', ${passwordHash}, 'ismile@example.com', true)
      `
      
      console.log('✅ Default admin user created:')
      console.log('   Username: ismile')
      console.log('   Password: ismile@8866')
      console.log('   Email: ismile@example.com')
    } else {
      console.log('ℹ️  Admin user already exists')
    }
    
    console.log('🎉 Admin table setup completed!')
    
  } catch (error) {
    console.error('❌ Error setting up admin table:', error)
    process.exit(1)
  }
}

setupAdminTable()
