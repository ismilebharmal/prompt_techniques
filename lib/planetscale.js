import { connect } from '@planetscale/database'

const config = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
}

const conn = process.env.DATABASE_HOST ? connect(config) : null

export async function getPrompts() {
  if (!conn) {
    console.log('PlanetScale not configured, returning empty array to trigger fallback')
    return []
  }

  try {
    const result = await conn.execute('SELECT * FROM prompts ORDER BY created_at DESC')
    return result.rows.map(row => ({
      _id: row.id.toString(),
      title: row.title,
      category: row.category,
      tags: JSON.parse(row.tags || '[]'),
      description: row.description,
      prompt: row.prompt,
      exampleInput: row.example_input,
      exampleOutput: row.example_output,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))
  } catch (error) {
    console.error('PlanetScale error:', error)
    return []
  }
}

export async function createPrompt(promptData) {
  if (!conn) {
    throw new Error('Database not configured')
  }

  const { title, category, tags, description, prompt, exampleInput, exampleOutput } = promptData
  
  const result = await conn.execute(
    `INSERT INTO prompts (title, category, tags, description, prompt, example_input, example_output, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [title, category, JSON.stringify(tags), description, prompt, exampleInput, exampleOutput]
  )

  return result.insertId
}

export { conn }
