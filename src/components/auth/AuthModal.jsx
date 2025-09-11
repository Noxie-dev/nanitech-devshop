import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import TwoFactorAuth from './TwoFactorAuth';
import ResetPasswordForm from './ResetPasswordForm';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [show2FA, setShow2FA] = useState(false);

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const handleLoginSuccess = () => {
    setShow2FA(true);
  };

  const handle2FASuccess = () => {
    onClose();
  };

  const handle2FACancel = () => {
    setShow2FA(false);
    setMode('login');
  };

  const handleRegisterSuccess = () => {
    onClose();
  };

  const handleResetSuccess = () => {
    setMode('login');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          className="relative z-10 w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 z-20 w-8 h-8 bg-[#1C1F27] border border-[#2A2D3A] rounded-full flex items-center justify-center text-[#EAEAEA]/60 hover:text-[#EAEAEA] hover:border-[#E53935] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <AnimatePresence mode="wait">
            {show2FA ? (
              <TwoFactorAuth
                key="2fa"
                onSuccess={handle2FASuccess}
                onCancel={handle2FACancel}
              />
            ) : mode === 'login' ? (
              <LoginForm
                key="login"
                onSuccess={handleLoginSuccess}
                onSwitchToRegister={() => handleModeChange('register')}
                onSwitchToReset={() => handleModeChange('reset')}
              />
            ) : mode === 'register' ? (
              <RegisterForm
                key="register"
                onSuccess={handleRegisterSuccess}
                onSwitchToLogin={() => handleModeChange('login')}
              />
            ) : mode === 'reset' ? (
              <ResetPasswordForm
                key="reset"
                onSuccess={handleResetSuccess}
                onSwitchToLogin={() => handleModeChange('login')}
              />
            ) : null}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
