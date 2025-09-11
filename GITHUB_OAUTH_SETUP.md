# 🔐 GitHub OAuth Setup Guide

## ❌ **Current Issue:**
```
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

This error means **GitHub OAuth is not enabled** in your Supabase project.

## ✅ **How to Fix:**

### Step 1: Enable GitHub OAuth in Supabase

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project** (NaniTech DevShop)
3. **Go to Authentication → Providers**
4. **Find "GitHub"** in the list of providers
5. **Toggle it ON** (enable it)

### Step 2: Configure GitHub OAuth App

#### **2.1 Create GitHub OAuth App:**

1. **Go to GitHub**: https://github.com/settings/applications/new
2. **Fill in the details**:
   - **Application name**: `NaniTech DevShop`
   - **Homepage URL**: `http://localhost:5173` (for development)
   - **Authorization callback URL**: `https://onymzjegznpjcltxerxu.supabase.co/auth/v1/callback`
3. **Click "Register application"**
4. **Copy the Client ID and Client Secret**

#### **2.2 Configure in Supabase:**

1. **Back in Supabase Dashboard** → Authentication → Providers → GitHub
2. **Enter your GitHub credentials**:
   - **Client ID**: (from GitHub OAuth app)
   - **Client Secret**: (from GitHub OAuth app)
3. **Set Redirect URL**: `https://onymzjegznpjcltxerxu.supabase.co/auth/v1/callback`
4. **Click "Save"**

### Step 3: Update Site URL (Important!)

1. **Go to Authentication → URL Configuration**
2. **Set Site URL**: `http://localhost:5173` (for development)
3. **Add Redirect URLs**:
   - `http://localhost:5173/auth/callback`
   - `http://localhost:5173/dashboard`
   - `http://localhost:5173/auth-demo`

### Step 4: Test GitHub OAuth

1. **Restart your dev server**: `pnpm dev`
2. **Go to**: http://localhost:5173/auth-demo
3. **Click "GitHub" button**
4. **Should redirect to GitHub for authorization**

## 🔧 **Alternative: Disable GitHub OAuth Temporarily**

If you want to disable GitHub OAuth for now, you can hide the button:

```jsx
// In RegisterForm.jsx and LoginForm.jsx
// Comment out or remove the GitHub button
{/* 
<button
  onClick={() => handleProviderLogin('github')}
  disabled={isLoading || loading}
  className="w-full py-3 px-4 bg-[#1C1F27] border border-[#2A2D3A] rounded-lg text-[#EAEAEA] hover:border-[#00E5FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
>
  <Github className="w-5 h-5" />
  GitHub
</button>
*/}
```

## 📋 **Required URLs for Production:**

When you deploy to production, update these URLs:

### **GitHub OAuth App:**
- **Homepage URL**: `https://your-domain.com`
- **Authorization callback URL**: `https://onymzjegznpjcltxerxu.supabase.co/auth/v1/callback`

### **Supabase Configuration:**
- **Site URL**: `https://your-domain.com`
- **Redirect URLs**: 
  - `https://your-domain.com/auth/callback`
  - `https://your-domain.com/dashboard`
  - `https://your-domain.com/auth-demo`

## 🧪 **Testing Steps:**

1. **Enable GitHub OAuth** in Supabase
2. **Create GitHub OAuth App** with correct callback URL
3. **Configure credentials** in Supabase
4. **Update Site URL** in Supabase
5. **Test the flow**:
   - Go to http://localhost:5173/auth-demo
   - Click "GitHub" button
   - Should redirect to GitHub
   - After authorization, should redirect back to your app

## 🚨 **Common Issues:**

### **Issue 1: "Invalid redirect URI"**
- **Fix**: Make sure the callback URL in GitHub matches exactly: `https://onymzjegznpjcltxerxu.supabase.co/auth/v1/callback`

### **Issue 2: "Provider not enabled"**
- **Fix**: Enable GitHub provider in Supabase Dashboard → Authentication → Providers

### **Issue 3: "Invalid client"**
- **Fix**: Check that Client ID and Client Secret are correct in Supabase

### **Issue 4: "Redirect URI mismatch"**
- **Fix**: Update Site URL and Redirect URLs in Supabase → Authentication → URL Configuration

## 📞 **Need Help?**

1. **Check Supabase logs**: Dashboard → Logs → Auth
2. **Check GitHub OAuth app settings**: Make sure callback URL is correct
3. **Verify environment variables**: Make sure Supabase URL and key are correct
4. **Test with different browser**: Clear cookies and try again

---

**Once you enable GitHub OAuth in Supabase, the signup with GitHub will work perfectly! 🚀**
