import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Building, 
  MessageSquare,
  DollarSign,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { bookingsAPI } from '../lib/supabase';

const BookingSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    projectDescription: '',
    preferredDate: '',
    preferredTime: '',
    budgetRange: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const serviceTypes = [
    'Web Development',
    'Mobile App Development',
    'AI Integration',
    'Cloud Solutions',
    'Data Engineering',
    'Cybersecurity',
    'Full-Stack Development',
    'Consultation'
  ];

  const budgetRanges = [
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000 - $100,000',
    '$100,000+'
  ];

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM'
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
      // const { data, error } = await bookingsAPI.create(formData);
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        serviceType: '',
        projectDescription: '',
        preferredDate: '',
        preferredTime: '',
        budgetRange: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-orbitron gradient-text-cyan">
            Book a Demo
          </h2>
          <p className="text-xl text-[#EAEAEA]/70 max-w-3xl mx-auto">
            Ready to transform your ideas into reality? Schedule a consultation with our experts 
            and discover how we can bring your vision to life.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Booking Form */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 font-orbitron gradient-text-red">
                Schedule Your Consultation
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#EAEAEA]/70 mb-2 text-sm font-medium">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#1C1F27]/50 border border-[#00E5FF]/20 rounded-lg focus:border-[#00E5FF]/50 focus:outline-none transition-colors text-[#EAEAEA]"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-[#EAEAEA]/70 mb-2 text-sm font-medium">
                      <Building className="w-4 h-4 inline mr-2" />
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#1C1F27]/50 border border-[#00E5FF]/20 rounded-lg focus:border-[#00E5FF]/50 focus:outline-none transition-colors text-[#EAEAEA]"
                      placeholder="Your Company"
                    />
                  </div>
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-[#EAEAEA]/70 mb-2 text-sm font-medium">
                    Service Type *
                  </label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[#1C1F27]/50 border border-[#00E5FF]/20 rounded-lg focus:border-[#00E5FF]/50 focus:outline-none transition-colors text-[#EAEAEA]"
                  >
                    <option value="">Select a service</option>
                    {serviceTypes.map((service, idx) => (
                      <option key={idx} value={service}>{service}</option>
                    ))}
                  </select>
                </div>

                {/* Budget Range */}
                <div>
                  <label className="block text-[#EAEAEA]/70 mb-2 text-sm font-medium">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Budget Range
                  </label>
                  <select
                    name="budgetRange"
                    value={formData.budgetRange}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#1C1F27]/50 border border-[#00E5FF]/20 rounded-lg focus:border-[#00E5FF]/50 focus:outline-none transition-colors text-[#EAEAEA]"
                  >
                    <option value="">Select budget range</option>
                    {budgetRanges.map((range, idx) => (
                      <option key={idx} value={range}>{range}</option>
                    ))}
                  </select>
                </div>

                {/* Preferred Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#EAEAEA]/70 mb-2 text-sm font-medium">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 bg-[#1C1F27]/50 border border-[#00E5FF]/20 rounded-lg focus:border-[#00E5FF]/50 focus:outline-none transition-colors text-[#EAEAEA]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#EAEAEA]/70 mb-2 text-sm font-medium">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Preferred Time
                    </label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#1C1F27]/50 border border-[#00E5FF]/20 rounded-lg focus:border-[#00E5FF]/50 focus:outline-none transition-colors text-[#EAEAEA]"
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((time, idx) => (
                        <option key={idx} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Project Description */}
                <div>
                  <label className="block text-[#EAEAEA]/70 mb-2 text-sm font-medium">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Project Description *
                  </label>
                  <textarea
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-[#1C1F27]/50 border border-[#00E5FF]/20 rounded-lg focus:border-[#00E5FF]/50 focus:outline-none transition-colors text-[#EAEAEA] resize-none"
                    placeholder="Tell us about your project, goals, and requirements..."
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 btn-secondary rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? 'Scheduling...' : 'Schedule Demo'}
                </motion.button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <motion.div
                    className="flex items-center gap-2 text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg p-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Demo scheduled successfully! We'll contact you soon.</span>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span>Something went wrong. Please try again.</span>
                  </motion.div>
                )}
              </form>
            </motion.div>

            {/* Information Panel */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* What to Expect */}
              <div className="glass-card rounded-xl p-6">
                <h4 className="text-xl font-semibold mb-4 font-orbitron gradient-text-cyan">
                  What to Expect
                </h4>
                <ul className="space-y-3 text-[#EAEAEA]/70">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#00E5FF] rounded-full mt-2 flex-shrink-0"></div>
                    <span>30-minute consultation with our technical experts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#00E5FF] rounded-full mt-2 flex-shrink-0"></div>
                    <span>Project scope and requirements analysis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#00E5FF] rounded-full mt-2 flex-shrink-0"></div>
                    <span>Technology recommendations and roadmap</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#00E5FF] rounded-full mt-2 flex-shrink-0"></div>
                    <span>Timeline and budget estimation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#00E5FF] rounded-full mt-2 flex-shrink-0"></div>
                    <span>Next steps and proposal outline</span>
                  </li>
                </ul>
              </div>

              {/* Contact Information */}
              <div className="glass-card rounded-xl p-6">
                <h4 className="text-xl font-semibold mb-4 font-orbitron gradient-text-red">
                  Get in Touch
                </h4>
                <div className="space-y-4 text-[#EAEAEA]/70">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#00E5FF]" />
                    <span>hello@nanitech.dev</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#00E5FF]" />
                    <span>+27 123 456 789</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#00E5FF]" />
                    <span>Mon-Fri: 9:00 AM - 6:00 PM (SAST)</span>
                  </div>
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="glass-card rounded-xl p-6">
                <h4 className="text-xl font-semibold mb-4 font-orbitron gradient-text-cyan">
                  Why Choose NANI TECH?
                </h4>
                <div className="space-y-3 text-[#EAEAEA]/70">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>5+ years of industry experience</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>AI-first development approach</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>100% client satisfaction rate</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Agile development methodology</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;

