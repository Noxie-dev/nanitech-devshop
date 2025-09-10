import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, 
  Github, 
  Code2, 
  Smartphone, 
  Globe, 
  Database,
  Brain,
  Gamepad2,
  Play,
  Pause
} from 'lucide-react';

const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSlideshowPaused, setIsSlideshowPaused] = useState(false);

  // Tic-Tac-Toe screenshots array
  const ticTacToeImages = [
    "/TickTechToe-media/Screenshot 2025-09-10 at 17.54.41.png",
    "/TickTechToe-media/Screenshot 2025-09-10 at 17.55.14.png",
    "/TickTechToe-media/Screenshot 2025-09-10 at 17.56.04.png",
    "/TickTechToe-media/Screenshot 2025-09-10 at 17.56.14.png",
    "/TickTechToe-media/Screenshot 2025-09-10 at 17.56.25.png",
    "/TickTechToe-media/Screenshot 2025-09-10 at 17.56.41.png",
    "/TickTechToe-media/Screenshot 2025-09-10 at 17.57.49.png",
    "/TickTechToe-media/Screenshot 2025-09-10 at 18.12.35.png"
  ];

  // Slideshow effect for Tic-Tac-Toe images
  useEffect(() => {
    if (isSlideshowPaused) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === ticTacToeImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000); // 6 seconds interval

    return () => clearInterval(interval);
  }, [ticTacToeImages.length, isSlideshowPaused]);

  // Function to toggle slideshow pause/play
  const toggleSlideshow = () => {
    setIsSlideshowPaused(!isSlideshowPaused);
  };

  const categories = [
    { id: 'all', name: 'All Projects', icon: <Code2 className="w-4 h-4" /> },
    { id: 'web', name: 'Web Apps', icon: <Globe className="w-4 h-4" /> },
    { id: 'mobile', name: 'Mobile', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'ai', name: 'AI/ML', icon: <Brain className="w-4 h-4" /> },
    { id: 'gaming', name: 'Gaming', icon: <Gamepad2 className="w-4 h-4" /> }
  ];

  const projects = [
    {
      id: 1,
      title: "QuantumCore OS",
      category: "web",
      description: "Next-generation operating system interface built with React and Electron",
      image: "/api/placeholder/400/300",
      technologies: ["React", "Electron", "TypeScript", "Rust"],
      status: "Completed",
      demoUrl: "#",
      githubUrl: "#",
      featured: true
    },
    {
      id: 2,
      title: "NeuralNet Analytics",
      category: "ai",
      description: "AI-powered analytics platform for real-time data insights",
      image: "/api/placeholder/400/300",
      technologies: ["Python", "TensorFlow", "React", "FastAPI"],
      status: "In Progress",
      demoUrl: "#",
      githubUrl: "#",
      featured: true
    },
    {
      id: 3,
      title: "CryptoVault Pro",
      category: "gaming",
      description: "Secure cryptocurrency wallet with advanced trading features",
      image: "/api/placeholder/400/300",
      technologies: ["Solidity", "Web3.js", "React", "Node.js"],
      status: "Completed",
      demoUrl: "#",
      githubUrl: "#",
      featured: false
    },
    {
      id: 4,
      title: "CloudScale Enterprise",
      category: "web",
      description: "Scalable SaaS platform for enterprise resource management",
      image: "/api/placeholder/400/300",
      technologies: ["Next.js", "PostgreSQL", "AWS", "Docker"],
      status: "Completed",
      demoUrl: "#",
      githubUrl: "#",
      featured: false
    },
    {
      id: 5,
      title: "MobileFirst Banking",
      category: "mobile",
      description: "Revolutionary mobile banking app with biometric security",
      image: "/api/placeholder/400/300",
      technologies: ["React Native", "Node.js", "MongoDB", "Stripe"],
      status: "Completed",
      demoUrl: "#",
      githubUrl: "#",
      featured: true
    },
    {
      id: 6,
      title: "SmartHome IoT Hub",
      category: "ai",
      description: "AI-driven home automation system with voice control",
      image: "/api/placeholder/400/300",
      technologies: ["Python", "Raspberry Pi", "TensorFlow", "MQTT"],
      status: "In Progress",
      demoUrl: "#",
      githubUrl: "#",
      featured: false
    },
    {
      id: 7,
      title: "Tic-Tac-Toe AI",
      category: "gaming",
      description: "Modern Tic-Tac-Toe game with AI opponents featuring three difficulty levels and persistent scoring",
      image: "slideshow", // Special identifier for slideshow
      technologies: ["React", "TypeScript", "Vite", "Tailwind CSS", "Shadcn UI", "Lucide React"],
      status: "Completed",
      demoUrl: "#",
      githubUrl: "https://github.com/Noxie-dev/Tic-Tech-Toe-AI-To-The-Bone",
      featured: true
    }
  ];

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  const getStatusColor = (status) => {
    return status === 'Completed' ? 'text-green-400' : 'text-yellow-400';
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'web': return <Globe className="w-4 h-4" />;
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'ai': return <Brain className="w-4 h-4" />;
      case 'gaming': return <Gamepad2 className="w-4 h-4" />;
      default: return <Code2 className="w-4 h-4" />;
    }
  };

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-orbitron gradient-text-cyan">
            Our Projects
          </h2>
          <p className="text-xl text-[#EAEAEA]/70 max-w-3xl mx-auto">
            Showcasing our expertise through innovative solutions and cutting-edge technology implementations
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {categories.map((category, idx) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-[#00E5FF] to-[#0066CC] text-white shadow-lg shadow-[#00E5FF]/30'
                  : 'glass-card text-[#EAEAEA]/70 hover:text-[#00E5FF] hover:border-[#00E5FF]/50'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.icon}
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
              >
                {/* Featured badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-gradient-to-r from-[#E53935] to-[#FF6B6B] rounded-full text-xs font-semibold text-white">
                    Featured
                  </div>
                )}

                {/* Card */}
                <div className="glass-card rounded-xl overflow-hidden h-full transition-all duration-300 group-hover:border-[#00E5FF]/50">
                  {/* Project Image */}
                  <div className="relative h-64 bg-gradient-to-br from-[#1C1F27] to-[#14273D] flex items-center justify-center overflow-hidden cursor-pointer" onClick={project.image === "slideshow" ? toggleSlideshow : undefined}>
                    {project.image === "slideshow" ? (
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={currentImageIndex}
                          src={ticTacToeImages[currentImageIndex]}
                          alt={`${project.title} - Screenshot ${currentImageIndex + 1}`}
                          className="w-full h-full object-contain bg-[#1C1F27]"
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                      </AnimatePresence>
                    ) : project.image && project.image !== "/api/placeholder/400/300" ? (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-6xl text-[#00E5FF]/30">
                        {getCategoryIcon(project.category)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F16]/80 to-transparent"></div>
                    
                    {/* Slideshow controls and indicators */}
                    {project.image === "slideshow" && (
                      <>
                        {/* Pause/Play button */}
                        <div className="absolute top-2 right-2 p-2 bg-[#0C0F16]/80 rounded-full backdrop-blur-sm">
                          {isSlideshowPaused ? (
                            <Play className="w-4 h-4 text-[#00E5FF]" />
                          ) : (
                            <Pause className="w-4 h-4 text-[#00E5FF]" />
                          )}
                        </div>
                        
                        {/* Slideshow indicator dots */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                          {ticTacToeImages.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === currentImageIndex 
                                  ? 'bg-[#00E5FF] scale-125' 
                                  : 'bg-[#00E5FF]/30'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                    
                    {/* Overlay with links */}
                    <div className="absolute inset-0 bg-[#0C0F16]/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                      <motion.a
                        href={project.demoUrl}
                        className="p-3 bg-[#00E5FF] rounded-full text-[#0C0F16] hover:bg-[#00A5CC] transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ExternalLink className="w-5 h-5" />
                      </motion.a>
                      <motion.a
                        href={project.githubUrl}
                        className="p-3 bg-[#E53935] rounded-full text-white hover:bg-[#D32F2F] transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Github className="w-5 h-5" />
                      </motion.a>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-[#EAEAEA] font-orbitron group-hover:text-[#00E5FF] transition-colors">
                        {project.title}
                      </h3>
                      <span className={`text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-[#EAEAEA]/70 mb-4 text-sm leading-relaxed">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, techIdx) => (
                        <span
                          key={techIdx}
                          className="px-2 py-1 bg-[#1C1F27]/50 border border-[#00E5FF]/20 rounded text-xs text-[#00E5FF]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Category */}
                    <div className="flex items-center gap-2 text-xs text-[#EAEAEA]/50">
                      {getCategoryIcon(project.category)}
                      <span className="capitalize">{project.category}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-[#EAEAEA]/70 mb-8">
            Ready to bring your project to life?
          </p>
          <motion.button
            className="px-8 py-4 btn-secondary rounded-lg font-semibold text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Project
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;

