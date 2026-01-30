'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface ClientLogo {
  id: string;
  client_name: string;
  logo_url: string;
  order: number;
  active: boolean;
  website_url?: string;
  created_at?: string;
}

interface AvailableImage {
  filename: string;
  path: string;
}

export default function AdminLogosPage() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [availableImages, setAvailableImages] = useState<AvailableImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [clientName, setClientName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [uploadFolder] = useState('logos'); // Fixed to logos folder
  const [order, setOrder] = useState(1);
  const [message, setMessage] = useState('');
  const [showImageBrowser, setShowImageBrowser] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch client logos
  const fetchLogos = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/client-logos');
      const data = await response.json();
      if (data.success) {
        setLogos(data.logos.sort((a: ClientLogo, b: ClientLogo) => a.order - b.order));
      }
    } catch (error) {
      console.error('Error fetching logos:', error);
      setMessage('Failed to fetch logos');
    } finally {
      setLoading(false);
    }
  };

  // Fetch available images from logos folder
  const fetchAvailableImages = async () => {
    try {
      const response = await fetch(`/api/upload-image?folder=${uploadFolder}`);
      const data = await response.json();
      if (data.success) {
        setAvailableImages(data.images);
      }
    } catch (error) {
      console.error('Error fetching available images:', error);
    }
  };

  useEffect(() => {
    fetchLogos();
    fetchAvailableImages();
  }, []);

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    setMessage('Uploading...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', uploadFolder);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ File uploaded: ${data.filename}`);
        setLogoUrl(data.url || data.path);
        await fetchAvailableImages();
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

  // Add logo
  const handleAdd = async () => {
    if (!logoUrl || !clientName) {
      setMessage('Please provide both logo image and client name');
      return;
    }

    try {
      const response = await fetch('/api/client-logos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: clientName,
          logo_url: logoUrl,
          order,
          website_url: websiteUrl || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Logo added successfully!');
        setClientName('');
        setWebsiteUrl('');
        setLogoUrl('');
        setOrder(order + 1);
        await fetchLogos();
      } else {
        setMessage('❌ ' + (data.error || 'Failed to add logo'));
      }
    } catch (error) {
      console.error('Add error:', error);
      setMessage('❌ Failed to add logo');
    }
  };

  // Toggle active status
  const handleToggle = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch('/api/client-logos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !currentActive }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Status updated');
        await fetchLogos();
      } else {
        setMessage('❌ Update failed');
      }
    } catch (error) {
      console.error('Toggle error:', error);
      setMessage('❌ Failed to update');
    }
  };

  // Delete logo
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this logo? This will also remove the image from storage.')) {
      return;
    }

    try {
      const response = await fetch(`/api/client-logos?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Logo deleted');
        await fetchLogos();
        await fetchAvailableImages();
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
      const response = await fetch('/api/client-logos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, order: newOrder }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Order updated');
        await fetchLogos();
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
          Client Logos Manager
        </h1>
        <p className="text-gray-400 mb-8">
          Upload and manage client logos for the homepage marquee
        </p>

        {/* Message */}
        {message && (
          <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg">
            {message}
          </div>
        )}

        {/* Upload Section */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Step 1: Upload Logo</h2>

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
                <p className="text-gray-500 text-xs mt-2">
                  Recommended: PNG or SVG with transparent background
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

          {/* Available Images Browser */}
          <div className="mt-6">
            <button
              onClick={() => setShowImageBrowser(!showImageBrowser)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              {showImageBrowser ? '▼ Hide' : '▶ Show'} Available Logos ({availableImages.length})
            </button>

            {showImageBrowser && (
              <div className="mt-4 grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4 max-h-96 overflow-y-auto p-4 bg-black/20 rounded-lg">
                {availableImages.map((img) => (
                  <div
                    key={img.filename}
                    onClick={() => {
                      setLogoUrl(img.path);
                      setMessage(`✅ Selected: ${img.filename}`);
                    }}
                    className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all hover:scale-105 ${
                      logoUrl === img.path
                        ? 'border-purple-500 shadow-lg shadow-purple-500/50'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="aspect-square relative bg-white p-2">
                      <Image
                        src={img.path}
                        alt={img.filename}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <p className="text-xs text-gray-400 p-2 truncate bg-black/50">
                      {img.filename}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Logo Form */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Step 2: Client Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g., Acme Corporation"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Website URL (Optional)
              </label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleAdd}
              disabled={!logoUrl || !clientName}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Logo
            </button>
          </div>

          {logoUrl && (
            <div className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <p className="text-green-400 text-sm">✅ Logo selected and ready</p>
            </div>
          )}
        </div>

        {/* Active Logos List */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Client Logos ({logos.length})
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 mt-4">Loading...</p>
            </div>
          ) : logos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No logos yet. Add your first client logo above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {logos.map((logo) => (
                <div
                  key={logo.id}
                  className="bg-white/5 border border-white/10 rounded-lg overflow-hidden"
                >
                  {/* Logo Preview */}
                  <div className="aspect-square bg-white p-4 relative">
                    <Image
                      src={logo.logo_url}
                      alt={logo.client_name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-3">
                    <h3 className="text-sm font-bold text-white truncate">
                      {logo.client_name}
                    </h3>

                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">Order:</span>
                      <input
                        type="number"
                        value={logo.order}
                        onChange={(e) =>
                          handleUpdateOrder(logo.id, parseInt(e.target.value))
                        }
                        className="w-12 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs text-center"
                        min="1"
                      />
                    </div>

                    {logo.website_url && (
                      <a
                        href={logo.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cyan-400 hover:text-cyan-300 truncate block"
                      >
                        🔗 Website
                      </a>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={logo.active}
                          onChange={() => handleToggle(logo.id, logo.active)}
                          className="w-4 h-4"
                        />
                        <span className="text-xs text-gray-300">Active</span>
                      </label>

                      <button
                        onClick={() => handleDelete(logo.id)}
                        className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
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
