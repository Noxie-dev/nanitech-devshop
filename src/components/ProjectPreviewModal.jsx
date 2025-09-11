import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Maximize2,
  ExternalLink,
  Github,
  Calendar,
  User,
  Tag,
  Eye,
  Heart,
  Star
} from 'lucide-react';

const ProjectPreviewModal = ({ projectData, images, onClose, isOpen }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto-play slideshow
  useEffect(() => {
    if (isPlaying && images && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, images]);

  const nextImage = () => {
    if (images && images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images && images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  if (!isOpen || !projectData) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'queued':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className={`bg-gray-900 w-full rounded-lg shadow-2xl flex flex-col ${
        isFullscreen ? 'h-full max-w-none' : 'max-w-6xl h-[90vh]'
      }`}>
        {/* Header */}
        <header className="flex justify-between items-center p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">Project Preview</h2>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(projectData.status)}`}>
                {projectData.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getTypeColor(projectData.type)}`}>
                {projectData.type}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Toggle Fullscreen"
            >
              <Maximize2 size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow overflow-y-auto">
          {/* Image Slideshow */}
          {images && images.length > 0 && (
            <div className="relative bg-gray-800">
              <div className="relative aspect-video bg-gray-900">
                <img
                  src={images[currentImageIndex]?.preview}
                  alt={`Project image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                
                {/* Navigation Controls */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 p-3 rounded-full transition-all"
                    >
                      <ChevronLeft size={24} className="text-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 p-3 rounded-full transition-all"
                    >
                      <ChevronRight size={24} className="text-white" />
                    </button>
                  </>
                )}

                {/* Play/Pause Button */}
                {images.length > 1 && (
                  <button
                    onClick={togglePlayPause}
                    className="absolute bottom-4 left-4 bg-black bg-opacity-50 hover:bg-opacity-70 p-3 rounded-full transition-all"
                  >
                    {isPlaying ? (
                      <Pause size={20} className="text-white" />
                    ) : (
                      <Play size={20} className="text-white" />
                    )}
                  </button>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 px-3 py-1 rounded-full text-white text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="p-4 border-t border-gray-700">
                  <div className="flex gap-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex
                            ? 'border-blue-500'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <img
                          src={image.preview}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Project Details */}
          <div className="p-6 space-y-6">
            {/* Title and Meta */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{projectData.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Created {formatDate(projectData.createdAt)}</span>
                </div>
                {projectData.updatedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Updated {formatDate(projectData.updatedAt)}</span>
                  </div>
                )}
                {projectData.viewCount && (
                  <div className="flex items-center gap-2">
                    <Eye size={16} />
                    <span>{projectData.viewCount} views</span>
                  </div>
                )}
                {projectData.likeCount && (
                  <div className="flex items-center gap-2">
                    <Heart size={16} />
                    <span>{projectData.likeCount} likes</span>
                  </div>
                )}
                {projectData.featured && (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Star size={16} />
                    <span>Featured</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tech Stack */}
            {projectData.techStack && projectData.techStack.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Tag size={20} />
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {projectData.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {projectData.description}
              </p>
            </div>

            {/* Links */}
            <div className="flex gap-4">
              {projectData.githubUrl && (
                <a
                  href={projectData.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <Github size={20} />
                  View on GitHub
                </a>
              )}
              {projectData.liveUrl && (
                <a
                  href={projectData.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <ExternalLink size={20} />
                  Live Demo
                </a>
              )}
            </div>

            {/* Additional Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
              <div>
                <h4 className="font-medium text-gray-300 mb-2">Project Details</h4>
                <div className="space-y-1 text-sm text-gray-400">
                  <div>Category: <span className="text-white">{projectData.category}</span></div>
                  <div>Type: <span className="text-white">{projectData.type}</span></div>
                  <div>Status: <span className="text-white capitalize">{projectData.status}</span></div>
                </div>
              </div>
              
              {projectData.metadata && (
                <div>
                  <h4 className="font-medium text-gray-300 mb-2">Additional Info</h4>
                  <div className="space-y-1 text-sm text-gray-400">
                    {Object.entries(projectData.metadata).map(([key, value]) => (
                      <div key={key}>
                        {key}: <span className="text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 border-t border-gray-700 bg-gray-800">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              This is a preview of how your project will appear on the website
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  // TODO: Implement publish functionality
                  console.log('Publish project:', projectData);
                }}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Publish Project
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ProjectPreviewModal;

