'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeroImage {
  id: string;
  filename: string;
  url?: string;
  category: string;
  order: number;
  active: boolean;
}

interface LibraryImage {
  filename: string;
  url: string;
  path: string;
}

export default function AdminHeroPage() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [libraryImages, setLibraryImages] = useState<LibraryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [category, setCategory] = useState('Logo Design');
  const [order, setOrder] = useState(1);
  const [message, setMessage] = useState('');
  const [showImageBrowser, setShowImageBrowser] = useState(false);

  const categories = [
    'Logo Design',
    'Social Media',
    'Artwork',
    'Video',
    'Branding',
  ];

  // Required dimensions for hero section
  const REQUIRED_DIMENSIONS = {
    width: 200,
    height: 280,
    aspectRatio: '2:3',
    description: 'Vertical portrait images work best for animated background cards'
  };

  // Fetch hero images configuration
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

  // Fetch library images
  const fetchLibraryImages = async () => {
    try {
      const response = await fetch('/api/upload-image');
      const data = await response.json();
      if (data.success) {
        setLibraryImages(data.images);
      }
    } catch (error) {
      console.error('Error fetching library images:', error);
    }
  };

  useEffect(() => {
    fetchImages();
    fetchLibraryImages();
  }, []);

  // Add image to hero configuration
  const handleAdd = async () => {
    if (!filename && !imageUrl) {
      setMessage('Please select an image from the library first');
      return;
    }

    try {
      const response = await fetch('/api/hero-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename,
          url: imageUrl,
          category,
          order
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Image added to hero section!');
        setFilename('');
        setImageUrl('');
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

  // Toggle active status
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

  // Delete from configuration
  const handleDelete = async (id: string) => {
    if (!confirm('Remove this image from the hero section?')) {
      return;
    }

    try {
      const response = await fetch(`/api/hero-images?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Image removed from hero section');
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
          Select images from your library for the hero section animated background
        </p>

        {/* Message */}
        {message && (
          <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg">
            {message}
          </div>
        )}

        {/* Dimension Requirements */}
        <div className="glass rounded-2xl p-6 mb-8 border-l-4 border-purple-500">
          <h2 className="text-xl font-bold text-white mb-3">📐 Recommended Image Dimensions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-gray-400 text-sm">Width</p>
              <p className="text-white font-bold text-lg">{REQUIRED_DIMENSIONS.width}px</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-gray-400 text-sm">Height</p>
              <p className="text-white font-bold text-lg">{REQUIRED_DIMENSIONS.height}px</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-gray-400 text-sm">Aspect Ratio</p>
              <p className="text-white font-bold text-lg">{REQUIRED_DIMENSIONS.aspectRatio}</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-gray-400 text-sm">Orientation</p>
              <p className="text-white font-bold text-lg">Portrait</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-4">💡 {REQUIRED_DIMENSIONS.description}</p>
        </div>

        {/* Select from Library */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Step 1: Select Image from Library</h2>
            <Link
              href="/admin/library"
              className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors"
            >
              📚 Go to Library
            </Link>
          </div>

          <button
            onClick={() => {
              setShowImageBrowser(!showImageBrowser);
              if (!showImageBrowser) fetchLibraryImages();
            }}
            className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors mb-4"
          >
            {showImageBrowser ? '▼ Hide' : '▶ Show'} Image Library ({libraryImages.length} images)
          </button>

          {showImageBrowser && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto p-4 bg-black/20 rounded-lg">
              {libraryImages.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-400 mb-4">No images in library yet</p>
                  <Link
                    href="/admin/library"
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg inline-block"
                  >
                    Upload Images to Library
                  </Link>
                </div>
              ) : (
                libraryImages.map((img) => (
                  <div
                    key={img.filename}
                    onClick={() => {
                      setFilename(img.filename);
                      setImageUrl(img.url);
                      setMessage(`✅ Selected: ${img.filename}`);
                    }}
                    className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all hover:scale-105 ${
                      imageUrl === img.url
                        ? 'border-purple-500 shadow-lg shadow-purple-500/50'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="aspect-square relative bg-black">
                      <Image
                        src={img.url}
                        alt={img.filename}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-xs text-gray-400 p-2 truncate bg-black/50">
                      {img.filename}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Add to Hero Section */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Step 2: Configure & Add to Hero</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Selected Image
              </label>
              <input
                type="text"
                value={filename}
                readOnly
                placeholder="Select an image above"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none"
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
                style={{ colorScheme: 'dark' }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-gray-900 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Order
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
                disabled={!filename}
                className="w-full px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Hero
              </button>
            </div>
          </div>
        </div>

        {/* Active Hero Images */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Hero Section Images ({images.length})
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 mt-4">Loading...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No images in hero section yet. Add your first image above!</p>
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
                    {image.url ? (
                      <Image
                        src={image.url}
                        alt={image.category}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No URL
                      </div>
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
