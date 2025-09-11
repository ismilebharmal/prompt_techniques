const { MongoClient } = require('mongodb')

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://smile463bharmal463_db_user:GNyzuCCumul8bVhB@prompttechnique.pql8lmx.mongodb.net/?retryWrites=true&w=majority&appName=promptTechnique'
const MONGODB_DB = 'prompt-hub'

// Sample prompts data (clean JSON)
const prompts = [
  {
    title: "Email Rewrite — Professional",
    category: "Mail",
    tags: ["email", "tone", "professional"],
    description: "Rewrite an email politely and concisely.",
    prompt: "SYSTEM: You are a professional communications assistant. Rewrite the following email to be more polite, concise, and professional while maintaining the original intent.\n\nUSER: Rewrite the following email: <<INPUT>>",
    exampleInput: "Hey team, I need that report asap. Can someone get it done today? Thanks.",
    exampleOutput: "Subject: Request for Report — Deadline Clarification\n\nHi Team,\n\nI hope this message finds you well. I wanted to follow up on the report we discussed and kindly request an update on the timeline. If possible, could we aim to have this completed by end of day today?\n\nI understand everyone has a busy schedule, so please let me know if you need any additional information or support to complete this task.\n\nThank you for your time and assistance.\n\nBest regards,\n[Your Name]",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    title: "Code Review Assistant",
    category: "Code",
    tags: ["code", "review", "debugging", "best-practices"],
    description: "Get comprehensive code review feedback with suggestions for improvement.",
    prompt: "SYSTEM: You are an expert software engineer conducting a code review. Analyze the provided code for:\n1. Correctness and potential bugs\n2. Performance issues\n3. Code style and readability\n4. Security vulnerabilities\n5. Best practices adherence\n\nProvide specific, actionable feedback with examples.\n\nUSER: Please review this code:\n<<INPUT>>",
    exampleInput: "function calculateTotal(items) {\n  let total = 0;\n  for (let i = 0; i < items.length; i++) {\n    total += items[i].price;\n  }\n  return total;\n}",
    exampleOutput: "## Code Review Feedback\n\n### Issues Found:\n\n1. **Missing Input Validation**: No null/undefined checks\n2. **Performance**: Could use reduce() for better readability\n3. **Edge Cases**: Empty array handling\n\n### Suggested Improvements:\n\n```javascript\nfunction calculateTotal(items) {\n  if (!Array.isArray(items)) {\n    throw new Error('Items must be an array');\n  }\n  \n  return items.reduce((total, item) => {\n    if (typeof item.price !== 'number' || item.price < 0) {\n      throw new Error('Invalid price');\n    }\n    return total + item.price;\n  }, 0);\n}\n```\n\n### Benefits:\n- Input validation prevents runtime errors\n- More readable and functional approach\n- Better error handling",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    title: "Data Analysis Summary",
    category: "Data",
    tags: ["data", "analysis", "insights", "summary"],
    description: "Generate comprehensive data analysis summaries with key insights.",
    prompt: "SYSTEM: You are a data analyst. Analyze the provided dataset and create a comprehensive summary including:\n1. Dataset overview (size, columns, data types)\n2. Key statistics and distributions\n3. Notable patterns or trends\n4. Potential insights or recommendations\n5. Data quality assessment\n\nPresent findings in a clear, structured format.\n\nUSER: Analyze this dataset:\n<<INPUT>>",
    exampleInput: "Sales data: Q1 2024\n- Total sales: $2.3M\n- Top product: Widget A (35% of sales)\n- Growth rate: +12% vs Q1 2023\n- Customer acquisition: 1,200 new customers\n- Average order value: $187",
    exampleOutput: "## Q1 2024 Sales Analysis Summary\n\n### Dataset Overview\n- **Period**: Q1 2024\n- **Total Revenue**: $2.3M\n- **New Customers**: 1,200\n- **Average Order Value**: $187\n\n### Key Performance Indicators\n- **Growth Rate**: +12% YoY (strong positive trend)\n- **Product Concentration**: Widget A dominates at 35% of sales\n- **Customer Acquisition**: 1,200 new customers indicates healthy growth\n\n### Insights & Recommendations\n1. **Product Diversification**: Consider promoting other products to reduce dependency on Widget A\n2. **Customer Value**: AOV of $187 suggests good customer engagement\n3. **Growth Trajectory**: 12% YoY growth indicates strong market position\n\n### Next Steps\n- Monitor Widget A performance closely\n- Investigate factors driving the 12% growth\n- Analyze customer acquisition channels for optimization",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    title: "Content Creator — Blog Post",
    category: "Content",
    tags: ["content", "blog", "writing", "seo"],
    description: "Generate engaging blog post content with SEO optimization.",
    prompt: "SYSTEM: You are a professional content writer and SEO specialist. Create a comprehensive blog post that is:\n1. Engaging and valuable to readers\n2. SEO-optimized with relevant keywords\n3. Well-structured with headings and subheadings\n4. Includes a compelling introduction and conclusion\n5. Incorporates actionable insights\n\nUSER: Write a blog post about: <<INPUT>>",
    exampleInput: "The Future of Remote Work in 2024",
    exampleOutput: "# The Future of Remote Work in 2024: Trends, Challenges, and Opportunities\n\n## Introduction\n\nRemote work has evolved from a temporary solution to a permanent fixture in the modern workplace. As we navigate 2024, organizations and employees alike are discovering new ways to optimize this flexible work model.\n\n## Key Trends Shaping Remote Work\n\n### 1. Hybrid Work Models Dominate\n- 73% of companies now offer hybrid arrangements\n- Employees report 23% higher job satisfaction\n- Reduced overhead costs for businesses\n\n### 2. Advanced Collaboration Tools\n- AI-powered meeting assistants\n- Virtual reality meeting spaces\n- Real-time collaboration platforms\n\n### 3. Focus on Employee Well-being\n- Mental health support programs\n- Flexible scheduling options\n- Work-life balance initiatives\n\n## Challenges and Solutions\n\n### Common Remote Work Challenges\n1. **Communication Gaps**: Implement regular check-ins and clear communication protocols\n2. **Isolation**: Create virtual team-building activities\n3. **Productivity Management**: Use project management tools and set clear expectations\n\n## The Road Ahead\n\nRemote work in 2024 represents more than just working from home—it's about creating flexible, inclusive, and productive work environments that benefit both employees and employers.\n\n## Conclusion\n\nThe future of remote work is bright, with technology and changing attitudes driving innovation. Organizations that embrace flexibility and invest in the right tools will thrive in this new landscape.",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    title: "Role-Playing — Customer Service",
    category: "Role",
    tags: ["customer-service", "role-play", "communication", "problem-solving"],
    description: "Practice customer service scenarios with AI role-playing.",
    prompt: "SYSTEM: You are a customer service representative. Role-play the following scenario:\n1. Listen actively to the customer's concern\n2. Show empathy and understanding\n3. Ask clarifying questions if needed\n4. Provide solutions or next steps\n5. Ensure customer satisfaction\n\nStay professional, patient, and solution-oriented.\n\nUSER: Customer scenario: <<INPUT>>",
    exampleInput: "Customer is upset about a delayed order that was supposed to arrive 3 days ago. They need the product for an important event this weekend.",
    exampleOutput: "I completely understand your frustration, and I sincerely apologize for the delay with your order. I know how important it is to have everything ready for your special event this weekend.\n\nLet me look into this right away. Could you please provide me with your order number so I can check the current status and see what happened?\n\nIn the meantime, I want to assure you that I'll do everything possible to resolve this quickly. If the original shipping method won't get it to you in time, I can explore expedited shipping options or even arrange for a replacement order to be sent overnight.\n\nWhat's the latest you would need to receive the order to still be prepared for your event? This will help me determine the best solution for you.\n\nI'm going to personally follow up on this and make sure we get this resolved today. You have my commitment that we'll make this right.",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  }
]

async function seedDatabase() {
  let client
  
  try {
    console.log('🔄 Connecting to MongoDB...')
    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const db = client.db(MONGODB_DB)
    const collection = db.collection('prompts')
    
    console.log(`📄 Found ${prompts.length} prompts to insert`)
    
    // Add unique IDs to each prompt
    const promptsWithIds = prompts.map((prompt, index) => ({
      ...prompt,
      _id: `prompt_${Date.now()}_${index}`,
    }))
    
    // Clear existing prompts
    console.log('🗑️  Clearing existing prompts...')
    await collection.deleteMany({})
    
    // Insert all prompts
    console.log('📝 Inserting prompts into database...')
    const result = await collection.insertMany(promptsWithIds)
    
    console.log(`✅ Successfully inserted ${result.insertedCount} prompts`)
    
    // Verify the data
    const count = await collection.countDocuments()
    console.log(`📊 Total prompts in database: ${count}`)
    
    // Show a sample
    const sample = await collection.findOne({})
    console.log('📋 Sample prompt:', {
      title: sample.title,
      category: sample.category,
      tags: sample.tags
    })
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
      console.log('🔌 Database connection closed')
    }
  }
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log('🎉 Database seeding completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error)
    process.exit(1)
  })
