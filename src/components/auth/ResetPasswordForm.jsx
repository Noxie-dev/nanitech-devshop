import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Mail, 
  ArrowLeft,
  AlertCircle,
  Loader2,
  CheckCircle
} from 'lucide-react';

const ResetPasswordForm = ({ onSuccess, onSwitchToLogin }) => {
  const { resetPassword, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { data, error } = await resetPassword(email);
    
    if (error) {
      setError(error.message);
    } else if (data) {
      setSuccess(true);
    }
    
    setIsLoading(false);
  };

  if (success) {
    return (
      <motion.div
        className="w-full max-w-md mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#EAEAEA] mb-4 font-orbitron">
            Check Your Email
          </h2>
          <p className="text-[#EAEAEA]/70 mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-[#EAEAEA]/50 mb-6">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <button
            onClick={onSwitchToLogin}
            className="w-full py-3 bg-gradient-to-r from-[#00E5FF] to-[#0066CC] text-white rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            Back to Sign In
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-card rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#EAEAEA] mb-2 font-orbitron">
            Reset Password
          </h2>
          <p className="text-[#EAEAEA]/70">
            Enter your email address and we'll send you a reset link
          </p>
        </div>

        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-400 text-sm">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#EAEAEA]/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#1C1F27] border border-[#2A2D3A] rounded-lg text-[#EAEAEA] placeholder-[#EAEAEA]/40 focus:border-[#00E5FF] focus:outline-none transition-colors"
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || loading}
            className="w-full py-3 bg-gradient-to-r from-[#00E5FF] to-[#0066CC] text-white rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading || loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending reset link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onSwitchToLogin}
            className="flex items-center justify-center gap-2 text-[#EAEAEA]/70 hover:text-[#00E5FF] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResetPasswordForm;
