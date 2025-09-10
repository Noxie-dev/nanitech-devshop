// Legacy Supabase configuration - DEPRECATED
// Please use the new consolidated module: ./supabase-module.js
// This file is kept for backward compatibility

// Import the singleton instance from the main module to avoid multiple instances
export { supabase } from './supabase-module.js'

// Re-export from the new consolidated module for backward compatibility
export { 
  supabase as supabaseClient,
  fetchPublishedProjects,
  ProjectSearchEngine,
  RecommendationEngine,
  getUserProfile,
  canUserPerform,
  PERMISSIONS,
  getSignedImageUrl,
  signedUrlCache,
  projectCache,
  userCache
} from './supabase-module.js'

// Database schema for NANI TECH DevShop
export const createTables = async () => {
  // This would be run in Supabase SQL editor or via migrations
  const schema = `
    -- Projects table
    CREATE TABLE IF NOT EXISTS projects (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      status VARCHAR(50) DEFAULT 'active',
      technologies TEXT[], -- Array of tech stack
      image_url TEXT,
      demo_url TEXT,
      github_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Services table
    CREATE TABLE IF NOT EXISTS services (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      icon VARCHAR(100),
      features TEXT[],
      price_range VARCHAR(100),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Blog posts table
    CREATE TABLE IF NOT EXISTS blog_posts (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      content TEXT,
      excerpt TEXT,
      author VARCHAR(100),
      featured_image TEXT,
      tags TEXT[],
      published BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Bookings table
    CREATE TABLE IF NOT EXISTS bookings (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      company VARCHAR(255),
      service_type VARCHAR(100),
      project_description TEXT,
      preferred_date DATE,
      preferred_time TIME,
      budget_range VARCHAR(100),
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Contact messages table
    CREATE TABLE IF NOT EXISTS contact_messages (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(255),
      message TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'unread',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Team members table
    CREATE TABLE IF NOT EXISTS team_members (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(100),
      bio TEXT,
      image_url TEXT,
      skills TEXT[],
      social_links JSONB,
      order_index INTEGER DEFAULT 0,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  
  return schema;
};

// API functions for different features
export const projectsAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },
  
  getByCategory: async (category) => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    return { data, error };
  },
  
  create: async (project) => {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select();
    return { data, error };
  }
};

export const servicesAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  }
};

export const blogAPI = {
  getPublished: async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },
  
  getBySlug: async (slug) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    return { data, error };
  },
  
  create: async (post) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select();
    return { data, error };
  }
};

export const bookingsAPI = {
  create: async (booking) => {
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select();
    return { data, error };
  },
  
  getAll: async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  }
};

export const contactAPI = {
  create: async (message) => {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([message])
      .select();
    return { data, error };
  }
};

export const teamAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('active', true)
      .order('order_index', { ascending: true });
    return { data, error };
  }
};

