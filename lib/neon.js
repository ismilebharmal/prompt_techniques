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

// Projects functions
export async function getProjects() {
  if (!sql) {
    console.log('Neon not configured, returning empty array')
    return []
  }

  try {
    const result = await sql`
      SELECT p.*, i.filename, i.mime_type, i.size as image_size
      FROM projects p
      LEFT JOIN images i ON p.image_id = i.id
      ORDER BY p.order_index ASC, p.created_at DESC
    `
    return result.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      shortDescription: row.short_description,
      imageUrl: row.image_url,
      imageId: row.image_id,
      imageFilename: row.filename,
      imageMimeType: row.mime_type,
      imageSize: row.image_size,
      githubUrl: row.github_url,
      liveUrl: row.live_url,
      technologies: row.technologies || [],
      category: row.category,
      featured: row.featured,
      orderIndex: row.order_index,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))
  } catch (error) {
    console.error('Neon error getting projects:', error)
    return []
  }
}

export async function getFeaturedProjects() {
  if (!sql) {
    console.log('Neon not configured, returning empty array')
    return []
  }

  try {
    const result = await sql`
      SELECT p.*, i.filename, i.mime_type, i.size as image_size
      FROM projects p
      LEFT JOIN images i ON p.image_id = i.id
      WHERE p.featured = true
      ORDER BY p.order_index ASC, p.created_at DESC
    `
    return result.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      shortDescription: row.short_description,
      imageUrl: row.image_url,
      imageId: row.image_id,
      imageFilename: row.filename,
      imageMimeType: row.mime_type,
      imageSize: row.image_size,
      githubUrl: row.github_url,
      liveUrl: row.live_url,
      technologies: row.technologies || [],
      category: row.category,
      featured: row.featured,
      orderIndex: row.order_index,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))
  } catch (error) {
    console.error('Neon error getting featured projects:', error)
    return []
  }
}

export async function createProject(projectData) {
  if (!sql) {
    throw new Error('Database not configured')
  }

  const { 
    title, 
    description, 
    shortDescription, 
    imageUrl, 
    imageId,
    githubUrl, 
    liveUrl, 
    technologies, 
    category, 
    featured, 
    orderIndex 
  } = projectData
  
  const result = await sql`
    INSERT INTO projects (title, description, short_description, image_url, image_id, github_url, live_url, technologies, category, featured, order_index, created_at, updated_at) 
    VALUES (${title}, ${description}, ${shortDescription}, ${imageUrl}, ${imageId}, ${githubUrl}, ${liveUrl}, ${JSON.stringify(technologies)}, ${category}, ${featured || false}, ${orderIndex || 0}, NOW(), NOW())
    RETURNING id
  `

  return result[0].id
}

export async function updateProject(id, projectData) {
  if (!sql) {
    throw new Error('Database not configured')
  }

  const { 
    title, 
    description, 
    shortDescription, 
    imageUrl, 
    imageId,
    githubUrl, 
    liveUrl, 
    technologies, 
    category, 
    featured, 
    orderIndex 
  } = projectData
  
  await sql`
    UPDATE projects 
    SET title = ${title}, 
        description = ${description}, 
        short_description = ${shortDescription}, 
        image_url = ${imageUrl}, 
        image_id = ${imageId},
        github_url = ${githubUrl}, 
        live_url = ${liveUrl}, 
        technologies = ${JSON.stringify(technologies)}, 
        category = ${category}, 
        featured = ${featured || false}, 
        order_index = ${orderIndex || 0}, 
        updated_at = NOW()
    WHERE id = ${id}
  `
  
  return true
}

export async function deleteProject(id) {
  if (!sql) {
    throw new Error('Database not configured')
  }

  await sql`DELETE FROM projects WHERE id = ${id}`
  return true
}

// Slides functions
export async function getSlides() {
  if (!sql) {
    console.log('Neon not configured, returning empty array')
    return []
  }

  try {
    const result = await sql`
      SELECT s.*, i.filename, i.mime_type, i.size as image_size
      FROM slides s
      LEFT JOIN images i ON s.image_id = i.id
      WHERE s.active = true
      ORDER BY s.order_index ASC, s.created_at DESC
    `
    return result.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      imageUrl: row.image_url,
      imageId: row.image_id,
      imageFilename: row.filename,
      imageMimeType: row.mime_type,
      imageSize: row.image_size,
      category: row.category,
      orderIndex: row.order_index,
      active: row.active,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))
  } catch (error) {
    console.error('Neon error getting slides:', error)
    return []
  }
}

export async function createSlide(slideData) {
  if (!sql) {
    throw new Error('Database not configured')
  }

  const { title, description, imageUrl, imageId, category, orderIndex } = slideData
  
  const result = await sql`
    INSERT INTO slides (title, description, image_url, image_id, category, order_index, active, created_at, updated_at) 
    VALUES (${title}, ${description}, ${imageUrl}, ${imageId}, ${category}, ${orderIndex || 0}, true, NOW(), NOW())
    RETURNING id
  `

  return result[0].id
}

export async function updateSlide(id, slideData) {
  if (!sql) {
    throw new Error('Database not configured')
  }

  const { title, description, imageUrl, imageId, category, orderIndex, active } = slideData
  
  await sql`
    UPDATE slides 
    SET title = ${title}, 
        description = ${description}, 
        image_url = ${imageUrl}, 
        image_id = ${imageId},
        category = ${category}, 
        order_index = ${orderIndex || 0}, 
        active = ${active !== undefined ? active : true}, 
        updated_at = NOW()
    WHERE id = ${id}
  `
  
  return true
}

export async function deleteSlide(id) {
  if (!sql) {
    throw new Error('Database not configured')
  }

  await sql`DELETE FROM slides WHERE id = ${id}`
  return true
}

export { sql }
