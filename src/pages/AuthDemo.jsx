import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/auth/AuthModal';
import { 
  User, 
  Shield, 
  LogIn, 
  UserPlus, 
  LogOut,
  CheckCircle,
  AlertCircle,
  Settings,
  ExternalLink
} from 'lucide-react';

const AuthDemo = () => {
  const { user, is2FAEnabled, is2FAVerified, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  // Check if Supabase is configured
  const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co' &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== 'your-anon-key-here';

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-[#0C0F16] text-[#EAEAEA] py-20">
      <div className="container mx-auto px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold font-orbitron gradient-text-cyan mb-6">
              Authentication System
            </h1>
            <p className="text-xl text-[#EAEAEA]/70 max-w-2xl mx-auto">
              Experience our robust authentication system with SSO and 2FA capabilities.
            </p>
          </div>

          {/* Configuration Status */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#EAEAEA] font-orbitron">
                Configuration Status
              </h2>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                isSupabaseConfigured 
                  ? 'bg-green-500/20 border border-green-500/30' 
                  : 'bg-red-500/20 border border-red-500/30'
              }`}>
                {isSupabaseConfigured ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ${
                  isSupabaseConfigured ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isSupabaseConfigured ? 'Configured' : 'Not Configured'}
                </span>
              </div>
            </div>
            
            {isSupabaseConfigured ? (
              <div className="flex items-start space-x-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-400 font-medium">Supabase Connected</p>
                  <p className="text-green-300/70 text-sm">
                    Authentication is properly configured and ready for production use.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-medium">Supabase Not Configured</p>
                    <p className="text-red-300/70 text-sm">
                      Please configure your Supabase credentials to use real authentication.
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#1C1F27] rounded-lg p-4">
                  <h3 className="text-[#EAEAEA] font-semibold mb-2 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Setup Instructions
                  </h3>
                  <ol className="text-[#EAEAEA]/70 text-sm space-y-1 list-decimal list-inside">
                    <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-[#00E5FF] hover:underline inline-flex items-center gap-1">supabase.com <ExternalLink className="w-3 h-3" /></a></li>
                    <li>Get your Project URL and API Key from Settings → API</li>
                    <li>Create a <code className="bg-[#0C0F16] px-1 rounded">.env.local</code> file in your project root</li>
                    <li>Add your Supabase credentials to the environment file</li>
                    <li>Restart your development server</li>
                  </ol>
                  <div className="mt-3">
                    <a 
                      href="/SUPABASE_CONFIGURATION_GUIDE.md" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#00E5FF] hover:text-[#00E5FF]/80 transition-colors text-sm"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View detailed configuration guide
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Auth Status Card */}
          <div className="glass-card rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-[#EAEAEA] mb-6 font-orbitron">
              Current Authentication Status
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00E5FF]"></div>
                <span className="ml-3 text-[#EAEAEA]/70">Loading...</span>
              </div>
            ) : user ? (
              <div className="space-y-6">
                {/* User Info */}
                <div className="flex items-center space-x-4 p-4 bg-[#1C1F27] rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00E5FF] to-[#E53935] rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#EAEAEA]">
                      {user.user_metadata?.full_name || 'Demo User'}
                    </h3>
                    <p className="text-[#EAEAEA]/60">{user.email}</p>
                  </div>
                </div>

                {/* 2FA Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-[#1C1F27] rounded-lg">
                    <Shield className={`w-6 h-6 ${is2FAEnabled ? 'text-green-500' : 'text-yellow-500'}`} />
                    <div>
                      <p className="text-[#EAEAEA] font-medium">2FA Status</p>
                      <p className={`text-sm ${is2FAEnabled ? 'text-green-400' : 'text-yellow-400'}`}>
                        {is2FAEnabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-[#1C1F27] rounded-lg">
                    <CheckCircle className={`w-6 h-6 ${is2FAVerified ? 'text-green-500' : 'text-gray-500'}`} />
                    <div>
                      <p className="text-[#EAEAEA] font-medium">2FA Verified</p>
                      <p className={`text-sm ${is2FAVerified ? 'text-green-400' : 'text-gray-400'}`}>
                        {is2FAVerified ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Configuration Notice */}
                {!isSupabaseConfigured && (
                  <div className="flex items-start space-x-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-yellow-400 font-medium">Configuration Required</p>
                      <p className="text-yellow-300/70 text-sm">
                        Please configure Supabase credentials to enable authentication features.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="w-16 h-16 text-[#EAEAEA]/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#EAEAEA] mb-2">
                  Not Signed In
                </h3>
                <p className="text-[#EAEAEA]/60 mb-6">
                  Sign in to access the dashboard and other protected features
                </p>
              </div>
            )}
          </div>

          {/* Auth Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user ? (
              <>
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#EAEAEA] mb-4">
                    Dashboard Access
                  </h3>
                  <p className="text-[#EAEAEA]/70 mb-4">
                    Access your protected dashboard with 2FA verification
                  </p>
                  <a
                    href="/dashboard"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#00E5FF] to-[#0066CC] text-white rounded-lg font-semibold hover:scale-105 transition-transform"
                  >
                    <User className="w-4 h-4" />
                    <span>Go to Dashboard</span>
                  </a>
                </div>

                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#EAEAEA] mb-4">
                    Account Management
                  </h3>
                  <p className="text-[#EAEAEA]/70 mb-4">
                    Manage your account settings and security preferences
                  </p>
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-[#1C1F27] border border-[#2A2D3A] text-[#EAEAEA] rounded-lg font-semibold hover:border-[#E53935] transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#EAEAEA] mb-4">
                    Sign In
                  </h3>
                  <p className="text-[#EAEAEA]/70 mb-4">
                    Access your account with email/password or social login
                  </p>
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#00E5FF] to-[#0066CC] text-white rounded-lg font-semibold hover:scale-105 transition-transform"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                </div>

                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#EAEAEA] mb-4">
                    Create Account
                  </h3>
                  <p className="text-[#EAEAEA]/70 mb-4">
                    Join NaniTech and start building amazing projects
                  </p>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#E53935] to-[#FF6B6B] text-white rounded-lg font-semibold hover:scale-105 transition-transform"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Features List */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#EAEAEA] mb-6 font-orbitron text-center">
              Authentication Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card rounded-xl p-6 text-center">
                <Shield className="w-12 h-12 text-[#00E5FF] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#EAEAEA] mb-2">
                  Two-Factor Authentication
                </h3>
                <p className="text-[#EAEAEA]/70 text-sm">
                  TOTP-based 2FA with QR codes and backup codes for enhanced security
                </p>
              </div>

              <div className="glass-card rounded-xl p-6 text-center">
                <User className="w-12 h-12 text-[#E53935] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#EAEAEA] mb-2">
                  Social Login
                </h3>
                <p className="text-[#EAEAEA]/70 text-sm">
                  One-click authentication with Google, GitHub, and Microsoft
                </p>
              </div>

              <div className="glass-card rounded-xl p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#EAEAEA] mb-2">
                  Secure Sessions
                </h3>
                <p className="text-[#EAEAEA]/70 text-sm">
                  Protected routes and session management with automatic refresh
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export default AuthDemo;
