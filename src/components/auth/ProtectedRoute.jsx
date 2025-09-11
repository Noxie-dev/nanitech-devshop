import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Shield, Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, require2FA = false }) => {
  const { user, loading, is2FAEnabled, is2FAVerified } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C0F16] flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-[#00E5FF]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-8 h-8 text-[#00E5FF] animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-[#EAEAEA] mb-2">
            Loading...
          </h2>
          <p className="text-[#EAEAEA]/70">
            Please wait while we verify your access
          </p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0C0F16] flex items-center justify-center">
        <motion.div
          className="text-center max-w-md mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#EAEAEA] mb-4 font-orbitron">
            Access Denied
          </h2>
          <p className="text-[#EAEAEA]/70 mb-6">
            You need to be signed in to access this page. Please sign in to continue.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-8 py-3 bg-gradient-to-r from-[#00E5FF] to-[#0066CC] text-white rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  if (require2FA && is2FAEnabled && !is2FAVerified) {
    return (
      <div className="min-h-screen bg-[#0C0F16] flex items-center justify-center">
        <motion.div
          className="text-center max-w-md mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#EAEAEA] mb-4 font-orbitron">
            Two-Factor Authentication Required
          </h2>
          <p className="text-[#EAEAEA]/70 mb-6">
            This page requires two-factor authentication. Please complete 2FA verification to continue.
          </p>
          <button
            onClick={() => window.location.href = '/verify-2fa'}
            className="px-8 py-3 bg-gradient-to-r from-[#00E5FF] to-[#0066CC] text-white rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            Verify 2FA
          </button>
        </motion.div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
