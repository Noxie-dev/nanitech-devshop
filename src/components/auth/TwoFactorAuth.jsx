import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Shield, 
  Key, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  QrCode,
  Copy,
  Download
} from 'lucide-react';

const TwoFactorAuth = ({ onSuccess, onCancel }) => {
  const { enable2FA, verify2FA, is2FAEnabled, loading } = useAuth();
  const [step, setStep] = useState('setup'); // 'setup', 'verify', 'success'
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);

  useEffect(() => {
    if (is2FAEnabled) {
      setStep('verify');
    } else {
      setup2FA();
    }
  }, [is2FAEnabled]);

  const setup2FA = async () => {
    setIsLoading(true);
    setError('');

    const { data, error } = await enable2FA();
    
    if (error) {
      setError(error.message);
    } else if (data) {
      setQrCode(data.qr_code);
      setSecret(data.secret);
      setBackupCodes(data.backup_codes || []);
      setStep('verify');
    }
    
    setIsLoading(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { data, error } = await verify2FA(token);
    
    if (error) {
      setError(error.message);
    } else if (data?.success) {
      setStep('success');
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    }
    
    setIsLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const downloadBackupCodes = () => {
    const content = backupCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nani-tech-2fa-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (step === 'setup' || isLoading) {
    return (
      <motion.div
        className="w-full max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-[#00E5FF]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-8 h-8 text-[#00E5FF] animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-[#EAEAEA] mb-4 font-orbitron">
            Setting up 2FA
          </h2>
          <p className="text-[#EAEAEA]/70">
            Please wait while we prepare your two-factor authentication...
          </p>
        </div>
      </motion.div>
    );
  }

  if (step === 'verify') {
    return (
      <motion.div
        className="w-full max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass-card rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#00E5FF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-[#00E5FF]" />
            </div>
            <h2 className="text-2xl font-bold text-[#EAEAEA] mb-2 font-orbitron">
              Enable Two-Factor Authentication
            </h2>
            <p className="text-[#EAEAEA]/70">
              Scan the QR code with your authenticator app
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

          <div className="space-y-6">
            {/* QR Code */}
            <div className="text-center">
              <div className="inline-block p-4 bg-white rounded-lg">
                {qrCode && (
                  <img 
                    src={qrCode} 
                    alt="2FA QR Code" 
                    className="w-48 h-48"
                  />
                )}
              </div>
            </div>

            {/* Secret Key */}
            <div>
              <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
                Secret Key (if you can't scan QR code)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={secret}
                  readOnly
                  className="flex-1 px-3 py-2 bg-[#1C1F27] border border-[#2A2D3A] rounded-lg text-[#EAEAEA] text-sm font-mono"
                />
                <button
                  onClick={() => copyToClipboard(secret)}
                  className="p-2 text-[#EAEAEA]/60 hover:text-[#00E5FF] transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
                  Enter 6-digit code from your app
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#EAEAEA]/40" />
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full pl-10 pr-4 py-3 bg-[#1C1F27] border border-[#2A2D3A] rounded-lg text-[#EAEAEA] placeholder-[#EAEAEA]/40 focus:border-[#00E5FF] focus:outline-none transition-colors text-center text-2xl font-mono tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || token.length !== 6}
                className="w-full py-3 bg-gradient-to-r from-[#00E5FF] to-[#0066CC] text-white rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Enable 2FA'
                )}
              </button>
            </form>

            {/* Backup Codes */}
            {backupCodes.length > 0 && (
              <div className="bg-[#1C1F27]/50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-[#EAEAEA] mb-2">
                  Backup Codes (Save these!)
                </h3>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {backupCodes.map((code, index) => (
                    <div
                      key={index}
                      className="px-2 py-1 bg-[#0C0F16] rounded text-xs font-mono text-[#EAEAEA] text-center"
                    >
                      {code}
                    </div>
                  ))}
                </div>
                <button
                  onClick={downloadBackupCodes}
                  className="flex items-center gap-2 text-xs text-[#00E5FF] hover:text-[#00E5FF]/80 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  Download backup codes
                </button>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-2 px-4 border border-[#2A2D3A] text-[#EAEAEA] rounded-lg hover:border-[#E53935] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (step === 'success') {
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
            2FA Enabled Successfully!
          </h2>
          <p className="text-[#EAEAEA]/70 mb-6">
            Your account is now protected with two-factor authentication.
          </p>
          <div className="animate-pulse">
            <div className="w-8 h-8 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default TwoFactorAuth;
