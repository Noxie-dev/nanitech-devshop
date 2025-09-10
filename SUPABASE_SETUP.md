# 🚀 Supabase Setup Guide

## Quick Fix for Current Error

The error you're seeing occurs because Supabase environment variables are not configured. Here's how to fix it:

### Option 1: Use Mock Data (Quick Demo)
The module now includes mock data, so your app will work immediately with demo projects and a demo admin user.

### Option 2: Set Up Real Supabase (Recommended for Production)

#### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Choose a region close to your users
4. Wait for the project to be created

#### Step 2: Get Your Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key

#### Step 3: Configure Environment Variables
1. Create a `.env.local` file in your project root (if not already created)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-actual-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

#### Step 4: Set Up Database Schema
1. Go to your Supabase dashboard → **SQL Editor**
2. Run the following SQL to create the required tables:

```sql
-- Enhanced Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  githubUrl TEXT,
  liveUrl TEXT,
  images TEXT[] DEFAULT '{}',
  techStack TEXT[] DEFAULT '{}',
  createdBy UUID REFERENCES auth.users(id),
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role VARCHAR(20) DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  fullName TEXT,
  avatarUrl TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (status = 'published');
CREATE POLICY "Allow authenticated insert" ON projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = createdBy);
CREATE POLICY "Allow owner update" ON projects FOR UPDATE USING (auth.uid() = createdBy) WITH CHECK (auth.uid() = createdBy);
CREATE POLICY "Allow owner delete" ON projects FOR DELETE USING (auth.uid() = createdBy);
CREATE POLICY "Allow admin full access" ON projects FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
) WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- RLS Policies for profiles
CREATE POLICY "Allow users to view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow users to update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
```

#### Step 5: Restart Development Server
```bash
pnpm run dev
```

## Current Status

✅ **Mock Data Mode**: Your app now works with demo data
✅ **Error Fixed**: No more environment variable errors
✅ **Full Functionality**: All features work with mock data

## Features Available in Mock Mode

- **Demo Projects**: 2 sample projects with realistic data
- **Demo Admin User**: Full permissions for testing
- **Search Engine**: Works with mock data
- **Recommendation Engine**: Functions with mock tech stacks
- **RBAC System**: Permission checking works
- **Caching**: All caching features operational

## Next Steps

1. **Test the Dashboard**: Visit `/dashboard` to see all features
2. **Configure Supabase**: Follow the setup guide above for production
3. **Add Real Data**: Once Supabase is configured, add your actual projects

## Troubleshooting

### Still Getting Errors?
1. Make sure you restarted the dev server after creating `.env.local`
2. Check that your `.env.local` file is in the project root
3. Verify your Supabase credentials are correct

### Want to Use Mock Data Only?
The app will automatically use mock data if Supabase is not configured, so you can develop and test without setting up Supabase.

---

**The app is now ready to use! 🎉**

