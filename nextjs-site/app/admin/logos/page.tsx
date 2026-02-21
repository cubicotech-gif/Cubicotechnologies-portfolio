'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ClientLogo {
  id: string;
  client_name: string;
  logo_url: string;
  order: number;
  active: boolean;
  website_url?: string;
  created_at?: string;
}

interface LibraryImage {
  filename: string;
  url: string;
  path: string;
  media_type?: string;
}

export default function AdminLogosPage() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [libraryImages, setLibraryImages] = useState<LibraryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [clientName, setClientName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [order, setOrder] = useState(1);
  const [message, setMessage] = useState('');
  const [showImageBrowser, setShowImageBrowser] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit state
  const [editingLogo, setEditingLogo] = useState<ClientLogo | null>(null);
  const [editClientName, setEditClientName] = useState('');
  const [editWebsiteUrl, setEditWebsiteUrl] = useState('');
  const [editLogoUrl, setEditLogoUrl] = useState('');
  const [showEditImageBrowser, setShowEditImageBrowser] = useState(false);

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

  const fetchLibraryImages = async () => {
    try {
      const response = await fetch('/api/upload-image');
      const data = await response.json();
      if (data.success) {
        setLibraryImages(data.images.filter((img: LibraryImage) => img.media_type !== 'video'));
      }
    } catch (error) {
      console.error('Error fetching library images:', error);
    }
  };

  useEffect(() => {
    fetchLogos();
    fetchLibraryImages();
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    setMessage('Uploading...');

    try {
      // Get signed upload URL
      const urlRes = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      const urlData = await urlRes.json();

      if (!urlData.success) {
        setMessage('❌ ' + (urlData.error || 'Failed to get upload URL'));
        setUploading(false);
        return;
      }

      // Upload directly to Supabase
      const uploadRes = await fetch(urlData.signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (uploadRes.ok) {
        setMessage(`✅ File uploaded: ${urlData.filename}`);
        setLogoUrl(urlData.publicUrl);
        await fetchLibraryImages();
      } else {
        setMessage('❌ Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('❌ Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

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
          client_name: clientName, logo_url: logoUrl, order,
          website_url: websiteUrl || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Logo added successfully!');
        setClientName(''); setWebsiteUrl(''); setLogoUrl('');
        setOrder(order + 1);
        await fetchLogos();
      } else {
        setMessage('❌ ' + (data.error || 'Failed to add logo'));
      }
    } catch (error) {
      setMessage('❌ Failed to add logo');
    }
  };

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
      setMessage('❌ Failed to update');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this logo? This will also remove the image from storage.')) return;

    try {
      const response = await fetch(`/api/client-logos?id=${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setMessage('✅ Logo deleted');
        await fetchLogos();
      } else {
        setMessage('❌ Delete failed');
      }
    } catch (error) {
      setMessage('❌ Failed to delete');
    }
  };

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
      setMessage('❌ Failed to update order');
    }
  };

  // Open edit modal
  const openEdit = (logo: ClientLogo) => {
    setEditingLogo(logo);
    setEditClientName(logo.client_name);
    setEditWebsiteUrl(logo.website_url || '');
    setEditLogoUrl('');
    setShowEditImageBrowser(false);
  };

  // Save edits
  const handleSaveEdit = async () => {
    if (!editingLogo) return;

    try {
      const updates: any = { id: editingLogo.id };

      if (editClientName !== editingLogo.client_name) updates.client_name = editClientName;
      if (editWebsiteUrl !== (editingLogo.website_url || '')) updates.website_url = editWebsiteUrl || null;
      if (editLogoUrl) updates.logo_url = editLogoUrl;

      const response = await fetch('/api/client-logos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('✅ Logo updated successfully');
        setEditingLogo(null);
        await fetchLogos();
      } else {
        setMessage('❌ Update failed: ' + (data.error || ''));
      }
    } catch (error) {
      setMessage('❌ Failed to update logo');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Client Logos Manager</h1>
            <p className="text-gray-400">Upload and manage client logos for the homepage marquee</p>
          </div>
          <Link href="/admin" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
            ← Dashboard
          </Link>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg">
            {message}
          </div>
        )}

        {/* Upload Section */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Step 1: Upload or Select Logo</h2>

          <div onDrop={handleDrop} onDragOver={handleDragOver}
            className="border-2 border-dashed border-purple-500/50 rounded-xl p-12 text-center hover:border-purple-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}>
            <div className="space-y-4">
              <div className="text-6xl">📤</div>
              <div>
                <p className="text-xl text-white font-semibold mb-2">Drag & Drop or Click to Upload</p>
                <p className="text-gray-400 text-sm">Supports: JPG, PNG, GIF, WebP, SVG (Max 50MB)</p>
                <p className="text-gray-500 text-xs mt-2">Recommended: PNG or SVG with transparent background</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*"
                onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file); }}
                className="hidden" />
            </div>
          </div>

          {uploading && (
            <div className="mt-4 text-center">
              <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 mt-2">Uploading...</p>
            </div>
          )}

          {/* Library Browser */}
          <div className="mt-6">
            <button onClick={() => { setShowImageBrowser(!showImageBrowser); if (!showImageBrowser) fetchLibraryImages(); }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              {showImageBrowser ? '▼ Hide' : '▶ Show'} Image Library ({libraryImages.length})
            </button>

            {showImageBrowser && (
              <div className="mt-4 grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4 max-h-96 overflow-y-auto p-4 bg-black/20 rounded-lg">
                {libraryImages.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-400 mb-4">No images in library yet</p>
                    <Link href="/admin/library" className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg inline-block">
                      Upload Images to Library
                    </Link>
                  </div>
                ) : (
                  libraryImages.map((img) => (
                    <div key={img.filename}
                      onClick={() => { setLogoUrl(img.url); setMessage(`✅ Selected: ${img.filename}`); }}
                      className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all hover:scale-105 ${
                        logoUrl === img.url ? 'border-purple-500 shadow-lg shadow-purple-500/50' : 'border-white/10 hover:border-white/30'
                      }`}>
                      <div className="aspect-square relative bg-white p-2">
                        <Image src={img.url} alt={img.filename} fill className="object-contain p-2" />
                      </div>
                      <p className="text-xs text-gray-400 p-2 truncate bg-black/50">{img.filename}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Add Logo Form */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Step 2: Client Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Client Name <span className="text-red-500">*</span></label>
              <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g., Acme Corporation"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Website URL (Optional)</label>
              <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://example.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
              <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value))} min="1"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>

          <div className="mt-6">
            <button onClick={handleAdd} disabled={!logoUrl || !clientName}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
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
          <h2 className="text-2xl font-bold text-white mb-4">Client Logos ({logos.length})</h2>

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
                <div key={logo.id} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                  <div className="aspect-square bg-white p-4 relative">
                    <Image src={logo.logo_url} alt={logo.client_name} fill className="object-contain p-2" />
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="text-sm font-bold text-white truncate">{logo.client_name}</h3>

                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">Order:</span>
                      <input type="number" value={logo.order}
                        onChange={(e) => handleUpdateOrder(logo.id, parseInt(e.target.value))}
                        className="w-12 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs text-center" min="1" />
                    </div>

                    {logo.website_url && (
                      <a href={logo.website_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-cyan-400 hover:text-cyan-300 truncate block">
                        🔗 Website
                      </a>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={logo.active}
                          onChange={() => handleToggle(logo.id, logo.active)} className="w-4 h-4" />
                        <span className="text-xs text-gray-300">Active</span>
                      </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(logo)}
                        className="flex-1 px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs rounded transition-colors">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(logo.id)}
                        className="flex-1 px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs rounded transition-colors">
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingLogo && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setEditingLogo(null)}>
            <div className="bg-[#1a1a1a] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Edit Logo</h2>
                <button onClick={() => setEditingLogo(null)} className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg">
                  ✕ Close
                </button>
              </div>

              {/* Current Logo Preview */}
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-2">Current Logo:</p>
                <div className="flex gap-4 items-center">
                  <div className="w-24 h-24 relative bg-white rounded-lg overflow-hidden flex-shrink-0 p-2">
                    <Image src={editLogoUrl || editingLogo.logo_url} alt="Preview" fill className="object-contain p-1" />
                  </div>
                  {editLogoUrl && (
                    <p className="text-green-400 text-xs">✅ New logo selected (will replace current)</p>
                  )}
                </div>
              </div>

              {/* Replace Logo */}
              <div className="mb-6">
                <button onClick={() => { setShowEditImageBrowser(!showEditImageBrowser); if (!showEditImageBrowser) fetchLibraryImages(); }}
                  className="w-full px-4 py-3 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg transition-colors font-medium">
                  🔄 {showEditImageBrowser ? 'Hide' : 'Replace Logo'} - Select from Library
                </button>

                {showEditImageBrowser && (
                  <div className="mt-4 grid grid-cols-4 md:grid-cols-6 gap-3 max-h-64 overflow-y-auto p-3 bg-black/30 rounded-lg">
                    {libraryImages.map((img) => (
                      <div key={img.filename}
                        onClick={() => { setEditLogoUrl(img.url); setShowEditImageBrowser(false); }}
                        className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all hover:scale-105 ${
                          editLogoUrl === img.url ? 'border-orange-500' : 'border-white/10 hover:border-white/30'
                        }`}>
                        <div className="aspect-square relative bg-white p-1">
                          <Image src={img.url} alt={img.filename} fill className="object-contain p-1" />
                        </div>
                        <p className="text-xs text-gray-400 p-1 truncate bg-black/50">{img.filename}</p>
                      </div>
                    ))}
                  </div>
                )}

                {editLogoUrl && (
                  <button onClick={() => setEditLogoUrl('')}
                    className="mt-2 px-3 py-1 bg-white/10 hover:bg-white/20 text-gray-400 text-xs rounded transition-colors">
                    ✕ Cancel replacement
                  </button>
                )}
              </div>

              {/* Edit Fields */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Client Name</label>
                  <input type="text" value={editClientName} onChange={(e) => setEditClientName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Website URL</label>
                  <input type="url" value={editWebsiteUrl} onChange={(e) => setEditWebsiteUrl(e.target.value)} placeholder="https://example.com"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>

              {/* Save */}
              <div className="flex gap-3">
                <button onClick={handleSaveEdit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:scale-105 transition-all">
                  💾 Save Changes
                </button>
                <button onClick={() => setEditingLogo(null)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
