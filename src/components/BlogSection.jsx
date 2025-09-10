import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  Tag,
  Search,
  Filter,
  BookOpen,
  TrendingUp,
  Code,
  Brain,
  Zap
} from 'lucide-react';
import { blogAPI } from '../lib/supabase';

const BlogSection = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Demo blog posts data
  const demoPosts = [
    {
      id: 1,
      title: "The Future of AI in Web Development",
      slug: "future-ai-web-development",
      excerpt: "Exploring how artificial intelligence is revolutionizing the way we build and interact with web applications.",
      content: "Full article content here...",
      author: "Sarah Chen",
      featured_image: "/api/placeholder/600/400",
      tags: ["AI", "Web Development", "Machine Learning"],
      published: true,
      created_at: "2024-01-15T10:00:00Z",
      read_time: "8 min read",
      category: "AI & ML"
    },
    {
      id: 2,
      title: "Building Scalable Microservices with Docker",
      slug: "scalable-microservices-docker",
      excerpt: "A comprehensive guide to architecting and deploying microservices using containerization technologies.",
      content: "Full article content here...",
      author: "Marcus Johnson",
      featured_image: "/api/placeholder/600/400",
      tags: ["Docker", "Microservices", "DevOps"],
      published: true,
      created_at: "2024-01-12T14:30:00Z",
      read_time: "12 min read",
      category: "DevOps"
    },
    {
      id: 3,
      title: "React 18 Performance Optimization Techniques",
      slug: "react-18-performance-optimization",
      excerpt: "Advanced strategies for optimizing React applications and improving user experience.",
      content: "Full article content here...",
      author: "Alex Rivera",
      featured_image: "/api/placeholder/600/400",
      tags: ["React", "Performance", "JavaScript"],
      published: true,
      created_at: "2024-01-10T09:15:00Z",
      read_time: "10 min read",
      category: "Frontend"
    },
    {
      id: 4,
      title: "Cybersecurity Best Practices for Modern Applications",
      slug: "cybersecurity-best-practices",
      excerpt: "Essential security measures every developer should implement to protect their applications.",
      content: "Full article content here...",
      author: "Dr. Emily Watson",
      featured_image: "/api/placeholder/600/400",
      tags: ["Security", "Best Practices", "Web Development"],
      published: true,
      created_at: "2024-01-08T16:45:00Z",
      read_time: "15 min read",
      category: "Security"
    },
    {
      id: 5,
      title: "The Rise of Edge Computing in 2024",
      slug: "rise-edge-computing-2024",
      excerpt: "How edge computing is transforming data processing and application performance.",
      content: "Full article content here...",
      author: "David Kim",
      featured_image: "/api/placeholder/600/400",
      tags: ["Edge Computing", "Cloud", "Performance"],
      published: true,
      created_at: "2024-01-05T11:20:00Z",
      read_time: "7 min read",
      category: "Cloud"
    },
    {
      id: 6,
      title: "Building Mobile-First Progressive Web Apps",
      slug: "mobile-first-progressive-web-apps",
      excerpt: "Creating responsive, fast, and engaging web applications that work seamlessly across all devices.",
      content: "Full article content here...",
      author: "Lisa Park",
      featured_image: "/api/placeholder/600/400",
      tags: ["PWA", "Mobile", "Web Development"],
      published: true,
      created_at: "2024-01-03T13:10:00Z",
      read_time: "9 min read",
      category: "Mobile"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Posts', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'AI & ML', name: 'AI & ML', icon: <Brain className="w-4 h-4" /> },
    { id: 'Frontend', name: 'Frontend', icon: <Code className="w-4 h-4" /> },
    { id: 'DevOps', name: 'DevOps', icon: <Zap className="w-4 h-4" /> },
    { id: 'Security', name: 'Security', icon: <Filter className="w-4 h-4" /> },
    { id: 'Cloud', name: 'Cloud', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'Mobile', name: 'Mobile', icon: <Search className="w-4 h-4" /> }
  ];

  useEffect(() => {
    // Simulate loading blog posts
    const loadPosts = async () => {
      setLoading(true);
      // In production, this would fetch from Supabase
      // const { data, error } = await blogAPI.getPublished();
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPosts(demoPosts);
      setFilteredPosts(demoPosts);
      setLoading(false);
    };

    loadPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  }, [posts, selectedCategory, searchTerm]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    const categoryObj = categories.find(cat => cat.id === category);
    return categoryObj ? categoryObj.icon : <BookOpen className="w-4 h-4" />;
  };

  return (
    <section id="blog" className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-orbitron gradient-text-cyan">
            Tech Insights
          </h2>
          <p className="text-xl text-[#EAEAEA]/70 max-w-3xl mx-auto">
            Stay updated with the latest trends, tutorials, and insights from the world of 
            technology and software development.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          className="flex flex-col md:flex-row gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#EAEAEA]/50 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#1C1F27]/50 border border-[#00E5FF]/20 rounded-lg focus:border-[#00E5FF]/50 focus:outline-none transition-colors text-[#EAEAEA]"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category, idx) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-[#00E5FF] to-[#0066CC] text-white'
                    : 'glass-card text-[#EAEAEA]/70 hover:text-[#00E5FF] hover:border-[#00E5FF]/50'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                {category.icon}
                <span className="hidden sm:inline">{category.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="glass-card rounded-xl p-6 animate-pulse">
                <div className="h-48 bg-[#1C1F27] rounded-lg mb-4"></div>
                <div className="h-4 bg-[#1C1F27] rounded mb-2"></div>
                <div className="h-4 bg-[#1C1F27] rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-[#1C1F27] rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post.id}
                className="group glass-card rounded-xl overflow-hidden hover:border-[#00E5FF]/50 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
              >
                {/* Featured Image */}
                <div className="relative h-48 bg-gradient-to-br from-[#1C1F27] to-[#14273D] flex items-center justify-center overflow-hidden">
                  <div className="text-6xl text-[#00E5FF]/30">
                    {getCategoryIcon(post.category)}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F16]/80 to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-[#00E5FF] to-[#0066CC] rounded-full text-xs font-semibold text-white">
                    {post.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta Information */}
                  <div className="flex items-center gap-4 text-xs text-[#EAEAEA]/50 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.read_time}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-3 text-[#EAEAEA] group-hover:text-[#00E5FF] transition-colors font-orbitron line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-[#EAEAEA]/70 mb-4 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="px-2 py-1 bg-[#1C1F27]/50 border border-[#00E5FF]/20 rounded text-xs text-[#00E5FF]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Author and Read More */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-[#EAEAEA]/60">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    
                    <motion.button
                      className="flex items-center gap-1 text-[#00E5FF] hover:text-[#00A5CC] transition-colors text-sm font-medium"
                      whileHover={{ x: 5 }}
                    >
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* No Results */}
        {!loading && filteredPosts.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <BookOpen className="w-16 h-16 text-[#EAEAEA]/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#EAEAEA]/70 mb-2">No articles found</h3>
            <p className="text-[#EAEAEA]/50">Try adjusting your search or filter criteria.</p>
          </motion.div>
        )}

        {/* Load More / Newsletter Signup */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="glass-card rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 font-orbitron gradient-text-red">
              Stay Updated
            </h3>
            <p className="text-[#EAEAEA]/70 mb-6">
              Subscribe to our newsletter and never miss the latest tech insights and tutorials.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-[#1C1F27]/50 border border-[#00E5FF]/20 rounded-lg focus:border-[#00E5FF]/50 focus:outline-none transition-colors text-[#EAEAEA]"
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
      </div>
    </section>
  );
};

export default BlogSection;

