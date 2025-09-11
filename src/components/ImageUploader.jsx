import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Crop, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

const ImageUploader = ({ onImagesChange, maxFiles = 10 }) => {
  const [files, setFiles] = useState([]);
  const [croppingFile, setCroppingFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (files.length + acceptedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newFiles = acceptedFiles.map(file => ({
      ...file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
      crop: { x: 0, y: 0, width: 100, height: 100 },
      scale: 1,
      rotation: 0
    }));
    
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onImagesChange(updatedFiles);
  }, [files, maxFiles, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxFiles: maxFiles - files.length
  });

  // Drag and Drop Logic
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);
        onImagesChange(reordered);
        return reordered;
      });
    }
  };

  const removeFile = (fileId) => {
    const updatedFiles = files.filter(file => file.id !== fileId);
    setFiles(updatedFiles);
    onImagesChange(updatedFiles);
  };

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const saveCrop = () => {
    if (croppingFile && croppedAreaPixels) {
      const updatedFiles = files.map(file => 
        file.id === croppingFile.id 
          ? { 
              ...file, 
              crop: croppedAreaPixels,
              scale: zoom,
              rotation: rotation
            }
          : file
      );
      setFiles(updatedFiles);
      onImagesChange(updatedFiles);
    }
    setCroppingFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
  };

  const cancelCrop = () => {
    setCroppingFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
  };

  const SortableItem = ({ file }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({ id: file.id });

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
        className="flex items-center bg-gray-800 p-4 rounded-lg mb-3 border border-gray-700 hover:border-gray-600 transition-colors"
      >
        <div
          {...listeners}
          className="cursor-grab p-2 hover:bg-gray-700 rounded transition-colors"
        >
          <GripVertical size={20} className="text-gray-400" />
        </div>
        
        <img
          src={file.preview}
          alt={file.name}
          className="w-20 h-20 object-cover rounded-lg mx-4"
        />
        
        <div className="flex-grow min-w-0">
          <p className="text-sm font-medium text-white truncate">{file.name}</p>
          <p className="text-xs text-gray-400">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCroppingFile(file)}
            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-gray-700 rounded transition-colors"
            title="Crop Image"
          >
            <Crop size={16} />
          </button>
          
          <button
            onClick={() => removeFile(file.id)}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded transition-colors"
            title="Remove Image"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  };

  if (croppingFile) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Crop Image</h3>
          <div className="flex gap-2">
            <button
              onClick={cancelCrop}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveCrop}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Save Crop
            </button>
          </div>
        </div>

        <div className="relative w-full h-96 bg-gray-800 rounded-lg overflow-hidden">
          <Cropper
            image={croppingFile.preview}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={16 / 9}
            onCropChange={setCrop}
            onCropComplete={handleCropComplete}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            showGrid={true}
            style={{
              containerStyle: {
                width: '100%',
                height: '100%',
                position: 'relative'
              }
            }}
          />
        </div>

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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-600 hover:border-gray-500'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <div>
            <p className="text-lg font-medium text-white">
              {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
            </p>
            <p className="text-gray-400 text-sm">
              or click to select files
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Supports: JPEG, PNG, WebP, GIF (Max {maxFiles} files)
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Uploaded Images ({files.length}/{maxFiles})
            </h3>
            <p className="text-sm text-gray-400">
              Drag to reorder • Click crop to edit
            </p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={files.map(f => f.id)}
              strategy={verticalListSortingStrategy}
            >
              {files.map(file => (
                <SortableItem key={file.id} file={file} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

