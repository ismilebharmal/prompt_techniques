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

  const { 
    title, 
    description, 
    detailed_description,
    imageUrl, 
    imageId, 
    category, 
    orderIndex,
    workshop_date,
    duration_hours,
    participants_count,
    workshop_type,
    cover_image_id
  } = slideData
  
  const result = await sql`
    INSERT INTO slides (
      title, 
      description, 
      detailed_description,
      image_url, 
      image_id, 
      category, 
      order_index, 
      active, 
      created_at, 
      updated_at,
      workshop_date,
      duration_hours,
      participants_count,
      workshop_type,
      cover_image_id
    ) 
    VALUES (
      ${title}, 
      ${description}, 
      ${detailed_description || null},
      ${imageUrl}, 
      ${imageId}, 
      ${category}, 
      ${orderIndex || 0}, 
      true, 
      NOW(), 
      NOW(),
      ${workshop_date || null},
      ${duration_hours || null},
      ${participants_count || null},
      ${workshop_type || null},
      ${cover_image_id || null}
    )
    RETURNING id
  `

  return result[0].id
}

export async function updateSlide(id, slideData) {
  if (!sql) {
    throw new Error('Database not configured')
  }

  const { 
    title, 
    description, 
    detailed_description,
    imageUrl, 
    imageId, 
    category, 
    orderIndex, 
    active,
    workshop_date,
    duration_hours,
    participants_count,
    workshop_type,
    cover_image_id
  } = slideData
  
  await sql`
    UPDATE slides 
    SET title = ${title}, 
        description = ${description}, 
        detailed_description = ${detailed_description || null},
        image_url = ${imageUrl}, 
        image_id = ${imageId},
        category = ${category}, 
        order_index = ${orderIndex || 0}, 
        active = ${active !== undefined ? active : true}, 
        updated_at = NOW(),
        workshop_date = ${workshop_date || null},
        duration_hours = ${duration_hours || null},
        participants_count = ${participants_count || null},
        workshop_type = ${workshop_type || null},
        cover_image_id = ${cover_image_id || null}
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

// Enhanced Project Functions with Multiple Images
export async function getProjectsWithImages() {
  if (!sql) {
    console.log('Neon not configured, returning empty array')
    return []
  }

  try {
    const result = await sql`
      SELECT 
        p.*,
        i.filename as image_filename,
        i.mime_type as image_mime_type,
        i.size as image_size,
        pi.display_order,
        pi.is_cover
      FROM projects p
      LEFT JOIN project_images pi ON p.id = pi.project_id
      LEFT JOIN images i ON pi.image_id = i.id
      ORDER BY p.order_index ASC, pi.display_order ASC
    `
    
    // Group images by project
    const projectsMap = new Map()
    
    result.forEach(row => {
      if (!projectsMap.has(row.id)) {
        projectsMap.set(row.id, {
          id: row.id,
          title: row.title,
          description: row.description,
          short_description: row.short_description,
          image_url: row.image_url,
          github_url: row.github_url,
          live_url: row.live_url,
          technologies: row.technologies || [],
          category: row.category,
          featured: row.featured,
          order_index: row.order_index,
          created_at: row.created_at,
          updated_at: row.updated_at,
          detailed_description: row.detailed_description,
          tools_used: row.tools_used || [],
          project_date: row.project_date,
          client_name: row.client_name,
          project_status: row.project_status,
          cover_image_id: row.cover_image_id,
          images: []
        })
      }
      
      if (row.image_id) {
        projectsMap.get(row.id).images.push({
          id: row.image_id,
          filename: row.image_filename,
          mime_type: row.image_mime_type,
          size: row.image_size,
          display_order: row.display_order,
          is_cover: row.is_cover
        })
      }
    })
    
    return Array.from(projectsMap.values())
  } catch (error) {
    console.error('Neon error:', error)
    return []
  }
}

export async function getSlidesWithImages() {
  if (!sql) {
    console.log('Neon not configured, returning empty array')
    return []
  }

  try {
    const result = await sql`
      SELECT 
        s.*,
        i.filename as image_filename,
        i.mime_type as image_mime_type,
        i.size as image_size,
        si.display_order,
        si.is_cover
      FROM slides s
      LEFT JOIN slide_images si ON s.id = si.slide_id
      LEFT JOIN images i ON si.image_id = i.id
      ORDER BY s.order_index ASC, si.display_order ASC
    `
    
    // Group images by slide
    const slidesMap = new Map()
    
    result.forEach(row => {
      if (!slidesMap.has(row.id)) {
        slidesMap.set(row.id, {
          id: row.id,
          title: row.title,
          description: row.description,
          image_url: row.image_url,
          order_index: row.order_index,
          created_at: row.created_at,
          updated_at: row.updated_at,
          detailed_description: row.detailed_description,
          workshop_date: row.workshop_date,
          duration_hours: row.duration_hours,
          participants_count: row.participants_count,
          workshop_type: row.workshop_type,
          cover_image_id: row.cover_image_id,
          images: []
        })
      }
      
      if (row.image_id) {
        slidesMap.get(row.id).images.push({
          id: row.image_id,
          filename: row.image_filename,
          mime_type: row.image_mime_type,
          size: row.image_size,
          display_order: row.display_order,
          is_cover: row.is_cover
        })
      }
    })
    
    return Array.from(slidesMap.values())
  } catch (error) {
    console.error('Neon error:', error)
    return []
  }
}

// Image Management Functions
export async function addImageToProject(projectId, imageId, isCover = false, displayOrder = 0) {
  if (!sql) {
    throw new Error('Database not configured')
  }

  // If setting as cover, unset other covers for this project
  if (isCover) {
    await sql`UPDATE project_images SET is_cover = FALSE WHERE project_id = ${projectId}`
  }

  const result = await sql`
    INSERT INTO project_images (project_id, image_id, is_cover, display_order)
    VALUES (${projectId}, ${imageId}, ${isCover}, ${displayOrder})
    ON CONFLICT (project_id, image_id) DO UPDATE SET
      is_cover = ${isCover},
      display_order = ${displayOrder}
    RETURNING id
  `

  return result[0].id
}

export async function addImageToSlide(slideId, imageId, isCover = false, displayOrder = 0) {
  if (!sql) {
    throw new Error('Database not configured')
  }

  // If setting as cover, unset other covers for this slide
  if (isCover) {
    await sql`UPDATE slide_images SET is_cover = FALSE WHERE slide_id = ${slideId}`
  }

  const result = await sql`
    INSERT INTO slide_images (slide_id, image_id, is_cover, display_order)
    VALUES (${slideId}, ${imageId}, ${isCover}, ${displayOrder})
    ON CONFLICT (slide_id, image_id) DO UPDATE SET
      is_cover = ${isCover},
      display_order = ${displayOrder}
    RETURNING id
  `

  return result[0].id
}

export async function removeImageFromProject(projectId, imageId) {
  if (!sql) {
    throw new Error('Database not configured')
  }

  await sql`DELETE FROM project_images WHERE project_id = ${projectId} AND image_id = ${imageId}`
  return true
}

export async function removeImageFromSlide(slideId, imageId) {
  if (!sql) {
    throw new Error('Database not configured')
  }

  await sql`DELETE FROM slide_images WHERE slide_id = ${slideId} AND image_id = ${imageId}`
  return true
}

export async function setProjectCoverImage(projectId, imageId) {
  if (!sql) {
    throw new Error('Database not configured')
  }

  // Unset all covers for this project
  await sql`UPDATE project_images SET is_cover = FALSE WHERE project_id = ${projectId}`
  
  // Set the new cover
  await sql`UPDATE project_images SET is_cover = TRUE WHERE project_id = ${projectId} AND image_id = ${imageId}`
  
  // Also update the project's cover_image_id
  await sql`UPDATE projects SET cover_image_id = ${imageId} WHERE id = ${projectId}`
  
  return true
}

export async function setSlideCoverImage(slideId, imageId) {
  if (!sql) {
    throw new Error('Database not configured')
  }

  // Unset all covers for this slide
  await sql`UPDATE slide_images SET is_cover = FALSE WHERE slide_id = ${slideId}`
  
  // Set the new cover
  await sql`UPDATE slide_images SET is_cover = TRUE WHERE slide_id = ${slideId} AND image_id = ${imageId}`
  
  // Also update the slide's cover_image_id
  await sql`UPDATE slides SET cover_image_id = ${imageId} WHERE id = ${slideId}`
  
  return true
}

export async function reorderProjectImages(projectId, imageOrders) {
  if (!sql) {
    throw new Error('Database not configured')
  }

  for (const { imageId, displayOrder } of imageOrders) {
    await sql`
      UPDATE project_images 
      SET display_order = ${displayOrder} 
      WHERE project_id = ${projectId} AND image_id = ${imageId}
    `
  }
  
  return true
}

export async function reorderSlideImages(slideId, imageOrders) {
  if (!sql) {
    throw new Error('Database not configured')
  }

  for (const { imageId, displayOrder } of imageOrders) {
    await sql`
      UPDATE slide_images 
      SET display_order = ${displayOrder} 
      WHERE slide_id = ${slideId} AND image_id = ${imageId}
    `
  }
  
  return true
}

// Hero Slides Functions
export async function getHeroSlides() {
  if (!sql) {
    console.log('Neon not configured, returning empty array')
    return []
  }

  try {
    const result = await sql`
      SELECT 
        hs.*,
        i.filename,
        i.mime_type,
        i.size
      FROM hero_slides hs
      LEFT JOIN images i ON hs.image_id = i.id
      WHERE hs.is_active = true
      ORDER BY hs.display_order ASC, hs.created_at ASC
    `
    return result
  } catch (error) {
    console.error('Neon error:', error)
    return []
  }
}

export async function createHeroSlide(title, description, imageId, displayOrder = 0, imageFit = 'cover', imagePosition = 'center', textPosition = 'bottom-left') {
  if (!sql) {
    console.log('Neon not configured, returning null')
    return null
  }

  try {
    const result = await sql`
      INSERT INTO hero_slides (title, description, image_id, display_order, is_active, image_fit, image_position, text_position)
      VALUES (${title}, ${description}, ${imageId}, ${displayOrder}, true, ${imageFit}, ${imagePosition}, ${textPosition})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error('Neon error:', error)
    return null
  }
}

export async function updateHeroSlide(id, title, description, imageId, displayOrder, isActive, imageFit = 'cover', imagePosition = 'center', textPosition = 'bottom-left') {
  if (!sql) {
    console.log('Neon not configured, returning null')
    return null
  }

  try {
    const result = await sql`
      UPDATE hero_slides 
      SET title = ${title}, 
          description = ${description}, 
          image_id = ${imageId}, 
          display_order = ${displayOrder},
          is_active = ${isActive},
          image_fit = ${imageFit},
          image_position = ${imagePosition},
          text_position = ${textPosition},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error('Neon error:', error)
    return null
  }
}

export async function deleteHeroSlide(id) {
  if (!sql) {
    console.log('Neon not configured, returning false')
    return false
  }

  try {
    await sql`DELETE FROM hero_slides WHERE id = ${id}`
    return true
  } catch (error) {
    console.error('Neon error:', error)
    return false
  }
}

export async function reorderHeroSlides(slideOrders) {
  if (!sql) {
    console.log('Neon not configured, returning false')
    return false
  }

  try {
    for (const { id, displayOrder } of slideOrders) {
      await sql`
        UPDATE hero_slides 
        SET display_order = ${displayOrder}
        WHERE id = ${id}
      `
    }
    return true
  } catch (error) {
    console.error('Neon error:', error)
    return false
  }
}

// Resume Management Functions
export async function getResumes() {
  if (!sql) {
    console.log('Neon not configured, returning empty array')
    return []
  }

  try {
    const result = await sql`
      SELECT id, filename, original_name, mime_type, size, is_active, created_at, updated_at
      FROM resumes
      ORDER BY created_at DESC
    `
    return result
  } catch (error) {
    console.error('Neon error:', error)
    return []
  }
}

export async function getActiveResume() {
  if (!sql) {
    console.log('Neon not configured, returning null')
    return null
  }

  try {
    const result = await sql`
      SELECT id, filename, original_name, mime_type, size, data, is_active, created_at, updated_at
      FROM resumes
      WHERE is_active = true
      ORDER BY created_at DESC
      LIMIT 1
    `
    return result[0] || null
  } catch (error) {
    console.error('Neon error:', error)
    return null
  }
}

export async function createResume(filename, originalName, mimeType, size, data) {
  if (!sql) {
    console.log('Neon not configured, returning null')
    return null
  }

  try {
    // First, deactivate all existing resumes
    await sql`
      UPDATE resumes 
      SET is_active = false
    `

    // Then create the new resume as active
    const result = await sql`
      INSERT INTO resumes (filename, original_name, mime_type, size, data, is_active)
      VALUES (${filename}, ${originalName}, ${mimeType}, ${size}, ${data}, true)
      RETURNING id, filename, original_name, mime_type, size, is_active, created_at
    `
    return result[0]
  } catch (error) {
    console.error('Neon error:', error)
    return null
  }
}

export async function updateResume(id, filename, originalName, mimeType, size, data) {
  if (!sql) {
    console.log('Neon not configured, returning null')
    return null
  }

  try {
    const result = await sql`
      UPDATE resumes 
      SET filename = ${filename}, 
          original_name = ${originalName}, 
          mime_type = ${mimeType}, 
          size = ${size}, 
          data = ${data},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, filename, original_name, mime_type, size, is_active, updated_at
    `
    return result[0]
  } catch (error) {
    console.error('Neon error:', error)
    return null
  }
}

export async function deleteResume(id) {
  if (!sql) {
    console.log('Neon not configured, returning false')
    return false
  }

  try {
    await sql`
      DELETE FROM resumes 
      WHERE id = ${id}
    `
    return true
  } catch (error) {
    console.error('Neon error:', error)
    return false
  }
}

export async function setActiveResume(id) {
  if (!sql) {
    console.log('Neon not configured, returning false')
    return false
  }

  try {
    // First, deactivate all resumes
    await sql`
      UPDATE resumes 
      SET is_active = false
    `

    // Then activate the selected resume
    await sql`
      UPDATE resumes 
      SET is_active = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `
    return true
  } catch (error) {
    console.error('Neon error:', error)
    return false
  }
}

export { sql }
