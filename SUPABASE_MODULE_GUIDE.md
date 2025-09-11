# Supabase Module Implementation Guide

## 🚀 Overview

This guide covers the implementation of the consolidated production-ready Supabase module for the NANI TECH DevShop project. The module provides a comprehensive solution with advanced caching, RBAC, fuzzy search, and recommendation engines.

## 📁 File Structure

```
src/lib/
├── supabase.js          # Legacy configuration (backward compatibility)
├── supabase-module.js   # New consolidated module
└── components/
    └── Dashboard.jsx    # Example implementation
```

## 🔧 Installation & Setup

### 1. Dependencies

The module requires the following dependencies (already installed):

```bash
pnpm add @supabase/supabase-js fuse.js
```

### 2. Environment Configuration

Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Database Setup

Run the following SQL in your Supabase SQL Editor to set up the enhanced schema:

```sql
-- Enhanced Projects table
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

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (status = 'published');
CREATE POLICY "Allow authenticated insert" ON projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = createdBy);
CREATE POLICY "Allow owner update" ON projects FOR UPDATE USING (auth.uid() = createdBy) WITH CHECK (auth.uid() = createdBy);
CREATE POLICY "Allow owner delete" ON projects FOR DELETE USING (auth.uid() = createdBy);
CREATE POLICY "Allow admin full access" ON projects FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
) WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- RLS Policies for profiles
CREATE POLICY "Allow users to view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow users to update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
```

## 🎯 Core Features

### 1. Singleton Service Pattern

The module uses a singleton pattern to ensure a single Supabase connection:

```javascript
import { supabase } from './lib/supabase-module.js';

// Always returns the same instance
const client = supabase;
```

### 2. Advanced Caching System

Three specialized LRU caches for optimal performance:

```javascript
import { signedUrlCache, projectCache, userCache } from './lib/supabase-module.js';

// Automatic cache management with TTL
// - signedUrlCache: 10 minutes TTL
// - projectCache: 5 minutes TTL  
// - userCache: 15 minutes TTL
```

### 3. Role-Based Access Control (RBAC)

Comprehensive permission system:

```javascript
import { canUserPerform, PERMISSIONS, getUserProfile } from './lib/supabase-module.js';

// Check permissions
const user = await getUserProfile(userId);
const canEdit = canUserPerform(user, PERMISSIONS.PROJECT_EDIT_OWN, project);

// Available permissions:
// - PROJECT_CREATE
// - PROJECT_EDIT_OWN
// - PROJECT_DELETE_OWN
// - ADMIN_ACCESS
```

### 4. Fuzzy Search Engine

Powerful search with Fuse.js integration:

```javascript
import { ProjectSearchEngine } from './lib/supabase-module.js';

const searchEngine = new ProjectSearchEngine(projects);
const results = searchEngine.search('react typescript', 10);
```

### 5. Recommendation Engine

Tech stack recommendation system:

```javascript
import { RecommendationEngine } from './lib/supabase-module.js';

const recEngine = new RecommendationEngine(projects);

// Get general recommendations
const recommendations = recEngine.getRecommendations(['React', 'TypeScript']);

// Get UI library recommendations for React
const uiRecs = recEngine.recommendUiForFramework('React');
```

## 📖 Usage Examples

### Basic Project Fetching

```javascript
import { fetchPublishedProjects } from './lib/supabase-module.js';

// Automatically cached for 5 minutes
const projects = await fetchPublishedProjects();
```

### Search Implementation

```javascript
import { ProjectSearchEngine } from './lib/supabase-module.js';

function ProjectSearch({ projects }) {
  const searchEngine = useMemo(() => new ProjectSearchEngine(projects), [projects]);
  const [results, setResults] = useState(projects);

  const handleSearch = (query) => {
    if (!query) {
      setResults(projects);
    } else {
      const searchResults = searchEngine.search(query);
      setResults(searchResults);
    }
  };

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {results.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### RBAC Implementation

```javascript
import { canUserPerform, PERMISSIONS } from './lib/supabase-module.js';

function ProjectActions({ project, user }) {
  const canEdit = canUserPerform(user, PERMISSIONS.PROJECT_EDIT_OWN, project);
  const canDelete = canUserPerform(user, PERMISSIONS.PROJECT_DELETE_OWN, project);

  return (
    <div>
      {canEdit && <EditButton project={project} />}
      {canDelete && <DeleteButton project={project} />}
    </div>
  );
}
```

### Recommendation System

```javascript
import { RecommendationEngine } from './lib/supabase-module.js';

function TechRecommendations({ projects, currentTechs }) {
  const recEngine = useMemo(() => new RecommendationEngine(projects), [projects]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const recs = recEngine.getRecommendations(currentTechs, 5);
    setRecommendations(recs);
  }, [currentTechs, recEngine]);

  return (
    <div>
      <h3>Recommended Technologies</h3>
      {recommendations.map(rec => (
        <div key={rec.tech}>
          {rec.tech} (Score: {rec.score})
        </div>
      ))}
    </div>
  );
}
```

## 🎨 Dashboard Component

The `Dashboard.jsx` component demonstrates all features:

- **Real-time Search**: Fuzzy search across project titles, descriptions, and tech stacks
- **RBAC Integration**: Permission-based UI rendering
- **Recommendation Engine**: Tech stack suggestions
- **Caching**: Automatic performance optimization
- **Responsive Design**: Mobile-first approach

### Key Features:

1. **Search Bar**: Real-time project filtering
2. **Permission Checks**: Edit/delete buttons only show for authorized users
3. **Recommendations**: UI library suggestions for React projects
4. **Statistics**: Project counts and status overview
5. **Responsive Grid**: Adaptive layout for all screen sizes

## 🔒 Security Features

### Row Level Security (RLS)

The module includes comprehensive RLS policies:

- **Public Read**: Published projects are publicly readable
- **Owner Access**: Users can only edit/delete their own projects
- **Admin Override**: Admins have full access to all projects
- **Profile Management**: Users can only access their own profiles

### Frontend RBAC

- **Permission Checking**: `canUserPerform()` function for UI decisions
- **Role-based Access**: Admin, Editor, Viewer roles
- **Resource Ownership**: Ownership validation for specific actions

## 🚀 Performance Optimizations

### Caching Strategy

1. **Signed URLs**: 10-minute cache for storage URLs
2. **Projects**: 5-minute cache for project data
3. **User Profiles**: 15-minute cache for user data
4. **LRU Eviction**: Automatic cleanup of old entries

### Search Optimization

- **Fuse.js Integration**: Fast fuzzy search
- **Weighted Fields**: Optimized search relevance
- **Result Limiting**: Configurable result limits
- **Memoization**: Search engine reuse across renders

## 🛠️ Development Guidelines

### Best Practices

1. **Use the new module**: Import from `supabase-module.js`
2. **Leverage caching**: Let the module handle cache management
3. **Check permissions**: Always use `canUserPerform()` for UI decisions
4. **Handle errors**: Use try-catch blocks for async operations
5. **Memoize engines**: Use `useMemo` for search and recommendation engines

### Migration from Legacy

The old `supabase.js` file is maintained for backward compatibility but is deprecated. To migrate:

1. Update imports to use `supabase-module.js`
2. Replace direct Supabase calls with module functions
3. Implement RBAC checks in your components
4. Add search functionality where needed

## 📊 Monitoring & Debugging

### Error Handling

The module includes comprehensive error handling:

```javascript
import { SupabaseError } from './lib/supabase-module.js';

try {
  const projects = await fetchPublishedProjects();
} catch (error) {
  if (error instanceof SupabaseError) {
    console.error('Supabase Error:', error.message, error.code);
  }
}
```

### Cache Monitoring

```javascript
import { projectCache, userCache, signedUrlCache } from './lib/supabase-module.js';

// Clear caches if needed
projectCache.clear();
userCache.clear();
signedUrlCache.clear();
```

## 🎯 Next Steps

1. **Set up environment variables** in `.env.local`
2. **Run the database schema** in Supabase SQL Editor
3. **Import the Dashboard component** to see all features
4. **Customize the recommendation engine** for your specific needs
5. **Add more permission types** as your application grows

## 📞 Support

For questions or issues with the Supabase module:

- Check the console for detailed error messages
- Verify your environment variables are set correctly
- Ensure your Supabase RLS policies are properly configured
- Review the Dashboard component for implementation examples

---

**Built with ❤️ by the NANI TECH team**


