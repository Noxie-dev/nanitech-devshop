import React, { useState, memo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  MoreVertical, 
  Trash2, 
  Edit, 
  Eye, 
  Heart, 
  ExternalLink, 
  Github,
  RotateCcw,
  Clock,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';

const ProjectCard = memo(({ 
  project, 
  viewMode = 'grid', 
  onEdit, 
  onDelete, 
  onRestore 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  
  const getStatusInfo = (status) => {
    switch (status) {
      case 'published':
        return { 
          icon: <CheckCircle size={16} />, 
          color: 'bg-green-600', 
          text: 'Published' 
        };
      case 'draft':
        return { 
          icon: <Edit size={16} />, 
          color: 'bg-yellow-600', 
          text: 'Draft' 
        };
      case 'queued':
        return { 
          icon: <Clock size={16} />, 
          color: 'bg-blue-600', 
          text: 'Queued' 
        };
      case 'deleted':
        return { 
          icon: <Trash2 size={16} />, 
          color: 'bg-red-600', 
          text: 'Deleted' 
        };
      default:
        return { 
          icon: <AlertCircle size={16} />, 
          color: 'bg-gray-600', 
          text: status 
        };
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'UI':
        return 'bg-purple-600';
      case 'Code':
        return 'bg-blue-600';
      case 'Design':
        return 'bg-pink-600';
      default:
        return 'bg-gray-600';
    }
  };

  const timeSinceAdded = formatDistanceToNow(new Date(project.createdAt), { addSuffix: true });
  const statusInfo = getStatusInfo(project.status);

  if (viewMode === 'list') {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* Project Image */}
            <div className="w-16 h-16 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
              {project.images && project.images.length > 0 ? (
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-white truncate">{project.title}</h3>
                {project.featured && (
                  <Star size={16} className="text-yellow-400 flex-shrink-0" />
                )}
              </div>
              <p className="text-gray-400 text-sm mb-2 line-clamp-2">{project.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Type: <span className={`px-2 py-1 rounded-full text-white ${getTypeColor(project.type)}`}>{project.type}</span></span>
                <span>Added {timeSinceAdded}</span>
                {project.viewCount && <span>{project.viewCount} views</span>}
                {project.likeCount && <span>{project.likeCount} likes</span>}
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm ${statusInfo.color}`}>
              {statusInfo.icon}
              {statusInfo.text}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <MoreVertical size={20} />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg border border-gray-600 z-10">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        onEdit();
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                    >
                      <Edit size={16} />
                      Edit Project
                    </button>
                    
                    <button
                      onClick={() => {
                        console.log('View project:', project.id);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                    >
                      <Eye size={16} />
                      View Details
                    </button>

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                      >
                        <Github size={16} />
                        View on GitHub
                      </a>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                      >
                        <ExternalLink size={16} />
                        Live Demo
                      </a>
                    )}

                    <div className="border-t border-gray-600 my-1"></div>

                    {project.status === 'deleted' ? (
                      <button
                        onClick={() => {
                          onRestore();
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-green-400 hover:bg-gray-600 hover:text-green-300 transition-colors"
                      >
                        <RotateCcw size={16} />
                        Restore Project
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onDelete();
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-600 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                        Delete Project
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex flex-wrap gap-2">
              {project.techStack.slice(0, 5).map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 5 && (
                <span className="px-2 py-1 bg-gray-600 text-gray-400 text-xs rounded-full">
                  +{project.techStack.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 flex flex-col justify-between hover:scale-105 transition-transform duration-200 border border-gray-700 hover:border-gray-600">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm ${statusInfo.color}`}>
          {statusInfo.icon}
          {statusInfo.text}
        </div>
        
        <div className="flex items-center gap-2">
          {project.featured && (
            <Star size={16} className="text-yellow-400" />
          )}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Project Image */}
      <div className="w-full h-32 bg-gray-700 rounded-lg mb-4 overflow-hidden">
        {project.images && project.images.length > 0 ? (
          <img
            src={project.images[0]}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{project.title}</h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-3">{project.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${getTypeColor(project.type)}`}>
            {project.type}
          </span>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {project.viewCount && (
              <div className="flex items-center gap-1">
                <Eye size={12} />
                {project.viewCount}
              </div>
            )}
            {project.likeCount && (
              <div className="flex items-center gap-1">
                <Heart size={12} />
                {project.likeCount}
              </div>
            )}
          </div>
        </div>

        {/* Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.techStack.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="px-2 py-1 bg-gray-600 text-gray-400 text-xs rounded-full">
                +{project.techStack.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-700">
        <p className="text-gray-500 text-xs mb-3">
          Added {timeSinceAdded}
        </p>
        
        <div className="flex gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors"
            >
              <Github size={16} />
              GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              <ExternalLink size={16} />
              Live Demo
            </a>
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute right-2 top-2 mt-8 w-48 bg-gray-700 rounded-lg shadow-lg border border-gray-600 z-10">
          <div className="py-2">
            <button
              onClick={() => {
                onEdit();
                setShowMenu(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
            >
              <Edit size={16} />
              Edit Project
            </button>
            
            <button
              onClick={() => {
                console.log('View project:', project.id);
                setShowMenu(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
            >
              <Eye size={16} />
              View Details
            </button>

            <div className="border-t border-gray-600 my-1"></div>

            {project.status === 'deleted' ? (
              <button
                onClick={() => {
                  onRestore();
                  setShowMenu(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-green-400 hover:bg-gray-600 hover:text-green-300 transition-colors"
              >
                <RotateCcw size={16} />
                Restore Project
              </button>
            ) : (
              <button
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-600 hover:text-red-300 transition-colors"
              >
                <Trash2 size={16} />
                Delete Project
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
