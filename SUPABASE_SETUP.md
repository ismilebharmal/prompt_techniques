# 🗄️ Supabase Setup Guide (Vercel Compatible)

## Why Supabase?
- ✅ **Perfect Vercel compatibility** - No SSL/TLS issues
- ✅ **Free tier available** - 500MB database, 2GB bandwidth
- ✅ **PostgreSQL database** - Reliable and fast
- ✅ **Real-time features** - Built-in real-time subscriptions
- ✅ **Easy setup** - Just need to create a project

## Step 1: Create Supabase Project

1. **Go to [https://supabase.com](https://supabase.com)**
2. **Click "Start your project"**
3. **Sign up with GitHub**
4. **Create a new project**:
   - Name: `prompt-techniques-hub`
   - Database Password: Choose a strong password
   - Region: Choose closest to you

## Step 2: Create Database Table

In your Supabase project dashboard:

1. **Go to "Table Editor"**
2. **Click "Create a new table"**
3. **Table name**: `prompts`
4. **Add these columns**:

| Column Name | Type | Default Value | Nullable |
|-------------|------|---------------|----------|
| `id` | `int8` | `auto-increment` | ❌ |
| `title` | `text` | - | ❌ |
| `category` | `text` | - | ❌ |
| `tags` | `text[]` | - | ✅ |
| `description` | `text` | - | ✅ |
| `prompt` | `text` | - | ❌ |
| `example_input` | `text` | - | ✅ |
| `example_output` | `text` | - | ✅ |
| `created_at` | `timestamptz` | `now()` | ❌ |
| `updated_at` | `timestamptz` | `now()` | ❌ |

5. **Click "Save"**

## Step 3: Get API Keys

1. **Go to "Settings" → "API"**
2. **Copy these values**:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 4: Add Environment Variables to Vercel

1. **Go to your Vercel project dashboard**
2. **Go to "Settings" → "Environment Variables"**
3. **Add these variables**:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 5: Deploy!

1. **Push your changes to GitHub**
2. **Vercel will automatically deploy**
3. **Your app will work with Supabase!** 🎉

## Step 6: Add Sample Data (Optional)

You can add sample prompts directly in Supabase:

1. **Go to "Table Editor"**
2. **Click on "prompts" table**
3. **Click "Insert" → "Insert row"**
4. **Add your first prompt**:

```json
{
  "title": "Email Rewrite — Professional",
  "category": "Mail",
  "tags": ["email", "tone", "professional"],
  "description": "Rewrite an email politely and concisely.",
  "prompt": "SYSTEM: You are a professional communications assistant...",
  "example_input": "Hey team, I need that report asap...",
  "example_output": "Subject: Request for Report — Deadline Clarification..."
}
```

## What You Get

- ✅ **Real database** - No more fallback needed
- ✅ **Perfect Vercel compatibility** - No SSL issues
- ✅ **Real-time updates** - Can add real-time features later
- ✅ **Free tier** - 500MB database, 2GB bandwidth
- ✅ **Easy management** - Web dashboard for data management

## Troubleshooting

### If Supabase connection fails:
- Check environment variables are set correctly
- Verify the table structure matches the code
- Check Supabase project is active

### If you see fallback data:
- Supabase connection failed, but app still works
- Check the console for error messages
- Verify API keys are correct

**Supabase + Vercel = Perfect combination!** 🚀
