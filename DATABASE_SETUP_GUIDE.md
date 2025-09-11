# 🗄️ **Advanced Dashboard Database Setup Guide**

## 📋 **Overview**
This guide will help you set up the advanced database schema for the NaniTeck DevShop dashboard with all the new features including project queuing, image management, settings, and recovery systems.

## 🚀 **Quick Setup**

### **Step 1: Execute SQL Schema**
1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `database-schema.sql`
4. Click **Run** to execute all the SQL scripts

### **Step 2: Verify Tables Created**
Check that these tables were created successfully:
- ✅ `project_queue` - Job management system
- ✅ `deleted_projects` - Project recovery system  
- ✅ `image_metadata` - Advanced image management
- ✅ `settings` - Application configuration
- ✅ `project_categories` - Project organization
- ✅ `tech_categories` - Tech stack hierarchy

### **Step 3: Test the Setup**
The updated `supabase-module.js` includes all the new functions. Test them by:
1. Starting your development server: `npm run dev`
2. Navigate to `/dashboard`
3. Check the browser console for any errors

---

## 🏗️ **Database Schema Details**

### **1. Project Queue System**
```sql
-- Manages background jobs and async tasks
CREATE TABLE project_queue (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    job_type TEXT NOT NULL, -- 'process_images', 'auto_publish', etc.
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    payload JSONB, -- Job-specific data
    attempts INT DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

**Use Cases:**
- Auto-publishing projects at scheduled times
- Background image processing
- Sending notifications
- Generating reports

### **2. Deleted Projects Recovery**
```sql
-- Archives deleted projects for recovery
CREATE TABLE deleted_projects (
    id UUID PRIMARY KEY, -- Original project ID
    original_data JSONB NOT NULL, -- Full project backup
    deleted_at TIMESTAMPTZ DEFAULT now(),
    deleted_by UUID REFERENCES auth.users(id),
    reason TEXT -- Deletion reason
);
```

**Features:**
- Automatic project archiving on deletion
- Full data recovery capability
- Audit trail with deletion timestamps
- User attribution for deletions

### **3. Advanced Image Management**
```sql
-- Comprehensive image metadata storage
CREATE TABLE image_metadata (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    image_path TEXT UNIQUE NOT NULL,
    alt_text TEXT, -- Accessibility
    caption TEXT,
    file_size_bytes INT,
    width INT, height INT,
    position_x INT, position_y INT, -- Drag positioning
    scale DECIMAL(3,2) DEFAULT 1.0, -- Zoom level
    rotation INT DEFAULT 0, -- Rotation angle
    crop_data JSONB, -- Crop coordinates
    is_primary BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 0
);
```

**Features:**
- Drag and drop positioning
- Zoom and rotation support
- Crop data storage
- Image ordering and primary selection
- Accessibility with alt text

### **4. Settings Management**
```sql
-- Key-value configuration store
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value JSONB,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    category TEXT DEFAULT 'general',
    last_updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Categories:**
- `dashboard` - Dashboard-specific settings
- `media` - Image and file management
- `iam` - Identity and access management
- `general` - Site-wide settings

---

## 🔧 **New API Functions**

### **Project Queue Management**
```javascript
// Add project to queue
await addProjectToQueue(projectId, 'auto_publish', { scheduledTime: '2024-01-01' });

// Get queue status
const { data: queue } = await getProjectQueue('pending');

// Update job status
await updateQueueJobStatus(jobId, 'completed');
```

### **Project Recovery**
```javascript
// Get deleted projects
const { data: deleted } = await getDeletedProjects();

// Restore a project
await restoreProject(deletedProjectId);

// Permanently delete
await permanentlyDeleteProject(deletedProjectId);
```

### **Image Management**
```javascript
// Upload image with metadata
await uploadProjectImage(projectId, file, {
  altText: 'Project screenshot',
  positionX: 100,
  positionY: 50,
  scale: 1.2,
  isPrimary: true
});

// Get project images
const { data: images } = await getProjectImages(projectId);

// Update image metadata
await updateImageMetadata(imageId, { positionX: 200, scale: 1.5 });

// Delete image
await deleteProjectImage(imageId);
```

### **Settings Management**
```javascript
// Get all settings
const { data: settings } = await getSettings();

// Get settings by category
const { data: dashboardSettings } = await getSettings('dashboard');

// Update setting
await updateSetting('dashboard.auto_publish', true);

// Create new setting
await createSetting('custom.setting', 'value', 'Description', false, 'custom');
```

---

## 🎯 **Default Settings Included**

### **Dashboard Settings**
- `dashboard.auto_publish` - Auto-publish projects
- `dashboard.auto_delete` - Auto-delete old projects
- `dashboard.recovery_period` - Days to keep deleted projects (30)
- `dashboard.max_images_per_project` - Max images per project (10)
- `dashboard.allowed_file_types` - Allowed image types
- `dashboard.max_file_size` - Max file size (50MB)

### **Media Settings**
- `media.image_quality` - Compression quality (high)
- `media.auto_optimize` - Auto-optimize images (true)
- `media.generate_thumbnails` - Generate thumbnails (true)

### **IAM Settings**
- `iam.default_role` - Default user role (viewer)
- `iam.allow_registration` - Allow new registrations (false)
- `iam.session_timeout` - Session timeout (3600s)

### **Public Settings**
- `site.title` - Site title
- `site.description` - Site description
- `site.maintenance_mode` - Maintenance mode toggle

---

## 🔐 **Security Features**

### **Row Level Security (RLS)**
All tables have RLS enabled with appropriate policies:

- **Admins**: Full access to all tables
- **Users**: Can manage their own projects and images
- **Public**: Can view public settings only

### **Data Protection**
- Automatic project archiving on deletion
- User attribution for all actions
- Audit trails with timestamps
- Secure file upload with validation

---

## 📊 **Performance Optimizations**

### **Indexes Created**
- Status-based queries on queue
- Project-based image lookups
- Category-based filtering
- Timestamp-based sorting

### **Caching Strategy**
- Project data cached for 5 minutes
- User profiles cached for 15 minutes
- Signed URLs cached for 10 minutes

---

## 🚨 **Troubleshooting**

### **Common Issues**

1. **RLS Policy Errors**
   - Ensure user has proper role in `profiles` table
   - Check if user is authenticated

2. **Image Upload Failures**
   - Verify Supabase Storage bucket exists
   - Check file size limits
   - Ensure proper file types

3. **Queue Job Failures**
   - Check job payload format
   - Verify project exists
   - Review error logs

### **Debug Commands**
```sql
-- Check table creation
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('project_queue', 'deleted_projects', 'image_metadata', 'settings');

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check settings
SELECT key, value, category FROM settings ORDER BY category, key;
```

---

## 🎉 **Next Steps**

1. **Execute the SQL schema** in your Supabase project
2. **Test the new functions** in your dashboard
3. **Configure settings** according to your needs
4. **Set up image storage** bucket in Supabase
5. **Implement the advanced UI components** using these new APIs

The database is now ready to support all the advanced dashboard features you requested! 🚀

