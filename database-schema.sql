-- ===========================
-- Advanced Dashboard Database Schema
-- NaniTeck DevShop - Supabase SQL Scripts
-- ===========================

-- 1. Project Queue Table
-- Manages background jobs and asynchronous tasks for projects
CREATE TABLE IF NOT EXISTS public.project_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    job_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    payload JSONB, -- Stores job-specific data
    attempts INT DEFAULT 0,
    last_error TEXT,
    last_attempt_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add comments for clarity
COMMENT ON TABLE public.project_queue IS 'A queue for processing asynchronous jobs related to projects.';
COMMENT ON COLUMN public.project_queue.job_type IS 'The type of job to be processed (e.g., "process_images", "send_notification", "auto_publish").';
COMMENT ON COLUMN public.project_queue.status IS 'The current status of the job in the queue.';
COMMENT ON COLUMN public.project_queue.payload IS 'Data required for the job to be executed.';

-- Add indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_project_queue_status ON public.project_queue(status);
CREATE INDEX IF NOT EXISTS idx_project_queue_job_type ON public.project_queue(job_type);
CREATE INDEX IF NOT EXISTS idx_project_queue_created_at ON public.project_queue(created_at);

-- Enable RLS
ALTER TABLE public.project_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_queue
CREATE POLICY "Allow admin full access to queue"
ON public.project_queue FOR ALL
USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );

CREATE POLICY "Allow users to view their own project jobs"
ON public.project_queue FOR SELECT
USING ( 
    EXISTS (
        SELECT 1 FROM projects 
        WHERE projects.id = project_queue.project_id 
        AND projects.createdBy = auth.uid()
    )
);

-- 2. Deleted Projects Table
-- Archives projects for recovery and auditing
CREATE TABLE IF NOT EXISTS public.deleted_projects (
    id UUID PRIMARY KEY, -- The original project ID
    original_data JSONB NOT NULL, -- Full JSON backup of the project row
    deleted_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    deleted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reason TEXT -- Optional: A reason for deletion
);

-- Add comments for clarity
COMMENT ON TABLE public.deleted_projects IS 'Archives projects that have been deleted for auditing and potential restoration.';
COMMENT ON COLUMN public.deleted_projects.original_data IS 'A JSON snapshot of the entire project row at the time of deletion.';
COMMENT ON COLUMN public.deleted_projects.deleted_by IS 'The user who initiated the deletion.';

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_deleted_projects_deleted_at ON public.deleted_projects(deleted_at);
CREATE INDEX IF NOT EXISTS idx_deleted_projects_deleted_by ON public.deleted_projects(deleted_by);

-- Enable RLS
ALTER TABLE public.deleted_projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deleted_projects
CREATE POLICY "Allow admin access to deleted projects"
ON public.deleted_projects FOR ALL
USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );

CREATE POLICY "Allow users to view their own deleted projects"
ON public.deleted_projects FOR SELECT
USING ( deleted_by = auth.uid() );

-- 3. Image Metadata Table
-- Stores metadata for project images
CREATE TABLE IF NOT EXISTS public.image_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    uploader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    image_path TEXT UNIQUE NOT NULL, -- Path in Supabase Storage
    alt_text TEXT,
    caption TEXT,
    file_size_bytes INT,
    width INT,
    height INT,
    mime_type TEXT,
    position_x INT DEFAULT 0, -- For drag positioning
    position_y INT DEFAULT 0,
    scale DECIMAL(3,2) DEFAULT 1.0, -- For zoom
    rotation INT DEFAULT 0, -- For rotation
    crop_data JSONB, -- For crop coordinates
    is_primary BOOLEAN DEFAULT false, -- Primary image for project
    sort_order INT DEFAULT 0, -- For image ordering
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add comments for clarity
COMMENT ON TABLE public.image_metadata IS 'Stores metadata for images associated with projects.';
COMMENT ON COLUMN public.image_metadata.image_path IS 'The unique path to the image file in Supabase Storage.';
COMMENT ON COLUMN public.image_metadata.alt_text IS 'Descriptive text for accessibility (screen readers).';
COMMENT ON COLUMN public.image_metadata.position_x IS 'Horizontal position for drag and drop functionality.';
COMMENT ON COLUMN public.image_metadata.position_y IS 'Vertical position for drag and drop functionality.';
COMMENT ON COLUMN public.image_metadata.scale IS 'Zoom level for the image (0.1 to 5.0).';
COMMENT ON COLUMN public.image_metadata.rotation IS 'Rotation angle in degrees.';
COMMENT ON COLUMN public.image_metadata.crop_data IS 'Crop coordinates and dimensions.';

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_image_metadata_project_id ON public.image_metadata(project_id);
CREATE INDEX IF NOT EXISTS idx_image_metadata_image_path ON public.image_metadata(image_path);
CREATE INDEX IF NOT EXISTS idx_image_metadata_uploader_id ON public.image_metadata(uploader_id);
CREATE INDEX IF NOT EXISTS idx_image_metadata_is_primary ON public.image_metadata(is_primary);

-- Enable RLS
ALTER TABLE public.image_metadata ENABLE ROW LEVEL SECURITY;

-- RLS Policies for image_metadata
CREATE POLICY "Allow users to view all image metadata"
ON public.image_metadata FOR SELECT
USING (true);

CREATE POLICY "Allow users to manage metadata for their own project images"
ON public.image_metadata FOR (INSERT, UPDATE, DELETE)
USING ( 
    EXISTS (
        SELECT 1 FROM projects 
        WHERE projects.id = image_metadata.project_id 
        AND projects.createdBy = auth.uid()
    )
);

CREATE POLICY "Allow admin full access to image metadata"
ON public.image_metadata FOR ALL
USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );

-- 4. Settings Table
-- Key-value store for application settings
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value JSONB,
    description TEXT, -- Human-readable description
    is_public BOOLEAN DEFAULT false NOT NULL, -- Whether this setting can be exposed to client-side
    category TEXT DEFAULT 'general', -- Settings category (e.g., 'dashboard', 'iam', 'media')
    last_updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add comments for clarity
COMMENT ON TABLE public.settings IS 'A key-value store for global application settings.';
COMMENT ON COLUMN public.settings.key IS 'The unique identifier for the setting.';
COMMENT ON COLUMN public.settings.value IS 'The value of the setting, stored in flexible JSONB format.';
COMMENT ON COLUMN public.settings.is_public IS 'Controls if the setting can be fetched by anonymous users.';
COMMENT ON COLUMN public.settings.category IS 'Groups settings by functionality.';

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_settings_category ON public.settings(category);
CREATE INDEX IF NOT EXISTS idx_settings_is_public ON public.settings(is_public);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for settings
CREATE POLICY "Allow public read of public settings"
ON public.settings FOR SELECT
USING (is_public = true);

CREATE POLICY "Allow authenticated users to read all settings"
ON public.settings FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access to settings"
ON public.settings FOR ALL
USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );

-- 5. Project Categories Table (Enhanced)
-- For better project organization
CREATE TABLE IF NOT EXISTS public.project_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3B82F6', -- Hex color for UI
    icon TEXT, -- Icon name or URL
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Insert default categories
INSERT INTO public.project_categories (name, slug, description, color, icon, sort_order) VALUES
('Web Apps', 'web-apps', 'Web applications and websites', '#3B82F6', 'globe', 1),
('Mobile Apps', 'mobile-apps', 'Mobile applications for iOS and Android', '#10B981', 'smartphone', 2),
('AI/ML', 'ai-ml', 'Artificial Intelligence and Machine Learning projects', '#8B5CF6', 'brain', 3),
('Gaming', 'gaming', 'Games and interactive experiences', '#F59E0B', 'gamepad', 4),
('Desktop', 'desktop', 'Desktop applications', '#EF4444', 'monitor', 5)
ON CONFLICT (slug) DO NOTHING;

-- 6. Tech Stack Categories Table
-- For organized tech stack management
CREATE TABLE IF NOT EXISTS public.tech_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    parent_id UUID REFERENCES public.tech_categories(id) ON DELETE CASCADE,
    icon TEXT,
    color TEXT DEFAULT '#6B7280',
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Insert tech categories hierarchy
INSERT INTO public.tech_categories (name, icon, color, sort_order) VALUES
('Frontend', 'palette', '#3B82F6', 1),
('Backend', 'server', '#10B981', 2),
('Database', 'database', '#8B5CF6', 3),
('DevOps', 'settings', '#F59E0B', 4),
('Mobile', 'smartphone', '#EF4444', 5)
ON CONFLICT (name) DO NOTHING;

-- Insert specific technologies
INSERT INTO public.tech_categories (name, parent_id, icon, color, sort_order) VALUES
-- Frontend Technologies
('JavaScript', (SELECT id FROM tech_categories WHERE name = 'Frontend'), 'js', '#F7DF1E', 1),
('TypeScript', (SELECT id FROM tech_categories WHERE name = 'Frontend'), 'ts', '#3178C6', 2),
('React', (SELECT id FROM tech_categories WHERE name = 'Frontend'), 'react', '#61DAFB', 3),
('Vue', (SELECT id FROM tech_categories WHERE name = 'Frontend'), 'vue', '#4FC08D', 4),
('Angular', (SELECT id FROM tech_categories WHERE name = 'Frontend'), 'angular', '#DD0031', 5),
('Svelte', (SELECT id FROM tech_categories WHERE name = 'Frontend'), 'svelte', '#FF3E00', 6),
-- UI Libraries
('Tailwind CSS', (SELECT id FROM tech_categories WHERE name = 'Frontend'), 'tailwind', '#06B6D4', 7),
('Material-UI', (SELECT id FROM tech_categories WHERE name = 'Frontend'), 'material-ui', '#0081CB', 8),
('Chakra UI', (SELECT id FROM tech_categories WHERE name = 'Frontend'), 'chakra', '#319795', 9),
('Ant Design', (SELECT id FROM tech_categories WHERE name = 'Frontend'), 'ant-design', '#1890FF', 10),
-- Backend Technologies
('Node.js', (SELECT id FROM tech_categories WHERE name = 'Backend'), 'nodejs', '#339933', 1),
('Python', (SELECT id FROM tech_categories WHERE name = 'Backend'), 'python', '#3776AB', 2),
('Java', (SELECT id FROM tech_categories WHERE name = 'Backend'), 'java', '#007396', 3),
('Go', (SELECT id FROM tech_categories WHERE name = 'Backend'), 'go', '#00ADD8', 4),
('Rust', (SELECT id FROM tech_categories WHERE name = 'Backend'), 'rust', '#000000', 5)
ON CONFLICT (name) DO NOTHING;

-- 7. Default Settings
-- Insert essential application settings
INSERT INTO public.settings (key, value, description, is_public, category) VALUES
-- Dashboard Settings
('dashboard.auto_publish', 'false'::jsonb, 'Automatically publish projects when created', false, 'dashboard'),
('dashboard.auto_delete', 'false'::jsonb, 'Automatically delete old projects', false, 'dashboard'),
('dashboard.recovery_period', '30'::jsonb, 'Days to keep deleted projects before permanent deletion', false, 'dashboard'),
('dashboard.max_images_per_project', '10'::jsonb, 'Maximum number of images per project', false, 'dashboard'),
('dashboard.allowed_file_types', '["jpg", "jpeg", "png", "webp", "gif"]'::jsonb, 'Allowed image file types', false, 'dashboard'),
('dashboard.max_file_size', '52428800'::jsonb, 'Maximum file size in bytes (50MB)', false, 'dashboard'),

-- Media Settings
('media.image_quality', 'high'::jsonb, 'Image compression quality (low, medium, high)', false, 'media'),
('media.auto_optimize', 'true'::jsonb, 'Automatically optimize uploaded images', false, 'media'),
('media.generate_thumbnails', 'true'::jsonb, 'Generate thumbnails for uploaded images', false, 'media'),

-- IAM Settings
('iam.default_role', 'viewer'::jsonb, 'Default role for new users', false, 'iam'),
('iam.allow_registration', 'false'::jsonb, 'Allow new user registration', false, 'iam'),
('iam.session_timeout', '3600'::jsonb, 'Session timeout in seconds', false, 'iam'),

-- Public Settings
('site.title', '"NaniTeck DevShop"'::jsonb, 'Site title', true, 'general'),
('site.description', '"Advanced software development services"'::jsonb, 'Site description', true, 'general'),
('site.maintenance_mode', 'false'::jsonb, 'Enable maintenance mode', true, 'general')
ON CONFLICT (key) DO NOTHING;

-- 8. Update existing projects table
-- Add category and enhanced metadata
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.project_categories(id),
ADD COLUMN IF NOT EXISTS queue_status TEXT DEFAULT 'none' CHECK (queue_status IN ('none', 'queued', 'processing', 'published')),
ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS view_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS like_count INT DEFAULT 0;

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_projects_category_id ON public.projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_queue_status ON public.projects(queue_status);
CREATE INDEX IF NOT EXISTS idx_projects_scheduled_publish_at ON public.projects(scheduled_publish_at);
CREATE INDEX IF NOT EXISTS idx_projects_published_at ON public.projects(published_at);

-- 9. Create functions for common operations

-- Function to move project to deleted_projects
CREATE OR REPLACE FUNCTION move_project_to_deleted()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.deleted_projects (id, original_data, deleted_by, reason)
    VALUES (
        OLD.id,
        to_jsonb(OLD),
        auth.uid(),
        'Deleted via dashboard'
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically move deleted projects to archive
CREATE TRIGGER move_deleted_project_trigger
    BEFORE DELETE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION move_project_to_deleted();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_project_queue_updated_at
    BEFORE UPDATE ON public.project_queue
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_image_metadata_updated_at
    BEFORE UPDATE ON public.image_metadata
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON public.settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 10. Create views for easier querying

-- View for project statistics
CREATE OR REPLACE VIEW public.project_stats AS
SELECT 
    COUNT(*) as total_projects,
    COUNT(*) FILTER (WHERE status = 'published') as published_projects,
    COUNT(*) FILTER (WHERE status = 'draft') as draft_projects,
    COUNT(*) FILTER (WHERE featured = true) as featured_projects,
    COUNT(*) FILTER (WHERE queue_status = 'queued') as queued_projects,
    AVG(view_count) as avg_views,
    MAX(created_at) as latest_project_date
FROM public.projects;

-- View for dashboard overview
CREATE OR REPLACE VIEW public.dashboard_overview AS
SELECT 
    (SELECT total_projects FROM project_stats) as total_projects,
    (SELECT published_projects FROM project_stats) as published_projects,
    (SELECT draft_projects FROM project_stats) as draft_projects,
    (SELECT featured_projects FROM project_stats) as featured_projects,
    (SELECT queued_projects FROM project_stats) as queued_projects,
    COUNT(DISTINCT dp.id) as deleted_projects,
    COUNT(DISTINCT pq.id) as pending_jobs,
    COUNT(DISTINCT im.id) as total_images
FROM public.deleted_projects dp
CROSS JOIN public.project_queue pq
CROSS JOIN public.image_metadata im;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

