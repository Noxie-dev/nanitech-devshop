import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  ArrowUp,
  Heart
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    services: [
      { name: 'Web Development', href: '#services' },
      { name: 'Mobile Apps', href: '#services' },
      { name: 'AI Integration', href: '#services' },
      { name: 'Cloud Solutions', href: '#services' },
      { name: 'Cybersecurity', href: '#services' },
      { name: 'Data Engineering', href: '#services' }
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Our Team', href: '#about' },
      { name: 'Careers', href: '#contact' },
      { name: 'Blog', href: '#blog' },
      { name: 'Case Studies', href: '#projects' },
      { name: 'Contact', href: '#contact' }
    ],
    resources: [
      { name: 'Documentation', href: '#' },
      { name: 'API Reference', href: '#' },
      { name: 'Support Center', href: '#contact' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' }
    ]
  };

  const socialLinks = [
    {
      name: 'GitHub',
      icon: <Github className="w-5 h-5" />,
      url: 'https://github.com/nanitech',
      color: 'hover:text-[#00E5FF]'
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      url: 'https://linkedin.com/company/nanitech',
      color: 'hover:text-[#00E5FF]'
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      url: 'https://twitter.com/nanitech',
      color: 'hover:text-[#00E5FF]'
    },
    {
      name: 'Website',
      icon: <Globe className="w-5 h-5" />,
      url: 'https://nanitech.dev',
      color: 'hover:text-[#E53935]'
    }
  ];

  return (
    <footer className="relative bg-[#0C0F16] border-t border-[#1C1F27]/50">
      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 p-3 bg-gradient-to-r from-[#00E5FF] to-[#0066CC] rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>

      <div className="container mx-auto px-6 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Company Info */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Logo */}
            <div className="flex items-center space-x-4 mb-6">
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
            </div>

            <p className="text-[#EAEAEA]/70 mb-6 leading-relaxed">
              Transforming ideas into reality with cutting-edge AI-powered solutions. 
              We build the future of technology, one project at a time.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[#EAEAEA]/60">
                <Mail className="w-4 h-4 text-[#00E5FF]" />
                <span>hello@nanitech.dev</span>
              </div>
              <div className="flex items-center gap-3 text-[#EAEAEA]/60">
                <Phone className="w-4 h-4 text-[#00E5FF]" />
                <span>+27 123 456 789</span>
              </div>
              <div className="flex items-center gap-3 text-[#EAEAEA]/60">
                <MapPin className="w-4 h-4 text-[#00E5FF]" />
                <span>Cape Town, South Africa</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 glass-card rounded-lg text-[#EAEAEA]/60 ${social.color} transition-all duration-300`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-[#EAEAEA] mb-6 font-orbitron gradient-text-cyan">
              Services
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link, idx) => (
                <li key={idx}>
                  <motion.a
                    href={link.href}
                    className="text-[#EAEAEA]/60 hover:text-[#00E5FF] transition-colors text-sm"
                    whileHover={{ x: 5 }}
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-[#EAEAEA] mb-6 font-orbitron gradient-text-red">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, idx) => (
                <li key={idx}>
                  <motion.a
                    href={link.href}
                    className="text-[#EAEAEA]/60 hover:text-[#00E5FF] transition-colors text-sm"
                    whileHover={{ x: 5 }}
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-[#EAEAEA] mb-6 font-orbitron gradient-text-cyan">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, idx) => (
                <li key={idx}>
                  <motion.a
                    href={link.href}
                    className="text-[#EAEAEA]/60 hover:text-[#00E5FF] transition-colors text-sm"
                    whileHover={{ x: 5 }}
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Newsletter Signup */}
        <motion.div
          className="glass-card rounded-xl p-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center md:text-left md:flex md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-semibold text-[#EAEAEA] mb-2 font-orbitron">
                Stay Updated with NANI TECH
              </h3>
              <p className="text-[#EAEAEA]/70">
                Get the latest tech insights, project updates, and industry news delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 md:ml-8">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 bg-[#1C1F27]/50 border border-[#00E5FF]/20 rounded-lg focus:border-[#00E5FF]/50 focus:outline-none transition-colors text-[#EAEAEA] min-w-[250px]"
              />
              <motion.button
                className="px-6 py-3 btn-secondary rounded-lg font-semibold whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#1C1F27]/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 text-[#EAEAEA]/50 text-sm mb-4 md:mb-0">
            <span>© 2025 NANI TECH DevShop. Made with</span>
            <Heart className="w-4 h-4 text-[#E53935] fill-current" />
            <span>in Cape Town, South Africa</span>
          </div>
          
          <div className="flex items-center gap-6 text-[#EAEAEA]/50 text-sm">
            <motion.a 
              href="#" 
              className="hover:text-[#00E5FF] transition-colors"
              whileHover={{ y: -2 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a 
              href="#" 
              className="hover:text-[#00E5FF] transition-colors"
              whileHover={{ y: -2 }}
            >
              Terms of Service
            </motion.a>
            <motion.a 
              href="#" 
              className="hover:text-[#00E5FF] transition-colors"
              whileHover={{ y: -2 }}
            >
              Cookie Policy
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-1 h-1 bg-[#00E5FF] rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-10 right-1/3 w-0.5 h-0.5 bg-[#E53935] rounded-full opacity-40 animate-pulse"></div>
      <div className="absolute bottom-10 left-1/3 w-1.5 h-1.5 bg-[#00E5FF] rounded-full opacity-20 animate-pulse"></div>
    </footer>
  );
};

export default Footer;

