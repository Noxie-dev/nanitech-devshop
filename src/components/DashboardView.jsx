import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import ProjectCard from './ProjectCard';
import QueueManagementView from './QueueManagementView';
import SettingsView from './SettingsView';
import useDebounce from '../hooks/useDebounce';
import { PlusCircle, Search, Filter, Grid, List, Settings, User, LogOut, Shield } from 'lucide-react';

// Lazy load heavy components
const ProjectCreationWizard = React.lazy(() => import('./ProjectCreationWizard'));

const TABS = [
  { id: 'all', label: 'All Projects', count: 0 },
  { id: 'web-apps', label: 'Web Apps', count: 0 },
  { id: 'mobile', label: 'Mobile', count: 0 },
  { id: 'ai-ml', label: 'AI/ML', count: 0 },
  { id: 'gaming', label: 'Gaming', count: 0 },
  { id: 'deleted', label: 'Deleted', count: 0 },
  { id: 'queue', label: 'Queue', count: 0 },
  { id: 'settings', label: 'Settings', count: 0 }
];

const DashboardView = () => {
  const { user, signOut, is2FAEnabled } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Debounce search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchProjects();
  }, [activeTab, debouncedSearchQuery, filterStatus]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      // TODO: API Integration
      // Call appropriate Supabase function based on activeTab
      // For 'deleted' tab: call getDeletedProjects()
      // For 'queue' tab: call getProjectQueue()
      // For others: call getProjects with category filter
      
      // Mock data for now
      const mockProjects = [
        {
          id: '1',
          title: 'Tic-Tac-Toe AI',
          description: 'Modern Tic-Tac-Toe game with AI opponents featuring three difficulty levels',
          status: 'published',
          type: 'UI',
          category: 'gaming',
          techStack: ['React', 'TypeScript', 'Tailwind CSS'],
          createdAt: '2023-10-26T10:00:00Z',
          updatedAt: '2023-10-26T10:00:00Z',
          viewCount: 150,
          likeCount: 23,
          featured: true,
          images: ['/TickTechToe-media/Screenshot 2025-09-10 at 17.54.41.png']
        },
        {
          id: '2',
          title: 'E-commerce Platform',
          description: 'Full-stack e-commerce solution with payment integration and admin dashboard',
          status: 'draft',
          type: 'Code',
          category: 'web-apps',
          techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
          createdAt: '2023-09-15T10:00:00Z',
          updatedAt: '2023-09-20T14:30:00Z',
          viewCount: 89,
          likeCount: 12,
          featured: false,
          images: ['/hero-image.png']
        },
        {
          id: '3',
          title: 'Mobile Banking App',
          description: 'Secure mobile banking application with biometric authentication',
          status: 'published',
          type: 'Code',
          category: 'mobile',
          techStack: ['React Native', 'TypeScript', 'Firebase'],
          createdAt: '2023-08-10T09:00:00Z',
          updatedAt: '2023-08-15T16:45:00Z',
          viewCount: 234,
          likeCount: 45,
          featured: true,
          images: []
        }
      ];

      // Filter projects based on active tab
      let filteredProjects = mockProjects;
      
      if (activeTab !== 'all') {
        if (activeTab === 'deleted') {
          // Show deleted projects (mock data)
          filteredProjects = [
            {
              id: 'deleted-1',
              title: 'Old Portfolio Site',
              description: 'Previous version of portfolio website',
              status: 'deleted',
              type: 'UI',
              category: 'web-apps',
              deletedAt: '2023-07-01T10:00:00Z',
              deletedBy: 'user-123'
            }
          ];
        } else if (activeTab === 'queue') {
          // Show queued projects
          filteredProjects = [
            {
              id: 'queue-1',
              title: 'AI Chatbot',
              description: 'Intelligent customer support chatbot',
              status: 'queued',
              type: 'Code',
              category: 'ai-ml',
              queuedAt: '2023-11-01T10:00:00Z',
              scheduledPublishAt: '2023-11-02T10:00:00Z'
            }
          ];
        } else {
          filteredProjects = mockProjects.filter(project => project.category === activeTab);
        }
      }

      // Apply search filter
      if (debouncedSearchQuery) {
        filteredProjects = filteredProjects.filter(project =>
          project.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          project.techStack.some(tech => tech.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
        );
      }

      // Apply status filter
      if (filterStatus !== 'all') {
        filteredProjects = filteredProjects.filter(project => project.status === filterStatus);
      }

      setProjects(filteredProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectCreated = (newProject) => {
    console.log('New project created:', newProject);
    // TODO: Add to projects list and refresh
    fetchProjects();
  };

  const renderContent = () => {
    if (activeTab === 'queue') {
      return <QueueManagementView />;
    }

    if (activeTab === 'settings') {
      return <SettingsView />;
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-4 text-gray-400">Loading projects...</span>
        </div>
      );
    }

    if (projects.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
          <p className="text-gray-400 mb-6">
            {debouncedSearchQuery ? 'Try adjusting your search terms' : 'Get started by creating your first project'}
          </p>
          {!debouncedSearchQuery && (
            <button
              onClick={() => setIsWizardOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Create Project
            </button>
          )}
        </div>
      );
    }

      return (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6' : 'space-y-4'}>
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              viewMode={viewMode}
              onEdit={() => console.log('Edit project:', project.id)}
              onDelete={() => console.log('Delete project:', project.id)}
              onRestore={() => console.log('Restore project:', project.id)}
            />
          ))}
        </div>
      );
  };

  return (
    <ProtectedRoute require2FA={true}>
      <div className="pt-20 p-4 sm:p-6 md:p-8 bg-[#0C0F16] min-h-screen text-[#EAEAEA]">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 md:mb-10 gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#EAEAEA] font-orbitron">
                Projects Dashboard
              </h1>
              {is2FAEnabled && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-400">2FA Enabled</span>
                </div>
              )}
            </div>
            <p className="text-sm sm:text-base text-[#EAEAEA]/70">
              Manage your projects, track progress, and showcase your work
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-[#EAEAEA]">
                  {user?.user_metadata?.full_name || user?.email}
                </p>
                <p className="text-xs text-[#EAEAEA]/60">
                  {user?.email}
                </p>
              </div>
              
              <div className="w-8 h-8 bg-gradient-to-r from-[#00E5FF] to-[#E53935] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              
              <button
                onClick={signOut}
                className="p-2 text-[#EAEAEA]/60 hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
            
            <button
              onClick={() => setIsWizardOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#00E5FF] to-[#0066CC] hover:scale-105 text-white font-medium py-3 px-4 sm:px-6 rounded-lg transition-transform"
            >
              <PlusCircle size={20} />
              <span className="hidden sm:inline">Add Project</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </header>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="queued">Queued</option>
          </select>
          
          <div className="flex bg-gray-800 rounded-lg p-1 self-start">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              aria-label="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabbed Interface */}
      <div className="border-b border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-4 sm:space-x-6 lg:space-x-8 overflow-x-auto pb-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 sm:py-3 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors flex-shrink-0 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              {tab.count > 0 && (
                <span className="ml-1 sm:ml-2 bg-gray-700 text-gray-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {renderContent()}

      {/* Project Creation Wizard Modal */}
      {isWizardOpen && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 text-white rounded-lg p-6 flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span>Loading wizard...</span>
            </div>
          </div>
        }>
          <ProjectCreationWizard
            onClose={() => setIsWizardOpen(false)}
            onProjectCreated={handleProjectCreated}
          />
        </Suspense>
      )}
      </div>
    </ProtectedRoute>
  );
};

export default DashboardView;
