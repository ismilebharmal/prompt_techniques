require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function setupSkillsTable() {
  try {
    console.log('Creating skills table...')
    
    // Create skills table
    await sql`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        level INTEGER NOT NULL CHECK (level >= 0 AND level <= 100),
        color VARCHAR(100) NOT NULL,
        display_order INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `
    
    console.log('Skills table created successfully!')
    
    // Insert default skills
    const defaultSkills = [
      { name: 'Flutter', level: 95, color: 'from-blue-400 to-cyan-500', display_order: 1 },
      { name: 'Dart', level: 90, color: 'from-blue-500 to-indigo-600', display_order: 2 },
      { name: 'Python', level: 90, color: 'from-yellow-400 to-orange-500', display_order: 3 },
      { name: 'AI/ML', level: 85, color: 'from-purple-400 to-pink-500', display_order: 4 },
      { name: 'LangChain', level: 80, color: 'from-green-400 to-emerald-500', display_order: 5 },
      { name: 'FastAPI', level: 85, color: 'from-red-400 to-pink-500', display_order: 6 },
      { name: 'StreamLit', level: 80, color: 'from-orange-400 to-red-500', display_order: 7 },
      { name: 'Firebase', level: 85, color: 'from-yellow-500 to-orange-600', display_order: 8 },
      { name: 'MySQL', level: 80, color: 'from-blue-600 to-blue-800', display_order: 9 },
      { name: 'PostgreSQL', level: 75, color: 'from-indigo-400 to-purple-500', display_order: 10 },
      { name: 'Git/GitLab', level: 90, color: 'from-gray-400 to-gray-600', display_order: 11 },
      { name: 'Figma', level: 75, color: 'from-pink-400 to-purple-500', display_order: 12 }
    ]
    
    console.log('Inserting default skills...')
    for (const skill of defaultSkills) {
      await sql`
        INSERT INTO skills (name, level, color, display_order)
        VALUES (${skill.name}, ${skill.level}, ${skill.color}, ${skill.display_order})
        ON CONFLICT (name) DO NOTHING
      `
    }
    
    console.log('Default skills inserted successfully!')
    
    // Verify the table
    const skills = await sql`SELECT * FROM skills ORDER BY display_order ASC`
    console.log(`Found ${skills.length} skills in the database:`)
    skills.forEach(skill => {
      console.log(`- ${skill.name}: ${skill.level}% (${skill.color})`)
    })
    
  } catch (error) {
    console.error('Error setting up skills table:', error)
  } finally {
    process.exit()
  }
}

setupSkillsTable()
