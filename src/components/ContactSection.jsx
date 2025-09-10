import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageSquare,
  User,
  Building,
  CheckCircle,
  AlertCircle,
  Github,
  Linkedin,
  Twitter,
  Globe
} from 'lucide-react';
import { contactAPI } from '../lib/supabase';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      details: "hello@nanitech.dev",
      description: "Send us an email anytime",
      action: "mailto:hello@nanitech.dev"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      details: "+27 123 456 789",
      description: "Mon-Fri from 9am to 6pm",
      action: "tel:+27123456789"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      details: "Cape Town, South Africa",
      description: "Come say hello at our office",
      action: "#"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Working Hours",
      details: "Mon-Fri: 9:00 AM - 6:00 PM",
      description: "SAST (UTC+2)",
      action: "#"
    }
  ];

  const socialLinks = [
    {
      name: "GitHub",
      icon: <Github className="w-5 h-5" />,
      url: "https://github.com/nanitech",
      color: "hover:text-[#00E5FF]"
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      url: "https://linkedin.com/company/nanitech",
      color: "hover:text-[#00E5FF]"
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      url: "https://twitter.com/nanitech",
      color: "hover:text-[#00E5FF]"
    },
    {
      name: "Website",
      icon: <Globe className="w-5 h-5" />,
      url: "https://nanitech.dev",
      color: "hover:text-[#E53935]"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // For demo purposes, we'll simulate the API call
      // In production, this would use the actual Supabase client
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate API call
      // const { data, error } = await contactAPI.create(formData);
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-orbitron gradient-text-cyan">
            Get In Touch
          </h2>
          <p className="text-xl text-[#EAEAEA]/70 max-w-3xl mx-auto">
            Ready to start your next project? We'd love to hear from you. 
            Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <motion.div
              className="lg:col-span-1 space-y-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6 font-orbitron gradient-text-red">
                  Contact Information
                </h3>
                
                <div className="space-y-6">
                  {contactInfo.map((info, idx) => (
                    <motion.div
                      key={idx}
                      className="group"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <motion.a
                        href={info.action}
                        className="flex items-start gap-4 p-4 rounded-lg hover:bg-[#1C1F27]/30 transition-all duration-300 cursor-pointer"
                        whileHover={{ x: 5 }}
                      >
                        <div className="text-[#00E5FF] mt-1 group-hover:scale-110 transition-transform">
                          {info.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#EAEAEA] mb-1">
                            {info.title}
                          </h4>
                          <p className="text-[#00E5FF] font-medium mb-1">
                            {info.details}
                          </p>
                          <p className="text-[#EAEAEA]/60 text-sm">
                            {info.description}
                          </p>
                        </div>
                      </motion.a>
                    </motion.div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="mt-8 pt-8 border-t border-[#1C1F27]">
                  <h4 className="font-semibold text-[#EAEAEA] mb-4">Follow Us</h4>
                  <div className="flex gap-4">
                    {socialLinks.map((social, idx) => (
                      <motion.a
                        key={idx}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 glass-card rounded-lg text-[#EAEAEA]/60 ${social.color} transition-all duration-300`}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Response Promise */}
              <motion.div
                className="glass-card rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-[#00E5FF] to-[#0066CC] rounded-lg">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-[#EAEAEA] font-orbitron">
                    Quick Response
                  </h4>
                </div>
                <p className="text-[#EAEAEA]/70 text-sm leading-relaxed">
                  We typically respond to all inquiries within 24 hours. 
                  For urgent matters, please call us directly.
                </p>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6 font-orbitron gradient-text-cyan">
                  Send us a Message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[#EAEAEA]/70 mb-2 text-sm font-medium">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[#1C1F27]/50 border border-[#00E5FF]/20 rounded-lg focus:border-[#00E5FF]/50 focus:outline-none transition-colors text-[#EAEAEA]"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-[#EAEAEA]/70 mb-2 text-sm font-medium">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[#1C1F27]/50 border border-[#00E5FF]/20 rounded-lg focus:border-[#00E5FF]/50 focus:outline-none transition-colors text-[#EAEAEA]"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-[#EAEAEA]/70 mb-2 text-sm font-medium">
                      <Building className="w-4 h-4 inline mr-2" />
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[#1C1F27]/50 border border-[#00E5FF]/20 rounded-lg focus:border-[#00E5FF]/50 focus:outline-none transition-colors text-[#EAEAEA]"
                      placeholder="Project Inquiry"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[#EAEAEA]/70 mb-2 text-sm font-medium">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-[#1C1F27]/50 border border-[#00E5FF]/20 rounded-lg focus:border-[#00E5FF]/50 focus:outline-none transition-colors text-[#EAEAEA] resize-none"
                      placeholder="Tell us about your project, requirements, or any questions you have..."
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 btn-secondary rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </motion.button>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <motion.div
                      className="flex items-center gap-2 text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg p-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Message sent successfully! We'll get back to you soon.</span>
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div
                      className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle className="w-5 h-5" />
                      <span>Something went wrong. Please try again or contact us directly.</span>
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </div>

        {/* FAQ Section */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 font-orbitron gradient-text-red">
            Frequently Asked Questions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                question: "What's your typical project timeline?",
                answer: "Project timelines vary based on complexity, but most web applications take 4-12 weeks from concept to deployment."
              },
              {
                question: "Do you provide ongoing support?",
                answer: "Yes, we offer comprehensive maintenance and support packages to keep your applications running smoothly."
              },
              {
                question: "Can you work with existing systems?",
                answer: "Absolutely! We specialize in integrating with existing systems and modernizing legacy applications."
              },
              {
                question: "What technologies do you use?",
                answer: "We use modern tech stacks including React, Node.js, Python, cloud platforms, and AI/ML frameworks."
              }
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                className="glass-card rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <h4 className="font-semibold text-[#EAEAEA] mb-3 font-orbitron">
                  {faq.question}
                </h4>
                <p className="text-[#EAEAEA]/70 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;

