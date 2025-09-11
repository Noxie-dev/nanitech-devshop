# GitHub Authentication Setup Guide

## 🔐 Current Status Analysis

### ✅ What's Working:
- GitHub CLI authenticated as `Noxie-dev`
- Repository access: ADMIN permissions
- Token scopes: `gist`, `read:org`, `repo`, `workflow`
- Repository: `Noxie-dev/nanitech-devshop`

### ❌ What's Missing:
- Required secrets for Supabase
- GitHub Pages not enabled
- Advanced GitHub App setup (optional)

## 🚀 Quick Setup (Recommended)

### Step 1: Add Required Secrets

```bash
# Add Supabase secrets to your repository
gh secret set VITE_SUPABASE_URL --body "your-supabase-url-here"
gh secret set VITE_SUPABASE_ANON_KEY --body "your-supabase-anon-key-here"
```

### Step 2: Enable GitHub Pages

```bash
# Enable GitHub Pages
gh api repos/Noxie-dev/nanitech-devshop/pages -X POST -f source[branch]=main -f source[path]=/ -f build_type=workflow
```

### Step 3: Test the Workflows

```bash
# Push your code to trigger workflows
git add .
git commit -m "feat: add GitHub Actions workflows"
git push origin main
```

## 🔧 Advanced Setup (Optional)

### Step 1: Create GitHub App

1. Go to [GitHub Apps](https://github.com/settings/apps)
2. Click "New GitHub App"
3. Fill in details:
   - **Name**: `NaniTech DevShop CI`
   - **Homepage URL**: `https://nanitech-devshop.vercel.app`
   - **Webhook URL**: (optional)
   - **Webhook secret**: (generate random string)

4. **Permissions**:
   - Actions: Read
   - Contents: Read
   - Issues: Read
   - Pull requests: Read
   - Metadata: Read

5. **Subscribe to events**:
   - Pull request
   - Issues
   - Push

6. **Where can this GitHub App be installed?**: Only on this account

### Step 2: Get App Credentials

1. **App ID**: Found on the app's general page
2. **Private Key**: 
   - Click "Generate a private key"
   - Download the `.pem` file
   - Keep this secure!

### Step 3: Add App Secrets

```bash
# Add the private key content
gh secret set APP_PEM --body "$(cat path/to/your/app.pem)"

# Add the app ID as a variable
gh variable set APP_ID --body "your-app-id-here"
```

### Step 4: Install GitHub App

```bash
# Install the app on your repository
gh api repos/Noxie-dev/nanitech-devshop/installations -X POST -f app_id=your-app-id
```

## 🧪 Testing Your Setup

### Test 1: Check Secrets
```bash
# List all secrets
gh secret list

# Should show:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - APP_PEM (if using advanced setup)
```

### Test 2: Check Variables
```bash
# List all variables
gh variable list

# Should show:
# - APP_ID (if using advanced setup)
```

### Test 3: Check GitHub Pages
```bash
# Check if Pages is enabled
gh api repos/Noxie-dev/nanitech-devshop/pages
```

### Test 4: Trigger Workflow
```bash
# Trigger workflow manually
gh workflow run "Simple CI/CD Pipeline"
```

## 🔍 Troubleshooting

### Common Issues:

1. **"Secret not found" error**:
   ```bash
   # Check if secret exists
   gh secret list
   
   # Add missing secret
   gh secret set SECRET_NAME --body "secret-value"
   ```

2. **"Permission denied" error**:
   ```bash
   # Check your permissions
   gh repo view --json viewerPermission
   
   # Should show "ADMIN"
   ```

3. **"GitHub Pages not found" error**:
   ```bash
   # Enable GitHub Pages
   gh api repos/Noxie-dev/nanitech-devshop/pages -X POST -f source[branch]=main -f source[path]=/ -f build_type=workflow
   ```

4. **"Workflow not triggered" error**:
   ```bash
   # Check workflow file exists
   ls -la .github/workflows/
   
   # Check workflow syntax
   gh workflow list
   ```

## 📊 Workflow Comparison

### Simple Setup (Recommended):
- ✅ Uses `GITHUB_TOKEN` (automatic)
- ✅ No additional setup required
- ✅ Works immediately
- ❌ Less granular permissions

### Advanced Setup:
- ✅ Uses generated tokens (expire in 60 minutes)
- ✅ More granular permissions
- ✅ Better security
- ❌ Requires GitHub App setup

## 🎯 Next Steps

1. **Choose your setup**: Simple (easier) or Advanced (more secure)
2. **Add required secrets**: Supabase credentials
3. **Enable GitHub Pages**: For deployment
4. **Test workflows**: Push code and check Actions tab
5. **Monitor results**: Check deployment and logs

## 🔒 Security Best Practices

1. **Never commit secrets**: Use repository secrets
2. **Rotate keys regularly**: Update your private key periodically
3. **Minimal permissions**: Only grant necessary permissions
4. **Monitor usage**: Check app usage in GitHub settings
5. **Secure storage**: Keep private keys in secure locations

---

**Note**: The simple setup is recommended for most use cases and will work immediately with your current authentication.
