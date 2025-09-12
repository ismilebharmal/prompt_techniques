import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

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

export async function updatePrompt(id, promptData) {
  if (!sql) {
    throw new Error('Database not configured')
  }

  const { title, category, tags, description, prompt, exampleInput, exampleOutput } = promptData
  
  await sql`
    UPDATE prompts 
    SET title = ${title}, 
        category = ${category}, 
        tags = ${JSON.stringify(tags)}, 
        description = ${description}, 
        prompt = ${prompt}, 
        example_input = ${exampleInput}, 
        example_output = ${exampleOutput}, 
        updated_at = NOW()
    WHERE id = ${id}
  `
  
  return true
}

export async function deletePrompt(id) {
  if (!sql) {
    throw new Error('Database not configured')
  }

  await sql`DELETE FROM prompts WHERE id = ${id}`
  return true
}

// Admin user functions
export async function verifyAdminUser(username, password) {
  if (!sql) {
    throw new Error('Database not configured')
  }

  try {
    const result = await sql`
      SELECT id, username, password_hash, email, is_active 
      FROM admin_users 
      WHERE username = ${username} AND is_active = true
    `

    if (result.length === 0) {
      return { success: false, message: 'Invalid username or password' }
    }

    const user = result[0]
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return { success: false, message: 'Invalid username or password' }
    }

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    }
  } catch (error) {
    console.error('Error verifying admin user:', error)
    return { success: false, message: 'Database error' }
  }
}

export async function createAdminUser(userData) {
  if (!sql) {
    throw new Error('Database not configured')
  }

  const { username, password, email } = userData
  const passwordHash = await bcrypt.hash(password, 12)

  try {
    const result = await sql`
      INSERT INTO admin_users (username, password_hash, email, is_active)
      VALUES (${username}, ${passwordHash}, ${email}, true)
      RETURNING id, username, email
    `

    return { success: true, user: result[0] }
  } catch (error) {
    console.error('Error creating admin user:', error)
    if (error.code === '23505') { // Unique constraint violation
      return { success: false, message: 'Username already exists' }
    }
    return { success: false, message: 'Database error' }
  }
}

export async function updateAdminUser(id, userData) {
  if (!sql) {
    throw new Error('Database not configured')
  }

  const { username, email, isActive } = userData
  const updates = []
  const values = []

  if (username !== undefined) {
    updates.push('username = $' + (values.length + 1))
    values.push(username)
  }
  if (email !== undefined) {
    updates.push('email = $' + (values.length + 1))
    values.push(email)
  }
  if (isActive !== undefined) {
    updates.push('is_active = $' + (values.length + 1))
    values.push(isActive)
  }

  if (updates.length === 0) {
    return { success: false, message: 'No updates provided' }
  }

  updates.push('updated_at = NOW()')
  values.push(id)

  try {
    await sql`
      UPDATE admin_users 
      SET ${sql(updates.join(', '))}
      WHERE id = ${id}
    `

    return { success: true }
  } catch (error) {
    console.error('Error updating admin user:', error)
    return { success: false, message: 'Database error' }
  }
}

export async function changeAdminPassword(id, newPassword) {
  if (!sql) {
    throw new Error('Database not configured')
  }

  const passwordHash = await bcrypt.hash(newPassword, 12)

  try {
    await sql`
      UPDATE admin_users 
      SET password_hash = ${passwordHash}, updated_at = NOW()
      WHERE id = ${id}
    `

    return { success: true }
  } catch (error) {
    console.error('Error changing admin password:', error)
    return { success: false, message: 'Database error' }
  }
}

export async function getAllAdminUsers() {
  if (!sql) {
    throw new Error('Database not configured')
  }

  try {
    const result = await sql`
      SELECT id, username, email, is_active, created_at, updated_at
      FROM admin_users 
      ORDER BY created_at DESC
    `

    return result.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }))
  } catch (error) {
    console.error('Error getting admin users:', error)
    return []
  }
}

export { sql }
