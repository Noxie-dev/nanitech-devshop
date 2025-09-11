import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw,
  Eye,
  Trash2
} from 'lucide-react';

const QueueItem = ({ job, onRetry, onView, onDelete }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'failed':
        return <AlertTriangle className="text-red-500" size={20} />;
      case 'processing':
        return <RefreshCw className="text-blue-500 animate-spin" size={20} />;
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatJobType = (jobType) => {
    return jobType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const jobDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - jobDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {/* Status Icon */}
          <div className="flex-shrink-0">
            {getStatusIcon(job.status)}
          </div>

          {/* Job Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-semibold text-white truncate">
                {formatJobType(job.job_type)}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Job ID: {job.id.substring(0, 8)}...</span>
              <span>Attempts: {job.attempts}</span>
              <span>{getTimeAgo(job.created_at)}</span>
            </div>

            {job.last_error && (
              <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-400">
                <strong>Error:</strong> {job.last_error}
              </div>
            )}

            {job.payload && Object.keys(job.payload).length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                <strong>Payload:</strong> {JSON.stringify(job.payload, null, 2).substring(0, 100)}...
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(job)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>

          {job.status === 'failed' && (
            <button
              onClick={() => onRetry(job)}
              className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-gray-700 rounded-lg transition-colors"
              title="Retry Job"
            >
              <RotateCcw size={16} />
            </button>
          )}

          {(job.status === 'completed' || job.status === 'failed') && (
            <button
              onClick={() => onDelete(job)}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-lg transition-colors"
              title="Delete Job"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Project Info */}
      {job.projects && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Project:</span>
            <span className="text-white font-medium">{job.projects.title}</span>
            <span className="text-gray-500">•</span>
            <span>Created by: {job.projects.createdBy}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const QueueManagementView = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchQueue();
  }, [filter, sortBy, sortOrder]);

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      // TODO: API Integration
      // Call getProjectQueue() from supabase-module.js
      
      // Mock data for now
      const mockQueue = [
        {
          id: 'uuid-1',
          project_id: 'proj-1',
          job_type: 'process_images',
          status: 'processing',
          payload: { 
            message: 'Processing 5 images for project Tic-Tac-Toe AI',
            imageCount: 5
          },
          attempts: 1,
          last_error: null,
          last_attempt_at: new Date().toISOString(),
          created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
          projects: {
            id: 'proj-1',
            title: 'Tic-Tac-Toe AI',
            createdBy: 'user-123'
          }
        },
        {
          id: 'uuid-2',
          project_id: 'proj-2',
          job_type: 'send_notification',
          status: 'completed',
          payload: { 
            message: 'Project E-commerce Platform published successfully',
            notificationType: 'project_published'
          },
          attempts: 1,
          last_error: null,
          last_attempt_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
          projects: {
            id: 'proj-2',
            title: 'E-commerce Platform',
            createdBy: 'user-456'
          }
        },
        {
          id: 'uuid-3',
          project_id: 'proj-3',
          job_type: 'generate_report',
          status: 'failed',
          payload: { 
            message: 'Generate monthly project report',
            reportType: 'monthly'
          },
          attempts: 3,
          last_error: 'Timeout exceeded after 30 seconds',
          last_attempt_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          projects: {
            id: 'proj-3',
            title: 'Mobile Banking App',
            createdBy: 'user-789'
          }
        },
        {
          id: 'uuid-4',
          project_id: 'proj-4',
          job_type: 'auto_publish',
          status: 'pending',
          payload: { 
            message: 'Auto-publish project at scheduled time',
            scheduledTime: '2024-01-01T10:00:00Z'
          },
          attempts: 0,
          last_error: null,
          last_attempt_at: null,
          created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
          projects: {
            id: 'proj-4',
            title: 'AI Chatbot',
            createdBy: 'user-123'
          }
        }
      ];

      // Apply filters
      let filteredJobs = mockQueue;
      
      if (filter !== 'all') {
        filteredJobs = mockQueue.filter(job => job.status === filter);
      }

      // Apply sorting
      filteredJobs.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      setJobs(filteredJobs);
    } catch (error) {
      console.error('Error fetching queue:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async (job) => {
    try {
      // TODO: API Integration
      // Call retryQueueJob() function
      console.log('Retrying job:', job.id);
      
      // Update local state
      setJobs(prev => prev.map(j => 
        j.id === job.id 
          ? { ...j, status: 'pending', attempts: j.attempts + 1 }
          : j
      ));
    } catch (error) {
      console.error('Error retrying job:', error);
    }
  };

  const handleView = (job) => {
    // TODO: Show job details modal
    console.log('View job details:', job);
  };

  const handleDelete = async (job) => {
    try {
      // TODO: API Integration
      // Call deleteQueueJob() function
      console.log('Deleting job:', job.id);
      
      // Update local state
      setJobs(prev => prev.filter(j => j.id !== job.id));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const getStats = () => {
    const total = jobs.length;
    const pending = jobs.filter(j => j.status === 'pending').length;
    const processing = jobs.filter(j => j.status === 'processing').length;
    const completed = jobs.filter(j => j.status === 'completed').length;
    const failed = jobs.filter(j => j.status === 'failed').length;

    return { total, pending, processing, completed, failed };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-gray-400">Loading queue...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Job Queue</h2>
          <p className="text-gray-400">Monitor and manage background jobs</p>
        </div>
        
        <button
          onClick={fetchQueue}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-sm text-gray-400">Total Jobs</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
          <div className="text-sm text-gray-400">Pending</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-blue-400">{stats.processing}</div>
          <div className="text-sm text-gray-400">Processing</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
          <div className="text-sm text-gray-400">Completed</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-red-400">{stats.failed}</div>
          <div className="text-sm text-gray-400">Failed</div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="created_at">Sort by Date</option>
            <option value="job_type">Sort by Type</option>
            <option value="status">Sort by Status</option>
            <option value="attempts">Sort by Attempts</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Queue Items */}
      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No jobs in queue</h3>
          <p className="text-gray-400">All jobs have been processed or no jobs have been created yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <QueueItem
              key={job.id}
              job={job}
              onRetry={handleRetry}
              onView={handleView}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QueueManagementView;

