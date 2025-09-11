# 🔧 Supabase URL Fix Guide

## ❌ **Issue Found:**
The Supabase URL in your `.env.local` file is incorrect:
- **Current (Wrong)**: `https://onymzjgznpjcltxerxu.supabase.co`
- **Error**: `ENOTFOUND onymzjgznpjcltxerxu.supabase.co`

## ✅ **How to Fix:**

### Step 1: Get Your Correct Supabase URL

1. **Go to [Supabase Dashboard](https://supabase.com/dashboard)**
2. **Select your project** (NaniTech DevShop)
3. **Go to Settings → API**
4. **Copy the "Project URL"** (should look like `https://your-project-id.supabase.co`)

### Step 2: Update Your .env.local File

Replace this line in your `.env.local` file:
```bash
# Change this:
VITE_SUPABASE_URL=https://onymzjgznpjcltxerxu.supabase.co

# To your actual Supabase URL:
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
```

### Step 3: Verify the Fix

Run this command to test:
```bash
node test-signup.js
```

## 🔍 **Common Supabase URL Formats:**

- ✅ **Correct**: `https://abcdefghijklmnop.supabase.co`
- ✅ **Correct**: `https://your-project-name.supabase.co`
- ❌ **Wrong**: `https://your-project.supabase.co` (placeholder)
- ❌ **Wrong**: `https://onymzjgznpjcltxerxu.supabase.co` (doesn't exist)

## 🚨 **Important Notes:**

1. **The URL must be accessible** - you should be able to visit it in your browser
2. **The URL should end with `.supabase.co`**
3. **The project ID should match** what you see in your Supabase dashboard
4. **After fixing, restart your dev server**: `pnpm dev`

## 🧪 **Test Your Fix:**

1. **Update the URL** in `.env.local`
2. **Restart your dev server**: `pnpm dev`
3. **Open your browser**: http://localhost:5175
4. **Go to Auth Demo page**: http://localhost:5175/auth-demo
5. **Try to sign up** with a test email
6. **Check browser console** for any errors

## 📞 **Need Help?**

If you can't find your Supabase URL:
1. Check your Supabase dashboard
2. Look for "Project URL" in Settings → API
3. Make sure you're in the correct project
4. The URL should be visible in the project overview

---

**Once you fix the URL, your signup functionality will work perfectly! 🎉**
