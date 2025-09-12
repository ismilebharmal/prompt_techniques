# Ismile Bharmal - Portfolio & AI Prompt Hub

A modern portfolio website showcasing my work as a Full Stack Developer, featuring an integrated AI prompt templates library.

## 🌟 Features

### Portfolio Website
- **Modern Design**: Dark gradient theme with glassmorphism effects
- **Responsive Layout**: Mobile-first design that works on all devices
- **Interactive UI**: Smooth animations, hover effects, and scroll animations
- **Professional Sections**: About, Skills, Projects, Contact, and AI Prompts

### AI Prompt Templates
- **Curated Collection**: 50+ professional AI prompt templates
- **Categorized Library**: Organized by use case (Code, Mail, Data, Content, Role, Verifier)
- **Search & Filter**: Advanced filtering and search functionality
- **Copy-Paste Ready**: Easy-to-use templates with examples

### Admin Dashboard
- **Secure Authentication**: Database-driven admin login system
- **CRUD Operations**: Create, read, update, and delete prompts
- **User Management**: Admin user system with password hashing
- **Real-time Updates**: Live data synchronization

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with SSR
- **React 18** - Modern React with hooks
- **TailwindCSS** - Utility-first CSS framework
- **Custom Hooks** - Scroll animations and interactions

### Backend
- **Neon PostgreSQL** - Serverless PostgreSQL database
- **bcryptjs** - Password hashing and security
- **Next.js API Routes** - Serverless API endpoints

### Database
- **PostgreSQL** - Relational database
- **Neon** - Serverless PostgreSQL hosting
- **Database Tables**:
  - `prompts` - AI prompt templates
  - `admin_users` - Admin authentication

## 📁 Project Structure

```
├── pages/
│   ├── index.jsx          # Main portfolio landing page
│   ├── prompts.jsx        # AI prompt templates library
│   ├── portfolio.jsx      # Standalone portfolio page
│   ├── admin/             # Admin dashboard
│   └── api/               # API endpoints
├── components/            # Reusable React components
├── lib/                   # Database and utility functions
├── hooks/                 # Custom React hooks
├── styles/                # Global CSS styles
└── scripts/               # Database seeding scripts
```

## 🎯 Site Structure

### Main Landing Page (`/`)
- **Hero Section**: Introduction and call-to-action
- **About Section**: Personal background and stats
- **Skills Section**: Technology stack with progress bars
- **Projects Section**: Featured work and projects
- **Prompts Section**: AI prompt templates showcase
- **Contact Section**: Ways to get in touch

### AI Prompt Library (`/prompts`)
- **Search & Filter**: Find prompts by category or keywords
- **Prompt Cards**: Detailed view of each template
- **Copy Functionality**: One-click copy to clipboard
- **Favorites System**: Save favorite prompts

### Admin Dashboard (`/admin`)
- **Login System**: Secure authentication
- **Prompt Management**: CRUD operations for prompts
- **User Management**: Admin user administration
- **Analytics**: Usage statistics and insights

## 🔧 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Neon PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ismilebharmal/prompt_techniques.git
   cd prompt_techniques
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your database URL:
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   ```

4. **Set up the database**
   ```bash
   # Create admin users table
   npm run setup-admin
   
   # Seed the database with prompts
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your GitHub repository to Vercel**
2. **Set environment variables** in Vercel dashboard:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
3. **Deploy**: Vercel will automatically deploy on every push

### Custom Domain

To use a custom domain like `ismile-bharmal.vercel.app`:

1. **Update Vercel project settings**
2. **Add custom domain** in Vercel dashboard
3. **Update DNS records** as instructed by Vercel

## 🔐 Admin Access

### Default Admin Credentials
- **Username**: `ismile`
- **Password**: `ismile@8866`

### Adding New Admin Users
Use the admin dashboard or create a script to add new admin users to the database.

## 📊 Database Schema

### Prompts Table
```sql
CREATE TABLE prompts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  tags JSONB,
  description TEXT,
  prompt TEXT NOT NULL,
  example_input TEXT,
  example_output TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Admin Users Table
```sql
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 Customization

### Colors and Styling
- Edit `tailwind.config.js` for color schemes
- Modify `styles/globals.css` for global styles
- Update component styles in individual files

### Content
- Update personal information in `pages/index.jsx`
- Modify project data in the projects array
- Add new skills in the skills array

### Prompts
- Add new prompts via admin dashboard
- Modify categories in the categories array
- Update prompt data structure as needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Ismile Bharmal**
- **Email**: ismile@example.com
- **GitHub**: [@ismilebharmal](https://github.com/ismilebharmal)
- **LinkedIn**: [ismilebharmal](https://linkedin.com/in/ismilebharmal)
- **Portfolio**: [ismile-bharmal.vercel.app](https://ismile-bharmal.vercel.app)

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **TailwindCSS** for the utility-first CSS
- **Neon** for the serverless PostgreSQL hosting
- **Vercel** for the seamless deployment platform

---

Built with ❤️ by [Ismile Bharmal](https://github.com/ismilebharmal)