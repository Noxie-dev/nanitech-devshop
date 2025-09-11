import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MeetTheTeam from '../components/MeetTheTeam';
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
  Rocket,
  CheckCircle,
  ArrowRight,
  Clock,
  Users,
  Award,
  Target,
  Lightbulb,
  Settings,
  Play,
  Star,
  DollarSign,
  Calendar,
  MessageCircle,
  FileText,
  Palette,
  Database,
  Shield,
  TrendingUp,
  Brain,
  Eye,
  MessageSquare,
  Search,
  Lock,
  Server,
  GitBranch,
  BarChart,
  PieChart,
  Activity,
  Zap as Lightning,
  Building2,
  Heart,
  GraduationCap,
  ShoppingCart,
  Home,
  Truck,
  CreditCard,
  Stethoscope,
  BookOpen,
  Briefcase
} from 'lucide-react';

const ServicesPage = () => {
  const [activeService, setActiveService] = useState(0);

  const services = [
    { 
      icon: <Monitor className="w-8 h-8" />, 
      title: "Full-Stack Web Development", 
      description: "Enterprise-grade web solutions built for performance, scalability, and exceptional user experience.",
      features: ["React, Next.js, Vue.js with TypeScript", "Node.js, Python, PostgreSQL", "Performance Optimization", "Security First Approach"],
      color: "from-[#00E5FF] to-[#0066CC]",
      details: {
        description: "We create stunning, responsive web applications that deliver exceptional user experiences. Our web development services cover everything from simple landing pages to complex enterprise applications.",
        technologies: ["React", "Next.js", "Vue.js", "TypeScript", "Node.js", "Python", "PostgreSQL", "MongoDB"],
        deliverables: ["Progressive Web Apps", "E-commerce Platforms", "Content Management Systems", "API Development", "Security Implementation"],
        timeline: "2-8 weeks",
        startingPrice: "R44,000",
        specializedSolutions: [
          "Progressive Web Apps (PWAs) – Native app experience with web accessibility",
          "E-commerce Platforms – Custom shopping experiences with payment gateway integration", 
          "Content Management Systems – Headless CMS solutions for flexible content delivery",
          "API Development & Integration – RESTful and GraphQL APIs with comprehensive documentation"
        ]
      }
    },
    { 
      icon: <Smartphone className="w-8 h-8" />, 
      title: "Mobile App Development", 
      description: "Native and cross-platform mobile solutions that deliver seamless user experiences.",
      features: ["React Native & Flutter", "Native iOS/Android", "App Store Optimization", "Real-time Integration"],
      color: "from-[#E53935] to-[#FF6B6B]",
      details: {
        description: "Transform your ideas into powerful mobile applications. We develop both native and cross-platform apps that provide seamless user experiences across all devices.",
        technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Java", "Objective-C", "Firebase", "Expo"],
        deliverables: ["iOS App", "Android App", "App Store Deployment", "Push Notifications", "Offline Functionality"],
        timeline: "4-12 weeks",
        startingPrice: "R88,000",
        specializedSolutions: [
          "Cross-Platform Excellence – React Native and Flutter for faster time-to-market",
          "Native Performance – iOS (Swift) and Android (Kotlin) for platform-specific optimization",
          "Backend Integration – Real-time data synchronization and offline functionality",
          "App Store Success – ASO optimization and submission support"
        ]
      }
    },
    { 
      icon: <Cloud className="w-8 h-8" />, 
      title: "Cloud Infrastructure & DevOps", 
      description: "Scalable, secure, and cost-effective cloud solutions that grow with your business.",
      features: ["AWS/Azure/GCP", "Docker/Kubernetes", "CI/CD Pipelines", "Infrastructure as Code"],
      color: "from-[#00E5FF] to-[#14273D]",
      details: {
        description: "Leverage the power of cloud computing with our comprehensive cloud solutions. We help you migrate, optimize, and scale your applications in the cloud.",
        technologies: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Terraform", "Jenkins", "GitLab CI"],
        deliverables: ["Cloud Migration", "Infrastructure Setup", "Auto-scaling", "Monitoring & Logging", "Backup & Recovery"],
        timeline: "2-6 weeks",
        startingPrice: "R53,000",
        specializedSolutions: [
          "Multi-Cloud Expertise – AWS, Azure, Google Cloud Platform deployment and management",
          "Containerization – Docker and Kubernetes for consistent, scalable deployments",
          "Serverless Architecture – Lambda functions and microservices for optimal cost efficiency",
          "Database Management – Cloud-native databases with automated backups and scaling"
        ]
      }
    },
    { 
      icon: <Layers className="w-8 h-8" />, 
      title: "SaaS Platform Development", 
      description: "Complete SaaS solutions from concept to market-ready product with AI-enhanced capabilities.",
      features: ["Multi-Tenant Architecture", "Subscription Management", "AI Integration", "White-Label Solutions"],
      color: "from-[#E53935] to-[#0066CC]",
      details: {
        description: "Build the next generation of SaaS applications with our comprehensive development services. From MVP to enterprise-scale solutions with AI-powered features.",
        technologies: ["React", "Node.js", "PostgreSQL", "Redis", "Stripe", "SendGrid", "AWS", "Docker"],
        deliverables: ["Multi-tenant Architecture", "User Management", "Payment Integration", "API Development", "Admin Dashboard"],
        timeline: "8-16 weeks",
        startingPrice: "R177,000",
        specializedSolutions: [
          "Multi-Tenant Design – Secure data isolation with shared infrastructure efficiency",
          "Subscription Management – Flexible billing, usage tracking, and payment processing",
          "AI-Enhanced Capabilities – Smart automation, predictive analytics, and intelligent recommendations",
          "White-Label Solutions – Customizable branding for enterprise clients"
        ]
      }
    },
    { 
      icon: <BarChart3 className="w-8 h-8" />, 
      title: "Business Intelligence Dashboards", 
      description: "Transform raw data into actionable insights with intuitive, powerful dashboards.",
      features: ["Real-Time Analytics", "Interactive Visualizations", "Predictive Modeling", "Custom KPI Tracking"],
      color: "from-[#00E5FF] to-[#E53935]",
      details: {
        description: "Create powerful data visualization dashboards that turn complex data into actionable insights. Perfect for business intelligence and analytics.",
        technologies: ["React", "D3.js", "Chart.js", "Python", "Pandas", "PostgreSQL", "Redis", "WebSocket"],
        deliverables: ["Interactive Charts", "Real-time Updates", "Custom Filters", "Export Functionality", "Responsive Design"],
        timeline: "3-8 weeks",
        startingPrice: "R71,000",
        specializedSolutions: [
          "Real-Time Analytics – Live data streaming with sub-second updates",
          "Interactive Charts – D3.js, Chart.js, and custom visualizations",
          "Predictive Modeling – Machine learning algorithms for forecasting",
          "Data Integration – Multiple data sources with automated ETL processes"
        ]
      }
    },
    { 
      icon: <Cpu className="w-8 h-8" />, 
      title: "AI & Machine Learning Solutions", 
      description: "Integrate intelligent features that automate processes and enhance user experiences.",
      features: ["Predictive Analytics", "Natural Language Processing", "Computer Vision", "Custom Model Development"],
      color: "from-[#FF6B6B] to-[#00E5FF]",
      details: {
        description: "Integrate cutting-edge AI and machine learning capabilities into your applications. From chatbots to predictive analytics, we make your apps intelligent.",
        technologies: ["Python", "TensorFlow", "PyTorch", "OpenAI API", "Hugging Face", "scikit-learn", "Pandas", "NumPy"],
        deliverables: ["AI Model Development", "API Integration", "Data Processing", "Model Training", "Performance Optimization"],
        timeline: "4-12 weeks",
        startingPrice: "R106,000",
        specializedSolutions: [
          "Machine Learning Applications – Predictive analytics, recommendation engines, fraud detection",
          "Natural Language Processing – Intelligent chatbots, sentiment analysis, content generation",
          "Computer Vision Solutions – Image recognition, video analytics, augmented reality",
          "Implementation & Integration – Custom algorithms with seamless system integration"
        ]
      }
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Discovery & Strategy",
      description: "Deep dive into your business goals, user needs, and technical requirements to create a comprehensive project roadmap.",
      icon: <Lightbulb className="w-6 h-6" />,
      duration: "1-2 weeks"
    },
    {
      step: "02", 
      title: "Design & Architecture",
      description: "Create user-centric designs and robust system architecture that balances functionality with scalability.",
      icon: <Palette className="w-6 h-6" />,
      duration: "2-3 weeks"
    },
    {
      step: "03",
      title: "Agile Development",
      description: "Build your solution using agile methodologies with regular demos and feedback cycles for optimal results.",
      icon: <Code2 className="w-6 h-6" />,
      duration: "4-12 weeks"
    },
    {
      step: "04",
      title: "Testing & Quality Assurance",
      description: "Comprehensive testing including unit tests, integration tests, and user acceptance testing to ensure reliability.",
      icon: <Shield className="w-6 h-6" />,
      duration: "1-2 weeks"
    },
    {
      step: "05",
      title: "Deployment & Launch",
      description: "Smooth deployment with monitoring, performance optimization, and user onboarding support.",
      icon: <Rocket className="w-6 h-6" />,
      duration: "1 week"
    },
    {
      step: "06",
      title: "Ongoing Support & Growth",
      description: "Continuous monitoring, updates, and feature enhancements to support your business evolution.",
      icon: <Settings className="w-6 h-6" />,
      duration: "Ongoing"
    }
  ];

  const industries = [
    { name: "FinTech", icon: <CreditCard className="w-6 h-6" />, description: "Trading platforms, payment systems" },
    { name: "HealthTech", icon: <Stethoscope className="w-6 h-6" />, description: "Patient management, telemedicine" },
    { name: "E-commerce", icon: <ShoppingCart className="w-6 h-6" />, description: "Marketplaces, inventory management" },
    { name: "EdTech", icon: <GraduationCap className="w-6 h-6" />, description: "Learning management systems" },
    { name: "PropTech", icon: <Home className="w-6 h-6" />, description: "Property management, analytics" },
    { name: "Logistics", icon: <Truck className="w-6 h-6" />, description: "Supply chain optimization" }
  ];

  const whyChooseUs = [
    {
      title: "Technical Excellence",
      icon: <Award className="w-8 h-8" />,
      points: [
        "10+ years of combined experience in full-stack development",
        "Certified cloud architects and AI specialists", 
        "Proven track record with 100+ successful projects"
      ],
      color: "from-[#00E5FF] to-[#0066CC]"
    },
    {
      title: "Business Focus",
      icon: <Target className="w-8 h-8" />,
      points: [
        "ROI-driven development approach",
        "Agile methodology with transparent communication",
        "Post-launch support and continuous optimization"
      ],
      color: "from-[#E53935] to-[#FF6B6B]"
    },
    {
      title: "Innovation Leadership",
      icon: <Brain className="w-8 h-8" />,
      points: [
        "Early adopters of cutting-edge technologies",
        "Custom AI/ML solutions tailored to your needs",
        "Future-proof architecture that evolves with trends"
      ],
      color: "from-[#00E5FF] to-[#E53935]"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "R44,000",
      period: "project",
      description: "Perfect for small projects and MVPs",
      features: [
        "Up to 5 pages",
        "Responsive design",
        "Basic SEO",
        "1 month support",
        "Source code included"
      ],
      color: "from-[#00E5FF] to-[#0066CC]",
      popular: false
    },
    {
      name: "Professional",
      price: "R133,000",
      period: "project", 
      description: "Ideal for growing businesses",
      features: [
        "Up to 15 pages",
        "Custom functionality",
        "Advanced SEO",
        "3 months support",
        "Performance optimization",
        "Analytics integration"
      ],
      color: "from-[#E53935] to-[#FF6B6B]",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "quote",
      description: "For large-scale applications",
      features: [
        "Unlimited pages",
        "Custom architecture",
        "Advanced integrations",
        "6 months support",
        "Dedicated team",
        "Priority support"
      ],
      color: "from-[#00E5FF] to-[#E53935]",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#0C0F16] text-[#EAEAEA]">
      {/* Hero Section */}
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

      {/* Services Overview */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron gradient-text-cyan">
              🌐 Our Core Services
            </h2>
            <p className="text-xl text-[#EAEAEA]/70 max-w-4xl mx-auto">
              From concept to deployment, we provide end-to-end development services 
              that bring your vision to life with cutting-edge technology and AI-powered innovation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                className="group relative cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => setActiveService(idx)}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${service.color} rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`}></div>
                
                <div className={`relative glass-card rounded-xl p-8 h-full transition-all duration-300 group-hover:border-[#00E5FF]/50 ${activeService === idx ? 'border-[#00E5FF]/50' : ''}`}>
                  <div className={`inline-flex p-4 rounded-lg bg-gradient-to-r ${service.color} mb-6`}>
                    <div className="text-white">
                      {service.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-4 text-[#EAEAEA] font-orbitron">
                    {service.title}
                  </h3>
                  <p className="text-[#EAEAEA]/70 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-center text-sm text-[#EAEAEA]/60">
                        <CheckCircle className="w-4 h-4 text-[#00E5FF] mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#EAEAEA]/60">Starting from</span>
                    <span className="text-[#00E5FF] font-semibold">{service.details.startingPrice}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-20 bg-[#0A0D14]">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <div className={`inline-flex p-4 rounded-lg bg-gradient-to-r ${services[activeService].color} mb-6`}>
                  <div className="text-white">
                    {services[activeService].icon}
                  </div>
                </div>
                
                <h3 className="text-4xl font-bold mb-6 font-orbitron text-[#EAEAEA]">
                  {services[activeService].title}
                </h3>
                
                <p className="text-lg text-[#EAEAEA]/80 mb-8 leading-relaxed">
                  {services[activeService].details.description}
                </p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="glass-card p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Clock className="w-5 h-5 text-[#00E5FF] mr-2" />
                      <span className="text-sm font-semibold text-[#EAEAEA]">Timeline</span>
                    </div>
                    <p className="text-[#EAEAEA]/70">{services[activeService].details.timeline}</p>
                  </div>
                  
                  <div className="glass-card p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <DollarSign className="w-5 h-5 text-[#E53935] mr-2" />
                      <span className="text-sm font-semibold text-[#EAEAEA]">Starting Price</span>
                    </div>
                    <p className="text-[#EAEAEA]/70">{services[activeService].details.startingPrice}</p>
                  </div>
                </div>

                <button className="px-8 py-4 bg-gradient-to-r from-[#00E5FF] to-[#0066CC] text-white rounded-lg font-semibold hover:scale-105 transition-transform">
                  Get Detailed Quote
                </button>
              </div>

              <div className="space-y-6">
                <div className="glass-card p-6 rounded-lg">
                  <h4 className="text-xl font-semibold mb-4 text-[#EAEAEA] flex items-center">
                    <Code2 className="w-5 h-5 text-[#00E5FF] mr-2" />
                    Core Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {services[activeService].details.technologies.map((tech, idx) => (
                      <span key={idx} className="px-3 py-1 bg-[#1C1F27]/50 border border-[#00E5FF]/30 rounded-full text-sm text-[#00E5FF]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6 rounded-lg">
                  <h4 className="text-xl font-semibold mb-4 text-[#EAEAEA] flex items-center">
                    <CheckCircle className="w-5 h-5 text-[#E53935] mr-2" />
                    Key Deliverables
                  </h4>
                  <ul className="space-y-2">
                    {services[activeService].details.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-center text-[#EAEAEA]/70">
                        <div className="w-1.5 h-1.5 bg-[#E53935] rounded-full mr-3"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-card p-6 rounded-lg">
                  <h4 className="text-xl font-semibold mb-4 text-[#EAEAEA] flex items-center">
                    <Star className="w-5 h-5 text-[#00E5FF] mr-2" />
                    Specialized Solutions
                  </h4>
                  <ul className="space-y-3">
                    {services[activeService].details.specializedSolutions.map((solution, idx) => (
                      <li key={idx} className="text-[#EAEAEA]/70 text-sm leading-relaxed">
                        <strong className="text-[#00E5FF]">{solution.split(' – ')[0]}</strong>
                        {solution.includes(' – ') && (
                          <span> – {solution.split(' – ')[1]}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron gradient-text-red">
              🎯 Our Proven Process
            </h2>
            <p className="text-xl text-[#EAEAEA]/70 max-w-4xl mx-auto">
              We follow a proven development process that ensures quality, 
              transparency, and successful project delivery with measurable results.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {processSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="glass-card p-6 rounded-xl h-full">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#00E5FF] to-[#E53935] rounded-lg flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-lg">{step.step}</span>
                      </div>
                      <div className="text-[#00E5FF]">
                        {step.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3 text-[#EAEAEA] font-orbitron">
                      {step.title}
                    </h3>
                    
                    <p className="text-[#EAEAEA]/70 mb-4 leading-relaxed">
                      {step.description}
                    </p>
                    
                    <div className="flex items-center text-sm text-[#00E5FF]">
                      <Clock className="w-4 h-4 mr-2" />
                      {step.duration}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industry Expertise */}
      <section className="py-20 bg-[#0A0D14]">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron gradient-text-cyan">
              💼 Industry Expertise
            </h2>
            <p className="text-xl text-[#EAEAEA]/70 max-w-4xl mx-auto">
              We've successfully delivered solutions across diverse industries, 
              understanding the unique challenges and opportunities in each sector.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {industries.map((industry, idx) => (
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
                  {industry.icon}
                </div>
                <h4 className="font-semibold text-[#EAEAEA] mb-2 text-sm">
                  {industry.name}
                </h4>
                <p className="text-xs text-[#EAEAEA]/60">
                  {industry.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <MeetTheTeam />

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron gradient-text-red">
              🏆 Why Choose Us?
            </h2>
            <p className="text-xl text-[#EAEAEA]/70 max-w-4xl mx-auto">
              Our combination of technical excellence, business focus, and innovation leadership 
              sets us apart in delivering exceptional results for our clients.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {whyChooseUs.map((item, idx) => (
              <motion.div
                key={idx}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="glass-card p-8 rounded-xl h-full text-center">
                  <div className={`inline-flex p-4 rounded-lg bg-gradient-to-r ${item.color} mb-6`}>
                    <div className="text-white">
                      {item.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-6 text-[#EAEAEA] font-orbitron">
                    {item.title}
                  </h3>
                  
                  <ul className="space-y-3 text-left">
                    {item.points.map((point, pointIdx) => (
                      <li key={pointIdx} className="flex items-start text-[#EAEAEA]/70">
                        <CheckCircle className="w-5 h-5 text-[#00E5FF] mr-3 mt-0.5 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-[#0A0D14]">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron gradient-text-cyan">
              💰 Transparent Pricing
            </h2>
            <p className="text-xl text-[#EAEAEA]/70 max-w-4xl mx-auto">
              Choose the perfect plan for your project. All plans include our commitment 
              to quality, ongoing support, and measurable ROI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, idx) => (
              <motion.div
                key={idx}
                className={`relative ${plan.popular ? 'scale-105' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#00E5FF] to-[#E53935] text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className={`glass-card p-8 rounded-xl h-full ${plan.popular ? 'border-[#00E5FF]/50' : ''}`}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2 text-[#EAEAEA] font-orbitron">
                      {plan.name}
                    </h3>
                    <p className="text-[#EAEAEA]/70 mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-[#EAEAEA]">{plan.price}</span>
                      <span className="text-[#EAEAEA]/60 ml-2">/{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-center text-[#EAEAEA]/70">
                        <CheckCircle className="w-5 h-5 text-[#00E5FF] mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-4 rounded-lg font-semibold transition-all ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-[#00E5FF] to-[#0066CC] text-white hover:scale-105' 
                      : 'border border-[#00E5FF] text-[#00E5FF] hover:bg-[#00E5FF]/10'
                  }`}>
                    {plan.name === 'Enterprise' ? 'Contact Us' : 'Get Started'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="relative glass-card rounded-2xl p-12 text-center max-w-5xl mx-auto"
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
                <Rocket className="w-12 h-12 text-white" />
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron">
                <span className="gradient-text-cyan">🚀 Ready to Transform</span>{" "}
                <span className="gradient-text-red">Your Business?</span>
              </h2>
              
              <p className="text-xl text-[#EAEAEA]/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                Let's discuss how we can bring your vision to life with powerful, scalable technology solutions. 
                Your success is our mission. Let's build something extraordinary together.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-[#00E5FF] to-[#0066CC] text-white rounded-lg font-semibold hover:scale-105 transition-transform flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Schedule Free Consultation
                </button>
                <button className="px-8 py-4 border border-[#E53935] text-[#E53935] rounded-lg font-semibold hover:bg-[#E53935]/10 transition-colors flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Request Detailed Quote
                </button>
                <button className="px-8 py-4 border border-[#00E5FF] text-[#00E5FF] rounded-lg font-semibold hover:bg-[#00E5FF]/10 transition-colors flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  View Portfolio
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;