# 🚀 **Supabase Edge Functions Deployment Guide**

## 📋 **Overview**
This guide will help you deploy the advanced backend API using Supabase Edge Functions for the NaniTeck DevShop dashboard.

## 🏗️ **Edge Functions Structure**

```
supabase/functions/
├── shared/
│   ├── supabase-client.ts    # Admin client and utilities
│   ├── iam.ts               # Authentication & authorization
│   ├── types.ts             # TypeScript interfaces
│   └── errors.ts            # Error handling
├── project-crud/
│   └── index.ts             # Project CRUD operations
├── image-management/
│   └── index.ts             # Image upload & metadata
├── settings-management/
│   └── index.ts             # Application settings
└── iam-system/
    └── index.ts             # User role management
```

---

## 🚀 **Deployment Steps**

### **Step 1: Install Supabase CLI**
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF
```

### **Step 2: Deploy Edge Functions**
```bash
# Deploy all functions
supabase functions deploy

# Or deploy individual functions
supabase functions deploy project-crud
supabase functions deploy image-management
supabase functions deploy settings-management
supabase functions deploy iam-system
```

### **Step 3: Set Environment Variables**
```bash
# Set required environment variables
supabase secrets set SUPABASE_URL=your_supabase_url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
supabase secrets set SUPABASE_ANON_KEY=your_anon_key
```

### **Step 4: Test Functions**
```bash
# Test individual functions
supabase functions serve project-crud
supabase functions serve image-management
supabase functions serve settings-management
supabase functions serve iam-system
```

---

## 🔧 **Function Endpoints**

### **1. Project CRUD** (`/project-crud`)
- **GET** `/project-crud` - List projects with filtering
- **POST** `/project-crud` - Create new project
- **PUT** `/project-crud` - Update existing project
- **DELETE** `/project-crud` - Soft-delete project

### **2. Image Management** (`/image-management`)
- **GET** `/image-management` - Get project images
- **POST** `/image-management` - Image operations:
  - `generate-upload-url` - Generate signed upload URL
  - `create-metadata` - Create image metadata
  - `update-metadata` - Update image metadata
  - `reorder-images` - Reorder project images
- **DELETE** `/image-management` - Delete image

### **3. Settings Management** (`/settings-management`)
- **GET** `/settings-management` - Get settings
- **POST** `/settings-management` - Create new setting
- **PUT** `/settings-management` - Update setting
- **PATCH** `/settings-management` - Bulk update settings
- **DELETE** `/settings-management` - Delete setting

### **4. IAM System** (`/iam-system`)
- **GET** `/iam-system` - List users with roles
- **POST** `/iam-system` - Create/update user role
- **PUT** `/iam-system` - Update user profile
- **PATCH** `/iam-system` - Bulk role updates
- **DELETE** `/iam-system` - Deactivate user

---

## 🔐 **Authentication & Authorization**

### **JWT Token Required**
All functions require a valid JWT token in the Authorization header:
```javascript
headers: {
  'Authorization': `Bearer ${jwt_token}`,
  'Content-Type': 'application/json'
}
```

### **Role-Based Access Control**
- **Admin**: Full access to all functions
- **Editor**: Can create/edit/delete own projects and images
- **Viewer**: Read-only access to published content

### **Public Access**
- Settings marked as `is_public: true` can be accessed without authentication
- Published projects are visible to all users

---

## 📊 **API Response Format**

### **Success Response**
```json
{
  "data": { ... },
  "success": true,
  "requestId": "req_1234567890_abc123",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **Error Response**
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "statusCode": 400,
    "requestId": "req_1234567890_abc123",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "success": false
}
```

---

## 🛠️ **Frontend Integration**

### **1. Update Supabase Module**
```javascript
// Add Edge Functions client
const supabaseFunctions = supabase.functions

// Example: Create project
export async function createProject(projectData) {
  const { data: { session } } = await supabase.auth.getSession()
  
  const { data, error } = await supabaseFunctions.invoke('project-crud', {
    method: 'POST',
    body: projectData,
    headers: {
      'Authorization': `Bearer ${session.access_token}`
    }
  })
  
  return { data, error }
}
```

### **2. Image Upload Flow**
```javascript
// 1. Generate upload URL
const { data: uploadData } = await supabaseFunctions.invoke('image-management', {
  method: 'POST',
  body: {
    action: 'generate-upload-url',
    fileName: file.name,
    projectId: projectId,
    fileSize: file.size,
    mimeType: file.type
  }
})

// 2. Upload file to storage
const uploadResponse = await fetch(uploadData.uploadUrl, {
  method: 'PUT',
  body: file
})

// 3. Create metadata
const { data: metadata } = await supabaseFunctions.invoke('image-management', {
  method: 'POST',
  body: {
    action: 'create-metadata',
    imagePath: uploadData.filePath,
    projectId: projectId,
    altText: 'Project image',
    isPrimary: true
  }
})
```

### **3. Settings Management**
```javascript
// Get all settings
const { data: settings } = await supabaseFunctions.invoke('settings-management', {
  method: 'GET'
})

// Update setting
const { data: updatedSetting } = await supabaseFunctions.invoke('settings-management', {
  method: 'PUT',
  body: {
    key: 'dashboard.auto_publish',
    value: true
  }
})
```

---

## 🔍 **Monitoring & Debugging**

### **Function Logs**
```bash
# View function logs
supabase functions logs project-crud
supabase functions logs image-management
supabase functions logs settings-management
supabase functions logs iam-system

# Follow logs in real-time
supabase functions logs project-crud --follow
```

### **Local Development**
```bash
# Start local development server
supabase start

# Serve functions locally
supabase functions serve

# Test with local functions
curl -X POST http://localhost:54321/functions/v1/project-crud \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Project", "description": "Test Description"}'
```

---

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Authentication Errors**
   - Verify JWT token is valid and not expired
   - Check if user has proper role in profiles table

2. **Permission Denied**
   - Ensure user has required role for the operation
   - Check RLS policies are correctly configured

3. **Function Timeout**
   - Edge Functions have a 60-second timeout limit
   - Optimize database queries and reduce payload size

4. **CORS Issues**
   - All functions include CORS headers
   - Verify frontend domain is allowed

### **Debug Commands**
```bash
# Check function status
supabase functions list

# View function details
supabase functions describe project-crud

# Test function locally
supabase functions serve project-crud --no-verify-jwt
```

---

## 📈 **Performance Optimization**

### **Database Indexes**
Ensure proper indexes are created for:
- User lookups by role
- Project filtering by status/category
- Image metadata by project
- Settings by category

### **Caching Strategy**
- Use Supabase's built-in caching
- Implement client-side caching for frequently accessed data
- Cache settings and user profiles

### **Rate Limiting**
- Functions include basic rate limiting
- Consider implementing Redis-based rate limiting for production

---

## 🔒 **Security Best Practices**

1. **Input Validation**
   - All functions validate input data
   - File size and type restrictions for uploads
   - SQL injection protection via parameterized queries

2. **Authentication**
   - JWT token validation on every request
   - Role-based access control
   - Audit logging for sensitive operations

3. **Data Protection**
   - RLS policies protect data access
   - Soft deletion for data recovery
   - Secure file upload with signed URLs

---

## 🎉 **Next Steps**

1. **Deploy Functions**: Run the deployment commands
2. **Test Integration**: Verify all functions work correctly
3. **Update Frontend**: Integrate with the new API endpoints
4. **Monitor Performance**: Set up logging and monitoring
5. **Scale as Needed**: Adjust based on usage patterns

Your advanced dashboard backend is now ready for production! 🚀

