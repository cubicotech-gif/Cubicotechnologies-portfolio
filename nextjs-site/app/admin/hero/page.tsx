'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeroImage {
  id: string;
  filename: string;
  category: string;
  order: number;
  active: boolean;
}

export default function AdminHeroPage() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [filename, setFilename] = useState('');
  const [category, setCategory] = useState('Logo Design');
  const [order, setOrder] = useState(1);
  const [message, setMessage] = useState('');

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
      setMessage('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Add image
  const handleAdd = async () => {
    if (!filename) {
      setMessage('Please enter a filename');
      return;
    }

    try {
      const response = await fetch('/api/hero-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, category, order }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Image added successfully!');
        setFilename('');
        setOrder(order + 1);
        await fetchImages();
      } else {
        setMessage('❌ ' + (data.error || 'Failed to add image'));
      }
    } catch (error) {
      console.error('Add error:', error);
      setMessage('❌ Failed to add image');
    }
  };

  // Toggle active
  const handleToggle = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch('/api/hero-images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !currentActive }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Status updated');
        await fetchImages();
      } else {
        setMessage('❌ Update failed');
      }
    } catch (error) {
      console.error('Toggle error:', error);
      setMessage('❌ Failed to update');
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Remove this image from the list?')) {
      return;
    }

    try {
      const response = await fetch(`/api/hero-images?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Image removed from list');
        await fetchImages();
      } else {
        setMessage('❌ Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage('❌ Failed to delete');
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
        setMessage('✅ Order updated');
        await fetchImages();
      } else {
        setMessage('❌ Update failed');
      }
    } catch (error) {
      console.error('Update order error:', error);
      setMessage('❌ Failed to update order');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-white mb-2">
          Hero Images Manager
        </h1>
        <p className="text-gray-400 mb-8">
          Manage images for the hero section animated background
        </p>

        {/* Message */}
        {message && (
          <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg">
            {message}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 rounded-lg p-4 mb-6">
          <h3 className="font-bold mb-2">📁 Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Upload your images to <code className="bg-black/30 px-2 py-1 rounded">/public/portfolio/hero/</code></li>
            <li>Enter the filename below (e.g., "logo-design-1.jpg")</li>
            <li>Select category and order number</li>
            <li>Click "Add Image" button</li>
          </ol>
        </div>

        {/* Add Form */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Add New Image</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Filename
              </label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="logo-design-1.jpg"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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

            <div className="flex items-end">
              <button
                onClick={handleAdd}
                className="w-full px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300"
              >
                Add Image
              </button>
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
              <p className="text-gray-400 mt-4">Loading...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No images added yet. Add your first image above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="bg-white/5 border border-white/10 rounded-lg overflow-hidden"
                >
                  {/* Image Preview */}
                  <div className="aspect-[2/3] bg-black relative">
                    <Image
                      src={`/portfolio/hero/${image.filename}`}
                      alt={image.category}
                      fill
                      className="object-cover"
                    />
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
                          onChange={() => handleToggle(image.id, image.active)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-300">Active</span>
                      </label>

                      <button
                        onClick={() => handleDelete(image.id)}
                        className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 truncate">
                      {image.filename}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
