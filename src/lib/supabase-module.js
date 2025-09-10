import { createClient } from "@supabase/supabase-js";
import Fuse from "fuse.js";

// ===========================
// Core Configuration & Singleton Service
// ===========================

class SupabaseService {
  static instance = null;
  client = null;

  constructor(config) {
    this.client = createClient(config.url, config.anonKey, config.options);
  }

  static getInstance() {
    if (!SupabaseService.instance) {
      // Use fallback values for development if environment variables are not set
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here';
      
      // Only show warning if using placeholder values and not in development mode
      if ((supabaseUrl === 'https://your-project.supabase.co' || supabaseAnonKey === 'your-anon-key-here') && 
          import.meta.env.VITE_APP_ENV !== 'development') {
        console.warn('⚠️ Supabase environment variables not configured. Using placeholder values.');
        console.warn('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file');
      }
      
      SupabaseService.instance = new SupabaseService({
        url: supabaseUrl,
        anonKey: supabaseAnonKey,
        options: {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
          },
        },
      });
    }
    return SupabaseService.instance;
  }
}

export const supabase = SupabaseService.getInstance().client;

// ===========================
// Type Definitions (JSDoc for better IDE support)
// ===========================

/**
 * @typedef {Object} Project
 * @property {string} id - Unique project identifier
 * @property {string} title - Project title
 * @property {string} description - Project description
 * @property {string} [githubUrl] - GitHub repository URL
 * @property {string} [liveUrl] - Live demo URL
 * @property {string[]} images - Array of image URLs
 * @property {string[]} techStack - Array of technologies used
 * @property {string} createdBy - User ID who created the project
 * @property {'draft'|'published'|'archived'} status - Project status
 * @property {boolean} [featured] - Whether project is featured
 * @property {Object} [metadata] - Additional project metadata
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 * @property {number} [score] - Search relevance score
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} id - User ID
 * @property {'admin'|'editor'|'viewer'} role - User role
 * @property {string[]} permissions - Array of user permissions
 * @property {string} [fullName] - User's full name
 * @property {string} [avatarUrl] - User's avatar URL
 */

// ===========================
// Advanced Caching System (Generic LRU Cache)
// ===========================

class LRUCache {
  constructor(maxSize = 100, ttl = 300000) { // 5 min default TTL
    this.maxSize = maxSize;
    this.ttl = ttl;
    this.cache = new Map();
    this.lruOrder = [];
  }

  set(key, value, customTTL) {
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const oldestKey = this.lruOrder.shift();
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      expires: Date.now() + (customTTL || this.ttl),
    });
    this.updateLRU(key);
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (entry.expires < Date.now()) {
      this.cache.delete(key);
      this.lruOrder = this.lruOrder.filter(k => k !== key);
      return null;
    }

    this.updateLRU(key);
    return entry.value;
  }

  updateLRU(key) {
    const index = this.lruOrder.indexOf(key);
    if (index > -1) this.lruOrder.splice(index, 1);
    this.lruOrder.push(key);
  }

  clear() {
    this.cache.clear();
    this.lruOrder = [];
  }
}

export const signedUrlCache = new LRUCache(200, 600000); // 10 min TTL
export const projectCache = new LRUCache(50, 300000); // 5 min TTL
export const userCache = new LRUCache(100, 900000); // 15 min TTL

// ===========================
// Error Handling & Resilience
// ===========================

export class SupabaseError extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = 'SupabaseError';
    this.code = code;
    this.details = details;
  }
}

function handleSupabaseError(error, context) {
  console.error(`[${context}] Supabase Error:`, error);
  throw new SupabaseError(error.message || 'An error occurred', error.code, error.details);
}

// ===========================
// Storage & Signed URLs
// ===========================

export async function getSignedImageUrl(path, expiresIn = 600) {
  const cachedUrl = signedUrlCache.get(path);
  if (cachedUrl) return cachedUrl;

  try {
    const { data, error } = await supabase.storage.from("project-images").createSignedUrl(path, expiresIn);
    if (error) throw error;
    
    if (data?.signedUrl) {
      signedUrlCache.set(path, data.signedUrl, expiresIn * 1000);
    }
    return data?.signedUrl || null;
  } catch (error) {
    handleSupabaseError(error, 'getSignedImageUrl');
  }
}

// ===========================
// Frontend RBAC System & RLS
// ===========================

export const PERMISSIONS = {
  PROJECT_CREATE: 'project.create',
  PROJECT_EDIT_OWN: 'project.edit.own',
  PROJECT_DELETE_OWN: 'project.delete.own',
  ADMIN_ACCESS: 'admin.access', // For viewing admin dashboards
};

export const ROLE_PERMISSIONS = {
  admin: Object.values(PERMISSIONS),
  editor: [
    PERMISSIONS.PROJECT_CREATE,
    PERMISSIONS.PROJECT_EDIT_OWN,
    PERMISSIONS.PROJECT_DELETE_OWN,
  ],
  viewer: [],
};

export async function getUserProfile(userId) {
  const cachedProfile = userCache.get(userId);
  if (cachedProfile) return cachedProfile;

  try {
    // Check if Supabase is properly configured
    if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://your-project.supabase.co') {
      console.warn('Supabase not configured, returning mock user profile');
      const mockProfile = {
        id: userId || 'demo-user',
        role: 'admin',
        permissions: ROLE_PERMISSIONS.admin,
        fullName: 'Demo User',
        avatarUrl: null
      };
      userCache.set(userId || 'demo-user', mockProfile);
      return mockProfile;
    }

    const { data, error } = await supabase.from("profiles").select("id, role, fullName, avatarUrl").eq("id", userId).single();
    if (error) throw error;
    if (!data) return null;

    const profile = {
      ...data,
      permissions: ROLE_PERMISSIONS[data.role] || [],
    };

    userCache.set(userId, profile);
    return profile;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
}

export function canUserPerform(user, permission, resource) {
  if (!user) return false;
  if (user.role === 'admin') return true;

  const hasPermission = user.permissions.includes(permission);
  if (!hasPermission) return false;
  
  // Ownership check for specific permissions
  if (resource && (permission === PERMISSIONS.PROJECT_EDIT_OWN || permission === PERMISSIONS.PROJECT_DELETE_OWN)) {
    return user.id === resource.createdBy;
  }

  return true;
}

/*
-- Recommended Supabase RLS SQL Policies (Run in Supabase SQL Editor)
-- Enable RLS on the 'projects' table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access for 'published' projects
CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (status = 'published');

-- Policy: Allow users to create new projects
CREATE POLICY "Allow authenticated insert" ON projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = createdBy);

-- Policy: Allow users to update their own projects
CREATE POLICY "Allow owner update" ON projects FOR UPDATE USING (auth.uid() = createdBy) WITH CHECK (auth.uid() = createdBy);

-- Policy: Allow users to delete their own projects
CREATE POLICY "Allow owner delete" ON projects FOR DELETE USING (auth.uid() = createdBy);

-- Policy: Allow admins to bypass all restrictions
CREATE POLICY "Allow admin full access" ON projects FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
) WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
*/

// ===========================
// Enhanced Fuzzy Search Engine
// ===========================

export class ProjectSearchEngine {
  constructor(projects) {
    this.fuse = new Fuse(projects, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'techStack', weight: 0.3 },
      ],
      threshold: 0.4, // Tuned for a good balance
      includeScore: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
    });
  }

  search(query, limit = 20) {
    if (!query || query.trim().length < 2) return [];
    const results = this.fuse.search(query, { limit });
    return results.map(r => ({ ...r.item, score: r.score }));
  }

  updateProjects(projects) {
    this.fuse.setCollection(projects);
  }
}

// ===========================
// Lightweight Recommendation Engine
// ===========================

export class RecommendationEngine {
  constructor(projects) {
    this.techGraph = new Map();
    this.allProjects = projects;
    this.buildTechGraph(projects);
  }

  buildTechGraph(projects) {
    projects.forEach(project => {
      const techs = project.techStack || [];
      for (let i = 0; i < techs.length; i++) {
        for (let j = i + 1; j < techs.length; j++) {
          this.incrementCoOccurrence(techs[i], techs[j]);
          this.incrementCoOccurrence(techs[j], techs[i]);
        }
      }
    });
  }

  incrementCoOccurrence(techA, techB) {
    if (!this.techGraph.has(techA)) {
      this.techGraph.set(techA, new Map());
    }
    const related = this.techGraph.get(techA);
    related.set(techB, (related.get(techB) || 0) + 1);
  }

  getRecommendations(baseTechs, limit = 3, filterFn = () => true) {
    const scores = new Map();

    baseTechs.forEach(baseTech => {
      const related = this.techGraph.get(baseTech);
      if (related) {
        related.forEach((count, relatedTech) => {
          if (!baseTechs.includes(relatedTech) && filterFn(relatedTech)) {
            scores.set(relatedTech, (scores.get(relatedTech) || 0) + count);
          }
        });
      }
    });

    return Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tech, score]) => ({ tech, score }));
  }

  // Example of specialized recommendation function
  recommendUiForFramework(framework, limit = 3) {
    const uiLibs = ['Tailwind CSS', 'Material UI', 'Chakra UI', 'Styled Components', 'Ant Design', 'Bootstrap'];
    return this.getRecommendations([framework], limit, (tech) => uiLibs.includes(tech));
  }
}

// ===========================
// Main Data Fetching
// ===========================

export async function fetchPublishedProjects() {
  const cacheKey = "published-projects";
  const cached = projectCache.get(cacheKey);
  if (cached) return cached;

  try {
    // Check if Supabase is properly configured
    if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://your-project.supabase.co') {
      console.warn('Supabase not configured, returning mock data');
      const mockProjects = [
        {
          id: '1',
          title: 'Tic-Tac-Toe AI',
          description: 'Modern Tic-Tac-Toe game with AI opponents and beautiful UI',
          githubUrl: 'https://github.com/Noxie-dev/Tic-Tech-Toe-AI-To-The-Bone',
          liveUrl: '#',
          images: ['/TickTechToe-media/Screenshot 2025-09-10 at 17.54.41.png'],
          techStack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
          createdBy: 'demo-user',
          status: 'published',
          featured: true,
          metadata: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'E-Commerce Platform',
          description: 'Full-stack e-commerce solution with payment integration',
          githubUrl: 'https://github.com/example/ecommerce',
          liveUrl: 'https://example-ecommerce.com',
          images: ['/hero-image.png'],
          techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
          createdBy: 'demo-user',
          status: 'published',
          featured: false,
          metadata: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      projectCache.set(cacheKey, mockProjects);
      return mockProjects;
    }

    const { data, error } = await supabase.from("projects").select("*").eq("status", "published");
    if (error) handleSupabaseError(error, 'fetchPublishedProjects');
    
    projectCache.set(cacheKey, data || []);
    return data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// ===========================
// Legacy API Compatibility
// ===========================

// Maintain backward compatibility with existing API structure
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

// ===========================
// Database Schema Helper
// ===========================

export const createTables = async () => {
  // This would be run in Supabase SQL editor or via migrations
  const schema = `
    -- Projects table (Enhanced)
    CREATE TABLE IF NOT EXISTS projects (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      githubUrl TEXT,
      liveUrl TEXT,
      images TEXT[] DEFAULT '{}',
      techStack TEXT[] DEFAULT '{}',
      createdBy UUID REFERENCES auth.users(id),
      status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
      featured BOOLEAN DEFAULT false,
      metadata JSONB DEFAULT '{}',
      createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- User profiles table
    CREATE TABLE IF NOT EXISTS profiles (
      id UUID REFERENCES auth.users(id) PRIMARY KEY,
      role VARCHAR(20) DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
      fullName TEXT,
      avatarUrl TEXT,
      createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
    CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(createdBy);
    CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
    CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
  `;
  
  return schema;
};
