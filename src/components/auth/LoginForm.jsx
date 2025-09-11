import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Github, 
  Chrome, 
  AlertCircle,
  Loader2
} from 'lucide-react';

const LoginForm = ({ onSuccess, onSwitchToRegister, onSwitchToReset }) => {
  const { signIn, signInWithProvider, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { data, error } = await signIn(formData.email, formData.password);
    
    if (error) {
      setError(error.message);
    } else if (data?.user) {
      onSuccess?.();
    }
    
    setIsLoading(false);
  };

  const handleProviderLogin = async (provider) => {
    setIsLoading(true);
    setError('');

    const { data, error } = await signInWithProvider(provider);
    
    if (error) {
      setError(error.message);
    }
    
    setIsLoading(false);
  };

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
            Welcome Back
          </h2>
          <p className="text-[#EAEAEA]/70">
            Sign in to your NaniTech account
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
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#1C1F27] border border-[#2A2D3A] rounded-lg text-[#EAEAEA] placeholder-[#EAEAEA]/40 focus:border-[#00E5FF] focus:outline-none transition-colors"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#EAEAEA]/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-12 py-3 bg-[#1C1F27] border border-[#2A2D3A] rounded-lg text-[#EAEAEA] placeholder-[#EAEAEA]/40 focus:border-[#00E5FF] focus:outline-none transition-colors"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#EAEAEA]/40 hover:text-[#EAEAEA] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#00E5FF] bg-[#1C1F27] border-[#2A2D3A] rounded focus:ring-[#00E5FF] focus:ring-2"
              />
              <span className="ml-2 text-sm text-[#EAEAEA]/70">Remember me</span>
            </label>
            <button
              type="button"
              onClick={onSwitchToReset}
              className="text-sm text-[#00E5FF] hover:text-[#00E5FF]/80 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || loading}
            className="w-full py-3 bg-gradient-to-r from-[#00E5FF] to-[#0066CC] text-white rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading || loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2A2D3A]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#0C0F16] text-[#EAEAEA]/40">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <button
              onClick={() => handleProviderLogin('google')}
              disabled={isLoading || loading}
              className="w-full py-3 px-4 bg-[#1C1F27] border border-[#2A2D3A] rounded-lg text-[#EAEAEA] hover:border-[#00E5FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Chrome className="w-5 h-5" />
              Google
            </button>
            {/* GitHub OAuth temporarily disabled - enable in Supabase Dashboard first */}
            <button
              onClick={() => handleProviderLogin('github')}
              disabled={true}
              className="w-full py-3 px-4 bg-[#1C1F27] border border-[#2A2D3A] rounded-lg text-[#EAEAEA]/40 cursor-not-allowed flex items-center justify-center gap-2"
              title="GitHub OAuth not enabled in Supabase. See GITHUB_OAUTH_SETUP.md for instructions."
            >
              <Github className="w-5 h-5" />
              GitHub (Not Configured)
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <span className="text-[#EAEAEA]/70">Don't have an account? </span>
          <button
            onClick={onSwitchToRegister}
            className="text-[#00E5FF] hover:text-[#00E5FF]/80 transition-colors font-semibold"
          >
            Sign up
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginForm;
