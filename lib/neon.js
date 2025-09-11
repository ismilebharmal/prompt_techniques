import { neon } from '@neondatabase/serverless'

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null

export async function getPrompts() {
  if (!sql) {
    console.log('Neon not configured, returning empty array to trigger fallback')
    return []
  }

  try {
    const result = await sql`SELECT * FROM prompts ORDER BY created_at DESC`
    return result.map(row => ({
      _id: row.id.toString(),
      title: row.title,
      category: row.category,
      tags: row.tags || [],
      description: row.description,
      prompt: row.prompt,
      exampleInput: row.example_input,
      exampleOutput: row.example_output,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))
  } catch (error) {
    console.error('Neon error:', error)
    return []
  }
}

export async function createPrompt(promptData) {
  if (!sql) {
    throw new Error('Database not configured')
  }

  const { title, category, tags, description, prompt, exampleInput, exampleOutput } = promptData
  
  const result = await sql`
    INSERT INTO prompts (title, category, tags, description, prompt, example_input, example_output, created_at, updated_at) 
    VALUES (${title}, ${category}, ${JSON.stringify(tags)}, ${description}, ${prompt}, ${exampleInput}, ${exampleOutput}, NOW(), NOW())
    RETURNING id
  `

  return result[0].id
}

export async function deletePrompt(id) {
  if (!sql) {
    throw new Error('Database not configured')
  }

  await sql`DELETE FROM prompts WHERE id = ${id}`
  return true
}

export { sql }
