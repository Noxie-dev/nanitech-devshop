import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Award, 
  Target, 
  Lightbulb,
  Code2,
  Rocket,
  Shield,
  Zap
} from 'lucide-react';

const AboutSection = () => {
  const stats = [
    { number: "50+", label: "Projects Completed", icon: <Rocket className="w-6 h-6" /> },
    { number: "5+", label: "Years Experience", icon: <Award className="w-6 h-6" /> },
    { number: "100%", label: "Client Satisfaction", icon: <Target className="w-6 h-6" /> },
    { number: "24/7", label: "Support Available", icon: <Shield className="w-6 h-6" /> }
  ];

  const values = [
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation First",
      description: "We embrace cutting-edge technologies and innovative approaches to solve complex problems and deliver exceptional results."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Client-Centric",
      description: "Your success is our priority. We work closely with clients to understand their vision and exceed expectations."
    },
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "Quality Code",
      description: "We write clean, maintainable, and scalable code following industry best practices and modern development standards."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Agile Delivery",
      description: "Fast, iterative development cycles ensure rapid delivery without compromising on quality or functionality."
    }
  ];


  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-orbitron gradient-text-cyan">
            About NANI TECH
          </h2>
          <p className="text-xl text-[#EAEAEA]/70 max-w-4xl mx-auto leading-relaxed">
            We are a passionate team of developers, designers, and innovators dedicated to 
            transforming ideas into powerful digital solutions. With AI at the core of everything 
            we do, we're building the future of technology.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              className="text-center glass-card rounded-xl p-6 hover:border-[#00E5FF]/50 transition-all duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-[#00E5FF] mb-4 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-[#EAEAEA] mb-2 font-orbitron">
                {stat.number}
              </div>
              <div className="text-[#EAEAEA]/70 text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            className="glass-card rounded-2xl p-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-[#00E5FF] to-[#0066CC] rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold font-orbitron gradient-text-cyan">Our Mission</h3>
            </div>
            <p className="text-[#EAEAEA]/70 leading-relaxed">
              To democratize access to cutting-edge technology by creating innovative, 
              AI-powered solutions that empower businesses to thrive in the digital age. 
              We believe that every idea deserves the best technology to bring it to life.
            </p>
          </motion.div>

          <motion.div
            className="glass-card rounded-2xl p-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-[#E53935] to-[#FF6B6B] rounded-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold font-orbitron gradient-text-red">Our Vision</h3>
            </div>
            <p className="text-[#EAEAEA]/70 leading-relaxed">
              To be the leading force in AI-integrated development, setting new standards 
              for innovation and excellence in the tech industry. We envision a future where 
              intelligent technology seamlessly enhances human potential.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 font-orbitron gradient-text-cyan">
            Our Core Values
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                className="glass-card rounded-xl p-6 text-center hover:border-[#00E5FF]/50 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="text-[#00E5FF] mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h4 className="text-xl font-semibold mb-3 text-[#EAEAEA] font-orbitron">
                  {value.title}
                </h4>
                <p className="text-[#EAEAEA]/70 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>


        {/* CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="glass-card rounded-2xl p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 font-orbitron">
              <span className="gradient-text-cyan">Ready to Work</span>{" "}
              <span className="gradient-text-red">With Us?</span>
            </h3>
            <p className="text-xl text-[#EAEAEA]/70 mb-8 max-w-2xl mx-auto">
              Let's collaborate to bring your vision to life with cutting-edge technology 
              and innovative solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 btn-primary rounded-lg font-semibold text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start a Project
              </motion.button>
              <motion.button
                className="px-8 py-4 btn-secondary rounded-lg font-semibold text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Our Team
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;

