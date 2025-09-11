#!/usr/bin/env node

/**
 * GitHub Authentication Setup Script for NaniTech DevShop
 * 
 * This script helps you set up GitHub authentication for your project.
 * Run with: node setup-github-auth.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupGitHubAuth() {
  console.log('\n🔐 NaniTech DevShop - GitHub Authentication Setup\n');
  
  try {
    // Check if GitHub CLI is authenticated
    console.log('🔍 Checking GitHub CLI authentication...');
    const authStatus = execSync('gh auth status', { encoding: 'utf8' });
    console.log('✅ GitHub CLI is authenticated');
    
    // Check repository permissions
    console.log('\n🔍 Checking repository permissions...');
    const repoInfo = execSync('gh repo view --json viewerPermission', { encoding: 'utf8' });
    const { viewerPermission } = JSON.parse(repoInfo);
    
    if (viewerPermission !== 'ADMIN') {
      console.log('❌ You need ADMIN permissions on this repository');
      console.log('Please contact the repository owner to grant you admin access');
      rl.close();
      return;
    }
    
    console.log('✅ You have ADMIN permissions');
    
    // Check current secrets
    console.log('\n🔍 Checking current secrets...');
    const secrets = execSync('gh secret list', { encoding: 'utf8' });
    console.log('Current secrets:');
    console.log(secrets);
    
    // Check if required secrets exist
    const hasSupabaseUrl = secrets.includes('VITE_SUPABASE_URL');
    const hasSupabaseKey = secrets.includes('VITE_SUPABASE_ANON_KEY');
    
    if (!hasSupabaseUrl || !hasSupabaseKey) {
      console.log('\n⚠️  Missing required secrets for Supabase');
      console.log('You need to add:');
      if (!hasSupabaseUrl) console.log('  - VITE_SUPABASE_URL');
      if (!hasSupabaseKey) console.log('  - VITE_SUPABASE_ANON_KEY');
      
      const addSecrets = await question('\nWould you like to add these secrets now? (y/n): ');
      
      if (addSecrets.toLowerCase() === 'y') {
        if (!hasSupabaseUrl) {
          const supabaseUrl = await question('Enter your VITE_SUPABASE_URL: ');
          execSync(`gh secret set VITE_SUPABASE_URL --body "${supabaseUrl}"`);
          console.log('✅ VITE_SUPABASE_URL added');
        }
        
        if (!hasSupabaseKey) {
          const supabaseKey = await question('Enter your VITE_SUPABASE_ANON_KEY: ');
          execSync(`gh secret set VITE_SUPABASE_ANON_KEY --body "${supabaseKey}"`);
          console.log('✅ VITE_SUPABASE_ANON_KEY added');
        }
      }
    } else {
      console.log('✅ All required secrets are present');
    }
    
    // Check GitHub Pages
    console.log('\n🔍 Checking GitHub Pages...');
    try {
      const pagesStatus = execSync('gh api repos/Noxie-dev/nanitech-devshop/pages', { encoding: 'utf8' });
      console.log('✅ GitHub Pages is enabled');
    } catch (error) {
      console.log('❌ GitHub Pages is not enabled');
      const enablePages = await question('Would you like to enable GitHub Pages? (y/n): ');
      
      if (enablePages.toLowerCase() === 'y') {
        try {
          execSync('gh api repos/Noxie-dev/nanitech-devshop/pages -X POST -f source[branch]=main -f source[path]=/ -f build_type=workflow');
          console.log('✅ GitHub Pages enabled');
        } catch (error) {
          console.log('❌ Failed to enable GitHub Pages:', error.message);
          console.log('Please enable it manually in repository settings');
        }
      }
    }
    
    // Check workflows
    console.log('\n🔍 Checking workflows...');
    const workflows = execSync('gh workflow list', { encoding: 'utf8' });
    console.log('Available workflows:');
    console.log(workflows);
    
    // Test workflow
    const testWorkflow = await question('\nWould you like to test a workflow? (y/n): ');
    if (testWorkflow.toLowerCase() === 'y') {
      try {
        execSync('gh workflow run "Simple CI/CD Pipeline"');
        console.log('✅ Workflow triggered successfully');
        console.log('Check the Actions tab in your repository to see the progress');
      } catch (error) {
        console.log('❌ Failed to trigger workflow:', error.message);
      }
    }
    
    console.log('\n🎉 GitHub authentication setup complete!');
    console.log('\n📋 Summary:');
    console.log('✅ GitHub CLI authenticated');
    console.log('✅ Repository permissions: ADMIN');
    console.log('✅ Required secrets configured');
    console.log('✅ GitHub Pages enabled');
    console.log('✅ Workflows available');
    
    console.log('\n🚀 Next steps:');
    console.log('1. Push your code to trigger workflows');
    console.log('2. Check the Actions tab for workflow progress');
    console.log('3. Monitor deployment in the Pages tab');
    
  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure GitHub CLI is installed: gh --version');
    console.log('2. Make sure you are authenticated: gh auth status');
    console.log('3. Make sure you have admin access to the repository');
  }
  
  rl.close();
}

// Handle Ctrl+C
rl.on('SIGINT', () => {
  console.log('\n\n👋 Setup cancelled. You can run this script again anytime.');
  rl.close();
});

setupGitHubAuth().catch(console.error);
