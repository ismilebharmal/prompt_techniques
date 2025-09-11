# Prompt Techniques Hub

A production-ready Next.js application for discovering, sharing, and managing AI prompts. Built with Next.js, TailwindCSS, and MongoDB.

![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![React](https://img.shields.io/badge/React-18.2-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6.3-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38B2AC)

## Features

- 🔍 **Search & Filter**: Find prompts by category, tags, or keywords
- 📋 **One-Click Copy**: Copy prompts to clipboard with confirmation
- ❤️ **Favorites**: Save favorite prompts locally
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 🚀 **Fast Performance**: Optimized with caching and connection pooling
- 🔒 **API Protection**: Secure POST endpoints with API key authentication
- 🌱 **Easy Seeding**: Populate database with sample data

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd prompt-techniques-hub

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection (Required)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prompt-hub?retryWrites=true&w=majority

# API Key for protected POST endpoints (Required)
API_KEY=your-secure-api-key-here

# Optional: Vercel URL for production
NEXT_PUBLIC_VERCEL_URL=https://your-app.vercel.app
```

### 3. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and add it to `.env.local`

### 4. Seed the Database

```bash
# Seed the database with sample prompts
npm run seed
```

### 5. Start Development Server

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data

## Project Structure

```
prompt-techniques-hub/
├── components/          # React components
│   ├── FilterTabs.jsx   # Category filter tabs
│   ├── PromptCard.jsx   # Individual prompt card
│   └── PromptModal.jsx  # Detailed prompt view
├── data/               # Seed data
│   └── prompts.json    # Sample prompts
├── lib/                # Utility functions
│   └── mongodb.js      # Database connection
├── pages/              # Next.js pages
│   ├── api/            # API routes
│   │   └── prompts/    # Prompts API endpoints
│   ├── _app.jsx        # App wrapper with toast notifications
│   └── index.jsx       # Home page
├── scripts/            # Utility scripts
│   └── seed.js         # Database seeding script
├── styles/             # Global styles
│   └── globals.css     # TailwindCSS imports
└── public/             # Static assets
```

## API Endpoints

### GET /api/prompts
Retrieve prompts with optional filtering.

**Query Parameters:**
- `category` - Filter by category (Code, Mail, Data, etc.)
- `q` - Search query for title, description, or tags
- `limit` - Maximum number of results (default: 50)

**Example:**
```bash
curl "http://localhost:3000/api/prompts?category=Code&q=javascript"
```

### POST /api/prompts
Create a new prompt (requires API key).

**Headers:**
```
Authorization: Bearer your-api-key
Content-Type: application/json
```

**Body:**
```json
{
  "title": "My New Prompt",
  "category": "Code",
  "tags": ["javascript", "debugging"],
  "description": "A helpful prompt for debugging",
  "prompt": "SYSTEM: You are a debugging expert...",
  "exampleInput": "Sample input",
  "exampleOutput": "Sample output"
}
```

## Deployment

### Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard:
     - `MONGODB_URI`
     - `API_KEY`
   - Deploy!

3. **Seed Production Database:**
   ```bash
   # Run locally with production MongoDB URI
   MONGODB_URI=your-production-uri npm run seed
   ```

### Environment Variables in Vercel

1. Go to your project dashboard
2. Click on "Settings" → "Environment Variables"
3. Add the following variables:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `API_KEY` - A secure random string for API protection

## Security Notes

### API Key Protection
- The POST endpoint is protected with a simple API key
- Store your API key securely and never commit it to version control
- For production, consider implementing more sophisticated authentication

### User Data
- No user data is stored in the database
- Favorites are stored locally in browser localStorage
- No personal information is collected or transmitted

### MongoDB Security
- Use MongoDB Atlas IP whitelisting
- Create database users with minimal required permissions
- Enable MongoDB Atlas security features (encryption at rest, network access)

## Customization

### Adding New Categories
1. Update the `categories` array in `pages/index.jsx`
2. Add new prompts with the desired category in `data/prompts.json`
3. Run `npm run seed` to update the database

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `styles/globals.css` for global styles
- Components use TailwindCSS classes for styling

### Database Schema
The prompts collection uses this schema:
```javascript
{
  _id: ObjectId,
  title: String,
  category: String,
  tags: [String],
  description: String,
  prompt: String,
  exampleInput: String,
  exampleOutput: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the [Issues](https://github.com/your-username/prompt-techniques-hub/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## Roadmap

- [ ] User authentication and accounts
- [ ] Prompt rating and reviews
- [ ] Advanced search filters
- [ ] Prompt sharing and collaboration
- [ ] API rate limiting improvements
- [ ] Admin dashboard for prompt management
- [ ] Export/import functionality
- [ ] Mobile app (React Native)

---

Built with ❤️ using Next.js, MongoDB, and TailwindCSS.
