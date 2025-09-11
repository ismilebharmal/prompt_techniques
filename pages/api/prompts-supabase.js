import { getPrompts, addPrompt } from '../../lib/supabase'

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'GET') {
      // Get all prompts from Supabase
      const prompts = await getPrompts()
      
      // If Supabase returns empty data, use fallback
      if (prompts.length === 0) {
        console.log('Supabase returned empty data, using fallback prompts')
        const fallbackPrompts = [
          {
            id: "68c28bf185b75ada59b55d57",
            title: "Email Rewrite — Professional",
            category: "Mail",
            tags: ["email", "tone", "professional"],
            description: "Rewrite an email politely and concisely.",
            prompt: "SYSTEM: You are a professional communications assistant. Rewrite the following email to be more polite, concise, and professional while maintaining the original intent.\n\nUSER: Rewrite the following email: <<INPUT>>",
            example_input: "Hey team, I need that report asap. Can someone get it done today? Thanks.",
            example_output: "Subject: Request for Report — Deadline Clarification\n\nHi Team,\n\nI hope this message finds you well. I wanted to follow up on the report we discussed and kindly request an update on the timeline. If possible, could we aim to have this completed by end of day today?\n\nI understand everyone has a busy schedule, so please let me know if you need any additional information or support to complete this task.\n\nThank you for your time and assistance.\n\nBest regards,\n[Your Name]",
            created_at: "2024-01-15T10:30:00Z",
            updated_at: "2024-01-15T10:30:00Z"
          },
          {
            id: "68c28bf185b75ada59b55d58",
            title: "Code Review Assistant",
            category: "Code",
            tags: ["code", "review", "debugging", "best-practices"],
            description: "Get comprehensive code review feedback with suggestions for improvement.",
            prompt: "SYSTEM: You are an expert software engineer conducting a code review. Analyze the provided code for:\n1. Correctness and potential bugs\n2. Performance issues\n3. Code style and readability\n4. Security vulnerabilities\n5. Best practices adherence\n\nProvide specific, actionable feedback with examples.\n\nUSER: Please review this code:\n<<INPUT>>",
            example_input: "function calculateTotal(items) {\n  let total = 0;\n  for (let i = 0; i < items.length; i++) {\n    total += items[i].price;\n  }\n  return total;\n}",
            example_output: "## Code Review Feedback\n\n### Issues Found:\n\n1. **Missing Input Validation**: No null/undefined checks\n2. **Performance**: Could use reduce() for better readability\n3. **Edge Cases**: Empty array handling\n\n### Suggested Improvements:\n\n```javascript\nfunction calculateTotal(items) {\n  if (!Array.isArray(items)) {\n    throw new Error('Items must be an array');\n  }\n  \n  return items.reduce((total, item) => {\n    if (typeof item.price !== 'number' || item.price < 0) {\n      throw new Error('Invalid price');\n    }\n    return total + item.price;\n  }, 0);\n}\n```\n\n### Benefits:\n- Input validation prevents runtime errors\n- More readable and functional approach\n- Better error handling",
            created_at: "2024-01-15T10:30:00Z",
            updated_at: "2024-01-15T10:30:00Z"
          },
          {
            id: "68c28bf185b75ada59b55d59",
            title: "Data Analysis Summary",
            category: "Data",
            tags: ["data", "analysis", "insights", "summary"],
            description: "Generate comprehensive data analysis summaries with key insights.",
            prompt: "SYSTEM: You are a data analyst. Analyze the provided dataset and create a comprehensive summary including:\n1. Dataset overview (size, columns, data types)\n2. Key statistics and distributions\n3. Notable patterns or trends\n4. Potential insights or recommendations\n5. Data quality assessment\n\nPresent findings in a clear, structured format.\n\nUSER: Analyze this dataset:\n<<INPUT>>",
            example_input: "Sales data: Q1 2024\n- Total sales: $2.3M\n- Top product: Widget A (35% of sales)\n- Growth rate: +12% vs Q1 2023\n- Customer acquisition: 1,200 new customers\n- Average order value: $187",
            example_output: "## Q1 2024 Sales Analysis Summary\n\n### Dataset Overview\n- **Period**: Q1 2024\n- **Total Revenue**: $2.3M\n- **New Customers**: 1,200\n- **Average Order Value**: $187\n\n### Key Performance Indicators\n- **Growth Rate**: +12% YoY (strong positive trend)\n- **Product Concentration**: Widget A dominates at 35% of sales\n- **Customer Acquisition**: 1,200 new customers indicates healthy growth\n\n### Insights & Recommendations\n1. **Product Diversification**: Consider promoting other products to reduce dependency on Widget A\n2. **Customer Value**: AOV of $187 suggests good customer engagement\n3. **Growth Trajectory**: 12% YoY growth indicates strong market position\n\n### Next Steps\n- Monitor Widget A performance closely\n- Investigate factors driving the 12% growth\n- Analyze customer acquisition channels for optimization",
            created_at: "2024-01-15T10:30:00Z",
            updated_at: "2024-01-15T10:30:00Z"
          }
        ]
        
        res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=60')
        return res.status(200).json(fallbackPrompts)
      }
      
      // Set cache headers for better performance
      res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=60')
      
      return res.status(200).json(prompts)
    }

    if (req.method === 'POST') {
      // Add new prompt
      const { title, category, tags, description, prompt, exampleInput, exampleOutput } = req.body

      // Validate required fields
      if (!title || !category || !prompt) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // Check for API key (you can add this for security)
      const apiKey = req.headers.authorization?.replace('Bearer ', '')
      if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const newPrompt = {
        title,
        category,
        tags: tags || [],
        description: description || '',
        prompt,
        example_input: exampleInput || '',
        example_output: exampleOutput || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const result = await addPrompt(newPrompt)
      
      return res.status(201).json({ 
        success: true, 
        id: result.id,
        message: 'Prompt added successfully' 
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })

  } catch (error) {
    console.error('API Error:', error)

    // Fallback to hardcoded prompts when Supabase fails or is empty
    if (req.method === 'GET') {
      console.log('Using fallback prompts - Supabase not configured or empty')
      const fallbackPrompts = [
        {
          id: "68c28bf185b75ada59b55d57",
          title: "Email Rewrite — Professional",
          category: "Mail",
          tags: ["email", "tone", "professional"],
          description: "Rewrite an email politely and concisely.",
          prompt: "SYSTEM: You are a professional communications assistant. Rewrite the following email to be more polite, concise, and professional while maintaining the original intent.\n\nUSER: Rewrite the following email: <<INPUT>>",
          example_input: "Hey team, I need that report asap. Can someone get it done today? Thanks.",
          example_output: "Subject: Request for Report — Deadline Clarification\n\nHi Team,\n\nI hope this message finds you well. I wanted to follow up on the report we discussed and kindly request an update on the timeline. If possible, could we aim to have this completed by end of day today?\n\nI understand everyone has a busy schedule, so please let me know if you need any additional information or support to complete this task.\n\nThank you for your time and assistance.\n\nBest regards,\n[Your Name]",
          created_at: "2024-01-15T10:30:00Z",
          updated_at: "2024-01-15T10:30:00Z"
        },
        {
          id: "68c28bf185b75ada59b55d58",
          title: "Code Review Assistant",
          category: "Code",
          tags: ["code", "review", "debugging", "best-practices"],
          description: "Get comprehensive code review feedback with suggestions for improvement.",
          prompt: "SYSTEM: You are an expert software engineer conducting a code review. Analyze the provided code for:\n1. Correctness and potential bugs\n2. Performance issues\n3. Code style and readability\n4. Security vulnerabilities\n5. Best practices adherence\n\nProvide specific, actionable feedback with examples.\n\nUSER: Please review this code:\n<<INPUT>>",
          example_input: "function calculateTotal(items) {\n  let total = 0;\n  for (let i = 0; i < items.length; i++) {\n    total += items[i].price;\n  }\n  return total;\n}",
          example_output: "## Code Review Feedback\n\n### Issues Found:\n\n1. **Missing Input Validation**: No null/undefined checks\n2. **Performance**: Could use reduce() for better readability\n3. **Edge Cases**: Empty array handling\n\n### Suggested Improvements:\n\n```javascript\nfunction calculateTotal(items) {\n  if (!Array.isArray(items)) {\n    throw new Error('Items must be an array');\n  }\n  \n  return items.reduce((total, item) => {\n    if (typeof item.price !== 'number' || item.price < 0) {\n      throw new Error('Invalid price');\n    }\n    return total + item.price;\n  }, 0);\n}\n```\n\n### Benefits:\n- Input validation prevents runtime errors\n- More readable and functional approach\n- Better error handling",
          created_at: "2024-01-15T10:30:00Z",
          updated_at: "2024-01-15T10:30:00Z"
        },
        {
          id: "68c28bf185b75ada59b55d59",
          title: "Data Analysis Summary",
          category: "Data",
          tags: ["data", "analysis", "insights", "summary"],
          description: "Generate comprehensive data analysis summaries with key insights.",
          prompt: "SYSTEM: You are a data analyst. Analyze the provided dataset and create a comprehensive summary including:\n1. Dataset overview (size, columns, data types)\n2. Key statistics and distributions\n3. Notable patterns or trends\n4. Potential insights or recommendations\n5. Data quality assessment\n\nPresent findings in a clear, structured format.\n\nUSER: Analyze this dataset:\n<<INPUT>>",
          example_input: "Sales data: Q1 2024\n- Total sales: $2.3M\n- Top product: Widget A (35% of sales)\n- Growth rate: +12% vs Q1 2023\n- Customer acquisition: 1,200 new customers\n- Average order value: $187",
          example_output: "## Q1 2024 Sales Analysis Summary\n\n### Dataset Overview\n- **Period**: Q1 2024\n- **Total Revenue**: $2.3M\n- **New Customers**: 1,200\n- **Average Order Value**: $187\n\n### Key Performance Indicators\n- **Growth Rate**: +12% YoY (strong positive trend)\n- **Product Concentration**: Widget A dominates at 35% of sales\n- **Customer Acquisition**: 1,200 new customers indicates healthy growth\n\n### Insights & Recommendations\n1. **Product Diversification**: Consider promoting other products to reduce dependency on Widget A\n2. **Customer Value**: AOV of $187 suggests good customer engagement\n3. **Growth Trajectory**: 12% YoY growth indicates strong market position\n\n### Next Steps\n- Monitor Widget A performance closely\n- Investigate factors driving the 12% growth\n- Analyze customer acquisition channels for optimization",
          created_at: "2024-01-15T10:30:00Z",
          updated_at: "2024-01-15T10:30:00Z"
        }
      ];

      // Set cache headers for better performance
      res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=60')

      return res.status(200).json(fallbackPrompts)
    }

    return res.status(500).json({ error: 'Internal server error' })
  }
}
