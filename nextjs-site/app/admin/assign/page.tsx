'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LibraryImage {
  filename: string;
  url: string;
  path: string;
}

// Define field types for section configuration
type FieldType = 'text' | 'textarea' | 'select' | 'url';

interface BaseField {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
}

interface SelectField extends BaseField {
  type: 'select';
  options: string[];
}

interface TextField extends BaseField {
  type: 'text' | 'textarea' | 'url';
  options?: never;
}

type ExtraField = SelectField | TextField;

interface ImageSection {
  id: string;
  name: string;
  description: string;
  icon: string;
  dimensions: {
    width: number;
    height: number;
    aspectRatio: string;
    note: string;
  };
  apiEndpoint: string;
  extraFields: ExtraField[];
}

// Define all image sections/placements on the website
const IMAGE_SECTIONS: Record<string, ImageSection> = {
  logo: {
    id: 'logo',
    name: 'Site Logo',
    description: 'Main Cubico logo for navigation header',
    icon: '🏷️',
    dimensions: {
      width: 200,
      height: 60,
      aspectRatio: '3:1 (Landscape)',
      note: 'PNG or SVG with transparent background. Shows in navbar. Recommended: White/light colored logo for dark background.'
    },
    apiEndpoint: '/api/site-settings',
    extraFields: [
      { name: 'type', label: 'Logo Type', type: 'select', options: ['Main Logo', 'Alternate Logo', 'Favicon'], required: true }
    ]
  },
  hero: {
    id: 'hero',
    name: 'Hero Background',
    description: 'Animated background cards in hero section',
    icon: '🎨',
    dimensions: {
      width: 200,
      height: 280,
      aspectRatio: '2:3 (Portrait)',
      note: 'Vertical portrait images work best. Multiple images will be distributed across animated cards.'
    },
    apiEndpoint: '/api/hero-images',
    extraFields: [
      { name: 'category', label: 'Design Category', type: 'select', options: ['Logo Design', 'Social Media', 'Artwork', 'Video', 'Branding'], required: true }
    ]
  },
  projects: {
    id: 'projects',
    name: 'Featured Projects',
    description: 'Homepage carousel showcase',
    icon: '🚀',
    dimensions: {
      width: 1920,
      height: 1080,
      aspectRatio: '16:9 (Landscape)',
      note: 'High-resolution landscape images. Displayed in carousel format.'
    },
    apiEndpoint: '/api/featured-projects',
    extraFields: [
      { name: 'title', label: 'Project Title', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['Artwork', 'Logo Design', 'Social Media', 'Video', 'Branding', 'UI/UX Design', 'Web Development'], required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'client_name', label: 'Client Name', type: 'text', required: false },
      { name: 'project_url', label: 'Project URL', type: 'url', required: false }
    ]
  },
  logos: {
    id: 'logos',
    name: 'Client Logos',
    description: 'Client logos marquee section',
    icon: '🏢',
    dimensions: {
      width: 400,
      height: 200,
      aspectRatio: '2:1 (Landscape)',
      note: 'PNG or SVG with transparent background recommended. Logos scroll horizontally.'
    },
    apiEndpoint: '/api/client-logos',
    extraFields: [
      { name: 'client_name', label: 'Client Name', type: 'text', required: true },
      { name: 'website_url', label: 'Website URL', type: 'url', required: false }
    ]
  }
};

export default function UnifiedImageManager() {
  const [libraryImages, setLibraryImages] = useState<LibraryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<LibraryImage | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>('hero');
  const [showImageBrowser, setShowImageBrowser] = useState(false);
  const [order, setOrder] = useState(1);
  const [message, setMessage] = useState('');
  const [extraFieldValues, setExtraFieldValues] = useState<Record<string, any>>({});

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
    fetchLibraryImages();
  }, []);

  // Reset extra fields when section changes
  useEffect(() => {
    setExtraFieldValues({});
    setSelectedImage(null);
  }, [selectedSection]);

  const currentSection = IMAGE_SECTIONS[selectedSection as keyof typeof IMAGE_SECTIONS];

  // Handle adding image to selected section
  const handleAssignImage = async () => {
    if (!selectedImage) {
      setMessage('❌ Please select an image first');
      return;
    }

    // Validate required extra fields
    for (const field of currentSection.extraFields) {
      if (field.required && !extraFieldValues[field.name]) {
        setMessage(`❌ ${field.label} is required`);
        return;
      }
    }

    try {
      let requestBody: any = {
        filename: selectedImage.filename,
        url: selectedImage.url,
        order: order,
        active: true
      };

      // Add section-specific fields
      if (currentSection.id === 'logo') {
        requestBody = {
          url: selectedImage.url,
          type: extraFieldValues.type || 'Main Logo',
        };
      } else if (currentSection.id === 'hero') {
        requestBody.category = extraFieldValues.category;
      } else if (currentSection.id === 'projects') {
        requestBody.title = extraFieldValues.title;
        requestBody.category = extraFieldValues.category;
        requestBody.description = extraFieldValues.description;
        requestBody.image_url = selectedImage.url;
        requestBody.client_name = extraFieldValues.client_name || null;
        requestBody.project_url = extraFieldValues.project_url || null;
        delete requestBody.filename;
        delete requestBody.url;
      } else if (currentSection.id === 'logos') {
        requestBody.client_name = extraFieldValues.client_name;
        requestBody.logo_url = selectedImage.url;
        requestBody.website_url = extraFieldValues.website_url || null;
        delete requestBody.filename;
        delete requestBody.url;
      }

      const response = await fetch(currentSection.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ Image added to ${currentSection.name}!`);
        setSelectedImage(null);
        setExtraFieldValues({});
        setOrder(order + 1);
      } else {
        setMessage(`❌ ${data.error || 'Failed to add image'}`);
      }
    } catch (error) {
      console.error('Error assigning image:', error);
      setMessage('❌ Failed to assign image');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-white mb-2">
          🎯 Image Manager
        </h1>
        <p className="text-gray-400 mb-8">
          Select images from your library and assign them to different sections
        </p>

        {/* Message */}
        {message && (
          <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg">
            {message}
          </div>
        )}

        {/* Step 1: Select Section */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Step 1: Choose Section/Placement</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(IMAGE_SECTIONS).map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={`p-6 rounded-xl text-left transition-all ${
                  selectedSection === section.id
                    ? 'bg-purple-500/30 border-2 border-purple-500'
                    : 'bg-white/5 border-2 border-white/10 hover:border-white/30'
                }`}
              >
                <div className="text-4xl mb-3">{section.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{section.name}</h3>
                <p className="text-sm text-gray-400">{section.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Show Dimensions */}
        <div className="glass rounded-2xl p-6 mb-8 border-l-4 border-purple-500">
          <h2 className="text-xl font-bold text-white mb-3">
            📐 {currentSection.name} - Image Requirements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-gray-400 text-sm">Width</p>
              <p className="text-white font-bold text-lg">{currentSection.dimensions.width}px</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-gray-400 text-sm">Height</p>
              <p className="text-white font-bold text-lg">{currentSection.dimensions.height}px</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-gray-400 text-sm">Aspect Ratio</p>
              <p className="text-white font-bold text-sm">{currentSection.dimensions.aspectRatio}</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-gray-400 text-sm">Order</p>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value))}
                min="1"
                className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-center font-bold"
              />
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-4">💡 {currentSection.dimensions.note}</p>
        </div>

        {/* Step 3: Select Image */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Step 2: Select Image from Library</h2>
            <Link
              href="/admin/library"
              className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors"
            >
              📚 Go to Library
            </Link>
          </div>

          {selectedImage && (
            <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-4">
              <div className="w-16 h-16 relative rounded overflow-hidden">
                <Image
                  src={selectedImage.url}
                  alt="Selected"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-green-400 font-semibold">✅ Image Selected</p>
                <p className="text-green-300 text-sm">{selectedImage.filename}</p>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded"
              >
                Clear
              </button>
            </div>
          )}

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
                    onClick={() => setSelectedImage(img)}
                    className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all hover:scale-105 ${
                      selectedImage?.url === img.url
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

        {/* Step 4: Additional Fields */}
        {currentSection.extraFields.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Step 3: Additional Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSection.extraFields.map((field) => (
                <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      value={extraFieldValues[field.name] || ''}
                      onChange={(e) => setExtraFieldValues({ ...extraFieldValues, [field.name]: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="">Select {field.label}</option>
                      {(field as SelectField).options.map((option) => (
                        <option key={option} value={option} className="bg-gray-900 text-white">
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={extraFieldValues[field.name] || ''}
                      onChange={(e) => setExtraFieldValues({ ...extraFieldValues, [field.name]: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      placeholder={field.label}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={extraFieldValues[field.name] || ''}
                      onChange={(e) => setExtraFieldValues({ ...extraFieldValues, [field.name]: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder={field.label}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Assign Button */}
        <div className="glass rounded-2xl p-6">
          <button
            onClick={handleAssignImage}
            disabled={!selectedImage}
            className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-lg font-bold rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✅ Assign to {currentSection.name}
          </button>
        </div>

        {/* Quick Navigation */}
        <div className="mt-8 p-6 bg-blue-500/20 border border-blue-500/50 rounded-lg">
          <h3 className="text-blue-400 font-semibold mb-3">View Assigned Images</h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/hero"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              🎨 View Hero Images
            </Link>
            <Link
              href="/admin/projects"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              🚀 View Projects
            </Link>
            <Link
              href="/admin/logos"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              🏢 View Logos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
