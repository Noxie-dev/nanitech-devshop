// supabase/functions/shared/types.ts

export interface UserProfile {
  id: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  images: string[];
  techStack: string[];
  createdBy: string;
  status: 'draft' | 'published' | 'archived';
  featured?: boolean;
  metadata?: Record<string, any>;
  categoryId?: string;
  queueStatus: 'none' | 'queued' | 'processing' | 'published';
  scheduledPublishAt?: string;
  publishedAt?: string;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ImageMetadata {
  id: string;
  projectId: string;
  uploaderId?: string;
  imagePath: string;
  altText?: string;
  caption?: string;
  fileSizeBytes?: number;
  width?: number;
  height?: number;
  mimeType?: string;
  positionX: number;
  positionY: number;
  scale: number;
  rotation: number;
  cropData?: Record<string, any>;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface TechCategory {
  id: string;
  name: string;
  parentId?: string;
  icon?: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface ProjectQueueJob {
  id: string;
  projectId: string;
  jobType: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payload?: Record<string, any>;
  attempts: number;
  lastError?: string;
  lastAttemptAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeletedProject {
  id: string;
  originalData: Project;
  deletedAt: string;
  deletedBy?: string;
  reason?: string;
}

export interface Setting {
  key: string;
  value: any;
  description?: string;
  isPublic: boolean;
  category: string;
  lastUpdatedBy?: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  featuredProjects: number;
  queuedProjects: number;
  deletedProjects: number;
  pendingJobs: number;
  totalImages: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  query?: string;
  category?: string;
  status?: string;
  featured?: boolean;
}

