# 🗄️ Database Setup Guide

## 🏆 **Recommended: Neon** (Easiest & Most Vercel-Friendly)

### Step 1: Create Neon Account
1. Go to [https://neon.tech](https://neon.tech)
2. Sign up with GitHub (1 minute)
3. Create a new project called `prompt_techniques`

### Step 2: Get Connection String
1. Go to your project dashboard
2. Click "Connection Details"
3. Copy the connection string (looks like: `postgresql://username:password@host/database`)

### Step 3: Create Table
Run this SQL in Neon's SQL editor:

```sql
CREATE TABLE prompts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  tags JSONB,
  description TEXT,
  prompt TEXT NOT NULL,
  example_input TEXT,
  example_output TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 4: Add Environment Variables to Vercel
1. Go to your Vercel dashboard
2. Select your project → Settings → Environment Variables
3. Add this variable:

```
DATABASE_URL=your-connection-string-from-neon
```

### Step 5: Update Your App
Change your frontend to use the new API endpoint:

```javascript
// In your frontend code, change:
const response = await fetch('/api/prompts-supabase')
// To:
const response = await fetch('/api/prompts-neon')
```

---

## 🚀 **Alternative: Neon** (PostgreSQL)

### Step 1: Create Neon Account
1. Go to [https://neon.tech](https://neon.tech)
2. Sign up with GitHub
3. Create a new project

### Step 2: Get Connection String
1. Copy the connection string from dashboard
2. Add to Vercel environment variables as `DATABASE_URL`

---

## 🎯 **Alternative: Railway** (Easiest Setup)

### Step 1: Create Railway Account
1. Go to [https://railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project → Database → PostgreSQL

### Step 2: Get Connection Details
1. Copy connection details from Railway dashboard
2. Add to Vercel environment variables

---

## ✅ **Current Status**

Your app is **already working** with fallback prompts! The database setup is optional for now.

**To use a real database:**
1. Choose one of the options above
2. Follow the setup steps
3. Add environment variables to Vercel
4. Your app will automatically use the real database!

**No database needed** - your app works perfectly with the built-in fallback system.
