const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function setupFeaturedProjectsTable() {
  try {
    console.log('Creating featured_projects table...');
    
    // Create featured_projects table
    await sql`
      CREATE TABLE IF NOT EXISTS featured_projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        short_description TEXT,
        technologies TEXT[] NOT NULL,
        category VARCHAR(100) NOT NULL,
        icon VARCHAR(10) NOT NULL,
        gradient_from VARCHAR(50) NOT NULL,
        gradient_to VARCHAR(50) NOT NULL,
        display_order INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Featured projects table created successfully!');

    // Insert sample featured projects
    console.log('Inserting sample featured projects...');
    
    const sampleProjects = [
      {
        title: 'AI-Powered Personalization System',
        description: 'Developed an AI-powered chatbot for guided product personalization with OpenAI APIs, real-time product previews using Pillow, and gRPC-based backend for scalable communication.',
        short_description: 'AI-powered chatbot for product personalization with real-time previews',
        technologies: ['Python', 'OpenAI', 'gRPC', 'Pillow'],
        category: 'AI/ML',
        icon: '🎨',
        gradient_from: 'blue-500/20',
        gradient_to: 'purple-500/20',
        display_order: 1
      },
      {
        title: 'AI Pharmacy Chatbot',
        description: 'Healthcare-focused chatbot with LangChain\'s GraphQAChain for safe drug recommendations, SurrealDB integration, and safety filtering for contraindications based on patient profiles.',
        short_description: 'Healthcare chatbot with safe drug recommendations and safety filtering',
        technologies: ['Python', 'LangChain', 'SurrealDB', 'FastAPI'],
        category: 'Healthcare AI',
        icon: '💊',
        gradient_from: 'green-500/20',
        gradient_to: 'teal-500/20',
        display_order: 2
      },
      {
        title: 'Object Detection & Replacement System',
        description: 'Advanced object detection using YOLOv11 and SAM for dynamic variant replacement, with Roboflow integration and instance-specific object modification capabilities.',
        short_description: 'Advanced object detection and replacement using YOLOv11 and SAM',
        technologies: ['YOLOv11', 'SAM', 'OpenCV', 'StreamLit'],
        category: 'Computer Vision',
        icon: '🔍',
        gradient_from: 'purple-500/20',
        gradient_to: 'pink-500/20',
        display_order: 3
      },
      {
        title: 'Time Series Analysis Platform',
        description: 'Advanced time series forecasting using ARIMA, SARIMA, and Prophet models with dynamic feature engineering and automated P,D,Q parameter optimization.',
        short_description: 'Time series forecasting with ARIMA, SARIMA, and Prophet models',
        technologies: ['Python', 'ARIMA', 'Prophet', 'FastAPI'],
        category: 'Time Series ML',
        icon: '📈',
        gradient_from: 'orange-500/20',
        gradient_to: 'red-500/20',
        display_order: 4
      },
      {
        title: 'Model Agnostic Chatbot',
        description: 'Advanced chatbot system with LangGraph integration, text-to-query generation, and graph-based UI for complex conversational workflows and query processing.',
        short_description: 'Advanced chatbot with LangGraph and text-to-query generation',
        technologies: ['Python', 'LangGraph', 'PostgreSQL', 'StreamLit'],
        category: 'LangGraph',
        icon: '🤖',
        gradient_from: 'indigo-500/20',
        gradient_to: 'blue-500/20',
        display_order: 5
      },
      {
        title: 'PDF RAG Application',
        description: 'Intelligent document processing system with ChromaDB integration, advanced embeddings, and hallucination-free retrieval for accurate information extraction.',
        short_description: 'Document processing with ChromaDB and hallucination-free retrieval',
        technologies: ['Python', 'ChromaDB', 'FastAPI', 'Embeddings'],
        category: 'RAG System',
        icon: '📄',
        gradient_from: 'pink-500/20',
        gradient_to: 'rose-500/20',
        display_order: 6
      },
      {
        title: 'Cross-Platform Flutter Applications',
        description: 'Multiple production Flutter apps including field management, inventory systems, and admin panels with Firebase integration, real-time features, and multi-language support.',
        short_description: 'Multiple production Flutter apps with Firebase integration',
        technologies: ['Flutter', 'Firebase', 'REST APIs', 'Push Notifications'],
        category: 'Flutter',
        icon: '📱',
        gradient_from: 'cyan-500/20',
        gradient_to: 'blue-500/20',
        display_order: 7
      },
      {
        title: 'Advanced Chatbot with Memory',
        description: 'Interactive chatbot with ChainLit UI, LangGraph agent workflows, conversation memory, and comprehensive DML operations for complex interactions.',
        short_description: 'Interactive chatbot with ChainLit UI and conversation memory',
        technologies: ['Python', 'ChainLit', 'LangGraph', 'SQLite'],
        category: 'Conversational AI',
        icon: '💬',
        gradient_from: 'emerald-500/20',
        gradient_to: 'teal-500/20',
        display_order: 8
      },
      {
        title: 'Data Integration Platform',
        description: 'Multi-platform data integration system with MongoDB, RabbitMQ messaging, GraphQL APIs, and pandas-based data transformation for enterprise applications.',
        short_description: 'Multi-platform data integration with MongoDB and RabbitMQ',
        technologies: ['Python', 'MongoDB', 'RabbitMQ', 'GraphQL'],
        category: 'Data Platform',
        icon: '🔗',
        gradient_from: 'violet-500/20',
        gradient_to: 'purple-500/20',
        display_order: 9
      }
    ];

    for (const project of sampleProjects) {
      await sql`
        INSERT INTO featured_projects (
          title, description, short_description, technologies, category, 
          icon, gradient_from, gradient_to, display_order, active
        ) VALUES (
          ${project.title}, ${project.description}, ${project.short_description}, 
          ${project.technologies}, ${project.category}, ${project.icon}, 
          ${project.gradient_from}, ${project.gradient_to}, ${project.display_order}, true
        )
      `;
    }

    console.log('Sample featured projects inserted successfully!');
    console.log('Featured projects table setup completed!');
    
  } catch (error) {
    console.error('Error setting up featured projects table:', error);
  }
}

setupFeaturedProjectsTable();
