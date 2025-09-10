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
          className="text-center max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Animated Logo */}
          <motion.div
            className="mb-12 inline-block"
            animate={{ 
              rotate: [0, 360],
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="relative w-40 h-40 mx-auto">
              {/* Outer glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0066CC] to-[#E53935] rounded-full opacity-20 blur-2xl animate-pulse"></div>
              
              {/* Main logo circle */}
              <div className="relative w-full h-full rounded-full bg-gradient-to-r from-[#0066CC] via-transparent to-[#E53935] p-1">
                <div className="w-full h-full bg-[#0C0F16] rounded-full flex items-center justify-center border border-[#00E5FF]/30">
                  <div className="text-center">
                    <span className="text-[#00E5FF] font-bold text-2xl font-orbitron block">NANI</span>
                    <span className="text-[#E53935] font-bold text-lg font-orbitron block -mt-1">TECH</span>
                  </div>
                </div>
              </div>
              
              {/* Rotating outer ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-dashed border-[#00E5FF]/30"
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>
          
          {/* Main Heading */}
          <motion.h1 
            className="text-7xl md:text-9xl font-bold mb-8 font-orbitron"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="gradient-text-cyan block">
              NANI TECH
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            className="text-3xl md:text-4xl text-[#00E5FF] mb-6 font-light tracking-wider font-orbitron"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            DevShop
          </motion.p>
          
          {/* Tagline */}
          <motion.p 
            className="text-xl md:text-2xl text-[#EAEAEA]/80 mb-16 leading-relaxed max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            We provide cutting-edge software development services,
            <br />transforming ideas into reality with
            <br />
            <span className="gradient-text-red font-semibold">innovative AI-powered solutions</span> and tailored experiences.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.button
              className="group relative px-10 py-4 btn-primary rounded-lg font-semibold text-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Get Started 
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </motion.button>
            
            <motion.button
              className="px-10 py-4 btn-secondary rounded-lg font-semibold text-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Our Work
            </motion.button>
          </motion.div>
          
          {/* Scroll Indicator */}
          <motion.div 
            className="text-[#00E5FF] opacity-60"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 mx-auto" />
            <p className="text-sm mt-2 font-light">Scroll to explore</p>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Additional decorative elements */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-[#00E5FF] rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-1/3 right-20 w-1 h-1 bg-[#E53935] rounded-full opacity-40 animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-[#00E5FF] rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-[#E53935] rounded-full opacity-30 animate-pulse"></div>
    </section>
  );
};

export default HeroSection;

