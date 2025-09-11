import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ImageEditor from './ImageEditor';
import ProjectPreviewModal from './ProjectPreviewModal';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

// Tech Stack Data Structure
const techData = {
  'Front-end': {
    JavaScript: {
      React: ['Tailwind CSS', 'Shadcn UI', 'Material UI', 'Chakra UI', 'Ant Design'],
      Vue: ['Tailwind CSS', 'Vuetify', 'Element Plus', 'Quasar'],
      Angular: ['Angular Material', 'PrimeNG', 'NG-ZORRO'],
      Svelte: ['Tailwind CSS', 'Svelte Material UI']
    },
    TypeScript: {
      React: ['Tailwind CSS', 'Shadcn UI', 'Material UI', 'Chakra UI', 'Ant Design'],
      Vue: ['Tailwind CSS', 'Vuetify', 'Element Plus', 'Quasar'],
      Angular: ['Angular Material', 'PrimeNG', 'NG-ZORRO'],
      Svelte: ['Tailwind CSS', 'Svelte Material UI']
    }
  },
  'Back-end': {
    JavaScript: {
      'Node.js': ['Express', 'Fastify', 'Koa', 'NestJS'],
      'Deno': ['Oak', 'Fresh']
    },
    TypeScript: {
      'Node.js': ['Express', 'Fastify', 'Koa', 'NestJS'],
      'Deno': ['Oak', 'Fresh']
    },
    Python: {
      Django: ['Django REST Framework', 'Django Channels'],
      Flask: ['Flask-RESTful', 'Flask-SocketIO'],
      FastAPI: ['Pydantic', 'SQLAlchemy']
    },
    Go: {
      'Gin': ['GORM', 'Viper'],
      'Echo': ['GORM', 'Viper']
    }
  },
  'Mobile': {
    JavaScript: {
      'React Native': ['Expo', 'NativeBase', 'React Native Elements'],
      'Ionic': ['Capacitor', 'Stencil']
    },
    TypeScript: {
      'React Native': ['Expo', 'NativeBase', 'React Native Elements'],
      'Ionic': ['Capacitor', 'Stencil']
    },
    Dart: {
      'Flutter': ['Provider', 'Bloc', 'GetX']
    }
  },
  'AI/ML': {
    Python: {
      'TensorFlow': ['Keras', 'TensorBoard'],
      'PyTorch': ['Torchvision', 'Transformers'],
      'Scikit-learn': ['Pandas', 'NumPy', 'Matplotlib']
    },
    JavaScript: {
      'TensorFlow.js': ['ML5.js', 'Brain.js']
    }
  }
};

const ProjectCreationWizard = ({ onClose, onProjectCreated }) => {
  const [step, setStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors } 
  } = useForm({
    defaultValues: { 
      techStack: [],
      status: 'draft',
      category: 'Web Apps'
    }
  });

  // State for dynamic tech stack selection
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('');
  const [framework, setFramework] = useState('');
  const selectedTech = watch('techStack');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      console.log('Final Form Data:', data);
      console.log('Uploaded Images:', uploadedImages);
      
      // TODO: API Integration
      // 1. Call image-management Supabase function to get signed URLs
      // 2. Upload files directly to Supabase Storage
      // 3. Call project-crud function with form data and image paths
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onProjectCreated) {
        onProjectCreated({ ...data, images: uploadedImages });
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTechSelect = (tech) => {
    const newStack = selectedTech.includes(tech)
      ? selectedTech.filter(t => t !== tech)
      : [...selectedTech, tech];
    setValue('techStack', newStack);
  };

  const renderStepOne = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Project Details</h2>
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
          Project Title *
        </label>
        <input
          {...register('title', { required: 'Title is required' })}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter project title..."
        />
        {errors.title && (
          <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          rows={4}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Describe your project..."
        />
        {errors.description && (
          <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
            Status
          </label>
          <select
            {...register('status')}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            {...register('category')}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Web Apps">Web Apps</option>
            <option value="Mobile">Mobile</option>
            <option value="AI/ML">AI/ML</option>
            <option value="Desktop">Desktop</option>
            <option value="Gaming">Gaming</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Tech Stack Selection</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setLanguage('');
              setFramework('');
            }}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Category</option>
            {Object.keys(techData).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Language */}
        {category && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setFramework('');
              }}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Language</option>
              {Object.keys(techData[category]).map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        )}

        {/* Framework */}
        {language && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Framework</label>
            <select
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Framework</option>
              {Object.keys(techData[category][language]).map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* UI Libraries / Related Tech */}
      {framework && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-300 mb-4">Select UI Libraries & Tools:</h3>
          <div className="flex flex-wrap gap-3">
            {techData[category][language][framework].map(lib => (
              <button
                key={lib}
                type="button"
                onClick={() => handleTechSelect(lib)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedTech.includes(lib)
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                {lib}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Tech Stack Display */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h4 className="font-semibold text-gray-300 mb-3">Selected Tech Stack:</h4>
        <div className="flex flex-wrap gap-2">
          {selectedTech.length > 0 ? (
            selectedTech.map(tech => (
              <span
                key={tech}
                className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-sm">No technologies selected yet</span>
          )}
        </div>
      </div>
    </div>
  );

  const renderStepThree = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Upload Images</h2>
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          disabled={!watch('title') || !watch('description') || uploadedImages.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <Eye size={18} />
          Preview Project
        </button>
      </div>
      <ImageEditor onImagesChange={setUploadedImages} maxFiles={10} />
    </div>
  );

  const totalSteps = 3;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wizard-title"
    >
      <div className="bg-gray-900 text-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
          <div>
            <h1 id="wizard-title" className="text-xl sm:text-2xl font-bold">Create New Project</h1>
            <p className="text-gray-400 text-sm">Step {step} of {totalSteps}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close wizard"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-4 sm:px-6 py-4">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
              role="progressbar"
              aria-valuenow={step}
              aria-valuemin={1}
              aria-valuemax={totalSteps}
              aria-label={`Step ${step} of ${totalSteps}`}
            />
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
          {step === 1 && (
            <>
              <h2 className="sr-only">Step 1: Project Details</h2>
              {renderStepOne()}
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="sr-only">Step 2: Tech Stack Selection</h2>
              {renderStepTwo()}
            </>
          )}
          {step === 3 && (
            <>
              <h2 className="sr-only">Step 3: Upload Images</h2>
              {renderStepThree()}
            </>
          )}
        </form>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 sm:p-6 border-t border-gray-700">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <ChevronLeft size={20} />
                Back
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            
            {step < totalSteps ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Next
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 disabled:focus:ring-0"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Project Preview Modal */}
      {showPreview && (
        <ProjectPreviewModal
          projectData={{
            title: watch('title'),
            description: watch('description'),
            status: watch('status'),
            category: watch('category'),
            techStack: selectedTech,
            type: 'UI', // Default type
            createdAt: new Date().toISOString(),
            viewCount: 0,
            likeCount: 0,
            featured: false
          }}
          images={uploadedImages}
          onClose={() => setShowPreview(false)}
          isOpen={showPreview}
        />
      )}
    </div>
  );
};

export default ProjectCreationWizard;
