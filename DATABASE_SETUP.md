# 🗄️ Database Setup Guide

## 🏆 **Recommended: PlanetScale** (Easiest & Most Vercel-Friendly)

### Step 1: Create PlanetScale Account
1. Go to [https://planetscale.com](https://planetscale.com)
2. Sign up with GitHub (2 minutes)
3. Create a new database called `prompt_techniques`

### Step 2: Get Connection Details
1. Go to your database dashboard
2. Click "Connect" → "Connect with PlanetScale CLI"
3. Copy the connection string (looks like: `mysql://username:password@host/database`)

### Step 3: Create Table
Run this SQL in PlanetScale's SQL editor:

```sql
CREATE TABLE prompts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  tags JSON,
  description TEXT,
  prompt TEXT NOT NULL,
  example_input TEXT,
  example_output TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Step 4: Add Environment Variables to Vercel
1. Go to your Vercel dashboard
2. Select your project → Settings → Environment Variables
3. Add these variables:

```
DATABASE_HOST=your-host-from-planetscale
DATABASE_USERNAME=your-username
DATABASE_PASSWORD=your-password
```

### Step 5: Update Your App
Change your frontend to use the new API endpoint:

```javascript
// In your frontend code, change:
const response = await fetch('/api/prompts-supabase')
// To:
const response = await fetch('/api/prompts-planetscale')
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
