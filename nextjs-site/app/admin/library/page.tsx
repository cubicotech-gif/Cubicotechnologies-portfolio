'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface LibraryImage {
  filename: string;
  url: string;
  path: string;
  created_at?: string;
  size?: number;
}

export default function ImageLibraryPage() {
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all images from library
  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/upload-image');
      const data = await response.json();
      if (data.success) {
        setImages(data.images);
      } else {
        setMessage('Failed to load images');
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      setMessage('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    setMessage('Uploading...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ ${data.message}`);
        await fetchImages();
      } else {
        setMessage('❌ ' + (data.error || 'Upload failed'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('❌ Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    } else {
      setMessage('❌ Please drop an image file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Copy URL to clipboard
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setMessage('✅ URL copied to clipboard!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            📚 Image Library
          </h1>
          <p className="text-gray-400">
            Upload all your images here, then use them across different sections
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg">
            {message}
          </div>
        )}

        {/* Upload Section */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Upload Images</h2>

          {/* Drag and Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-purple-500/50 rounded-xl p-12 text-center hover:border-purple-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-4">
              <div className="text-6xl">📤</div>
              <div>
                <p className="text-xl text-white font-semibold mb-2">
                  Drag & Drop or Click to Upload
                </p>
                <p className="text-gray-400 text-sm">
                  Supports: JPG, PNG, GIF, WebP, SVG (Max 10MB)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
              />
            </div>
          </div>

          {uploading && (
            <div className="mt-4 text-center">
              <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 mt-2">Uploading...</p>
            </div>
          )}
        </div>

        {/* Image Library Grid */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Your Images ({images.length})
            </h2>
            <button
              onClick={fetchImages}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              🔄 Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 mt-4">Loading images...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No images yet. Upload your first image above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {images.map((image) => (
                <div
                  key={image.filename}
                  onClick={() => setSelectedImage(selectedImage === image.url ? null : image.url)}
                  className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all hover:scale-105 ${
                    selectedImage === image.url
                      ? 'border-purple-500 shadow-lg shadow-purple-500/50'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  {/* Image Preview */}
                  <div className="aspect-square relative bg-black">
                    <Image
                      src={image.url}
                      alt={image.filename}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Image Info */}
                  <div className="p-3 bg-black/50 space-y-2">
                    <p className="text-xs text-gray-400 truncate" title={image.filename}>
                      {image.filename}
                    </p>
                    {image.size && (
                      <p className="text-xs text-gray-500">
                        {formatFileSize(image.size)}
                      </p>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(image.url);
                      }}
                      className="w-full px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-xs rounded transition-colors"
                    >
                      📋 Copy URL
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 p-6 bg-blue-500/20 border border-blue-500/50 rounded-lg">
          <h3 className="text-blue-400 font-semibold mb-3">How to Use</h3>
          <ol className="text-blue-300 text-sm space-y-2 list-decimal list-inside">
            <li>Upload all your images to this library</li>
            <li>Go to the specific section admin page (Hero, Projects, or Logos)</li>
            <li>Select an image from the library and assign it to that section</li>
            <li>Each section will show you the required dimensions for best results</li>
          </ol>
        </div>

        {/* Quick Links */}
        <div className="mt-6 flex flex-wrap gap-4">
          <a
            href="/admin/hero"
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:scale-105 transition-transform"
          >
            🎨 Assign to Hero Section
          </a>
          <a
            href="/admin/projects"
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:scale-105 transition-transform"
          >
            🚀 Assign to Projects
          </a>
          <a
            href="/admin/logos"
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:scale-105 transition-transform"
          >
            🏢 Assign to Client Logos
          </a>
        </div>
      </div>
    </div>
  );
}
