import React from 'react';
import { motion } from 'framer-motion';

const ServicesHero = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/10 via-transparent to-[#E53935]/10"></div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-6xl md:text-7xl font-bold mb-8 font-orbitron"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="gradient-text-cyan">🚀 Our</span>{" "}
            <span className="gradient-text-red">Services</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-[#EAEAEA]/80 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transform your digital vision into reality with <strong>cutting-edge solutions</strong> that drive growth, 
            engage users, and scale seamlessly. We specialize in building powerful web applications, 
            intelligent dashboards, and AI-driven platforms that give your business a competitive edge.
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button className="px-8 py-4 bg-gradient-to-r from-[#00E5FF] to-[#0066CC] text-white rounded-lg font-semibold hover:scale-105 transition-transform">
              Schedule Free Consultation
            </button>
            <button className="px-8 py-4 border border-[#E53935] text-[#E53935] rounded-lg font-semibold hover:bg-[#E53935]/10 transition-colors">
              View Portfolio
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesHero;
