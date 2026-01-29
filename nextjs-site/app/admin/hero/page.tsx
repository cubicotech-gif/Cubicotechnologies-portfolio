'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface HeroImage {
  id: string;
  cloudinary_id: string;
  category: string;
  order: number;
  active: boolean;
  secure_url?: string;
}

export default function HeroAdminPanel() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [category, setCategory] = useState('Logo Design');
  const [order, setOrder] = useState(1);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const categories = [
    'Logo Design',
    'Social Media',
    'Artwork',
    'Video',
    'Branding',
  ];

  // Fetch images
  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/hero-images');
      const data = await response.json();
      if (data.success) {
        setImages(data.images.sort((a: HeroImage, b: HeroImage) => a.order - b.order));
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      showMessage('error', 'Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Show message
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image
  const handleUpload = async () => {
    if (!selectedFile) {
      showMessage('error', 'Please select a file');
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;

        const response = await fetch('/api/hero-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: base64,
            category,
            order,
          }),
        });

        const data = await response.json();

        if (data.success) {
          showMessage('success', 'Image uploaded successfully!');
          setSelectedFile(null);
          setPreviewUrl('');
          setOrder(order + 1);
          await fetchImages();
        } else {
          showMessage('error', data.error || 'Upload failed');
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Upload error:', error);
      showMessage('error', 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Toggle active status
  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch('/api/hero-images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !currentActive }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Status updated');
        await fetchImages();
      } else {
        showMessage('error', data.error || 'Update failed');
      }
    } catch (error) {
      console.error('Toggle error:', error);
      showMessage('error', 'Failed to update status');
    }
  };

  // Delete image
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const response = await fetch(`/api/hero-images?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Image deleted successfully');
        await fetchImages();
      } else {
        showMessage('error', data.error || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showMessage('error', 'Failed to delete image');
    }
  };

  // Update order
  const handleUpdateOrder = async (id: string, newOrder: number) => {
    try {
      const response = await fetch('/api/hero-images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, order: newOrder }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Order updated');
        await fetchImages();
      } else {
        showMessage('error', data.error || 'Update failed');
      }
    } catch (error) {
      console.error('Update order error:', error);
      showMessage('error', 'Failed to update order');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 font-[family-name:var(--font-space-grotesk)]">
            Hero Images Manager
          </h1>
          <p className="text-gray-400">Upload and manage images for the hero section animated background</p>
        </div>

        {/* Message Toast */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                : 'bg-red-500/20 border border-red-500/50 text-red-400'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Upload Section */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Upload New Image</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 cursor-pointer bg-white/5 border border-white/10 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value))}
                  min="1"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>

            {/* Right: Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preview
              </label>
              <div className="aspect-[2/3] bg-white/5 border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={400}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-gray-500">No image selected</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Images Grid */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Current Images ({images.length})
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 mt-4">Loading images...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No images uploaded yet. Upload your first image above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 border border-white/10 rounded-lg overflow-hidden"
                >
                  {/* Image */}
                  <div className="aspect-[2/3] bg-black relative">
                    {image.secure_url && (
                      <Image
                        src={image.secure_url}
                        alt={image.category}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs font-semibold rounded-full">
                        {image.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Order:</span>
                        <input
                          type="number"
                          value={image.order}
                          onChange={(e) =>
                            handleUpdateOrder(image.id, parseInt(e.target.value))
                          }
                          className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm text-center"
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={image.active}
                          onChange={() => handleToggleActive(image.id, image.active)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-300">Active</span>
                      </label>

                      <button
                        onClick={() => handleDelete(image.id)}
                        className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 truncate">
                      ID: {image.cloudinary_id}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
