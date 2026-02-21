'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LibraryImage {
  filename: string;
  url: string;
  path: string;
  created_at?: string;
  size?: number;
  media_type?: 'image' | 'video';
}

export default function ImageLibraryPage() {
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ total: 0, done: 0, current: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info');
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [previewImage, setPreviewImage] = useState<LibraryImage | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(text);
    setMessageType(type);
    if (type !== 'error') {
      setTimeout(() => setMessage(''), 4000);
    }
  };

  // Fetch all images from library
  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/upload-image');
      const data = await response.json();
      if (data.success) {
        setImages(data.images);
      } else {
        showMessage('Failed to load images', 'error');
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      showMessage('Failed to load images', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Handle single or multi file upload
  const handleFileUpload = async (fileList: FileList) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress({ total: files.length, done: 0, current: files[0].name });
    showMessage(`Uploading ${files.length} file(s)...`, 'info');

    let successCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress({ total: files.length, done: i, current: file.name });

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          successCount++;
        } else {
          errors.push(`${file.name}: ${data.error || 'Upload failed'}`);
        }
      } catch (error) {
        errors.push(`${file.name}: Network error`);
      }
    }

    setUploadProgress({ total: files.length, done: files.length, current: '' });

    if (errors.length > 0 && successCount > 0) {
      showMessage(`✅ Uploaded ${successCount}/${files.length} files. ❌ Failed: ${errors.join('; ')}`, 'error');
    } else if (errors.length > 0) {
      showMessage(`❌ Upload failed: ${errors.join('; ')}`, 'error');
    } else {
      showMessage(`✅ Successfully uploaded ${successCount} file(s)`, 'success');
    }

    await fetchImages();
    setUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag and drop (supports multiple files)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Delete single file from library
  const handleDelete = async (filename: string) => {
    if (!confirm(`Delete "${filename}" from the library?\n\nThis will remove the file from storage permanently.`)) return;

    setDeleting(filename);
    try {
      const response = await fetch(`/api/upload-image?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        showMessage('✅ File deleted successfully', 'success');
        setImages(prev => prev.filter(img => img.filename !== filename));
        setSelectedImages(prev => {
          const next = new Set(prev);
          next.delete(filename);
          return next;
        });
      } else {
        showMessage('❌ Delete failed: ' + (data.error || ''), 'error');
      }
    } catch (error) {
      showMessage('❌ Delete failed: Network error', 'error');
    } finally {
      setDeleting(null);
    }
  };

  // Bulk delete selected files
  const handleBulkDelete = async () => {
    if (selectedImages.size === 0) return;
    if (!confirm(`Delete ${selectedImages.size} file(s) from the library?\n\nThis cannot be undone.`)) return;

    setUploading(true);
    let successCount = 0;
    const errors: string[] = [];

    for (const filename of selectedImages) {
      try {
        const response = await fetch(`/api/upload-image?filename=${encodeURIComponent(filename)}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.success) {
          successCount++;
        } else {
          errors.push(filename);
        }
      } catch {
        errors.push(filename);
      }
    }

    if (errors.length > 0) {
      showMessage(`✅ Deleted ${successCount}/${selectedImages.size}. ❌ Failed: ${errors.length}`, 'error');
    } else {
      showMessage(`✅ Deleted ${successCount} file(s)`, 'success');
    }

    setSelectedImages(new Set());
    await fetchImages();
    setUploading(false);
  };

  // Toggle image selection
  const toggleSelect = (filename: string) => {
    setSelectedImages(prev => {
      const next = new Set(prev);
      if (next.has(filename)) {
        next.delete(filename);
      } else {
        next.add(filename);
      }
      return next;
    });
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
    showMessage('✅ URL copied to clipboard!', 'success');
  };

  // Filter images
  const filteredImages = images.filter(img => {
    if (filterType === 'all') return true;
    return img.media_type === filterType;
  });

  const imageCount = images.filter(i => i.media_type !== 'video').length;
  const videoCount = images.filter(i => i.media_type === 'video').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              📚 Media Library
            </h1>
            <p className="text-gray-400">
              Upload, manage, and delete images and videos
            </p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            messageType === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
            messageType === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
            'bg-blue-500/20 border-blue-500/50 text-blue-400'
          }`}>
            {message}
            {messageType === 'error' && (
              <button onClick={() => setMessage('')} className="ml-4 underline text-sm">
                Dismiss
              </button>
            )}
          </div>
        )}

        {/* Upload Section */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Upload Media</h2>

          {/* Drag and Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-purple-500/50 rounded-xl p-12 text-center hover:border-purple-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-4">
              <div className="text-6xl">{uploading ? '⏳' : '📤'}</div>
              <div>
                <p className="text-xl text-white font-semibold mb-2">
                  {uploading ? 'Uploading...' : 'Drag & Drop or Click to Upload'}
                </p>
                <p className="text-gray-400 text-sm">
                  <strong>Images:</strong> JPG, PNG, GIF, WebP, SVG (Max 50MB)
                </p>
                <p className="text-gray-400 text-sm">
                  <strong>Videos:</strong> MP4, WebM, MOV (Max 100MB)
                </p>
                <p className="text-purple-400 text-sm mt-2 font-medium">
                  💡 You can select multiple files at once
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload(e.target.files);
                  }
                }}
                className="hidden"
              />
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && uploadProgress.total > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Uploading: {uploadProgress.current}</span>
                <span>{uploadProgress.done}/{uploadProgress.total}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(uploadProgress.done / uploadProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="glass rounded-2xl p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-white">
                Your Media ({filteredImages.length})
              </h2>

              {/* Filter Tabs */}
              <div className="flex gap-1 bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${filterType === 'all' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  All ({images.length})
                </button>
                <button
                  onClick={() => setFilterType('image')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${filterType === 'image' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Images ({imageCount})
                </button>
                <button
                  onClick={() => setFilterType('video')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${filterType === 'video' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Videos ({videoCount})
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Bulk Delete */}
              {selectedImages.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  disabled={uploading}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded-lg transition-colors disabled:opacity-50 font-medium"
                >
                  🗑️ Delete Selected ({selectedImages.size})
                </button>
              )}

              {/* Refresh */}
              <button
                onClick={fetchImages}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Media Grid */}
        <div className="glass rounded-2xl p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 mt-4">Loading media...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">
                {images.length === 0 ? 'No media yet. Upload your first image or video above!' : 'No matching media found.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image.filename}
                  className={`relative group border-2 rounded-lg overflow-hidden transition-all ${
                    selectedImages.has(image.filename)
                      ? 'border-purple-500 shadow-lg shadow-purple-500/30'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  {/* Selection Checkbox */}
                  <div
                    className="absolute top-2 left-2 z-10 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); toggleSelect(image.filename); }}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      selectedImages.has(image.filename)
                        ? 'bg-purple-500 border-purple-500'
                        : 'border-white/50 bg-black/50 group-hover:border-white'
                    }`}>
                      {selectedImages.has(image.filename) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Media Preview */}
                  <div
                    className="aspect-square relative bg-black cursor-pointer"
                    onClick={() => setPreviewImage(image)}
                  >
                    {image.media_type === 'video' ? (
                      <video
                        src={image.url}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                      />
                    ) : (
                      <Image
                        src={image.url}
                        alt={image.filename}
                        fill
                        className="object-cover"
                      />
                    )}

                    {/* Media Type Badge */}
                    {image.media_type === 'video' && (
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                        🎬 VIDEO
                      </div>
                    )}
                  </div>

                  {/* Info & Actions */}
                  <div className="p-3 bg-black/50 space-y-2">
                    <p className="text-xs text-gray-400 truncate" title={image.filename}>
                      {image.filename}
                    </p>
                    {image.size ? (
                      <p className="text-xs text-gray-500">
                        {formatFileSize(image.size)}
                      </p>
                    ) : null}

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(image.url);
                        }}
                        className="flex-1 px-2 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-xs rounded transition-colors"
                      >
                        📋 Copy URL
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(image.filename);
                        }}
                        disabled={deleting === image.filename}
                        className="px-2 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs rounded transition-colors disabled:opacity-50"
                      >
                        {deleting === image.filename ? '⏳' : '🗑️ Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Modal */}
        {previewImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewImage(null)}
          >
            <div className="max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium truncate">{previewImage.filename}</p>
                  {previewImage.size ? (
                    <p className="text-gray-400 text-sm">{formatFileSize(previewImage.size)}</p>
                  ) : null}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => copyToClipboard(previewImage.url)}
                    className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors text-sm"
                  >
                    📋 Copy URL
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(previewImage.filename);
                      setPreviewImage(null);
                    }}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm"
                  >
                    🗑️ Delete
                  </button>
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
                  >
                    ✕ Close
                  </button>
                </div>
              </div>

              {previewImage.media_type === 'video' ? (
                <video
                  src={previewImage.url}
                  className="w-full max-h-[75vh] rounded-lg"
                  controls
                  autoPlay
                  muted
                />
              ) : (
                <div className="relative w-full h-[75vh]">
                  <Image
                    src={previewImage.url}
                    alt={previewImage.filename}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="mt-8 p-6 bg-blue-500/20 border border-blue-500/50 rounded-lg">
          <h3 className="text-blue-400 font-semibold mb-3">✅ Next Step</h3>
          <p className="text-blue-300 text-sm mb-4">
            Media uploaded! Now assign images and videos to different sections of your website (e.g., Portfolio, Service Images).
          </p>
          <Link
            href="/admin/assign"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold rounded-lg hover:scale-105 transition-transform"
          >
            🎯 Assign Media to Sections
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Quick View Links */}
        <div className="mt-6 p-4 bg-white/5 rounded-lg">
          <p className="text-gray-400 text-sm mb-3">View assigned images:</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/hero" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded transition-colors">
              🎨 Hero
            </Link>
            <Link href="/admin/projects" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded transition-colors">
              🚀 Projects
            </Link>
            <Link href="/admin/logos" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded transition-colors">
              🏢 Logos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
