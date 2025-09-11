import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, 
  XCircle, 
  Edit, 
  Save, 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { getCroppedImg, compressImage, validateImageFile, getImageDimensions } from '../utils/imageUtils';

// Sortable Image Item Component
const SortableImageItem = ({ file, onEdit, onRemove, isProcessing }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: file.preview });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex items-center bg-gray-800 p-3 rounded-lg mb-3 border border-gray-700 hover:border-gray-600 transition-all ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <div
        {...listeners}
        className="cursor-grab p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
      >
        <GripVertical size={20} />
      </div>
      
      <div className="relative w-16 h-16 mx-4 flex-shrink-0">
        <img
          src={file.preview}
          alt="preview"
          className="w-full h-full object-cover rounded-md"
        />
        {isProcessing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      
      <div className="flex-grow min-w-0">
        <p className="text-sm font-medium text-white truncate">{file.name}</p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          {file.dimensions && (
            <span>{file.dimensions.width} × {file.dimensions.height}</span>
          )}
          {file.compressed && (
            <span className="text-green-400 flex items-center gap-1">
              <CheckCircle size={12} />
              Compressed
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(file)}
          disabled={isProcessing}
          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Edit Image"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={() => onRemove(file)}
          disabled={isProcessing}
          className="p-2 text-red-500 hover:text-red-400 hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Remove Image"
        >
          <XCircle size={18} />
        </button>
      </div>
    </div>
  );
};

// Main Image Editor Component
const ImageEditor = ({ onImagesChange, maxFiles = 10 }) => {
  const [files, setFiles] = useState([]);
  const [editingFile, setEditingFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingFile, setProcessingFile] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const newFiles = [];
    setIsProcessing(true);

    for (const file of acceptedFiles.slice(0, maxFiles - files.length)) {
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        alert(`Error with ${file.name}: ${validation.error}`);
        continue;
      }

      // Get image dimensions
      try {
        const dimensions = await getImageDimensions(file);
        
        // Compress if too large
        let processedFile = file;
        if (file.size > 4 * 1024 * 1024 || dimensions.width > 3000) {
          setProcessingFile(file.name);
          processedFile = await compressImage(file, 3000, 0.8);
          processedFile.compressed = true;
        }

        // Create file object with metadata
        const fileObj = Object.assign(processedFile, {
          preview: URL.createObjectURL(processedFile),
          dimensions,
          originalSize: file.size,
          compressed: processedFile !== file
        });

        newFiles.push(fileObj);
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        alert(`Error processing ${file.name}. Please try again.`);
      }
    }

    setProcessingFile(null);
    setIsProcessing(false);
    
    if (newFiles.length > 0) {
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onImagesChange(updatedFiles);
    }
  }, [files, maxFiles, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxFiles: maxFiles - files.length,
    disabled: isProcessing
  });

  const handleRemove = (fileToRemove) => {
    const newFiles = files.filter(f => f.preview !== fileToRemove.preview);
    setFiles(newFiles);
    onImagesChange(newFiles);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = files.findIndex(f => f.preview === active.id);
      const newIndex = files.findIndex(f => f.preview === over.id);
      const reordered = arrayMove(files, oldIndex, newIndex);
      setFiles(reordered);
      onImagesChange(reordered);
    }
  };

  const handleSaveCrop = async () => {
    if (!croppedAreaPixels || !editingFile) return;
    
    setIsProcessing(true);
    setProcessingFile(editingFile.name);
    
    try {
      const croppedImageBlob = await getCroppedImg(editingFile.preview, croppedAreaPixels);
      const croppedFile = new File([croppedImageBlob], editingFile.name, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      
      // Get dimensions of cropped image
      const dimensions = await getImageDimensions(croppedFile);
      
      Object.assign(croppedFile, {
        preview: URL.createObjectURL(croppedImageBlob),
        dimensions,
        cropped: true,
        originalSize: editingFile.originalSize || editingFile.size
      });
      
      const updatedFiles = files.map(f => f.preview === editingFile.preview ? croppedFile : f);
      setFiles(updatedFiles);
      onImagesChange(updatedFiles);
      setEditingFile(null);
    } catch (error) {
      console.error("Error cropping image:", error);
      alert("Error cropping image. Please try again.");
    } finally {
      setIsProcessing(false);
      setProcessingFile(null);
    }
  };

  const cancelCrop = () => {
    setEditingFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
  };

  if (editingFile) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
        <div className="relative w-full h-4/5 max-w-6xl bg-gray-900 rounded-lg overflow-hidden">
          <Cropper
            image={editingFile.preview}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={16 / 9}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
            style={{
              containerStyle: {
                width: '100%',
                height: '100%',
                position: 'relative'
              }
            }}
          />
        </div>
        
        <div className="w-full max-w-6xl bg-gray-800 p-6 rounded-b-lg">
          <div className="space-y-4">
            {/* Zoom Controls */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Zoom: {Math.round(zoom * 100)}%
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <ZoomOut size={16} />
                </button>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <button
                  onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <ZoomIn size={16} />
                </button>
              </div>
            </div>

            {/* Rotation Controls */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rotation: {rotation}°
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setRotation(rotation - 90)}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <RotateCw size={16} className="rotate-180" />
                </button>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="90"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="flex-1"
                />
                <button
                  onClick={() => setRotation(rotation + 90)}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <RotateCw size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-400">
              {croppedAreaPixels && (
                <span>
                  Crop: {Math.round(croppedAreaPixels.width)} × {Math.round(croppedAreaPixels.height)}px
                </span>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={cancelCrop}
                className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleSaveCrop}
                disabled={!croppedAreaPixels || isProcessing}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Crop
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-600 hover:border-gray-500'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
            {isProcessing ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            ) : (
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            )}
          </div>
          <div>
            <p className="text-lg font-medium text-white">
              {isProcessing
                ? `Processing ${processingFile}...`
                : isDragActive
                ? 'Drop images here'
                : `Drag & drop up to ${maxFiles} images here, or click to select`}
            </p>
            <p className="text-gray-400 text-sm">
              {isProcessing ? 'Please wait...' : 'Supports: JPEG, PNG, WebP, GIF (Max 50MB each)'}
            </p>
            {!isProcessing && (
              <p className="text-gray-500 text-xs mt-2">
                Large images will be automatically compressed for optimal performance
              </p>
            )}
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Images ({files.length}/{maxFiles})
            </h3>
            <p className="text-sm text-gray-400">
              Drag to reorder • Click edit to crop
            </p>
          </div>

          <DndContext
            sensors={useSensors(useSensor(PointerSensor))}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={files.map(f => f.preview)}
              strategy={verticalListSortingStrategy}
            >
              {files.map(file => (
                <SortableImageItem
                  key={file.preview}
                  file={file}
                  onEdit={setEditingFile}
                  onRemove={handleRemove}
                  isProcessing={isProcessing && processingFile === file.name}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span className="text-blue-400 font-medium">
              Processing images... This may take a moment for large files.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;

