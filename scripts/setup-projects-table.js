const { neon } = require('@neondatabase/serverless');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function setupProjectsTable() {
  try {
    console.log('🚀 Setting up projects table...');

    // Create projects table
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        short_description VARCHAR(500),
        image_url VARCHAR(500),
        github_url VARCHAR(500),
        live_url VARCHAR(500),
        technologies JSONB,
        category VARCHAR(100),
        featured BOOLEAN DEFAULT false,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Projects table created successfully');

    // Create slides table for work/workshop images
    await sql`
      CREATE TABLE IF NOT EXISTS slides (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(500) NOT NULL,
        category VARCHAR(100),
        order_index INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Slides table created successfully');

    // Insert some sample projects
    const sampleProjects = [
      {
        title: 'Prompt Techniques Hub',
        description: 'A comprehensive AI prompt library with advanced search and filtering capabilities. Built with Next.js, PostgreSQL, and modern web technologies.',
        short_description: 'AI prompt library with search and filtering',
        image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
        github_url: 'https://github.com/ismilebharmal/prompt_techniques',
        live_url: 'https://prompt-techniques.vercel.app',
        technologies: ['Next.js', 'React', 'PostgreSQL', 'TailwindCSS', 'Neon'],
        category: 'Web Application',
        featured: true,
        order_index: 1
      },
      {
        title: 'E-Commerce Platform',
        description: 'Full-stack e-commerce solution with user authentication, payment integration, and admin dashboard. Built with modern technologies and best practices.',
        short_description: 'Full-stack e-commerce with payment integration',
        image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
        github_url: 'https://github.com/ismilebharmal/ecommerce-platform',
        live_url: 'https://ecommerce-demo.vercel.app',
        technologies: ['Next.js', 'Node.js', 'MongoDB', 'Stripe', 'JWT'],
        category: 'Web Application',
        featured: true,
        order_index: 2
      },
      {
        title: 'AI Chat Application',
        description: 'Real-time chat application with AI integration, file sharing, and group messaging capabilities. Features modern UI and real-time updates.',
        short_description: 'Real-time chat with AI integration',
        image_url: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&h=600&fit=crop',
        github_url: 'https://github.com/ismilebharmal/ai-chat-app',
        live_url: 'https://ai-chat-demo.vercel.app',
        technologies: ['React', 'Socket.io', 'OpenAI API', 'Node.js', 'Express'],
        category: 'Web Application',
        featured: true,
        order_index: 3
      }
    ];

    for (const project of sampleProjects) {
      await sql`
        INSERT INTO projects (title, description, short_description, image_url, github_url, live_url, technologies, category, featured, order_index)
        VALUES (${project.title}, ${project.description}, ${project.short_description}, ${project.image_url}, ${project.github_url}, ${project.live_url}, ${JSON.stringify(project.technologies)}, ${project.category}, ${project.featured}, ${project.order_index})
        ON CONFLICT DO NOTHING
      `;
    }

    console.log('✅ Sample projects inserted successfully');

    // Insert some sample slides
    const sampleSlides = [
      {
        title: 'React Workshop 2024',
        description: 'Conducted a comprehensive React workshop for 50+ developers',
        image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop',
        category: 'Workshop',
        order_index: 1
      },
      {
        title: 'AI Development Conference',
        description: 'Presented on AI integration in modern web applications',
        image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
        category: 'Conference',
        order_index: 2
      },
      {
        title: 'Team Building Event',
        description: 'Led team building activities and technical discussions',
        image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
        category: 'Event',
        order_index: 3
      }
    ];

    for (const slide of sampleSlides) {
      await sql`
        INSERT INTO slides (title, description, image_url, category, order_index)
        VALUES (${slide.title}, ${slide.description}, ${slide.image_url}, ${slide.category}, ${slide.order_index})
        ON CONFLICT DO NOTHING
      `;
    }

    console.log('✅ Sample slides inserted successfully');
    console.log('🎉 Database setup completed successfully!');

  } catch (error) {
    console.error('❌ Error setting up projects table:', error);
    process.exit(1);
  }
}

setupProjectsTable();
