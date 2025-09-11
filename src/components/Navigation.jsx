import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './auth/AuthModal';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Projects', href: '/projects' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Auth Demo', href: '/auth-demo' },
    { name: 'Contact', href: '/contact' }
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleAuthClick = (mode = 'login') => {
    setAuthMode(mode);
    setShowAuthModal(true);
    closeMobileMenu();
  };

  const handleSignOut = async () => {
    await signOut();
    closeMobileMenu();
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#0C0F16]/95 backdrop-blur-xl border-b border-[#00E5FF]/20 shadow-lg shadow-[#00E5FF]/10' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4 cursor-pointer">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
            <img 
              src="/header-logo.png" 
              alt="NaniTeck DevShop Logo" 
              className="w-12 h-12 object-contain"
            />
            <div>
              <span className="text-2xl font-bold font-orbitron text-white">
                NANI<span className="text-[#E53935]">TECH</span>
              </span>
              <span className="text-sm text-[#00E5FF] block -mt-1 font-orbitron">DevShop</span>
            </div>
            </motion.div>
          </Link>
          
          {/* Right side navigation and CTA */}
          <div className="flex items-center space-x-8">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
              {navItems.map((item, idx) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-3 py-2 transition-all duration-300 font-semibold text-base tracking-wide hover:shadow-[0_0_20px_rgba(229,57,53,0.5)] hover:shadow-red-500/50 ${
                    location.pathname === item.href 
                      ? 'text-[#E53935]' 
                      : 'text-[#00E5FF] hover:text-[#E53935]'
                  }`}
                >
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                  </motion.span>
                </Link>
              ))}
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-[#EAEAEA]">
                    <User className="w-4 h-4" />
                    <span className="text-sm">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 px-3 py-2 text-[#EAEAEA]/70 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="flex items-center space-x-1 px-3 py-2 text-[#EAEAEA]/70 hover:text-[#00E5FF] transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm">Sign In</span>
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="px-4 py-2 bg-gradient-to-r from-[#00E5FF] to-[#0066CC] text-white rounded-lg font-semibold text-sm hover:scale-105 transition-transform"
                  >
                    Sign Up
                  </button>
                </div>
              )}
              
              {/* CTA Button */}
              <Link to="/contact">
                <motion.button
                  className="px-6 py-2 btn-primary rounded-lg font-semibold text-sm transition-all duration-300"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.05 }}
                >
                  Book Demo
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-[#00E5FF] p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`md:hidden overflow-hidden ${isMobileMenuOpen ? 'max-h-96' : 'max-h-0'}`}
          initial={false}
          animate={{ 
            maxHeight: isMobileMenuOpen ? 400 : 0,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="py-4 space-y-4 border-t border-[#00E5FF]/20 mt-4">
            {navItems.map((item, idx) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={closeMobileMenu}
                className={`block w-full text-left px-3 py-2 transition-all duration-300 font-semibold text-base tracking-wide hover:shadow-[0_0_20px_rgba(229,57,53,0.5)] hover:shadow-red-500/50 ${
                  location.pathname === item.href 
                    ? 'text-[#E53935]' 
                    : 'text-[#00E5FF] hover:text-[#E53935]'
                }`}
              >
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: isMobileMenuOpen ? 1 : 0,
                    x: isMobileMenuOpen ? 0 : -20
                  }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.name}
                </motion.span>
              </Link>
            ))}
            {/* Mobile Auth Section */}
            <div className="mt-4 pt-4 border-t border-[#00E5FF]/20">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-[#EAEAEA] px-3 py-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-[#EAEAEA]/70 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-[#EAEAEA]/70 hover:text-[#00E5FF] transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm">Sign In</span>
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="w-full px-4 py-3 bg-gradient-to-r from-[#00E5FF] to-[#0066CC] text-white rounded-lg font-semibold text-sm hover:scale-105 transition-transform"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
            
            <Link to="/contact" onClick={closeMobileMenu}>
              <motion.button
                className="w-full mt-4 px-6 py-3 btn-primary rounded-lg font-semibold text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: isMobileMenuOpen ? 1 : 0,
                  y: isMobileMenuOpen ? 0 : 20
                }}
                transition={{ delay: 0.3 }}
              >
                Book Demo
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </nav>
  );
};

export default Navigation;

