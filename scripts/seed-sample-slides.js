const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function seedSampleSlides() {
  try {
    console.log('🚀 Seeding sample slides with multiple images...');

    // First, let's create some sample images
    const sampleImages = [
      {
        filename: 'workshop-cover.jpg',
        original_name: 'workshop-cover.jpg',
        mime_type: 'image/jpeg',
        size: 1024000,
        data: Buffer.from('fake-image-data-1') // In real scenario, this would be actual image data
      },
      {
        filename: 'workshop-slide-1.jpg',
        original_name: 'workshop-slide-1.jpg',
        mime_type: 'image/jpeg',
        size: 850000,
        data: Buffer.from('fake-image-data-2')
      },
      {
        filename: 'workshop-slide-2.jpg',
        original_name: 'workshop-slide-2.jpg',
        mime_type: 'image/jpeg',
        size: 920000,
        data: Buffer.from('fake-image-data-3')
      },
      {
        filename: 'workshop-slide-3.jpg',
        original_name: 'workshop-slide-3.jpg',
        mime_type: 'image/jpeg',
        size: 780000,
        data: Buffer.from('fake-image-data-4')
      }
    ];

    // Insert sample images
    const imageIds = [];
    for (const image of sampleImages) {
      const result = await sql`
        INSERT INTO images (filename, original_name, mime_type, size, data) 
        VALUES (${image.filename}, ${image.original_name}, ${image.mime_type}, ${image.size}, ${image.data})
        RETURNING id
      `;
      imageIds.push(result[0].id);
    }

    console.log('✅ Sample images created:', imageIds);

    // Create sample slides
    const sampleSlides = [
      {
        title: 'React Workshop: Building Modern Web Apps',
        description: 'A comprehensive workshop covering React fundamentals, hooks, state management, and best practices for building scalable web applications.',
        details: `This workshop covers:

• React Fundamentals
  - Components and JSX
  - Props and State
  - Event Handling
  - Lifecycle Methods

• Modern React Features
  - Functional Components
  - Hooks (useState, useEffect, useContext)
  - Custom Hooks
  - Context API

• State Management
  - Local State vs Global State
  - Redux and Redux Toolkit
  - Zustand for simple state management

• Best Practices
  - Component composition
  - Performance optimization
  - Code splitting and lazy loading
  - Testing strategies

• Real-world Project
  - Building a complete application
  - Integration with APIs
  - Deployment strategies`,
        category: 'Workshop',
        tags: ['React', 'JavaScript', 'Web Development', 'Frontend', 'Workshop'],
        featured: true,
        cover_image_id: imageIds[0],
        order_index: 1
      },
      {
        title: 'AI Integration in Web Applications',
        description: 'Exploring how to integrate AI capabilities into modern web applications using various APIs and frameworks.',
        details: `This presentation covers:

• AI Integration Overview
  - Understanding AI APIs
  - Authentication and security
  - Rate limiting and costs

• Popular AI Services
  - OpenAI GPT API
  - Google AI services
  - Anthropic Claude API
  - Custom AI models

• Implementation Strategies
  - Client-side integration
  - Server-side processing
  - Hybrid approaches

• Real-world Examples
  - Chat applications
  - Content generation
  - Image processing
  - Data analysis`,
        category: 'Presentation',
        tags: ['AI', 'Web Development', 'API Integration', 'Machine Learning'],
        featured: true,
        cover_image_id: imageIds[1],
        order_index: 2
      }
    ];

    // Insert slides
    for (const slide of sampleSlides) {
      const result = await sql`
        INSERT INTO slides (title, description, details, category, tags, featured, cover_image_id, order_index, active, image_url, created_at, updated_at) 
        VALUES (${slide.title}, ${slide.description}, ${slide.details}, ${slide.category}, ${slide.tags}, ${slide.featured}, ${slide.cover_image_id}, ${slide.order_index}, true, '', NOW(), NOW())
        RETURNING id
      `;
      
      const slideId = result[0].id;
      console.log(`✅ Created slide: ${slide.title} (ID: ${slideId})`);

      // Add multiple images to the first slide
      if (slide.title.includes('React Workshop')) {
        // Add all images to this slide
        for (let i = 0; i < imageIds.length; i++) {
          await sql`
            INSERT INTO slide_images (slide_id, image_id, is_cover, display_order) 
            VALUES (${slideId}, ${imageIds[i]}, ${i === 0}, ${i})
          `;
        }
        console.log(`✅ Added ${imageIds.length} images to React Workshop slide`);
      } else {
        // Add just the cover image to the second slide
        await sql`
          INSERT INTO slide_images (slide_id, image_id, is_cover, display_order) 
          VALUES (${slideId}, ${imageIds[1]}, true, 0)
        `;
        console.log(`✅ Added cover image to AI Integration slide`);
      }
    }

    console.log('✅ Sample slides seeded successfully!');
    console.log('📋 Created:');
    console.log('   - 4 sample images');
    console.log('   - 2 sample slides');
    console.log('   - Multiple images for React Workshop slide');
    console.log('   - Cover image for AI Integration slide');

  } catch (error) {
    console.error('❌ Error seeding sample slides:', error);
    process.exit(1);
  }
}

seedSampleSlides();
