#!/usr/bin/env node

/**
 * GitHub Actions Setup Script for NaniTech DevShop
 * 
 * This script helps you set up GitHub Actions for your project.
 * Run with: node setup-github-actions.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupGitHubActions() {
  console.log('\n🚀 NaniTech DevShop - GitHub Actions Setup\n');
  
  console.log('This script will help you set up GitHub Actions for your project.\n');
  
  console.log('📋 Available Options:');
  console.log('1. Simple setup (uses GITHUB_TOKEN)');
  console.log('2. Advanced setup (uses GitHub App with generated tokens)');
  console.log('3. View current workflows\n');
  
  const choice = await question('Choose an option (1-3): ');
  
  switch (choice) {
    case '1':
      await setupSimple();
      break;
    case '2':
      await setupAdvanced();
      break;
    case '3':
      await viewWorkflows();
      break;
    default:
      console.log('\n❌ Invalid option. Please run the script again.');
      rl.close();
      return;
  }
  
  rl.close();
}

async function setupSimple() {
  console.log('\n🔧 Setting up Simple GitHub Actions...\n');
  
  console.log('✅ Simple workflows are already created:');
  console.log('   - .github/workflows/simple-ci.yml');
  console.log('   - .github/workflows/track-simple.yml\n');
  
  console.log('📋 Next steps:');
  console.log('1. Go to your repository on GitHub');
  console.log('2. Go to Settings → Secrets and variables → Actions');
  console.log('3. Add these secrets:');
  console.log('   - VITE_SUPABASE_URL');
  console.log('   - VITE_SUPABASE_ANON_KEY');
  console.log('4. Enable GitHub Pages in repository settings');
  console.log('5. Push your code to trigger the workflows\n');
  
  console.log('🎯 The workflows will:');
  console.log('   - Run tests on every push/PR');
  console.log('   - Build your application');
  console.log('   - Deploy to GitHub Pages on main branch');
  console.log('   - Track PR and issue events');
}

async function setupAdvanced() {
  console.log('\n🔧 Setting up Advanced GitHub Actions...\n');
  
  console.log('📋 Prerequisites:');
  console.log('1. Create a GitHub App at https://github.com/settings/apps');
  console.log('2. Get your App ID and private key');
  console.log('3. Install the app on your repository\n');
  
  const appId = await question('Enter your GitHub App ID: ');
  const hasPrivateKey = await question('Do you have the private key file? (y/n): ');
  
  if (appId && hasPrivateKey.toLowerCase() === 'y') {
    console.log('\n✅ Advanced workflows are already created:');
    console.log('   - .github/workflows/ci.yml');
    console.log('   - .github/workflows/track-pr.yml\n');
    
    console.log('📋 Next steps:');
    console.log('1. Go to your repository on GitHub');
    console.log('2. Go to Settings → Secrets and variables → Actions');
    console.log('3. Add these secrets:');
    console.log('   - APP_PEM (contents of your private key file)');
    console.log('   - VITE_SUPABASE_URL');
    console.log('   - VITE_SUPABASE_ANON_KEY');
    console.log('4. Add this variable:');
    console.log('   - APP_ID (your app ID)');
    console.log('5. Enable GitHub Pages in repository settings\n');
    
    console.log('🎯 The workflows will:');
    console.log('   - Generate secure tokens (expire in 60 minutes)');
    console.log('   - Run tests and build your application');
    console.log('   - Deploy to GitHub Pages');
    console.log('   - Track PR and issue events with enhanced security');
  } else {
    console.log('\n⚠️  Please set up your GitHub App first, then run this script again.');
    console.log('📚 See GITHUB_ACTIONS_SETUP.md for detailed instructions.');
  }
}

async function viewWorkflows() {
  console.log('\n📁 Current GitHub Actions Workflows:\n');
  
  const workflowsDir = path.join(process.cwd(), '.github', 'workflows');
  
  if (!fs.existsSync(workflowsDir)) {
    console.log('❌ No workflows directory found.');
    return;
  }
  
  const files = fs.readdirSync(workflowsDir);
  
  if (files.length === 0) {
    console.log('❌ No workflow files found.');
    return;
  }
  
  files.forEach(file => {
    if (file.endsWith('.yml') || file.endsWith('.yaml')) {
      console.log(`📄 ${file}`);
      
      try {
        const content = fs.readFileSync(path.join(workflowsDir, file), 'utf8');
        const lines = content.split('\n');
        
        // Extract workflow name and description
        const nameLine = lines.find(line => line.startsWith('name:'));
        const onLine = lines.find(line => line.startsWith('on:'));
        
        if (nameLine) {
          console.log(`   Name: ${nameLine.replace('name:', '').trim()}`);
        }
        
        if (onLine) {
          console.log(`   Triggers: ${onLine.replace('on:', '').trim()}`);
        }
        
        console.log('');
      } catch (error) {
        console.log(`   ❌ Error reading file: ${error.message}`);
      }
    }
  });
  
  console.log('💡 To edit workflows, modify the files in .github/workflows/');
  console.log('💡 To trigger workflows, push code or use the Actions tab on GitHub');
}

// Handle Ctrl+C
rl.on('SIGINT', () => {
  console.log('\n\n👋 Setup cancelled. You can run this script again anytime.');
  rl.close();
});

setupGitHubActions().catch(console.error);
