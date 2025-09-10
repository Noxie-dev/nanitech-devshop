import React from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Smartphone, 
  Cloud, 
  Layers, 
  BarChart3, 
  Cpu,
  Globe,
  Zap,
  Code2,
  Rocket
} from 'lucide-react';

const ServicesSection = () => {
  const services = [
    { 
      icon: <Monitor className="w-8 h-8" />, 
      title: "Web Development", 
      description: "Custom web applications built with cutting-edge technologies and modern frameworks",
      features: ["React/Next.js", "Node.js/Express", "Progressive Web Apps", "E-commerce Solutions"],
      color: "from-[#00E5FF] to-[#0066CC]"
    },
    { 
      icon: <Smartphone className="w-8 h-8" />, 
      title: "Mobile Apps", 
      description: "Native and cross-platform mobile solutions for iOS and Android",
      features: ["React Native", "Flutter", "Native iOS/Android", "App Store Optimization"],
      color: "from-[#E53935] to-[#FF6B6B]"
    },
    { 
      icon: <Cloud className="w-8 h-8" />, 
      title: "Cloud Solutions", 
      description: "Scalable cloud infrastructure and deployment strategies",
      features: ["AWS/Azure/GCP", "Docker/Kubernetes", "CI/CD Pipelines", "Microservices"],
      color: "from-[#00E5FF] to-[#14273D]"
    },
    { 
      icon: <Layers className="w-8 h-8" />, 
      title: "SaaS Development", 
      description: "Modern, intuitive, and innovative SaaS solutions with creative UI design and scalable architecture",
      features: ["Creative UI Design", "Scalable Backend", "Artificial Intelligence", "Multi-tenant Architecture"],
      color: "from-[#E53935] to-[#0066CC]"
    },
    { 
      icon: <BarChart3 className="w-8 h-8" />, 
      title: "Dashboard Development", 
      description: "Advanced analytics dashboards with smart UI and user-friendly experiences",
      features: ["Real-time Analytics", "Interactive Visualizations", "Smart UI/UX", "Data Insights"],
      color: "from-[#00E5FF] to-[#E53935]"
    },
    { 
      icon: <Cpu className="w-8 h-8" />, 
      title: "AI Integration", 
      description: "Machine learning and AI-powered features for your applications",
      features: ["Machine Learning", "Natural Language Processing", "Computer Vision", "Predictive Analytics", "Algorithms"],
      color: "from-[#FF6B6B] to-[#00E5FF]"
    }
  ];

  const platforms = [
    { name: "Web Applications", icon: <Globe className="w-6 h-6" />, description: "Responsive web apps" },
    { name: "Mobile Apps", icon: <Smartphone className="w-6 h-6" />, description: "iOS & Android" },
    { name: "Desktop Software", icon: <Monitor className="w-6 h-6" />, description: "Cross-platform desktop" },
    { name: "Cloud Services", icon: <Cloud className="w-6 h-6" />, description: "Scalable cloud solutions" },
    { name: "AI/ML Systems", icon: <Cpu className="w-6 h-6" />, description: "Intelligent automation" },
    { name: "IoT Solutions", icon: <Zap className="w-6 h-6" />, description: "Connected devices" }
  ];

  return (
    <section id="services" className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Services Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-5xl md:text-6xl font-bold mb-6 font-orbitron"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <span className="gradient-text-cyan">Our Services</span>
          </motion.h2>
          <p className="text-xl text-[#EAEAEA]/70 max-w-3xl mx-auto">
            Cutting-edge solutions for modern challenges. We specialize in transforming ideas into 
            powerful digital experiences with AI at the core.
          </p>
        </motion.div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${service.color} rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`}></div>
              
              {/* Card */}
              <div className="relative glass-card rounded-xl p-8 h-full transition-all duration-300 group-hover:border-[#00E5FF]/50">
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-lg bg-gradient-to-r ${service.color} mb-6`}>
                  <div className="text-white">
                    {service.icon}
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-semibold mb-4 text-[#EAEAEA] font-orbitron">
                  {service.title}
                </h3>
                <p className="text-[#EAEAEA]/70 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-center text-sm text-[#EAEAEA]/60">
                      <div className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {/* Hover effect */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00E5FF] to-[#E53935] rounded-b-xl"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Platforms Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4 font-orbitron gradient-text-red">
            Platforms We Specialize In
          </h3>
          <p className="text-lg text-[#EAEAEA]/70 mb-12">
            From web to mobile, desktop to cloud - we build on every platform
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {platforms.map((platform, idx) => (
              <motion.div
                key={idx}
                className="glass-card rounded-lg p-6 text-center group hover:border-[#E53935]/50 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-[#E53935] mb-3 flex justify-center group-hover:scale-110 transition-transform">
                  {platform.icon}
                </div>
                <h4 className="font-semibold text-[#EAEAEA] mb-2 text-sm">
                  {platform.name}
                </h4>
                <p className="text-xs text-[#EAEAEA]/60">
                  {platform.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Integration Highlight */}
        <motion.div
          className="relative glass-card rounded-2xl p-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/10 to-[#E53935]/10 rounded-2xl blur-xl"></div>
          <div className="relative">
            <motion.div
              className="inline-flex p-6 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#E53935] mb-8"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Cpu className="w-12 h-12 text-white" />
            </motion.div>
            
            <h3 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron">
              <span className="gradient-text-cyan">AI-Powered</span>{" "}
              <span className="gradient-text-red">Innovation</span>
            </h3>
            
            <p className="text-xl text-[#EAEAEA]/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              We don't just build websites and apps - we integrate artificial intelligence 
              to make them smarter, more efficient, and future-ready. From chatbots to 
              predictive analytics, we bring AI to the core of your digital solutions.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {["Machine Learning", "Natural Language Processing", "Computer Vision", "Predictive Analytics"].map((tech, idx) => (
                <motion.span
                  key={idx}
                  className="px-4 py-2 bg-[#1C1F27]/50 border border-[#00E5FF]/30 rounded-full text-sm text-[#00E5FF]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.05, borderColor: "#00E5FF" }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;

