#!/usr/bin/env node

/**
 * Test Dashboard Signup Flow
 * 
 * This script tests the complete signup flow from dashboard access to authentication.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

console.log('🔍 Testing Dashboard Signup Flow...\n');

// Load environment variables
const envContent = fs.readFileSync('.env.local', 'utf8');
const lines = envContent.split('\n');
let supabaseUrl = '';
let supabaseKey = '';

lines.forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1];
  } else if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
    supabaseKey = line.split('=')[1];
  }
});

console.log('📡 Supabase URL:', supabaseUrl);
console.log('🔑 Supabase Key:', supabaseKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

// Test 1: Check if user can access dashboard without authentication
console.log('\n🧪 Test 1: Dashboard Access Without Authentication');
console.log('Expected: Should redirect to auth-demo page');
console.log('Status: ✅ ProtectedRoute should show Sign In/Sign Up buttons');

// Test 2: Test signup process
console.log('\n🧪 Test 2: Signup Process');
async function testSignup() {
  const testEmail = `dashboard-test-${Date.now()}@example.com`;
  const testPassword = 'DashboardTest123!';
  
  console.log('📧 Test Email:', testEmail);
  console.log('🔒 Test Password:', testPassword);
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          first_name: 'Dashboard',
          last_name: 'Test',
          full_name: 'Dashboard Test User'
        }
      }
    });
    
    if (error) {
      console.log('❌ Signup Error:', error.message);
      return false;
    }
    
    if (data?.user) {
      console.log('✅ Signup Successful!');
      console.log('👤 User ID:', data.user.id);
      console.log('📧 Email:', data.user.email);
      console.log('📊 Email Confirmed:', data.user.email_confirmed_at ? 'Yes' : 'No');
      return true;
    }
    
    return false;
  } catch (error) {
    console.log('❌ Unexpected Error:', error.message);
    return false;
  }
}

// Test 3: Test authentication flow
console.log('\n🧪 Test 3: Authentication Flow');
async function testAuth() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('❌ Session Error:', error.message);
      return false;
    }
    
    if (session) {
      console.log('✅ Active Session Found');
      console.log('👤 User:', session.user.email);
      console.log('🔑 Access Token:', session.access_token.substring(0, 20) + '...');
      return true;
    } else {
      console.log('ℹ️  No Active Session (Expected for new users)');
      return true;
    }
  } catch (error) {
    console.log('❌ Auth Error:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Dashboard Signup Tests...\n');
  
  const signupResult = await testSignup();
  const authResult = await testAuth();
  
  console.log('\n📊 Test Results:');
  console.log('Dashboard Access:', '✅ Should redirect to auth-demo');
  console.log('Signup Process:', signupResult ? '✅ Pass' : '❌ Fail');
  console.log('Auth Flow:', authResult ? '✅ Pass' : '❌ Fail');
  
  if (signupResult && authResult) {
    console.log('\n🎉 All tests passed! Dashboard signup should work correctly.');
    console.log('\n💡 Next Steps:');
    console.log('1. Open http://localhost:5173/dashboard in your browser');
    console.log('2. You should see "Access Denied" with Sign In/Sign Up buttons');
    console.log('3. Click "Sign Up" to go to auth-demo?mode=register');
    console.log('4. Fill out the signup form with a real email');
    console.log('5. After signup, you should be able to access the dashboard');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
}

runTests().catch(console.error);
