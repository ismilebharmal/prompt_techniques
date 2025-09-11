// Fallback API that returns hardcoded prompts when MongoDB fails
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    // Hardcoded prompts as fallback
    const prompts = [
      {
        _id: "68c28bf185b75ada59b55d57",
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
        _id: "68c28bf185b75ada59b55d58",
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
        _id: "68c28bf185b75ada59b55d59",
        title: "Data Analysis Summary",
        category: "Data",
        tags: ["data", "analysis", "insights", "summary"],
        description: "Generate comprehensive data analysis summaries with key insights.",
        prompt: "SYSTEM: You are a data analyst. Analyze the provided dataset and create a comprehensive summary including:\n1. Dataset overview (size, columns, data types)\n2. Key statistics and distributions\n3. Notable patterns or trends\n4. Potential insights or recommendations\n5. Data quality assessment\n\nPresent findings in a clear, structured format.\n\nUSER: Analyze this dataset:\n<<INPUT>>",
        exampleInput: "Sales data: Q1 2024\n- Total sales: $2.3M\n- Top product: Widget A (35% of sales)\n- Growth rate: +12% vs Q1 2023\n- Customer acquisition: 1,200 new customers\n- Average order value: $187",
        exampleOutput: "## Q1 2024 Sales Analysis Summary\n\n### Dataset Overview\n- **Period**: Q1 2024\n- **Total Revenue**: $2.3M\n- **New Customers**: 1,200\n- **Average Order Value**: $187\n\n### Key Performance Indicators\n- **Growth Rate**: +12% YoY (strong positive trend)\n- **Product Concentration**: Widget A dominates at 35% of sales\n- **Customer Acquisition**: 1,200 new customers indicates healthy growth\n\n### Insights & Recommendations\n1. **Product Diversification**: Consider promoting other products to reduce dependency on Widget A\n2. **Customer Value**: AOV of $187 suggests good customer engagement\n3. **Growth Trajectory**: 12% YoY growth indicates strong market position\n\n### Next Steps\n- Monitor Widget A performance closely\n- Investigate factors driving the 12% growth\n- Analyze customer acquisition channels for optimization",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z"
      }
    ];

    // Set cache headers for better performance
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=60')
    
    return res.status(200).json(prompts)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
