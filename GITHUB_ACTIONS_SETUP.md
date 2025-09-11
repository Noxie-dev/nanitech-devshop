# GitHub Actions Setup Guide

## 🔐 GitHub App Token Generation Setup

This guide will help you set up GitHub Actions with proper token generation instead of using GITHUB_TOKEN.

### 📋 Prerequisites

1. **GitHub Repository**: Your NaniTech DevShop repo
2. **Admin Access**: You need admin permissions on the repository
3. **GitHub App**: You'll need to create a GitHub App

### 🚀 Step 1: Create GitHub App

1. Go to [GitHub Apps](https://github.com/settings/apps)
2. Click "New GitHub App"
3. Fill in the details:
   - **GitHub App name**: `NaniTech DevShop CI`
   - **Homepage URL**: `https://your-domain.com`
   - **Webhook URL**: `https://your-domain.com/webhook` (optional)
   - **Webhook secret**: Generate a random string

4. **Permissions**:
   - **Repository permissions**:
     - Actions: Read
     - Contents: Read
     - Issues: Read
     - Pull requests: Read
     - Metadata: Read
   - **Subscribe to events**:
     - Pull request
     - Issues
     - Push

5. **Where can this GitHub App be installed?**: Only on this account
6. Click "Create GitHub App"

### 🔑 Step 2: Get App Credentials

1. **App ID**: Found on the app's general page
2. **Private Key**: 
   - Click "Generate a private key"
   - Download the `.pem` file
   - Keep this secure!

### ⚙️ Step 3: Configure Repository Secrets

1. Go to your repository → Settings → Secrets and variables → Actions
2. Add these secrets:

#### **Repository Secrets:**
```
APP_PEM
```
- Value: Contents of the `.pem` file you downloaded

#### **Repository Variables:**
```
APP_ID
```
- Value: The App ID from step 2

### 🔧 Step 4: Install GitHub App

1. Go to your GitHub App settings
2. Click "Install App"
3. Select your repository
4. Click "Install"

### 📝 Step 5: Environment Variables for Build

Add these to your repository secrets:

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

### 🧪 Step 6: Test the Workflow

1. **Manual Trigger**:
   ```bash
   # Go to Actions tab in your repository
   # Click "Track PR and Issues"
   # Click "Run workflow"
   ```

2. **PR Trigger**:
   ```bash
   # Create a test PR
   git checkout -b test-pr
   git commit --allow-empty -m "Test PR for workflow"
   git push origin test-pr
   # Create PR on GitHub
   ```

### 🔍 Step 7: Monitor Token Usage

The generated token:
- **Expires**: After 60 minutes
- **Scope**: Limited to your app's permissions
- **Security**: More secure than GITHUB_TOKEN
- **Rate Limits**: Based on your app's permissions

### 📊 Workflow Features

#### **CI/CD Pipeline (`ci.yml`)**:
- ✅ Runs tests on every push/PR
- ✅ Builds application with environment variables
- ✅ Deploys to GitHub Pages on main branch
- ✅ Uses generated token for deployment

#### **PR/Issue Tracker (`track-pr.yml`)**:
- ✅ Tracks PR events (opened, closed, merged)
- ✅ Tracks issue events (opened, closed)
- ✅ Uses generated token for API calls
- ✅ Logs token expiration time

### 🛠️ Customization

#### **Modify Token Expiration**:
```yaml
- name: Generate GitHub token
  id: generate-token
  uses: actions/create-github-app-token@v2
  with:
    app-id: ${{ vars.APP_ID }}
    private-key: ${{ secrets.APP_PEM }}
    # Token expires in 60 minutes by default
```

#### **Add More API Calls**:
```yaml
- name: Use GitHub API
  env:
    GH_TOKEN: ${{ steps.generate-token.outputs.token }}
  run: |
    # Get repository stats
    gh api repos/${{ github.repository }}/stats/contributors
    
    # Get recent commits
    gh api repos/${{ github.repository }}/commits --jq '.[0:5]'
    
    # Get repository languages
    gh api repos/${{ github.repository }}/languages
```

### 🚨 Troubleshooting

#### **Common Issues:**

1. **"App not found" error**:
   - Check APP_ID is correct
   - Verify the app is installed on your repository

2. **"Invalid private key" error**:
   - Check APP_PEM secret is correct
   - Ensure the .pem file content is properly formatted

3. **"Insufficient permissions" error**:
   - Check app permissions in GitHub App settings
   - Reinstall the app after changing permissions

4. **"Token expired" error**:
   - Tokens expire after 60 minutes
   - The workflow will generate a new token on each run

### 📚 Additional Resources

- [GitHub Apps Documentation](https://docs.github.com/en/developers/apps)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [create-github-app-token Action](https://github.com/marketplace/actions/create-github-app-token)

### 🔒 Security Best Practices

1. **Never commit secrets**: Use repository secrets
2. **Rotate keys regularly**: Update your private key periodically
3. **Minimal permissions**: Only grant necessary permissions
4. **Monitor usage**: Check app usage in GitHub settings
5. **Secure storage**: Keep private keys in secure locations

---

**Note**: This setup provides more security and flexibility than using GITHUB_TOKEN, as the generated tokens are scoped to your specific app and expire automatically.
