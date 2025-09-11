#!/usr/bin/env node

/**
 * Environment Setup Script for NaniTech DevShop
 * 
 * This script helps you set up your environment variables for Supabase authentication.
 * Run with: node setup-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupEnvironment() {
  console.log('\n🚀 NaniTech DevShop - Environment Setup\n');
  console.log('This script will help you configure your Supabase credentials.\n');
  
  console.log('📋 Prerequisites:');
  console.log('1. Create a Supabase project at https://supabase.com');
  console.log('2. Get your Project URL and API Key from Settings → API\n');
  
  const supabaseUrl = await question('Enter your Supabase Project URL: ');
  const supabaseAnonKey = await question('Enter your Supabase Anon Key: ');
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('\n❌ Both URL and API Key are required. Exiting...');
    rl.close();
    return;
  }
  
  // Validate URL format
  if (!supabaseUrl.includes('supabase.co')) {
    console.log('\n⚠️  Warning: The URL doesn\'t look like a Supabase URL. Please verify it\'s correct.');
  }
  
  // Validate API Key format
  if (!supabaseAnonKey.startsWith('eyJ')) {
    console.log('\n⚠️  Warning: The API Key doesn\'t look like a Supabase key. Please verify it\'s correct.');
  }
  
  const envContent = `# NaniTech DevShop - Environment Variables
# Generated on ${new Date().toISOString()}

# Supabase Configuration
VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseAnonKey}

# Application Configuration
VITE_APP_NAME=NANI TECH DevShop
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:5173

# Development Configuration
VITE_DEV_MODE=true
`;

  const envPath = path.join(process.cwd(), '.env.local');
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Environment file created successfully!');
    console.log(`📁 Location: ${envPath}`);
    console.log('\n🔄 Next steps:');
    console.log('1. Restart your development server (pnpm dev)');
    console.log('2. Visit http://localhost:5173/auth-demo to test authentication');
    console.log('3. Follow the Supabase configuration guide for database setup');
    console.log('\n📚 For detailed setup instructions, see: SUPABASE_CONFIGURATION_GUIDE.md');
  } catch (error) {
    console.log('\n❌ Error creating environment file:', error.message);
    console.log('\nPlease create .env.local manually with the following content:');
    console.log('\n' + envContent);
  }
  
  rl.close();
}

// Handle Ctrl+C
rl.on('SIGINT', () => {
  console.log('\n\n👋 Setup cancelled. You can run this script again anytime.');
  rl.close();
});

setupEnvironment().catch(console.error);
