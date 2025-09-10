import { useEffect, useState, useMemo } from 'react';
import {
  fetchPublishedProjects,
  ProjectSearchEngine,
  RecommendationEngine,
  getUserProfile,
  canUserPerform,
  PERMISSIONS,
  supabase,
} from '../lib/supabase-module';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  
  // Memoize the engines so they are not recreated on every render
  const searchEngine = useMemo(() => new ProjectSearchEngine(projects), [projects]);
  const recommendationEngine = useMemo(() => new RecommendationEngine(projects), [projects]);

  // Initial data fetching
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Fetch projects (will use cache if available)
        const projectData = await fetchPublishedProjects();
        setProjects(projectData);
        setSearchResults(projectData); // Initially show all projects
        
        // Fetch current user profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const profile = await getUserProfile(user.id);
          setCurrentUser(profile);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Handle search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setSearchResults(projects);
    } else {
      const results = searchEngine.search(query);
      setSearchResults(results);
    }
  };

  // Get UI recommendations for React projects
  const getUiRecommendations = () => {
    const recommendations = recommendationEngine.recommendUiForFramework('React');
    setRecommendations(recommendations);
    console.log('Recommended UI libraries for React:', recommendations);
  };

  // Handle project editing with RBAC check
  const handleEditProject = (project) => {
    if (canUserPerform(currentUser, PERMISSIONS.PROJECT_EDIT_OWN, project)) {
      console.log('Access granted: User can edit this project.');
      // Navigate to edit page or open edit modal
      alert(`Edit access granted for: ${project.title}`);
    } else {
      console.log('Access Denied: User cannot edit this project.');
      alert('Access Denied: You do not have permission to edit this project.');
    }
  };

  // Handle project deletion with RBAC check
  const handleDeleteProject = (project) => {
    if (canUserPerform(currentUser, PERMISSIONS.PROJECT_DELETE_OWN, project)) {
      console.log('Access granted: User can delete this project.');
      // Show confirmation dialog and delete
      if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
        alert(`Delete access granted for: ${project.title}`);
      }
    } else {
      console.log('Access Denied: User cannot delete this project.');
      alert('Access Denied: You do not have permission to delete this project.');
    }
  };

  // Create new project with RBAC check
  const handleCreateProject = () => {
    if (canUserPerform(currentUser, PERMISSIONS.PROJECT_CREATE)) {
      console.log('Access granted: User can create new project.');
      alert('Create access granted: Opening project creation form...');
    } else {
      console.log('Access Denied: User cannot create projects.');
      alert('Access Denied: You do not have permission to create projects.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-white mt-4 text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Project Dashboard</h1>
          <p className="text-gray-300">
            Welcome, {currentUser?.fullName || 'Guest'} 
            {currentUser && (
              <span className="ml-2 px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
                {currentUser.role}
              </span>
            )}
          </p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-white/20">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Search projects by title, description, or tech stack..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={getUiRecommendations}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 font-medium"
              >
                Get UI Recs for React
              </button>
              <button 
                onClick={handleCreateProject}
                disabled={!canUserPerform(currentUser, PERMISSIONS.PROJECT_CREATE)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>

        {/* Recommendations Display */}
        {recommendations.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">UI Library Recommendations for React</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-cyan-400 font-medium">{rec.tech}</h4>
                  <p className="text-gray-300 text-sm">Score: {rec.score}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((project) => (
            <div key={project.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all duration-300 group">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-gray-300 text-sm mt-2 line-clamp-3">
                  {project.description}
                </p>
              </div>

              {/* Tech Stack */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {project.techStack?.slice(0, 3).map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">
                      {tech}
                    </span>
                  ))}
                  {project.techStack?.length > 3 && (
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
                      +{project.techStack.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Status and Featured Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'published' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {project.status}
                </span>
                {project.featured && (
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
                    Featured
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEditProject(project)}
                  disabled={!canUserPerform(currentUser, PERMISSIONS.PROJECT_EDIT_OWN, project)}
                  className="flex-1 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteProject(project)}
                  disabled={!canUserPerform(currentUser, PERMISSIONS.PROJECT_DELETE_OWN, project)}
                  className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              </div>

              {/* Links */}
              <div className="mt-4 flex gap-2">
                {project.githubUrl && (
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-all duration-300 text-sm text-center"
                  >
                    GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300 text-sm text-center"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {searchResults.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No projects found matching "{searchQuery}"</p>
            <button 
              onClick={() => handleSearch('')}
              className="mt-4 px-6 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Dashboard Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400">{projects.length}</p>
              <p className="text-gray-300 text-sm">Total Projects</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">
                {projects.filter(p => p.status === 'published').length}
              </p>
              <p className="text-gray-300 text-sm">Published</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">
                {projects.filter(p => p.status === 'draft').length}
              </p>
              <p className="text-gray-300 text-sm">Drafts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">
                {projects.filter(p => p.featured).length}
              </p>
              <p className="text-gray-300 text-sm">Featured</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

