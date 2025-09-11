# Supabase Configuration Guide

## 🚀 Setting Up Real Supabase Authentication

This guide will help you configure real Supabase authentication for your NaniTech DevShop application.

### 📋 Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Node.js**: Ensure you have Node.js installed
3. **Git**: For version control

### 🔧 Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `nani-tech-devshop` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be set up (2-3 minutes)

### 🔑 Step 2: Get API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### 📁 Step 3: Create Environment File

1. In your project root, create a file called `.env.local`
2. Add the following content:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Application Configuration
VITE_APP_NAME=NANI TECH DevShop
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
VITE_APP_URL=http://localhost:5173
```

3. Replace the placeholder values with your actual Supabase credentials

### 🗄️ Step 4: Set Up Database Schema

Run the following SQL in your Supabase SQL Editor:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role VARCHAR(20) DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_2fa table
CREATE TABLE IF NOT EXISTS user_2fa (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  secret TEXT,
  backup_codes TEXT[],
  is_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  is_2fa_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  UNIQUE(session_id)
);

-- Create user_login_attempts table
CREATE TABLE IF NOT EXISTS user_login_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_2fa_user_id ON user_2fa(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_login_attempts_user_id ON user_login_attempts(user_id);
```

### 🔐 Step 5: Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:

#### **General Settings:**
- **Site URL**: `http://localhost:5173` (for development)
- **Redirect URLs**: Add `http://localhost:5173/dashboard`

#### **Email Settings:**
- **Enable email confirmations**: ✅ (recommended)
- **Enable email change confirmations**: ✅ (recommended)

#### **OAuth Providers:**
- **Google**: Configure if you want Google login
- **GitHub**: Configure if you want GitHub login
- **Microsoft**: Configure if you want Microsoft login

### 🚀 Step 6: Deploy Edge Functions

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-id
   ```

4. Deploy the edge functions:
   ```bash
   supabase functions deploy enable-2fa
   supabase functions deploy verify-2fa
   supabase functions deploy disable-2fa
   ```

### 🧪 Step 7: Test the Configuration

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Visit `http://localhost:5173/auth-demo`

3. Try to sign up with a real email address

4. Check your email for the confirmation link

5. Complete the sign-up process

### 🔧 Step 8: Production Configuration

For production deployment:

1. Update your environment variables:
   ```bash
   VITE_APP_URL=https://your-domain.com
   VITE_APP_ENV=production
   ```

2. Update Supabase settings:
   - **Site URL**: `https://your-domain.com`
   - **Redirect URLs**: `https://your-domain.com/dashboard`

3. Deploy your application

### 🐛 Troubleshooting

#### **Common Issues:**

1. **"Supabase not configured" error**:
   - Check that `.env.local` exists and has correct values
   - Restart your development server

2. **"Invalid API key" error**:
   - Verify your `VITE_SUPABASE_ANON_KEY` is correct
   - Check that the key starts with `eyJ`

3. **"Project not found" error**:
   - Verify your `VITE_SUPABASE_URL` is correct
   - Check that the URL includes your project ID

4. **Email confirmation not working**:
   - Check your email spam folder
   - Verify email settings in Supabase dashboard

5. **2FA not working**:
   - Ensure edge functions are deployed
   - Check Supabase function logs

### 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### 🆘 Support

If you encounter issues:

1. Check the browser console for errors
2. Check Supabase dashboard logs
3. Verify all environment variables are set correctly
4. Ensure database schema is properly set up

---

**Note**: This configuration removes all mock data and uses real Supabase authentication. Make sure to test thoroughly before deploying to production.
