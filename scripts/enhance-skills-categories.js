require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function enhanceSkillsWithCategories() {
  try {
    console.log('Adding category column to skills table...')
    
    // Add category column to skills table
    await sql`
      ALTER TABLE skills 
      ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'Technologies'
    `
    
    console.log('Category column added successfully!')
    
    // Update existing skills with appropriate categories
    const categoryUpdates = [
      { name: 'Flutter', category: 'Mobile Development' },
      { name: 'Dart', category: 'Programming Languages' },
      { name: 'Python', category: 'Programming Languages' },
      { name: 'AI/ML', category: 'Artificial Intelligence' },
      { name: 'LangChain', category: 'AI Frameworks' },
      { name: 'FastAPI', category: 'Backend Frameworks' },
      { name: 'StreamLit', category: 'Web Frameworks' },
      { name: 'Firebase', category: 'Databases' },
      { name: 'MySQL', category: 'Databases' },
      { name: 'PostgreSQL', category: 'Databases' },
      { name: 'Git/GitLab', category: 'Version Control' },
      { name: 'Figma', category: 'Design Tools' }
    ]
    
    console.log('Updating existing skills with categories...')
    for (const update of categoryUpdates) {
      await sql`
        UPDATE skills 
        SET category = ${update.category}
        WHERE name = ${update.name}
      `
    }
    
    console.log('Categories updated successfully!')
    
    // Add some additional skills with different categories
    const additionalSkills = [
      { name: 'MongoDB', level: 85, color: 'from-green-500 to-emerald-600', category: 'Databases', display_order: 13 },
      { name: 'Redis', level: 75, color: 'from-red-500 to-pink-600', category: 'Databases', display_order: 14 },
      { name: 'Docker', level: 80, color: 'from-blue-500 to-cyan-600', category: 'DevOps', display_order: 15 },
      { name: 'Kubernetes', level: 70, color: 'from-blue-600 to-indigo-700', category: 'DevOps', display_order: 16 },
      { name: 'AWS', level: 75, color: 'from-orange-500 to-yellow-600', category: 'Cloud Platforms', display_order: 17 },
      { name: 'Vercel', level: 90, color: 'from-gray-600 to-gray-800', category: 'Cloud Platforms', display_order: 18 },
      { name: 'GitHub Actions', level: 80, color: 'from-purple-500 to-pink-600', category: 'CI/CD', display_order: 19 },
      { name: 'Jenkins', level: 70, color: 'from-red-600 to-orange-700', category: 'CI/CD', display_order: 20 },
      { name: 'React', level: 90, color: 'from-cyan-400 to-blue-500', category: 'Frontend Frameworks', display_order: 21 },
      { name: 'Next.js', level: 95, color: 'from-gray-700 to-gray-900', category: 'Frontend Frameworks', display_order: 22 },
      { name: 'Node.js', level: 85, color: 'from-green-600 to-emerald-700', category: 'Backend Frameworks', display_order: 23 },
      { name: 'Express.js', level: 80, color: 'from-gray-500 to-gray-700', category: 'Backend Frameworks', display_order: 24 }
    ]
    
    console.log('Adding additional skills with categories...')
    for (const skill of additionalSkills) {
      await sql`
        INSERT INTO skills (name, level, color, category, display_order)
        VALUES (${skill.name}, ${skill.level}, ${skill.color}, ${skill.category}, ${skill.display_order})
        ON CONFLICT (name) DO NOTHING
      `
    }
    
    console.log('Additional skills added successfully!')
    
    // Verify the results
    const skills = await sql`
      SELECT name, level, color, category, display_order 
      FROM skills 
      ORDER BY category, display_order ASC
    `
    
    console.log('\nSkills organized by category:')
    const categories = {}
    skills.forEach(skill => {
      if (!categories[skill.category]) {
        categories[skill.category] = []
      }
      categories[skill.category].push(skill)
    })
    
    Object.keys(categories).sort().forEach(category => {
      console.log(`\n📁 ${category}:`)
      categories[category].forEach(skill => {
        console.log(`  - ${skill.name}: ${skill.level}% (${skill.color})`)
      })
    })
    
  } catch (error) {
    console.error('Error enhancing skills with categories:', error)
  } finally {
    process.exit()
  }
}

enhanceSkillsWithCategories()
