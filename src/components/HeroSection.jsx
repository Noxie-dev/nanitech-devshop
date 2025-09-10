import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import CircuitBackground from './CircuitBackground';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Circuit Background */}
      <CircuitBackground />
      
      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Animated Logo */}
          <div className="mb-16 inline-block">
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              {/* Outer glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0066CC] to-[#E53935] rounded-full opacity-30 blur-3xl animate-pulse"></div>
              
              {/* Rotating Frame */}
              <motion.div
                className="absolute w-full h-full border-4 border-[#00E5FF] rounded-full"
                animate={{ 
                  rotate: 360,
                }}
                transition={{ 
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  transformOrigin: "center"
                }}
              >
                {/* Add some visual elements to make rotation visible */}
                <div className="absolute top-0 left-1/2 w-1 h-4 bg-[#00E5FF] transform -translate-x-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-1 h-4 bg-[#E53935] transform -translate-x-1/2"></div>
                <div className="absolute left-0 top-1/2 w-4 h-1 bg-[#00E5FF] transform -translate-y-1/2"></div>
                <div className="absolute right-0 top-1/2 w-4 h-1 bg-[#E53935] transform -translate-y-1/2"></div>
              </motion.div>
              
              {/* Circular Logo Inside */}
              <motion.img 
                src="/header-logo.png" 
                alt="NaniTeck DevShop Logo" 
                className="w-36 h-36 rounded-full object-cover z-10 border-2 border-[#00E5FF]/20"
                animate={{ 
                  rotate: -360,
                }}
                transition={{ 
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  transformOrigin: "center"
                }}
              />
            </div>
          </div>
          
          {/* Hero Text */}
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-8 font-orbitron text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="gradient-text-cyan block drop-shadow-2xl">
              We don't just dev apps,
            </span>
            <span className="gradient-text-red block drop-shadow-2xl">
              we dev innovation.
            </span>
          </motion.h1>
          
          {/* Subheading */}
          <motion.p 
            className="text-xl md:text-2xl text-white/90 mb-16 leading-relaxed max-w-4xl mx-auto font-light drop-shadow-lg text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Bring your web apps to life with AI-powered intelligence that feels natural and works smarter.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              className="group relative px-12 py-5 btn-primary rounded-lg font-semibold text-xl transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Get Started 
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </span>
            </motion.button>
            
            <motion.button
              className="px-12 py-5 btn-secondary rounded-lg font-semibold text-xl transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Our Work
            </motion.button>
          </motion.div>
          
          {/* Scroll Indicator */}
          <motion.div 
            className="text-[#00E5FF] opacity-80"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <ChevronDown className="w-10 h-10 mx-auto drop-shadow-lg" />
            <p className="text-lg mt-3 font-light drop-shadow-lg">Scroll to explore</p>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Additional decorative elements */}
      <div className="absolute top-1/4 left-10 w-3 h-3 bg-[#00E5FF] rounded-full opacity-60 animate-pulse drop-shadow-lg"></div>
      <div className="absolute top-1/3 right-20 w-2 h-2 bg-[#E53935] rounded-full opacity-40 animate-pulse drop-shadow-lg"></div>
      <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-[#00E5FF] rounded-full opacity-50 animate-pulse drop-shadow-lg"></div>
      <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-[#E53935] rounded-full opacity-30 animate-pulse drop-shadow-lg"></div>
    </section>
  );
};

export default HeroSection;

