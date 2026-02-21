'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface FeaturedProject {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  order: number;
  active: boolean;
  client_name?: string;
  project_url?: string;
  created_at?: string;
}

interface LibraryImage {
  filename: string;
  url: string;
  path: string;
  media_type?: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<FeaturedProject[]>([]);
  const [libraryImages, setLibraryImages] = useState<LibraryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Artwork');
  const [description, setDescription] = useState('');
  const [clientName, setClientName] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [order, setOrder] = useState(1);
  const [message, setMessage] = useState('');
  const [showImageBrowser, setShowImageBrowser] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit state
  const [editingProject, setEditingProject] = useState<FeaturedProject | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editClientName, setEditClientName] = useState('');
  const [editProjectUrl, setEditProjectUrl] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [showEditImageBrowser, setShowEditImageBrowser] = useState(false);

  const categories = [
    'Artwork',
    'Logo Design',
    'Social Media',
    'Video',
    'Branding',
    'UI/UX Design',
    'Web Development',
  ];

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/featured-projects');
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects.sort((a: FeaturedProject, b: FeaturedProject) => a.order - b.order));
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setMessage('Failed to fetch projects');
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
    fetchProjects();
    fetchLibraryImages();
  }, []);

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
        setMessage(`✅ File uploaded: ${data.filename}`);
        setImageUrl(data.url || data.path);
        await fetchLibraryImages();
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      handleFileUpload(file);
    } else {
      setMessage('❌ Please drop an image or video file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleAdd = async () => {
    if (!imageUrl || !title || !description) {
      setMessage('Please fill in all required fields (image, title, description)');
      return;
    }

    try {
      const response = await fetch('/api/featured-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, category, description,
          image_url: imageUrl, order,
          client_name: clientName || null,
          project_url: projectUrl || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Project added successfully!');
        setTitle(''); setDescription(''); setClientName(''); setProjectUrl(''); setImageUrl('');
        setOrder(order + 1);
        await fetchProjects();
      } else {
        setMessage('❌ ' + (data.error || 'Failed to add project'));
      }
    } catch (error) {
      setMessage('❌ Failed to add project');
    }
  };

  const handleToggle = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch('/api/featured-projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !currentActive }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('✅ Status updated');
        await fetchProjects();
      } else {
        setMessage('❌ Update failed');
      }
    } catch (error) {
      setMessage('❌ Failed to update');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project? This will also remove the image from storage.')) return;

    try {
      const response = await fetch(`/api/featured-projects?id=${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setMessage('✅ Project deleted');
        await fetchProjects();
      } else {
        setMessage('❌ Delete failed');
      }
    } catch (error) {
      setMessage('❌ Failed to delete');
    }
  };

  const handleUpdateOrder = async (id: string, newOrder: number) => {
    try {
      const response = await fetch('/api/featured-projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, order: newOrder }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('✅ Order updated');
        await fetchProjects();
      } else {
        setMessage('❌ Update failed');
      }
    } catch (error) {
      setMessage('❌ Failed to update order');
    }
  };

  // Open edit modal
  const openEdit = (project: FeaturedProject) => {
    setEditingProject(project);
    setEditTitle(project.title);
    setEditCategory(project.category);
    setEditDescription(project.description);
    setEditClientName(project.client_name || '');
    setEditProjectUrl(project.project_url || '');
    setEditImageUrl('');
    setShowEditImageBrowser(false);
  };

  // Save edits
  const handleSaveEdit = async () => {
    if (!editingProject) return;

    try {
      const updates: any = { id: editingProject.id };

      if (editTitle !== editingProject.title) updates.title = editTitle;
      if (editCategory !== editingProject.category) updates.category = editCategory;
      if (editDescription !== editingProject.description) updates.description = editDescription;
      if (editClientName !== (editingProject.client_name || '')) updates.client_name = editClientName || null;
      if (editProjectUrl !== (editingProject.project_url || '')) updates.project_url = editProjectUrl || null;
      if (editImageUrl) updates.image_url = editImageUrl;

      const response = await fetch('/api/featured-projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('✅ Project updated successfully');
        setEditingProject(null);
        await fetchProjects();
      } else {
        setMessage('❌ Update failed: ' + (data.error || ''));
      }
    } catch (error) {
      setMessage('❌ Failed to update project');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Featured Projects Manager</h1>
            <p className="text-gray-400">Upload and manage featured projects for the homepage carousel</p>
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
          <h2 className="text-2xl font-bold text-white mb-4">Step 1: Upload or Select Project Image</h2>

          {/* Drag and Drop Zone */}
          <div onDrop={handleDrop} onDragOver={handleDragOver}
            className="border-2 border-dashed border-purple-500/50 rounded-xl p-12 text-center hover:border-purple-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}>
            <div className="space-y-4">
              <div className="text-6xl">📤</div>
              <div>
                <p className="text-xl text-white font-semibold mb-2">Drag & Drop or Click to Upload</p>
                <p className="text-gray-400 text-sm">Supports: JPG, PNG, GIF, WebP, SVG (Max 50MB)</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*,video/*"
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
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto p-4 bg-black/20 rounded-lg">
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
                      onClick={() => { setImageUrl(img.url); setMessage(`✅ Selected: ${img.filename}`); }}
                      className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all hover:scale-105 ${
                        imageUrl === img.url ? 'border-purple-500 shadow-lg shadow-purple-500/50' : 'border-white/10 hover:border-white/30'
                      }`}>
                      <div className="aspect-square relative bg-black">
                        <Image src={img.url} alt={img.filename} fill className="object-cover" />
                      </div>
                      <p className="text-xs text-gray-400 p-2 truncate bg-black/50">{img.filename}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Add Project Form */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Step 2: Project Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Project Title <span className="text-red-500">*</span></label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., QuranPath LMS Dashboard"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category <span className="text-red-500">*</span></label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ colorScheme: 'dark' }}>
                {categories.map((cat) => (<option key={cat} value={cat} className="bg-gray-900 text-white">{cat}</option>))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Description <span className="text-red-500">*</span></label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description..." rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Client Name (Optional)</label>
              <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g., Acme Corporation"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Project URL (Optional)</label>
              <input type="url" value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} placeholder="https://example.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
              <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value))} min="1"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div className="flex items-end">
              <button onClick={handleAdd} disabled={!imageUrl || !title || !description}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                Add Project
              </button>
            </div>
          </div>

          {imageUrl && (
            <div className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <p className="text-green-400 text-sm">✅ Image selected and ready</p>
            </div>
          )}
        </div>

        {/* Active Projects List */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Featured Projects ({projects.length})</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 mt-4">Loading...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No projects yet. Add your first project above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                  <div className="aspect-video bg-black relative">
                    <Image src={project.image_url} alt={project.title} fill className="object-cover" />
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="text-lg font-bold text-white truncate">{project.title}</h3>

                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs font-semibold rounded-full">
                        {project.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Order:</span>
                        <input type="number" value={project.order}
                          onChange={(e) => handleUpdateOrder(project.id, parseInt(e.target.value))}
                          className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm text-center" min="1" />
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>

                    {project.client_name && (
                      <p className="text-xs text-gray-500">Client: {project.client_name}</p>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={project.active}
                          onChange={() => handleToggle(project.id, project.active)} className="w-4 h-4" />
                        <span className="text-sm text-gray-300">Active</span>
                      </label>

                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(project)}
                          className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm rounded-lg transition-colors">
                          ✏️ Edit
                        </button>
                        <button onClick={() => handleDelete(project.id)}
                          className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded-lg transition-colors">
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingProject && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setEditingProject(null)}>
            <div className="bg-[#1a1a1a] rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/20" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Edit Project</h2>
                <button onClick={() => setEditingProject(null)} className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg">
                  ✕ Close
                </button>
              </div>

              {/* Current Image */}
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-2">Current Image:</p>
                <div className="flex gap-4 items-start">
                  <div className="w-48 aspect-video relative bg-black rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={editImageUrl || editingProject.image_url} alt="Preview" fill className="object-cover" />
                  </div>
                  {editImageUrl && (
                    <p className="text-green-400 text-xs">✅ New image selected (will replace current)</p>
                  )}
                </div>
              </div>

              {/* Replace Image */}
              <div className="mb-6">
                <button onClick={() => { setShowEditImageBrowser(!showEditImageBrowser); if (!showEditImageBrowser) fetchLibraryImages(); }}
                  className="w-full px-4 py-3 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg transition-colors font-medium">
                  🔄 {showEditImageBrowser ? 'Hide' : 'Replace Image'} - Select from Library
                </button>

                {showEditImageBrowser && (
                  <div className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-3 max-h-64 overflow-y-auto p-3 bg-black/30 rounded-lg">
                    {libraryImages.map((img) => (
                      <div key={img.filename}
                        onClick={() => { setEditImageUrl(img.url); setShowEditImageBrowser(false); }}
                        className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all hover:scale-105 ${
                          editImageUrl === img.url ? 'border-orange-500' : 'border-white/10 hover:border-white/30'
                        }`}>
                        <div className="aspect-square relative bg-black">
                          <Image src={img.url} alt={img.filename} fill className="object-cover" />
                        </div>
                        <p className="text-xs text-gray-400 p-1 truncate bg-black/50">{img.filename}</p>
                      </div>
                    ))}
                  </div>
                )}

                {editImageUrl && (
                  <button onClick={() => setEditImageUrl('')}
                    className="mt-2 px-3 py-1 bg-white/10 hover:bg-white/20 text-gray-400 text-xs rounded transition-colors">
                    ✕ Cancel replacement
                  </button>
                )}
              </div>

              {/* Edit Fields */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ colorScheme: 'dark' }}>
                    {categories.map((cat) => (<option key={cat} value={cat} className="bg-gray-900 text-white">{cat}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Client Name</label>
                    <input type="text" value={editClientName} onChange={(e) => setEditClientName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Project URL</label>
                    <input type="url" value={editProjectUrl} onChange={(e) => setEditProjectUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>
              </div>

              {/* Save */}
              <div className="flex gap-3">
                <button onClick={handleSaveEdit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:scale-105 transition-all">
                  💾 Save Changes
                </button>
                <button onClick={() => setEditingProject(null)}
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
